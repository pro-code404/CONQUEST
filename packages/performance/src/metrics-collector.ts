import { PERFORMANCE_CONSTANTS } from "@conquest/config";
import type { AiLatencyMetrics, PlatformMetricsSnapshot, SlowQueryRecord } from "./types.js";

export class PlatformMetricsCollector {
  private requestCount = 0;
  private slowQueryCount = 0;
  private readonly aiLatencies: number[] = [];
  private readonly slowQueries: SlowQueryRecord[] = [];
  private cacheMetrics: PlatformMetricsSnapshot["cache"] = null;
  private queueMetrics: PlatformMetricsSnapshot["queue"] = null;

  recordRequest(durationMs: number, correlationId?: string): void {
    this.requestCount += 1;
    if (durationMs >= PERFORMANCE_CONSTANTS.SLOW_QUERY_THRESHOLD_MS) {
      this.slowQueryCount += 1;
      this.slowQueries.push({
        label: "http_request",
        durationMs,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  recordAiLatency(latencyMs: number): void {
    this.aiLatencies.push(latencyMs);
  }

  recordSlowQuery(label: string, durationMs: number, correlationId?: string): void {
    if (durationMs < PERFORMANCE_CONSTANTS.SLOW_QUERY_THRESHOLD_MS) return;
    this.slowQueryCount += 1;
    const entry: SlowQueryRecord = {
      label,
      durationMs,
      timestamp: new Date().toISOString(),
    };
    if (correlationId !== undefined) {
      entry.correlationId = correlationId;
    }
    this.slowQueries.push(entry);
  }

  setCacheMetrics(metrics: NonNullable<PlatformMetricsSnapshot["cache"]>): void {
    this.cacheMetrics = metrics;
  }

  setQueueMetrics(metrics: NonNullable<PlatformMetricsSnapshot["queue"]>): void {
    this.queueMetrics = metrics;
  }

  getAiLatencyMetrics(): AiLatencyMetrics | null {
    if (this.aiLatencies.length === 0) return null;
    const sorted = [...this.aiLatencies].sort((a, b) => a - b);
    const total = sorted.reduce((a, b) => a + b, 0);
    const mid = Math.floor(sorted.length / 2);
    return {
      count: sorted.length,
      totalLatencyMs: total,
      p50LatencyMs: sorted[mid] ?? 0,
      maxLatencyMs: sorted[sorted.length - 1] ?? 0,
    };
  }

  snapshot(): PlatformMetricsSnapshot {
    return {
      cache: this.cacheMetrics,
      queue: this.queueMetrics,
      ai: this.getAiLatencyMetrics(),
      requestCount: this.requestCount,
      slowQueryCount: this.slowQueryCount,
      timestamp: new Date().toISOString(),
    };
  }

  listSlowQueries(limit = 20): SlowQueryRecord[] {
    return this.slowQueries.slice(-limit);
  }
}
