import { DeepAnalyticsResultSchema } from "@conquest/core";

/** Deep Analytics — numbers become intelligence */
export function runDeepAnalytics(text: string) {
  const metrics = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*(%|k|m)?/gi)).map((m, i) => ({
    name: `metric_${i}`,
    value: parseFloat(m[1]!),
    unit: m[2] ?? undefined,
  }));

  return DeepAnalyticsResultSchema.parse({
    rawMetrics: metrics,
    interpretations: metrics.map((m) => ({
      metric: m.name,
      insight: `${m.name} value ${m.value}${m.unit ?? ""} requires contextual analysis`,
    })),
    causalHypotheses: [],
    predictions: [],
    recommendedActions: [{ action: "Gather domain context for metric interpretation", priority: 1 }],
    confidence: metrics.length > 0 ? 0.7 : 0.4,
  });
}
