import type { AiCompletionRequest, AiCompletionResponse, AiProvider, AiProviderId } from "./types.js";

function stubResponse(providerId: AiProviderId, request: AiCompletionRequest): AiCompletionResponse {
  return {
    providerId,
    model: request.model ?? `${providerId}-default`,
    content: `[stub:${providerId}] response`,
    tokenCount: 0,
    latencyMs: 1,
    estimatedCostUsd: 0,
    toolsUsed: [],
  };
}

function createStubProvider(id: AiProviderId, name: string): AiProvider {
  return {
    id,
    name,
    status: () => "available",
    async complete(request) {
      return stubResponse(id, request);
    },
  };
}

/** Stub providers for Build-1 — real SDK adapters plug in without changing gateway code. */
export function createStubProviders(): AiProvider[] {
  return [
    createStubProvider("openai", "OpenAI"),
    createStubProvider("anthropic", "Anthropic"),
    createStubProvider("gemini", "Google Gemini"),
    createStubProvider("azure-openai", "Azure OpenAI"),
    createStubProvider("grok", "Grok"),
    createStubProvider("deepseek", "DeepSeek"),
  ];
}
