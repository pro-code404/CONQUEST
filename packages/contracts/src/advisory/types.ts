import { z } from "zod";

export const ADVISORY_STATUSES = ["pending", "approved", "rejected", "expired"] as const;
export type AdvisoryStatus = (typeof ADVISORY_STATUSES)[number];

export const ADVISORY_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type AdvisoryPriority = (typeof ADVISORY_PRIORITIES)[number];

/** Explainable recommendation — no black-box outputs. */
export interface AdvisoryRecommendationView {
  id: string;
  workspaceId: string;
  title: string;
  summary: string;
  rationale: string;
  evidenceRefs: string[];
  priority: AdvisoryPriority;
  confidence: number;
  status: AdvisoryStatus;
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdvisoryRecommendationDetailView extends AdvisoryRecommendationView {
  approvalRequired: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
}

export const UpdateAdvisoryStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export type UpdateAdvisoryStatusInput = z.infer<typeof UpdateAdvisoryStatusSchema>;

export function advisoryDetailRoute(workspaceId: string, recommendationId: string): string {
  return `/app/w/${workspaceId}/intelligence/recommendations/${recommendationId}`;
}
