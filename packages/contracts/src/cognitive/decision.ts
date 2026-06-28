import { z } from "zod";

export const DECISION_STATUSES = ["proposed", "approved", "rejected", "expired"] as const;
export type DecisionStatus = (typeof DECISION_STATUSES)[number];

export const EvaluateDecisionSchema = z.object({
  workspaceId: z.string().uuid(),
  candidates: z.array(
    z.object({
      id: z.string().min(1).max(64),
      title: z.string().min(1).max(300),
      summary: z.string().min(1).max(2000),
      evidenceIds: z.array(z.string().uuid()).min(1),
      priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    }),
  ).min(1),
  constraints: z.array(z.string().max(500)).optional(),
});

export type EvaluateDecisionInput = z.infer<typeof EvaluateDecisionSchema>;

export interface DecisionCandidateView {
  id: string;
  title: string;
  summary: string;
  score: number;
  priority: "low" | "medium" | "high" | "critical";
  evidenceIds: string[];
  tradeoffs: string[];
  approvalRequired: boolean;
  executionReady: boolean;
}

export interface DecisionEvaluationView {
  id: string;
  workspaceId: string;
  rankedCandidates: DecisionCandidateView[];
  topCandidateId: string | null;
  confidence: number;
  status: DecisionStatus;
  createdAt: string;
}
