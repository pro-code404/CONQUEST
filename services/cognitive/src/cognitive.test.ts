import { describe, it, expect } from "vitest";
import { EvidenceEngine } from "./evidence-engine.js";
import { ReasoningEngine } from "./reasoning-engine.js";
import { DecisionEngine } from "./decision-engine.js";

const workspaceId = "550e8400-e29b-41d4-a716-446655440001";

describe("EvidenceEngine (Phase 10F)", () => {
  it("deduplicates and ranks evidence", () => {
    const engine = new EvidenceEngine();
    const portfolio = engine.collect(workspaceId, {
      workspaceId,
      sources: [
        { sourceId: "a", title: "A", excerpt: "fact one" },
        { sourceId: "a", title: "A", excerpt: "fact one" },
      ],
    });
    expect(portfolio.items).toHaveLength(1);
    expect(portfolio.duplicateCount).toBe(1);
  });
});

describe("ReasoningEngine (Phase 10B)", () => {
  it("produces explainable reasoning chain", () => {
    const evidence = new EvidenceEngine();
    const reasoning = new ReasoningEngine(evidence);
    evidence.collect(workspaceId, {
      workspaceId,
      sources: [{ sourceId: "doc", title: "Doc", excerpt: "Revenue flat", reliability: 0.9 }],
    });
    const result = reasoning.reason(workspaceId, {
      workspaceId,
      objective: "Assess revenue trend",
    });
    expect(result.chain.length).toBeGreaterThan(0);
    expect(result.recommendation.length).toBeGreaterThan(0);
  });
});

describe("DecisionEngine (Phase 10G)", () => {
  it("ranks candidates without executing", () => {
    const evidence = new EvidenceEngine();
    const decision = new DecisionEngine(evidence);
    const portfolio = evidence.collect(workspaceId, {
      workspaceId,
      sources: [{ sourceId: "doc", title: "Doc", excerpt: "Risk elevated", reliability: 0.8 }],
    });
    const evaluation = decision.evaluate(workspaceId, {
      workspaceId,
      candidates: [
        {
          id: "c1",
          title: "Mitigate risk",
          summary: "Address elevated risk",
          evidenceIds: portfolio.items.map((i) => i.id),
          priority: "high",
        },
      ],
    });
    expect(evaluation.rankedCandidates[0]?.executionReady).toBe(false);
    expect(evaluation.topCandidateId).toBe("c1");
  });
});
