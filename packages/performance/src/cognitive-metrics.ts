/** Per-request cognitive telemetry suitable for dashboards. */
export interface CognitiveRequestMetrics {
  correlationId: string;
  durationMs: number;
  cacheHit: boolean;
  evidenceCount: number;
  confidence: number;
  success: boolean;
  phases: string[];
  providerId: string | null;
  fallbackUsed: boolean;
  timestamp: string;
}

export interface CognitiveMetricsSnapshot {
  requestCount: number;
  successCount: number;
  failureCount: number;
  cacheHitCount: number;
  avgDurationMs: number;
  avgConfidence: number;
  recent: CognitiveRequestMetrics[];
}
