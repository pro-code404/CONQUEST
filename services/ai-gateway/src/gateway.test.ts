import { describe, it, expect } from "vitest";
import { createPromptBuilder } from "@conquest/prompt-security";
import { getKillSwitchRegistry } from "@conquest/config";
import { AiGateway } from "./index.js";

describe("AI Gateway (Phase 8C)", () => {
  it("completes request via stub provider", async () => {
    const gateway = new AiGateway();
    const prompt = createPromptBuilder().system("You are helpful.").user("Hello").build();
    const response = await gateway.complete({
      prompt,
      correlationId: "corr-ai-1",
    });
    expect(response.content).toContain("[stub:");
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("respects kill switch", async () => {
    const gateway = new AiGateway();
    getKillSwitchRegistry().engage("ai_gateway", "drill");
    const prompt = createPromptBuilder().system("sys").user("hi").build();
    await expect(
      gateway.complete({ prompt, correlationId: "corr-ai-2" }),
    ).rejects.toThrow(/Kill switch/);
    getKillSwitchRegistry().release("ai_gateway");
  });

  it("registers providers without changing application code", () => {
    const gateway = new AiGateway();
    const providers = gateway.getRegistry().list();
    expect(providers.length).toBeGreaterThanOrEqual(6);
    expect(providers.some((p) => p.id === "openai")).toBe(true);
    expect(providers.some((p) => p.id === "deepseek")).toBe(true);
  });

  it("invokes telemetry and cost hooks", async () => {
    const events: string[] = [];
    const costs: number[] = [];
    const gateway = new AiGateway({
      telemetryHook: { emit: (event) => events.push(event) },
      costHook: {
        record: (e) => costs.push(e.estimatedCostUsd),
      },
    });
    const prompt = createPromptBuilder().system("sys").user("test").build();
    await gateway.complete({ prompt, correlationId: "corr-ai-3" });
    expect(events).toContain("ai_request_started");
    expect(events).toContain("ai_request_completed");
    expect(costs.length).toBe(1);
  });
});
