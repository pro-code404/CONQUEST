import { z } from "zod";
import { ConfidenceSchema, IsoTimestampSchema, EvidenceSchema } from "../pipeline/artifacts.js";

export const AgentMessageSchema = z.object({
  requestId: z.string().uuid(),
  correlationId: z.string().uuid(),
  origin: z.string(),
  destination: z.string(),
  intent: z.string(),
  payload: z.unknown(),
  confidence: ConfidenceSchema,
  priority: z.number().min(0).max(10),
  timestamp: IsoTimestampSchema,
  version: z.string(),
  traceId: z.string(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

export function createMessage(params: Omit<AgentMessage, "timestamp" | "version">): AgentMessage {
  return AgentMessageSchema.parse({
    ...params,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}

export const ServiceResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    recoverable: z.boolean(),
  }).optional(),
  confidence: ConfidenceSchema,
  metadata: z.object({
    traceId: z.string(),
    durationMs: z.number(),
    service: z.string(),
    version: z.string(),
  }),
});

export type ServiceResponse<T = unknown> = z.infer<typeof ServiceResponseSchema> & { data?: T };

export function createServiceResponse<T>(params: {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; recoverable: boolean };
  confidence: number;
  traceId: string;
  durationMs: number;
  service: string;
}): ServiceResponse<T> {
  return ServiceResponseSchema.parse({
    ...params,
    metadata: {
      traceId: params.traceId,
      durationMs: params.durationMs,
      service: params.service,
      version: "1.0.0",
    },
  }) as ServiceResponse<T>;
}

export { EvidenceSchema };
