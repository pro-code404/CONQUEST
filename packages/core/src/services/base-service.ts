import {
  type AgentMessage,
  createServiceResponse,
  type ServiceResponse,
} from "../messages/envelope.js";
import type { PipelineContext } from "../pipeline/context.js";
import type { CognitiveService as ICognitiveService } from "./contract.js";

export interface TelemetryEmitter {
  emit(params: {
    service: string;
    event: string;
    level: "debug" | "info" | "warn" | "error";
    durationMs?: number;
    confidence?: number;
    phase?: string;
    metadata?: Record<string, unknown>;
  }): void;
}

export abstract class BaseCognitiveService<TInput = unknown, TOutput = unknown>
  implements ICognitiveService<TInput, TOutput>
{
  abstract readonly name: string;
  readonly version = "1.0.0";

  constructor(protected readonly telemetry?: TelemetryEmitter) {}

  abstract process(input: TInput, ctx: PipelineContext): Promise<ServiceResponse<TOutput>>;

  async handleMessage(message: AgentMessage): Promise<ServiceResponse<TOutput>> {
    const start = Date.now();
    const ctx = message.payload as PipelineContext;
    try {
      const result = await this.process(message.payload as TInput, ctx);
      this.telemetry?.emit({
        service: this.name,
        event: "message_handled",
        level: "info",
        durationMs: Date.now() - start,
        confidence: result.confidence,
      });
      return result;
    } catch (err) {
      const message_text = err instanceof Error ? err.message : "Unknown error";
      return createServiceResponse<TOutput>({
        success: false,
        error: { code: "SERVICE_ERROR", message: message_text, recoverable: true },
        confidence: 0,
        traceId: message.requestId,
        durationMs: Date.now() - start,
        service: this.name,
      });
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    return { healthy: true, details: `${this.name} v${this.version}` };
  }

  protected respond(params: {
    success: boolean;
    data?: TOutput;
    error?: { code: string; message: string; recoverable: boolean };
    confidence: number;
    traceId: string;
    startMs: number;
  }): ServiceResponse<TOutput> {
    return createServiceResponse<TOutput>({
      ...params,
      durationMs: Date.now() - params.startMs,
      service: this.name,
    });
  }
}
