import type { CacheMetricsSnapshot } from "@conquest/cache";
import type { JobQueueMetrics } from "@conquest/jobs";

export interface AiLatencyMetrics {
  count: number;
  totalLatencyMs: number;
  p50LatencyMs: number;
  maxLatencyMs: number;
}

export interface PlatformMetricsSnapshot {
  cache: CacheMetricsSnapshot | null;
  queue: JobQueueMetrics | null;
  ai: AiLatencyMetrics | null;
  requestCount: number;
  slowQueryCount: number;
  timestamp: string;
}

export interface SlowQueryRecord {
  label: string;
  durationMs: number;
  correlationId?: string;
  timestamp: string;
}
