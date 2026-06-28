import { z } from "zod";

export const RESEARCH_SESSION_STATUSES = ["active", "saved", "archived"] as const;
export type ResearchSessionStatus = (typeof RESEARCH_SESSION_STATUSES)[number];

export interface ResearchSourceView {
  id: string;
  name: string;
  type: string;
  trusted: boolean;
}

export interface CitationMetadataView {
  sourceId: string;
  title: string;
  excerpt: string;
  retrievedAt: string;
}

export interface ResearchSessionView {
  id: string;
  workspaceId: string;
  title: string;
  status: ResearchSessionStatus;
  sourceCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSessionDetailView extends ResearchSessionView {
  sources: ResearchSourceView[];
  citations: CitationMetadataView[];
  notes: string;
}

export interface ResearchAnalysisResultView {
  sessionId: string;
  workspaceId: string;
  recommendationId: string | null;
  cognitiveRequestId: string;
  correlationId: string;
  evidenceCount: number;
  confidence: number;
  recommendationSummary: string;
  evidenceRefs: string[];
  recommendationHref: string | null;
}

export const CreateResearchSessionSchema = z.object({
  title: z.string().min(1).max(200),
});

export const RegisterResearchSourceSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.string().min(1).max(64),
});

export type CreateResearchSessionInput = z.infer<typeof CreateResearchSessionSchema>;
export type RegisterResearchSourceInput = z.infer<typeof RegisterResearchSourceSchema>;

export function researchHomeRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/research`;
}

export function researchSessionRoute(workspaceId: string, sessionId: string): string {
  return `/app/w/${workspaceId}/research/${sessionId}`;
}
