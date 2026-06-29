import type { AuthRepository, RepositoryMode } from "@conquest/auth";
import type { PlatformServices } from "@conquest/platform";
import type { ValidatedApiEnv } from "@conquest/config";
import type { RedisLikeClient } from "@conquest/cache";
import type { JobService } from "@conquest/jobs";

export interface DependencyProbeResult {
  name: string;
  available: boolean;
  degraded: boolean;
  message: string;
}

export interface DependencyProbeReport {
  timestamp: string;
  overall: "healthy" | "degraded" | "unhealthy";
  probes: DependencyProbeResult[];
}

export async function probeDependencies(input: {
  apiEnv: ValidatedApiEnv;
  repo: AuthRepository;
  persistenceMode: RepositoryMode;
  platform: PlatformServices;
  redisClient: RedisLikeClient | null;
  jobService: JobService;
  jobQueueLabel: string;
  emailProviderName: string;
}): Promise<DependencyProbeReport> {
  const probes: DependencyProbeResult[] = [];

  // Database
  let dbAvailable = input.persistenceMode === "memory";
  if (input.persistenceMode === "postgres") {
    try {
      await input.repo.listAuditEvents("00000000-0000-0000-0000-000000000000", { limit: 1 });
      dbAvailable = true;
    } catch {
      dbAvailable = false;
    }
  }
  probes.push({
    name: "database",
    available: dbAvailable,
    degraded: !dbAvailable && input.persistenceMode === "postgres",
    message: dbAvailable ? "reachable" : "unreachable — API continues in degraded mode",
  });

  // Redis
  let redisAvailable = false;
  if (input.redisClient) {
    try {
      const pong = await input.redisClient.ping();
      redisAvailable = pong === "PONG" || pong === "pong";
    } catch {
      redisAvailable = false;
    }
  }
  probes.push({
    name: "redis",
    available: redisAvailable,
    degraded: Boolean(input.apiEnv.REDIS_URL) && !redisAvailable,
    message: redisAvailable
      ? "connected"
      : input.apiEnv.REDIS_URL
        ? "unavailable — cache and queue fall back to in-memory"
        : "not configured",
  });

  // Email / SMTP
  const emailConfigured = input.emailProviderName !== "console";
  probes.push({
    name: "email",
    available: input.emailProviderName === "console" || emailConfigured,
    degraded: input.apiEnv.profile === "production" && input.emailProviderName === "console",
    message:
      input.emailProviderName === "console"
        ? "console provider (dev)"
        : `${input.emailProviderName} configured`,
  });

  // AI providers
  const aiStatuses = input.platform.aiProvider.listProviderStatus();
  const aiAvailable = aiStatuses.some((p) => p.status === "available" || p.status === "degraded");
  probes.push({
    name: "ai",
    available: aiAvailable,
    degraded: !aiAvailable,
    message: aiAvailable ? "at least one provider reachable" : "all providers unavailable — cognitive degraded",
  });

  // Queue
  const queueMetrics = await input.jobService.getMetrics();
  const queueHealthy = input.jobService.workerHealthy();
  probes.push({
    name: "queue",
    available: queueHealthy,
    degraded: input.jobQueueLabel === "in-memory" && Boolean(input.apiEnv.REDIS_URL),
    message: `backend=${input.jobQueueLabel} queued=${queueMetrics.queued} dlq=${queueMetrics.deadLetter}`,
  });

  const unhealthy = probes.some((p) => p.name === "database" && !p.available);
  const degraded = probes.some((p) => p.degraded);
  const overall = unhealthy ? "unhealthy" : degraded ? "degraded" : "healthy";

  return { timestamp: new Date().toISOString(), overall, probes };
}
