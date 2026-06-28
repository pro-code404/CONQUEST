import { randomUUID } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import {
  EvaluateDecisionSchema,
  type DecisionEvaluationView,
  type EvaluateDecisionInput,
} from "@conquest/contracts";
import { ApplicationServiceBase } from "@conquest/service-shared";
import { PRIORITY_WEIGHT, type EvidenceEngine } from "./evidence-engine.js";

/** Deterministic decision evaluation — outputs decisions only, no execution. */
export class DecisionEngine extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.DECISION;

  constructor(private readonly evidence: EvidenceEngine) {
    super();
  }

  evaluate(workspaceId: string, raw: EvaluateDecisionInput): DecisionEvaluationView {
    const input = EvaluateDecisionSchema.parse(raw);
    if (input.workspaceId !== workspaceId) throw new Error("Workspace mismatch");

    const rankedCandidates = input.candidates
      .map((candidate) => {
        const evidence = this.evidence.getByIds(workspaceId, candidate.evidenceIds);
        const evidenceScore = evidence.length
          ? evidence.reduce((sum, item) => sum + item.confidenceWeight, 0) / evidence.length
          : 0;
        const priority = candidate.priority ?? "medium";
        const score = Number(
          (evidenceScore * 0.7 + PRIORITY_WEIGHT[priority] * 0.3).toFixed(3),
        );
        const tradeoffs = [
          evidence.length === 0 ? "No supporting evidence attached" : `${evidence.length} evidence item(s) support this candidate`,
          `Priority weight: ${priority}`,
        ];
        const approvalRequired = priority === "high" || priority === "critical";
        return {
          id: candidate.id,
          title: candidate.title,
          summary: candidate.summary,
          score,
          priority,
          evidenceIds: [...candidate.evidenceIds],
          tradeoffs,
          approvalRequired,
          executionReady: false,
        };
      })
      .sort((a, b) => b.score - a.score);

    const top = rankedCandidates[0] ?? null;
    const confidence = top?.score ?? 0;

    const evaluation: DecisionEvaluationView = {
      id: randomUUID(),
      workspaceId,
      rankedCandidates,
      topCandidateId: top?.id ?? null,
      confidence,
      status: "proposed",
      createdAt: new Date().toISOString(),
    };

    this.emit("decision_evaluated", "info", {
      workspaceId,
      decisionId: evaluation.id,
      topCandidateId: evaluation.topCandidateId,
    });
    return evaluation;
  }
}
