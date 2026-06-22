import {
  ExecutionResultSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 8 — Can it be done? Responses become actions. */
export function execute(ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const text = ctx.observation?.rawRequest.text ?? "";
  const goal = ctx.successCriteria?.primaryGoal ?? "explain";
  const strategy = ctx.communicationStrategy;
  const reasoning = ctx.orchestrationResult?.engineOutputs.find((e) => e.engine === "reasoning")?.output;

  let result: unknown;
  const actions: Array<{ type: string; target: string; status: string }> = [];

  switch (goal) {
    case "execute":
      result = { message: "Execution action queued", action: "execute", input: text };
      actions.push({ type: "execute", target: "execution-runtime", status: "queued" });
      break;
    case "create":
      result = { message: "Creation task initiated", artifact: "pending", input: text };
      actions.push({ type: "create", target: "execution-runtime", status: "initiated" });
      break;
    default:
      result = {
        answer: composeResponse(text, strategy, reasoning),
        format: strategy?.preferredFormat ?? "technical",
        evidenceLevel: strategy?.evidenceLevel ?? "medium",
      };
      actions.push({ type: "respond", target: "user", status: "delivered" });
  }

  const executionResult = ExecutionResultSchema.parse({
    result,
    confidence: ctx.orchestrationResult?.aggregatedConfidence ?? 0.7,
    evidence: [],
    executionLog: [{ timestamp: new Date().toISOString(), message: `Executed goal: ${goal}` }],
    validationStatus: ctx.verificationReport?.passed ? "verified" : "pending",
    actionsPerformed: actions,
  });

  telemetry?.emit({ service: "execution", phase: "8", event: "execution_complete", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, executionResult }, PipelinePhase.Execution, Date.now() - start);
}

function composeResponse(text: string, strategy: PipelineContext["communicationStrategy"], reasoning: unknown): string {
  const depth = strategy?.explanationDepth ?? "moderate";
  const format = strategy?.preferredFormat ?? "technical";
  const reasoningNote = reasoning && typeof reasoning === "object" && "mergedConclusion" in reasoning
    ? (reasoning as { mergedConclusion: string }).mergedConclusion
    : "";

  if (format === "analogical") {
    return `[Analogical ${depth} response] Regarding "${text.slice(0, 80)}": ${reasoningNote}. Think of it like building blocks — each piece connects to form the complete picture.`;
  }
  return `[${depth} technical response] Regarding "${text.slice(0, 80)}": ${reasoningNote}. Analysis complete based on multi-layer reasoning.`;
}
