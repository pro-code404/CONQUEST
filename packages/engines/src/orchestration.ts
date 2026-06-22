import {
  OrchestrationResultSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
  type RoutingDecision,
  type PerformanceSnapshot,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";
import { conductResearch } from "./research.js";
import { runMultiLayerReasoning } from "./reasoning.js";
import { generatePrediction } from "./prediction.js";
import { runDeepAnalytics } from "./analytics.js";

export interface Router {
  selectRoute(taskType: string, domain: string): RoutingDecision;
}

const DEFAULT_PERFORMANCE: PerformanceSnapshot = {
  accuracy: 0.85,
  latencyP50Ms: 500,
  costPerTask: 0.01,
  sampleSize: 1,
  lastUpdated: new Date().toISOString(),
};

/** Phase 6 — Who should do the work? CIOS activates engines. */
export async function orchestrateIntelligence(
  ctx: PipelineContext,
  router?: Router,
  telemetry?: TelemetryCollector,
): Promise<PipelineContext> {
  const start = Date.now();
  const text = ctx.observation?.rawRequest.text ?? "";
  const goal = ctx.successCriteria?.primaryGoal ?? "explain";
  const domain = inferDomain(text);

  const routing = router?.selectRoute(goal, domain) ?? {
    taskType: goal,
    domain,
    selectedEngines: [{ engine: "reasoning", weight: 1, rationale: "default" }],
    rationale: "default routing",
    historicalPerformance: DEFAULT_PERFORMANCE,
    confidence: 0.8,
  };

  const engineOutputs: Array<{ engine: string; output: unknown; confidence: number; durationMs: number }> = [];
  const log: Array<{ timestamp: string; message: string; level: string }> = [];

  for (const step of ctx.executionPlan?.steps ?? []) {
    const stepStart = Date.now();
    let output: unknown;
    let confidence = 0.8;

    switch (step.engine) {
      case "research": {
        const r = await conductResearch(text, ctx);
        output = r;
        confidence = r.score;
        break;
      }
      case "reasoning": {
        const r = runMultiLayerReasoning(text, ctx);
        output = r;
        confidence = r.mergedConfidence;
        break;
      }
      case "prediction": {
        const r = generatePrediction(text, domain);
        output = r;
        confidence = r.confidence;
        break;
      }
      case "analytics": {
        const r = runDeepAnalytics(text);
        output = r;
        confidence = r.confidence;
        break;
      }
      case "execution":
      case "automation":
      case "verification":
        output = { deferred: true, engine: step.engine };
        confidence = 0.9;
        break;
      default:
        output = { engine: step.engine, status: "activated" };
    }

    engineOutputs.push({ engine: step.engine, output, confidence, durationMs: Date.now() - stepStart });
    log.push({ timestamp: new Date().toISOString(), message: `${step.engine} completed`, level: "info" });
  }

  const aggregatedConfidence = engineOutputs.length
    ? engineOutputs.reduce((s, e) => s + e.confidence, 0) / engineOutputs.length
    : 0.5;

  const orchestrationResult = OrchestrationResultSchema.parse({
    correlationId: ctx.correlationId,
    engineOutputs,
    aggregatedConfidence,
    executionLog: log,
    traceId: ctx.traceId,
  });

  telemetry?.emit({
    service: "orchestrator", phase: "6", event: "orchestration_complete", level: "info",
    durationMs: Date.now() - start, confidence: aggregatedConfidence,
    metadata: { routing: routing.rationale },
  });

  return recordPhaseTiming({ ...ctx, orchestrationResult }, PipelinePhase.IntelligenceOrchestration, Date.now() - start);
}

function inferDomain(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(trade|stock|bitcoin|finance|market)\b/.test(lower)) return "finance";
  if (/\b(code|program|api|typescript|python)\b/.test(lower)) return "programming";
  if (/\b(marketing|campaign|content|seo)\b/.test(lower)) return "marketing";
  return "general";
}
