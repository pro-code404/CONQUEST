import { z } from "zod";
import {
  ObservationContextSchema,
  HumanContextSchema,
  CommunicationStrategySchema,
  ReconstructedContextSchema,
  SuccessCriteriaSchema,
  ExecutionPlanSchema,
  OrchestrationResultSchema,
  VerificationReportSchema,
  ExecutionResultSchema,
  ReflectionRecordSchema,
  MemoryDeltaSchema,
} from "./artifacts.js";
import { PipelinePhase } from "./phases.js";

/** Accumulated state as a request flows through the cognitive pipeline */
export const PipelineContextSchema = z.object({
  requestId: z.string().uuid(),
  correlationId: z.string().uuid(),
  traceId: z.string(),
  sessionId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  currentPhase: z.nativeEnum(PipelinePhase),
  startedAt: z.string().datetime(),
  phaseTimings: z.record(z.number()),
  rerouteCount: z.number().default(0),
  observation: ObservationContextSchema.optional(),
  humanContext: HumanContextSchema.optional(),
  communicationStrategy: CommunicationStrategySchema.optional(),
  reconstructedContext: ReconstructedContextSchema.optional(),
  successCriteria: SuccessCriteriaSchema.optional(),
  executionPlan: ExecutionPlanSchema.optional(),
  orchestrationResult: OrchestrationResultSchema.optional(),
  verificationReport: VerificationReportSchema.optional(),
  executionResult: ExecutionResultSchema.optional(),
  reflectionRecord: ReflectionRecordSchema.optional(),
  memoryDelta: MemoryDeltaSchema.optional(),
});

export type PipelineContext = z.infer<typeof PipelineContextSchema>;

export function createPipelineContext(params: {
  requestId: string;
  correlationId: string;
  traceId: string;
  sessionId: string;
  userId?: string;
}): PipelineContext {
  return {
    ...params,
    currentPhase: PipelinePhase.Perception,
    startedAt: new Date().toISOString(),
    phaseTimings: {},
    rerouteCount: 0,
  };
}

export function recordPhaseTiming(ctx: PipelineContext, phase: PipelinePhase, durationMs: number): PipelineContext {
  return {
    ...ctx,
    phaseTimings: { ...ctx.phaseTimings, [PipelinePhase[phase]]: durationMs },
    currentPhase: phase,
  };
}
