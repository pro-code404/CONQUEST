import {
  SuccessCriteriaSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 4 — What is success? Not what answer to generate. */
export function reasonAboutGoals(ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const text = (ctx.observation?.rawRequest.text ?? "").toLowerCase();

  let primaryGoal: "explain" | "research" | "decide" | "create" | "execute" | "automate" | "predict" = "explain";
  if (/\b(build|create|write|generate|implement)\b/.test(text)) primaryGoal = "create";
  else if (/\b(run|execute|deploy|call|schedule)\b/.test(text)) primaryGoal = "execute";
  else if (/\b(research|find|investigate|analyze sources)\b/.test(text)) primaryGoal = "research";
  else if (/\b(should|choose|decide|compare)\b/.test(text)) primaryGoal = "decide";
  else if (/\b(automate|workflow|trigger)\b/.test(text)) primaryGoal = "automate";
  else if (/\b(predict|forecast|probability)\b/.test(text)) primaryGoal = "predict";

  const successCriteria = SuccessCriteriaSchema.parse({
    primaryGoal,
    secondaryGoals: [],
    measurableOutcomes: [{ description: `Achieve ${primaryGoal} for user request` }],
    constraints: (ctx.humanContext?.constraints ?? []).map((c) => ({ type: "user", description: c })),
    confidenceRequired: ctx.humanContext?.urgency === "high" ? 0.85 : 0.7,
    timeBudgetMs: ctx.humanContext?.urgency === "critical" ? 30000 : null,
  });

  telemetry?.emit({ service: "goal-reasoning", phase: "4", event: "success_criteria_defined", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, successCriteria }, PipelinePhase.GoalReasoning, Date.now() - start);
}
