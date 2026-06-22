import type { PerformanceSnapshot, RoutingUpdate, RoutingDecision } from "@conquest/core";

/** Self-Correcting Router — route based on historical performance */
export class SelfCorrectingRouter {
  private stats = new Map<string, PerformanceSnapshot & { engine: string }>();

  selectRoute(taskType: string, domain: string): RoutingDecision {
    const key = `${taskType}:${domain}`;
    const candidates = this.getCandidates(taskType, domain);
    const best = candidates.sort((a, b) => b.accuracy - a.accuracy)[0]!;

    return {
      taskType,
      domain,
      selectedEngines: [{ engine: best.engine, provider: best.engine, weight: 1, rationale: `Best accuracy: ${best.accuracy}` }],
      rationale: `Selected ${best.engine} for ${key} based on performance history`,
      historicalPerformance: best,
      confidence: best.accuracy,
    };
  }

  updateStats(update: RoutingUpdate & { newAccuracy?: number; latencyMs?: number; cost?: number }): void {
    const key = `${update.taskType}:${update.domain}:${update.engine}`;
    const existing = this.stats.get(key) ?? {
      engine: update.engine,
      accuracy: 0.5,
      latencyP50Ms: 1000,
      costPerTask: 0.01,
      sampleSize: 0,
      lastUpdated: new Date().toISOString(),
    };

    const n = existing.sampleSize + 1;
    this.stats.set(key, {
      engine: update.engine,
      accuracy: update.newAccuracy ?? Math.min(1, existing.accuracy + update.delta),
      latencyP50Ms: update.latencyMs ?? existing.latencyP50Ms,
      costPerTask: update.cost ?? existing.costPerTask,
      sampleSize: n,
      lastUpdated: new Date().toISOString(),
    });
  }

  private getCandidates(taskType: string, domain: string): Array<PerformanceSnapshot & { engine: string }> {
    const defaults: Record<string, string> = {
      "create:programming": "gpt-4",
      "explain:general": "claude",
      "predict:finance": "claude",
      "execute:general": "gpt-4",
    };
    const key = `${taskType}:${domain}`;
    const stored = this.stats.get(`${key}:${defaults[key] ?? "reasoning"}`);
    if (stored) return [stored];

    const engine = defaults[key] ?? "reasoning";
    return [{
      engine,
      accuracy: domain === "finance" ? 0.99 : domain === "programming" ? 0.98 : 0.85,
      latencyP50Ms: engine === "gpt-4" ? 2000 : 3000,
      costPerTask: 0.01,
      sampleSize: 1,
      lastUpdated: new Date().toISOString(),
    }];
  }
}

/** Optimization Engine — evaluates workflow efficiency */
export class OptimizationEngine {
  evaluate(metrics: { latencyMs: number; confidence: number; rerouteCount: number; success: boolean }) {
    const score = (metrics.success ? 0.4 : 0) + metrics.confidence * 0.4 + (metrics.rerouteCount === 0 ? 0.2 : 0.1);
    return {
      optimizationScore: score,
      recommendations: metrics.rerouteCount > 1
        ? [{ type: "workflow", description: "High reroute count — review planning phase" }]
        : [],
    };
  }
}

/** Learning Engine — applies validated evolution records */
export class LearningEngine {
  private applied: string[] = [];

  apply(record: { requestId: string; approved: boolean; improvements: Array<{ requiresHumanApproval: boolean }> }): boolean {
    if (!record.approved) return false;
    if (record.improvements.some((i) => i.requiresHumanApproval)) return false;
    this.applied.push(record.requestId);
    return true;
  }

  getAppliedCount(): number {
    return this.applied.length;
  }
}

export { SelfCorrectingRouter as Router };
