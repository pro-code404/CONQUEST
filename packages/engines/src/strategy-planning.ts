import { randomUUID } from "node:crypto";
import {
  ExecutionPlanSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 5 — What should happen next? Planning only — no generation. */
export function planStrategy(ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const goal = ctx.successCriteria?.primaryGoal ?? "explain";
  const engines: Array<{ engine: string; purpose: string }> = [];

  if (["research", "decide", "predict"].includes(goal)) engines.push({ engine: "research", purpose: "gather evidence" });
  engines.push({ engine: "reasoning", purpose: "multi-layer analysis" });
  if (goal === "predict") engines.push({ engine: "prediction", purpose: "probabilistic forecast" });
  if (["create", "execute"].includes(goal)) engines.push({ engine: "execution", purpose: "produce outcome" });
  if (goal === "execute") engines.push({ engine: "automation", purpose: "action execution" });
  engines.push({ engine: "verification", purpose: "validate output" });

  const steps = engines.map((e, i) => ({
    id: randomUUID(),
    action: e.purpose,
    engine: e.engine,
    dependencies: i > 0 ? [engines[i - 1]!.engine] : [],
  }));

  const executionPlan = ExecutionPlanSchema.parse({
    planId: randomUUID(),
    steps,
    requiredEngines: engines,
    parallelizable: false,
    estimatedDurationMs: engines.length * 500,
    fallbackStrategy: "reroute_to_research_on_low_confidence",
    humanContextApplied: !!ctx.humanContext,
    communicationStrategy: ctx.communicationStrategy ?? {
      tone: "balanced", evidenceLevel: "medium", explanationDepth: "moderate", askForClarification: false,
    },
  });

  telemetry?.emit({ service: "strategy-planning", phase: "5", event: "execution_plan_created", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, executionPlan }, PipelinePhase.StrategyPlanning, Date.now() - start);
}
