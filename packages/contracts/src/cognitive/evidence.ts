import { z } from "zod";

export const EVIDENCE_CLASSES = ["verified_fact", "inference", "prediction", "assumption"] as const;
export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number];

export const CollectEvidenceSchema = z.object({
  workspaceId: z.string().uuid(),
  sources: z.array(
    z.object({
      sourceId: z.string().min(1).max(120),
      title: z.string().min(1).max(300),
      excerpt: z.string().min(1).max(4000),
      evidenceClass: z.enum(EVIDENCE_CLASSES).optional(),
      reliability: z.number().min(0).max(1).optional(),
    }),
  ).min(1),
});

export type CollectEvidenceInput = z.infer<typeof CollectEvidenceSchema>;

export interface EvidenceItemView {
  id: string;
  workspaceId: string;
  sourceId: string;
  title: string;
  excerpt: string;
  evidenceClass: EvidenceClass;
  reliability: number;
  confidenceWeight: number;
  citation: string;
  fingerprint: string;
  rank: number;
  createdAt: string;
}

export interface EvidencePortfolioView {
  workspaceId: string;
  items: EvidenceItemView[];
  duplicateCount: number;
  averageConfidence: number;
}
