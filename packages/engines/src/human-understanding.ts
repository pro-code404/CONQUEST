import {
  HumanContextSchema,
  CommunicationStrategySchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

/** Phase 2 — Who am I helping right now? HUE — session-scoped, never permanent labels. */
export function understandHuman(ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const text = ctx.observation?.rawRequest.text ?? "";
  const lower = text.toLowerCase();

  const urgency = /\b(urgent|asap|immediately|critical)\b/.test(lower) ? "high" as const
    : /\b(soon|today)\b/.test(lower) ? "medium" as const : "low" as const;

  const expertiseLevel = /\b(implement|architecture|refactor|api|deploy)\b/.test(lower) ? "expert" as const
    : /\b(how do i|what is|explain|beginner)\b/.test(lower) ? "novice" as const : "intermediate" as const;

  const humanContext = HumanContextSchema.parse({
    expertiseLevel,
    emotionalSignals: /\b(frustrated|confused|stuck)\b/.test(lower) ? ["frustration"] : ["calm"],
    urgency,
    decisionStage: /\b(should i|which|compare|evaluate)\b/.test(lower) ? "evaluation" : "exploration",
    trustLevel: "medium",
    communicationPreference: expertiseLevel === "expert" ? "technical" : "conversational",
    intent: text.slice(0, 200),
    objectives: [],
    constraints: [],
    confidence: 0.75,
    sessionScoped: true,
  });

  const communicationStrategy = CommunicationStrategySchema.parse({
    tone: urgency === "high" ? "concise" : "balanced",
    evidenceLevel: expertiseLevel === "expert" ? "high" : "medium",
    explanationDepth: expertiseLevel === "novice" ? "detailed" : "moderate",
    preferredFormat: expertiseLevel === "novice" ? "analogical" : "technical",
    askForClarification: text.length < 10,
  });

  telemetry?.emit({ service: "human-understanding", phase: "2", event: "human_context_built", level: "info", durationMs: Date.now() - start, confidence: humanContext.confidence });
  return recordPhaseTiming({ ...ctx, humanContext, communicationStrategy }, PipelinePhase.HumanUnderstanding, Date.now() - start);
}
