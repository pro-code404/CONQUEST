import { AI_GATEWAY_CONSTANTS } from "@conquest/config";
import { getKillSwitchRegistry } from "@conquest/config";
import { SERVICE_NAMES, createServiceResponse, type AgentMessage, type PipelineContext, type ServiceResponse } from "@conquest/core";
import { AiServiceBase } from "@conquest/service-shared";
import { AiProviderRegistry } from "./provider-registry.js";
import { createStubProviders } from "./stub-providers.js";
import type {
  AiCompletionRequest,
  AiCompletionResponse,
  AiCostHook,
  AiGatewayPolicies,
  AiProviderId,
  AiTelemetryHook,
} from "./types.js";

export interface AiGatewayOptions {
  registry?: AiProviderRegistry;
  policies?: Partial<AiGatewayPolicies>;
  telemetryHook?: AiTelemetryHook;
  costHook?: AiCostHook;
}

const DEFAULT_POLICIES: AiGatewayPolicies = {
  timeoutMs: AI_GATEWAY_CONSTANTS.DEFAULT_TIMEOUT_MS,
  maxRetries: AI_GATEWAY_CONSTANTS.DEFAULT_MAX_RETRIES,
  retryBackoffMs: AI_GATEWAY_CONSTANTS.RETRY_BACKOFF_MS,
  fallbackChain: ["openai", "anthropic", "gemini"],
};

/**
 * Shared AI Gateway — provider abstraction only, no business logic.
 * Kill switch, timeout, retry, and fallback policies are centralized here.
 */
export class AiGateway extends AiServiceBase<AiCompletionRequest, AiCompletionResponse> {
  readonly name = SERVICE_NAMES.AI_GATEWAY;

  private readonly registry: AiProviderRegistry;
  private readonly policies: AiGatewayPolicies;
  private readonly telemetryHook: AiTelemetryHook | undefined;
  private readonly costHook: AiCostHook | undefined;

  constructor(options: AiGatewayOptions = {}) {
    super();
    this.registry = options.registry ?? new AiProviderRegistry();
    if (this.registry.list().length === 0) {
      for (const provider of createStubProviders()) {
        this.registry.register(provider);
      }
    }
    this.policies = { ...DEFAULT_POLICIES, ...options.policies };
    this.telemetryHook = options.telemetryHook;
    this.costHook = options.costHook;
  }

  getRegistry(): AiProviderRegistry {
    return this.registry;
  }

  protected selectProvider(_ctx: { taskType?: string }): string {
    const preferred = this.policies.fallbackChain.find((id) => {
      const provider = this.registry.get(id);
      return provider?.status() === "available";
    });
    return preferred ?? this.policies.fallbackChain[0] ?? "openai";
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    getKillSwitchRegistry().assertOpen("ai_gateway");
    const chain = this.buildProviderChain(request);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.policies.maxRetries; attempt += 1) {
      for (const providerId of chain) {
        const provider = this.registry.get(providerId);
        if (!provider || provider.status() !== "available") continue;

        this.emitProviderSelected(provider.id, request.correlationId);
        this.telemetryHook?.emit("ai_request_started", {
          providerId: provider.id,
          correlationId: request.correlationId,
          taskType: request.taskType,
        });

        try {
          const response = await this.withTimeout(provider.complete(request), this.policies.timeoutMs);
          this.costHook?.record({
            providerId: response.providerId,
            model: response.model,
            tokenCount: response.tokenCount,
            estimatedCostUsd: response.estimatedCostUsd,
            correlationId: request.correlationId,
          });
          this.telemetryHook?.emit("ai_request_completed", {
            providerId: response.providerId,
            latencyMs: response.latencyMs,
            correlationId: request.correlationId,
          });
          return response;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("AI provider failed");
          this.telemetryHook?.emit("ai_request_failed", {
            providerId: provider.id,
            correlationId: request.correlationId,
            error: lastError.message,
          });
        }
      }
      if (attempt < this.policies.maxRetries) {
        await new Promise((r) => setTimeout(r, this.policies.retryBackoffMs * (attempt + 1)));
      }
    }

    throw lastError ?? new Error("All AI providers failed");
  }

  private buildProviderChain(request?: AiCompletionRequest): AiProviderId[] {
    const selected = this.selectProvider(
      request?.taskType ? { taskType: request.taskType } : {},
    );
    const chain = [selected as AiProviderId, ...this.policies.fallbackChain];
    return [...new Set(chain)];
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("AI request timed out")), timeoutMs);
      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error: unknown) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  async process(input: AiCompletionRequest, ctx: PipelineContext) {
    const start = Date.now();
    const output = await this.complete(input);
    return createServiceResponse({
      success: true,
      data: output,
      confidence: 1,
      traceId: ctx.traceId,
      durationMs: Date.now() - start,
      service: this.name,
    });
  }

  async handleMessage(message: AgentMessage): Promise<ServiceResponse<AiCompletionResponse>> {
    return createServiceResponse({
      success: false,
      error: {
        code: "NOT_SUPPORTED",
        message: "AiGateway does not handle agent messages directly",
        recoverable: false,
      },
      confidence: 0,
      traceId: message.traceId,
      durationMs: 0,
      service: this.name,
    });
  }
}
