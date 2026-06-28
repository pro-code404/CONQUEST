import { z } from "zod";

export const COGNITIVE_LIFECYCLE_STATUSES = [
  "accepted",
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export type CognitiveLifecycleStatus = (typeof COGNITIVE_LIFECYCLE_STATUSES)[number];

export const CognitiveRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  objective: z.string().min(1).max(2000),
  context: z.record(z.string()).optional(),
  constraints: z.array(z.string().max(500)).optional(),
  correlationId: z.string().min(1).max(128).optional(),
  async: z.boolean().optional(),
});

export type CognitiveRequest = z.infer<typeof CognitiveRequestSchema>;

export interface CognitiveLifecycleView {
  requestId: string;
  correlationId: string;
  status: CognitiveLifecycleStatus;
  startedAt: string;
  completedAt: string | null;
  phases: string[];
}

export interface CognitiveResponseView {
  requestId: string;
  correlationId: string;
  lifecycle: CognitiveLifecycleStatus;
  recommendationId: string | null;
  decisionId: string | null;
  evidenceCount: number;
  confidence: number;
  recommendationSummary?: string;
  evidenceRefs?: string[];
  evidenceSummaries?: Array<{
    id: string;
    sourceId: string;
    title: string;
    excerpt: string;
  }>;
  telemetry?: CognitiveTelemetryView;
}

export interface CognitiveTelemetryView {
  durationMs: number;
  cacheHit: boolean;
  auditId: string | null;
  phases: string[];
  providerId: string | null;
  fallbackUsed: boolean;
}
