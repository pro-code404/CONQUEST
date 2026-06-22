import {
  ReconstructedContextSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

export interface MemoryRetriever {
  retrieve(params: { query: string; userId?: string; projectId?: string; limit?: number }): Promise<Array<{ id: string; store: string; summary: string }>>;
}

/** Phase 3 — What is the full situation? Reconstruct reality before reasoning. */
export async function reconstructContext(
  ctx: PipelineContext,
  memory?: MemoryRetriever,
  telemetry?: TelemetryCollector,
): Promise<PipelineContext> {
  const start = Date.now();
  const query = ctx.observation?.rawRequest.text ?? "";
  const relevantMemories = memory
    ? await memory.retrieve({ query, userId: ctx.userId, limit: 10 })
    : [];

  const reconstructedContext = ReconstructedContextSchema.parse({
    project: null,
    activeGoals: [],
    priorDecisions: [],
    existingAssumptions: [],
    completedTasks: [],
    relevantMemories,
    externalData: [],
    toolAvailability: Object.fromEntries(
      (ctx.observation?.availableTools ?? []).map((t) => [t.id, true]),
    ),
  });

  telemetry?.emit({ service: "context-reconstruction", phase: "3", event: "context_reconstructed", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, reconstructedContext }, PipelinePhase.ContextReconstruction, Date.now() - start);
}
