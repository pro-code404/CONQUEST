import type { CognitiveMetricsSnapshot, CognitiveRequestMetrics } from "./cognitive-metrics.js";

const MAX_RECENT = 100;

/** Aggregates cognitive request telemetry for operational dashboards. */
export class CognitiveMetricsCollector {
  private requestCount = 0;
  private successCount = 0;
  private failureCount = 0;
  private cacheHitCount = 0;
  private totalDurationMs = 0;
  private totalConfidence = 0;
  private readonly recent: CognitiveRequestMetrics[] = [];

  record(event: Omit<CognitiveRequestMetrics, "timestamp">): void {
    this.requestCount += 1;
    if (event.success) this.successCount += 1;
    else this.failureCount += 1;
    if (event.cacheHit) this.cacheHitCount += 1;
    this.totalDurationMs += event.durationMs;
    this.totalConfidence += event.confidence;

    const entry: CognitiveRequestMetrics = {
      ...event,
      timestamp: new Date().toISOString(),
    };
    this.recent.push(entry);
    if (this.recent.length > MAX_RECENT) {
      this.recent.shift();
    }
  }

  snapshot(): CognitiveMetricsSnapshot {
    return {
      requestCount: this.requestCount,
      successCount: this.successCount,
      failureCount: this.failureCount,
      cacheHitCount: this.cacheHitCount,
      avgDurationMs: this.requestCount ? Math.round(this.totalDurationMs / this.requestCount) : 0,
      avgConfidence: this.requestCount
        ? Number((this.totalConfidence / this.requestCount).toFixed(3))
        : 0,
      recent: [...this.recent],
    };
  }
}
