import {
  VerificationReportSchema,
  PipelinePhase,
  recordPhaseTiming,
  resolveReroute,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 7 — Is it correct? Mandatory gate before delivery. */
export function verify(ctx: PipelineContext, telemetry?: TelemetryCollector): { ctx: PipelineContext; shouldReroute: boolean; reroutePhase: PipelinePhase | null } {
  const start = Date.now();
  const confidence = ctx.orchestrationResult?.aggregatedConfidence ?? 0;
  const required = ctx.successCriteria?.confidenceRequired ?? 0.7;

  const checks = [
    { name: "instruction_compliance", passed: !!ctx.observation?.rawRequest.text, details: "Request present" },
    { name: "logical_consistency", passed: !!ctx.orchestrationResult, details: "Orchestration completed" },
    { name: "confidence_threshold", passed: confidence >= required, details: `Confidence ${confidence.toFixed(2)} vs required ${required}` },
    { name: "plan_complete", passed: (ctx.executionPlan?.steps.length ?? 0) > 0, details: "Execution plan exists" },
    { name: "human_context_applied", passed: ctx.executionPlan?.humanContextApplied ?? false, details: "HUE integrated" },
  ];

  const passed = checks.every((c) => c.passed);
  let rerouteCondition: string | null = null;

  if (!passed) {
    if (!checks.find((c) => c.name === "confidence_threshold")?.passed) {
      rerouteCondition = confidence < 0.4 ? "verification_context_incomplete" : "verification_factual_gap";
    } else if (!checks.find((c) => c.name === "plan_complete")?.passed) {
      rerouteCondition = "verification_plan_inadequate";
    }
  }

  const verificationReport = VerificationReportSchema.parse({
    passed,
    checks,
    confidence,
    rerouteCondition,
    refinementInstructions: passed ? null : "Address failed verification checks before delivery",
  });

  if (!passed) {
    telemetry?.emit({ service: "verification", phase: "7", event: "validation_failed", level: "warn", durationMs: Date.now() - start });
  }

  const updatedCtx = recordPhaseTiming({ ...ctx, verificationReport }, PipelinePhase.Verification, Date.now() - start);
  const reroutePhase = rerouteCondition ? resolveReroute(rerouteCondition) : null;

  return { ctx: updatedCtx, shouldReroute: !passed && reroutePhase != null, reroutePhase };
}
