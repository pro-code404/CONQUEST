import { randomUUID } from "node:crypto";
import {
  MemoryDeltaSchema,
  EvolutionRecordSchema,
  classifyImprovement,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
  type EvolutionRecord,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 10 — What should we retain? Memory is compression. */
export function evolveMemory(ctx: PipelineContext, telemetry?: TelemetryCollector): { ctx: PipelineContext; evolutionRecord: EvolutionRecord } {
  const start = Date.now();
  const patterns = (ctx.reflectionRecord?.optimizationActions ?? []).map((a) => ({
    pattern: a.description,
    confidence: 0.7,
  }));

  const memoryDelta = MemoryDeltaSchema.parse({
    stores: ctx.reflectionRecord?.successes.length
      ? [{ store: "workflow", operation: "upsert" as const, key: randomUUID(), value: { goal: ctx.successCriteria?.primaryGoal, success: true }, confidence: 0.8 }]
      : [],
    patternsExtracted: patterns,
    workflowsRecorded: [{
      workflowId: ctx.executionPlan?.planId ?? randomUUID(),
      success: ctx.reflectionRecord?.goalAchieved ?? false,
    }],
    knowledgeVerified: [],
    expiredEntries: [],
  });

  const improvements = (ctx.reflectionRecord?.optimizationActions ?? []).map((a) => ({
    type: a.type as "routing" | "prompt" | "workflow" | "memory" | "communication" | "confidence_threshold",
    description: a.description,
    payload: {},
    requiresHumanApproval: false,
    priority: a.priority,
  }));

  const evolutionRecord = EvolutionRecordSchema.parse({
    requestId: ctx.requestId,
    correlationId: ctx.correlationId,
    timestamp: new Date().toISOString(),
    performanceScore: ctx.orchestrationResult?.aggregatedConfidence ?? 0.5,
    weaknesses: (ctx.reflectionRecord?.failures ?? []).map((f) => ({
      category: "workflow" as const,
      description: f,
      severity: "medium" as const,
      detectedAt: new Date().toISOString(),
    })),
    improvements,
    routingRecommendations: (ctx.reflectionRecord?.routingRecommendations ?? []).map((r) => ({
      taskType: r.taskType,
      domain: "general",
      engine: "research",
      metric: "accuracy" as const,
      delta: 0.05,
    })),
    memoryUpdates: memoryDelta,
    promptRecommendations: [],
    workflowRecommendations: [],
    approved: improvements.every((i) => classifyImprovement(i) === "autonomous"),
    appliedAt: improvements.length > 0 ? new Date().toISOString() : null,
  });

  telemetry?.emit({ service: "memory-evolution", phase: "10", event: "memory_evolved", level: "info", durationMs: Date.now() - start });
  const updatedCtx = recordPhaseTiming({ ...ctx, memoryDelta }, PipelinePhase.MemoryEvolution, Date.now() - start);
  return { ctx: updatedCtx, evolutionRecord };
}
