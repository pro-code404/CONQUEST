import { z } from "zod";

export const PROVIDER_TASK_TYPES = [
  "reasoning",
  "research",
  "summarization",
  "classification",
  "general",
] as const;

export type ProviderTaskType = (typeof PROVIDER_TASK_TYPES)[number];

export const ProviderRouteRequestSchema = z.object({
  taskType: z.enum(PROVIDER_TASK_TYPES),
  correlationId: z.string().uuid(),
  preferredProvider: z.string().max(64).optional(),
});

export type ProviderRouteRequest = z.infer<typeof ProviderRouteRequestSchema>;

export interface ProviderRouteView {
  providerId: string;
  model: string;
  taskType: ProviderTaskType;
  fallbackChain: string[];
  timeoutMs: number;
  maxRetries: number;
}

export interface ProviderUsageView {
  providerId: string;
  requestCount: number;
  tokenCount: number;
  estimatedCostUsd: number;
  failureCount: number;
}
