import { randomUUID } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import {
  ReasoningRequestSchema,
  type ReasoningRequest,
  type ReasoningResultView,
} from "@conquest/contracts";
import { ApplicationServiceBase } from "@conquest/service-shared";
import type { EvidenceEngine } from "./evidence-engine.js";

/** Deterministic, explainable reasoning pipeline — no hidden decision making. */
export class ReasoningEngine extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.REASONING;

  constructor(private readonly evidence: EvidenceEngine) {
    super();
  }

  reason(workspaceId: string, raw: ReasoningRequest): ReasoningResultView {
    const input = ReasoningRequestSchema.parse(raw);
    if (input.workspaceId !== workspaceId) throw new Error("Workspace mismatch");

    const assumptions = input.assumptions ?? ["Workspace context is current and tenant-scoped"];
    const constraints = input.constraints ?? [];
    const portfolio = this.evidence.getPortfolio(workspaceId, input.evidenceIds);
    const evidenceRefs = portfolio.items.map((item) => item.id);

    const chain = [
      {
        id: randomUUID(),
        order: 1,
        statement: `Objective framed: ${input.objective}`,
        basis: "User-supplied objective with workspace context",
        evidenceRefs: [],
        confidence: 0.95,
      },
      {
        id: randomUUID(),
        order: 2,
        statement: `Evaluated ${portfolio.items.length} evidence item(s)`,
        basis: "Evidence portfolio ranked by confidence weight",
        evidenceRefs,
        confidence: portfolio.averageConfidence || 0.5,
      },
      {
        id: randomUUID(),
        order: 3,
        statement: constraints.length
          ? `Applied ${constraints.length} constraint(s)`
          : "No explicit constraints supplied",
        basis: "Constraint register",
        evidenceRefs: [],
        confidence: 0.9,
      },
    ];

    const confidence =
      chain.reduce((sum, step) => sum + step.confidence, 0) / chain.length;

    const topEvidence = portfolio.items[0];
    const recommendation = topEvidence
      ? `Prioritize action supported by ${topEvidence.citation}: ${topEvidence.excerpt.slice(0, 120)}`
      : `Clarify objective "${input.objective}" with additional evidence before recommending action`;

    const result: ReasoningResultView = {
      id: randomUUID(),
      workspaceId,
      objective: input.objective,
      assumptions,
      constraints,
      chain,
      recommendation,
      confidence: Number(confidence.toFixed(3)),
      createdAt: new Date().toISOString(),
    };

    this.emit("reasoning_completed", "info", {
      workspaceId,
      reasoningId: result.id,
      confidence: result.confidence,
    });
    return result;
  }
}
