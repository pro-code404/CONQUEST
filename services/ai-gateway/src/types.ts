import type { BuiltPrompt } from "@conquest/prompt-security";

export const AI_PROVIDER_IDS = [
  "openai",
  "anthropic",
  "gemini",
  "azure-openai",
  "grok",
  "deepseek",
] as const;

export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

export type AiProviderStatus = "available" | "degraded" | "unavailable";

export interface AiCompletionRequest {
  prompt: BuiltPrompt;
  model?: string;
  correlationId: string;
  taskType?: string;
  maxTokens?: number;
}

export interface AiCompletionResponse {
  providerId: AiProviderId;
  model: string;
  content: string;
  tokenCount: number;
  latencyMs: number;
  estimatedCostUsd: number;
  toolsUsed: string[];
}

export interface AiProvider {
  readonly id: AiProviderId;
  readonly name: string;
  status(): AiProviderStatus;
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}

export interface AiGatewayPolicies {
  timeoutMs: number;
  maxRetries: number;
  retryBackoffMs: number;
  fallbackChain: AiProviderId[];
}

export interface AiCostHook {
  record(event: {
    providerId: AiProviderId;
    model: string;
    tokenCount: number;
    estimatedCostUsd: number;
    correlationId: string;
  }): void;
}

export interface AiTelemetryHook {
  emit(event: string, metadata: Record<string, unknown>): void;
}
