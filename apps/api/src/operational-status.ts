import type { AuthRepository, RepositoryMode } from "@conquest/auth";
import type { PlatformServices } from "@conquest/platform";
import { getCognitiveMetricsSnapshot, getPlatformHealthReport } from "@conquest/platform";
import type { OperationalMetricsSnapshot } from "@conquest/performance";
import type { RateLimitEvent } from "./middleware/rate-limit.js";
import { securityEvents } from "./infrastructure/security-events.js";

export interface OperationalStatusView {
  service: string;
  timestamp: string;
  persistence: RepositoryMode;
  profile: string;
  overall: "healthy" | "degraded" | "unhealthy";
  dependencies: Awaited<ReturnType<typeof getPlatformHealthReport>>;
  metrics: {
    cache: ReturnType<PlatformServices["cache"]["getMetrics"]>;
    queue: ReturnType<PlatformServices["jobs"]["getMetrics"]>;
    cognitive: ReturnType<typeof getCognitiveMetricsSnapshot>;
    aiProviders: ReturnType<PlatformServices["aiProvider"]["listProviderStatus"]>;
    platform: ReturnType<PlatformServices["metrics"]["snapshot"]>;
    operational: OperationalMetricsSnapshot;
  };
  email: { deliveryCount: number; failedCount: number };
  security: {
    rateLimitEvents: number;
    recentBlocks: number;
    authFailures: number;
    tenantViolations: number;
    validationFailures: number;
    forbidden: number;
  };
  database: { reachable: boolean; mode: RepositoryMode };
  cache: { provider: string; healthy: boolean };
  queue: ReturnType<PlatformServices["jobs"]["getMetrics"]>;
}

export async function buildOperationalStatus(input: {
  platform: PlatformServices;
  repo: AuthRepository;
  persistenceMode: RepositoryMode;
  profile: string;
  rateLimitEvents: RateLimitEvent[];
  operationalMetrics: OperationalMetricsSnapshot;
}): Promise<OperationalStatusView> {
  const platformHealth = await getPlatformHealthReport(input.platform);
  const deliveries = await input.repo.listEmailDeliveries({ limit: 200 });
  const failedCount = deliveries.filter((d) => d.status === "failed").length;

  input.platform.metrics.setCacheMetrics(input.platform.cache.getMetrics());
  input.platform.metrics.setQueueMetrics(input.platform.jobs.getMetrics());

  let dbReachable = input.persistenceMode === "memory";
  if (input.persistenceMode === "postgres") {
    try {
      await input.repo.listAuditEvents("00000000-0000-0000-0000-000000000000", { limit: 1 });
      dbReachable = true;
    } catch {
      dbReachable = false;
    }
  }

  const recentBlocks = input.rateLimitEvents.filter((e) => e.blocked).length;
  const overall =
    platformHealth.status === "unhealthy" || !dbReachable
      ? "unhealthy"
      : platformHealth.status === "degraded" || failedCount > 0
        ? "degraded"
        : "healthy";

  const cacheMetrics = input.platform.cache.getMetrics();
  const queueMetrics = input.platform.jobs.getMetrics();

  return {
    service: "conquest-api",
    timestamp: new Date().toISOString(),
    persistence: input.persistenceMode,
    profile: input.profile,
    overall,
    dependencies: platformHealth,
    metrics: {
      cache: cacheMetrics,
      queue: queueMetrics,
      cognitive: getCognitiveMetricsSnapshot(input.platform),
      aiProviders: input.platform.aiProvider.listProviderStatus(),
      platform: input.platform.metrics.snapshot(),
      operational: input.operationalMetrics,
    },
    email: { deliveryCount: deliveries.length, failedCount },
    security: {
      rateLimitEvents: input.rateLimitEvents.length,
      recentBlocks,
      authFailures: securityEvents.authFailures,
      tenantViolations: securityEvents.tenantViolations,
      validationFailures: securityEvents.validationFailures,
      forbidden: securityEvents.forbidden,
    },
    database: { reachable: dbReachable, mode: input.persistenceMode },
    cache: { provider: input.platform.cacheLabel, healthy: true },
    queue: queueMetrics,
  };
}
