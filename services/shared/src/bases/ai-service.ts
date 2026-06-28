import { BaseCognitiveService } from "./cognitive-service.js";

/** Cognitive services that invoke external AI providers (ADR-0011). */
export abstract class AiServiceBase<TInput = unknown, TOutput = unknown> extends BaseCognitiveService<
  TInput,
  TOutput
> {
  readonly domain = "ai" as const;

  protected abstract selectProvider(ctx: { taskType?: string }): string;

  protected emitProviderSelected(provider: string, traceId: string): void {
    this.telemetry?.emit({
      service: this.name,
      event: "provider_selected",
      level: "debug",
      metadata: { provider, traceId },
    });
  }
}
