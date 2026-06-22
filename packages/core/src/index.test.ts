import { describe, it, expect } from "vitest";
import {
  PipelinePhase,
  PHASE_ORDER,
  nextPhase,
  resolveReroute,
  createPipelineContext,
  confidenceAction,
  classifyImprovement,
} from "./index.js";

describe("Pipeline phases", () => {
  it("defines ten phases in order", () => {
    expect(PHASE_ORDER).toHaveLength(10);
    expect(PHASE_ORDER[0]).toBe(PipelinePhase.Perception);
    expect(PHASE_ORDER[9]).toBe(PipelinePhase.MemoryEvolution);
  });

  it("advances to next phase", () => {
    expect(nextPhase(PipelinePhase.Perception)).toBe(PipelinePhase.HumanUnderstanding);
    expect(nextPhase(PipelinePhase.MemoryEvolution)).toBeNull();
  });

  it("resolves reroute conditions", () => {
    expect(resolveReroute("verification_plan_inadequate")).toBe(PipelinePhase.StrategyPlanning);
  });
});

describe("Pipeline context", () => {
  it("creates initial context at Perception", () => {
    const ctx = createPipelineContext({
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      correlationId: "550e8400-e29b-41d4-a716-446655440001",
      traceId: "trace-1",
      sessionId: "550e8400-e29b-41d4-a716-446655440002",
    });
    expect(ctx.currentPhase).toBe(PipelinePhase.Perception);
    expect(ctx.rerouteCount).toBe(0);
  });
});

describe("Confidence action", () => {
  it("maps confidence to actions", () => {
    expect(confidenceAction(0.99)).toBe("answer");
    expect(confidenceAction(0.5)).toBe("research");
    expect(confidenceAction(0.2)).toBe("refuse");
  });
});

describe("Evolution safety", () => {
  it("classifies autonomous vs human review", () => {
    expect(classifyImprovement({
      type: "routing",
      description: "test",
      payload: {},
      requiresHumanApproval: false,
      priority: 1,
    })).toBe("autonomous");

    expect(classifyImprovement({
      type: "routing",
      description: "test",
      payload: {},
      requiresHumanApproval: true,
      priority: 1,
    })).toBe("human_review");
  });
});
