import type { CacheService } from "@conquest/cache";
import type { JobService } from "@conquest/jobs";
import type { CognitiveOrchestrator } from "@conquest/cognitive";
import type { AiGateway } from "@conquest/ai-gateway";
import type { CognitiveMetricsCollector } from "@conquest/performance";
import { aggregatePlatformHealth } from "@conquest/performance";

export interface PlatformHealthDeps {
  cache: CacheService;
  jobs: JobService;
  cognitive: CognitiveOrchestrator;
  aiGateway: AiGateway;
  cognitiveMetrics: CognitiveMetricsCollector;
  cacheLabel: string;
}

/** Aggregates platform dependency health for API / operations dashboards. */
export async function getPlatformHealthReport(deps: PlatformHealthDeps) {
  const [cacheHealth, jobHealth, cognitiveHealth] = await Promise.all([
    deps.cache.provider.healthCheck(),
    deps.jobs.healthCheck(),
    deps.cognitive.healthCheck(),
  ]);

  const gatewayProviders = deps.aiGateway.getRegistry().list();
  const gatewayHealthy = gatewayProviders.some((p) => p.status() === "available");

  return aggregatePlatformHealth("conquest-platform", [
    { name: "cache", healthy: cacheHealth.healthy, ...(deps.cacheLabel ? { details: deps.cacheLabel } : {}) },
    {
      name: "jobs",
      healthy: jobHealth.healthy,
      ...(jobHealth.details ? { details: jobHealth.details } : {}),
    },
    {
      name: "cognitive",
      healthy: cognitiveHealth.healthy,
      ...(cognitiveHealth.details ? { details: cognitiveHealth.details } : {}),
    },
    {
      name: "ai-gateway",
      healthy: gatewayHealthy,
      details: `${gatewayProviders.length} providers`,
    },
  ]);
}

export function getCognitiveMetricsSnapshot(deps: Pick<PlatformHealthDeps, "cognitiveMetrics">) {
  return deps.cognitiveMetrics.snapshot();
}
