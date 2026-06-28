import { describe, it, expect } from "vitest";
import { AiGateway } from "./gateway.js";
import { AiProviderOrchestrator } from "./provider-orchestrator.js";

describe("AiProviderOrchestrator (Phase 10D)", () => {
  it("routes by task type through gateway registry", () => {
    const gateway = new AiGateway();
    const orchestrator = new AiProviderOrchestrator(gateway);
    const route = orchestrator.route({
      taskType: "reasoning",
      correlationId: "550e8400-e29b-41d4-a716-446655440099",
    });
    expect(route.providerId).toBeTruthy();
    expect(route.fallbackChain.length).toBeGreaterThan(0);
  });

  it("tracks provider usage", () => {
    const orchestrator = new AiProviderOrchestrator(new AiGateway());
    orchestrator.recordUsage("openai", { tokenCount: 100, estimatedCostUsd: 0.01, success: true });
    const usage = orchestrator.listUsage();
    expect(usage[0]?.requestCount).toBe(1);
  });
});
