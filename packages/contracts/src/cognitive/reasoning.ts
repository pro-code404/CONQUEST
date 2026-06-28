import { z } from "zod";

export const ReasoningRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  objective: z.string().min(1).max(2000),
  context: z.record(z.string()).optional(),
  constraints: z.array(z.string().max(500)).optional(),
  assumptions: z.array(z.string().max(500)).optional(),
  evidenceIds: z.array(z.string().uuid()).optional(),
});

export type ReasoningRequest = z.infer<typeof ReasoningRequestSchema>;

export interface ReasoningChainStepView {
  id: string;
  order: number;
  statement: string;
  basis: string;
  evidenceRefs: string[];
  confidence: number;
}

export interface ReasoningResultView {
  id: string;
  workspaceId: string;
  objective: string;
  assumptions: string[];
  constraints: string[];
  chain: ReasoningChainStepView[];
  recommendation: string;
  confidence: number;
  createdAt: string;
}
