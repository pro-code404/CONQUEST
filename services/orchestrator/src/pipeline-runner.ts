import {
  createPipelineContext,
  PipelinePhase,
  type PipelineContext,
  type EvolutionRecord,
} from "@conquest/core";
import {
  perceive,
  understandHuman,
  reconstructContext,
  reasonAboutGoals,
  planStrategy,
  orchestrateIntelligence,
  verify,
  execute,
  reflect,
  evolveMemory,
  SelfCorrectingRouter,
  OptimizationEngine,
  LearningEngine,
  type MemoryRetriever,
  type PerceptionInput,
} from "@conquest/engines";
import { TelemetryCollector } from "@conquest/observability";

export interface PipelineResult {
  context: PipelineContext;
  evolutionRecord: EvolutionRecord;
  response: unknown;
  metrics: ReturnType<TelemetryCollector["toMetrics"]>;
  optimizationScore: number;
}

export interface PipelineRunnerOptions {
  memory?: MemoryRetriever;
  maxReroutes?: number;
}

/** Intelligent Orchestrator — sole cross-service coordinator. Never performs domain work directly. */
export class PipelineRunner {
  private readonly router = new SelfCorrectingRouter();
  private readonly optimizer = new OptimizationEngine();
  private readonly learner = new LearningEngine();

  constructor(private readonly options: PipelineRunnerOptions = {}) {}

  async run(input: PerceptionInput & { sessionId: string; userId?: string }): Promise<PipelineResult> {
    const telemetry = new TelemetryCollector(
      input.requestId,
      input.requestId,
      input.requestId,
    );

    let ctx = createPipelineContext({
      requestId: input.requestId,
      correlationId: input.requestId,
      traceId: input.requestId,
      sessionId: input.sessionId,
      userId: input.userId,
    });

    const maxReroutes = this.options.maxReroutes ?? 2;
    let reroutes = 0;

    // Phase 1 — Perception
    ctx = perceive(input, ctx, telemetry);

    // Phases 2–10 with reroute support
    do {
      ctx = understandHuman(ctx, telemetry);
      ctx = await reconstructContext(ctx, this.options.memory, telemetry);
      ctx = reasonAboutGoals(ctx, telemetry);
      ctx = planStrategy(ctx, telemetry);
      ctx = await orchestrateIntelligence(ctx, this.router, telemetry);

      const verification = verify(ctx, telemetry);
      ctx = verification.ctx;

      if (verification.shouldReroute && reroutes < maxReroutes) {
        reroutes++;
        ctx = { ...ctx, rerouteCount: reroutes };
        telemetry.emit({ service: "orchestrator", event: "pipeline_reroute", level: "warn", metadata: { phase: verification.reroutePhase, reroutes } });
        continue;
      }
      break;
    } while (reroutes <= maxReroutes);

    ctx = execute(ctx, telemetry);
    ctx = reflect(ctx, telemetry);
    const { ctx: finalCtx, evolutionRecord } = evolveMemory(ctx, telemetry);

    this.learner.apply(evolutionRecord);
    for (const rec of evolutionRecord.routingRecommendations) {
      this.router.updateStats({ ...rec, newAccuracy: 0.85 + rec.delta });
    }

    const metrics = telemetry.toMetrics(finalCtx.verificationReport?.passed ?? false, reroutes);
    const optimization = this.optimizer.evaluate({
      latencyMs: metrics.latencyMs,
      confidence: metrics.confidence ?? finalCtx.orchestrationResult?.aggregatedConfidence ?? 0,
      rerouteCount: reroutes,
      success: metrics.success,
    });

    telemetry.emit({
      service: "orchestrator",
      event: "pipeline_complete",
      level: "info",
      durationMs: metrics.latencyMs,
      confidence: finalCtx.orchestrationResult?.aggregatedConfidence,
      metadata: { optimizationScore: optimization.optimizationScore, phase: PipelinePhase.MemoryEvolution },
    });

    return {
      context: finalCtx,
      evolutionRecord,
      response: finalCtx.executionResult?.result,
      metrics,
      optimizationScore: optimization.optimizationScore,
    };
  }

  healthCheck() {
    return { healthy: true, service: "orchestrator", learningApplied: this.learner.getAppliedCount() };
  }
}

export { PipelineRunner as IntelligentOrchestrator };
