import { AI_GATEWAY_CONSTANTS } from "@conquest/config";
import type { ProviderRouteRequest, ProviderRouteView, ProviderTaskType, ProviderUsageView } from "@conquest/contracts";
import { ProviderRouteRequestSchema } from "@conquest/contracts";
import type { AiGateway } from "./gateway.js";
import type { AiProviderId } from "./types.js";

const TASK_ROUTING: Record<ProviderTaskType, AiProviderId[]> = {
  reasoning: ["anthropic", "openai", "gemini"],
  research: ["gemini", "openai", "anthropic"],
  summarization: ["openai", "gemini", "anthropic"],
  classification: ["openai", "anthropic", "gemini"],
  general: ["openai", "anthropic", "gemini"],
};

interface UsageState {
  requestCount: number;
  tokenCount: number;
  estimatedCostUsd: number;
  failureCount: number;
}

/**
 * Provider orchestration layer — model selection and usage accounting on top of AiGateway.
 * Never exposes provider implementations outside the gateway.
 */
export class AiProviderOrchestrator {
  private readonly usage = new Map<string, UsageState>();

  constructor(private readonly gateway: AiGateway) {}

  route(raw: ProviderRouteRequest): ProviderRouteView {
    const input = ProviderRouteRequestSchema.parse(raw);
    const chain = TASK_ROUTING[input.taskType];
    const registry = this.gateway.getRegistry();
    const selected =
      (input.preferredProvider as AiProviderId | undefined) &&
      registry.get(input.preferredProvider as AiProviderId)?.status() === "available"
        ? (input.preferredProvider as AiProviderId)
        : chain.find((id) => registry.get(id)?.status() === "available") ?? chain[0]!;

    const provider = registry.get(selected);
    return {
      providerId: selected,
      model: provider?.name ?? selected,
      taskType: input.taskType,
      fallbackChain: chain,
      timeoutMs: AI_GATEWAY_CONSTANTS.DEFAULT_TIMEOUT_MS,
      maxRetries: AI_GATEWAY_CONSTANTS.DEFAULT_MAX_RETRIES,
    };
  }

  recordUsage(
    providerId: string,
    event: { tokenCount: number; estimatedCostUsd: number; success: boolean },
  ): void {
    const state = this.usage.get(providerId) ?? {
      requestCount: 0,
      tokenCount: 0,
      estimatedCostUsd: 0,
      failureCount: 0,
    };
    state.requestCount += 1;
    state.tokenCount += event.tokenCount;
    state.estimatedCostUsd += event.estimatedCostUsd;
    if (!event.success) state.failureCount += 1;
    this.usage.set(providerId, state);
  }

  listUsage(): ProviderUsageView[] {
    return [...this.usage.entries()].map(([providerId, state]) => ({
      providerId,
      requestCount: state.requestCount,
      tokenCount: state.tokenCount,
      estimatedCostUsd: Number(state.estimatedCostUsd.toFixed(6)),
      failureCount: state.failureCount,
    }));
  }

  listProviderStatus() {
    return this.gateway.getRegistry().list().map((provider) => ({
      id: provider.id,
      name: provider.name,
      status: provider.status(),
    }));
  }
}
