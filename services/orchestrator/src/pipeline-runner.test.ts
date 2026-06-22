import { describe, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { PipelineRunner } from "./pipeline-runner.js";

describe("PipelineRunner", () => {
  it("executes full cognitive pipeline", async () => {
    const runner = new PipelineRunner();
    const result = await runner.run({
      requestId: randomUUID(),
      sessionId: randomUUID(),
      text: "Explain how black holes work for a beginner",
    });

    expect(result.context.currentPhase).toBe(10);
    expect(result.context.observation).toBeDefined();
    expect(result.context.humanContext?.sessionScoped).toBe(true);
    expect(result.context.executionResult).toBeDefined();
    expect(result.evolutionRecord).toBeDefined();
    expect(result.response).toBeDefined();
  });

  it("detects programming domain", async () => {
    const runner = new PipelineRunner();
    const result = await runner.run({
      requestId: randomUUID(),
      sessionId: randomUUID(),
      text: "Implement a TypeScript API endpoint for user authentication",
    });

    expect(result.context.successCriteria?.primaryGoal).toBe("create");
  });
});
