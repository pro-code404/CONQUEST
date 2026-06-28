import { z } from "zod";

export const COGNITIVE_MEMORY_SEGMENTS = [
  "workspace",
  "research",
  "recommendation_history",
  "decision_history",
  "conversation_summary",
  "organization_knowledge",
] as const;

export type CognitiveMemorySegment = (typeof COGNITIVE_MEMORY_SEGMENTS)[number];

export const MemoryRetrieveSchema = z.object({
  workspaceId: z.string().uuid(),
  segment: z.enum(COGNITIVE_MEMORY_SEGMENTS),
  query: z.string().max(500).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const MemoryStoreSchema = z.object({
  workspaceId: z.string().uuid(),
  segment: z.enum(COGNITIVE_MEMORY_SEGMENTS),
  key: z.string().min(1).max(120),
  value: z.record(z.unknown()),
  summary: z.string().min(1).max(500),
});

export type MemoryRetrieveInput = z.infer<typeof MemoryRetrieveSchema>;
export type MemoryStoreInput = z.infer<typeof MemoryStoreSchema>;

export interface CognitiveMemoryRecordView {
  id: string;
  segment: CognitiveMemorySegment;
  key: string;
  summary: string;
  createdAt: string;
}
