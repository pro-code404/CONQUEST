import {
  ReflectionRecordSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 9 — What did we learn? Internal only — never exposed raw to users. */
export function reflect(ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const goalAchieved = ctx.verificationReport?.passed ?? false;
  const format = ctx.communicationStrategy?.preferredFormat;
  const expertise = ctx.humanContext?.expertiseLevel;

  const weaknesses: string[] = [];
  if (expertise === "novice" && format === "technical") {
    weaknesses.push("Explanation may be too technical for novice user — prefer analogies");
  }
  if ((ctx.orchestrationResult?.aggregatedConfidence ?? 0) < 0.8) {
    weaknesses.push("Confidence below optimal — consider additional research");
  }

  const reflectionRecord = ReflectionRecordSchema.parse({
    goalAchieved,
    successes: goalAchieved ? ["Verification passed", "Pipeline completed"] : [],
    failures: goalAchieved ? [] : ["Verification failed"],
    wrongAssumptions: [],
    optimizationActions: weaknesses.map((w, i) => ({
      type: w.includes("technical") ? "communication" : "routing",
      description: w,
      priority: i + 1,
    })),
    routingRecommendations: weaknesses.filter((w) => w.includes("research")).map(() => ({
      taskType: ctx.successCriteria?.primaryGoal ?? "explain",
      recommendation: "Activate research engine earlier",
    })),
  });

  telemetry?.emit({ service: "reflection", phase: "9", event: "reflection_complete", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, reflectionRecord }, PipelinePhase.Reflection, Date.now() - start);
}
