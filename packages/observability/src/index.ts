import { randomUUID } from "node:crypto";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface TelemetryEvent {
  traceId: string;
  correlationId: string;
  requestId: string;
  service: string;
  phase?: string;
  event: string;
  level: LogLevel;
  timestamp: string;
  durationMs?: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface MetricsSnapshot {
  latencyMs: number;
  confidence?: number;
  tokenUsage?: number;
  memoryRetrievalMs?: number;
  researchDurationMs?: number;
  validationFailures: number;
  rerouteCount: number;
  success: boolean;
}

export class TelemetryCollector {
  private events: TelemetryEvent[] = [];

  constructor(
    private readonly traceId: string,
    private readonly correlationId: string,
    private readonly requestId: string,
  ) {}

  emit(params: Omit<TelemetryEvent, "traceId" | "correlationId" | "requestId" | "timestamp">): void {
    const event: TelemetryEvent = {
      ...params,
      traceId: this.traceId,
      correlationId: this.correlationId,
      requestId: this.requestId,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    const line = JSON.stringify(event);
    if (params.level === "error") console.error(line);
    else if (params.level === "warn") console.warn(line);
    else console.log(line);
  }

  getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  toMetrics(success: boolean, rerouteCount: number): MetricsSnapshot {
    const durations = this.events.filter((e) => e.durationMs != null).map((e) => e.durationMs!);
    return {
      latencyMs: durations.reduce((a, b) => a + b, 0),
      confidence: this.events.find((e) => e.confidence != null)?.confidence,
      validationFailures: this.events.filter((e) => e.event === "validation_failed").length,
      rerouteCount,
      success,
    };
  }
}

export function createTraceId(): string {
  return randomUUID();
}

export function createRequestId(): string {
  return randomUUID();
}
