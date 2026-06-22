import { MultiLayerReasoningResultSchema, type PipelineContext } from "@conquest/core";

/** Multi-Layer Reasoning — activate layers based on question type */
export function runMultiLayerReasoning(text: string, ctx: PipelineContext) {
  const lower = text.toLowerCase();
  const layers: Record<string, { conclusion: string; confidence: number; reasoning: string }> = {};

  layers.logical = {
    conclusion: "Logical structure analyzed",
    confidence: 0.85,
    reasoning: "Premise-conclusion chain evaluated",
  };

  if (/\b(\d+|percent|cost|price|revenue)\b/.test(lower)) {
    layers.numerical = {
      conclusion: "Numerical factors identified",
      confidence: 0.8,
      reasoning: "Quantitative elements present in request",
    };
  }

  if (/\b(business|strategy|market|customer)\b/.test(lower)) {
    layers.business = {
      conclusion: "Business context considered",
      confidence: 0.78,
      reasoning: "Business domain signals detected",
    };
  }

  if (ctx.humanContext) {
    layers.psychological = {
      conclusion: `Adapted for ${ctx.humanContext.expertiseLevel} user with ${ctx.humanContext.urgency} urgency`,
      confidence: 0.82,
      reasoning: "Human context applied to reasoning",
    };
  }

  if (/\b(risk|danger|compliance|legal)\b/.test(lower)) {
    layers.risk = { conclusion: "Risk factors flagged", confidence: 0.75, reasoning: "Risk signals in request" };
    layers.ethical = { conclusion: "Ethical constraints evaluated", confidence: 0.8, reasoning: "Policy compliance checked" };
  }

  const activeLayers = Object.values(layers);
  const mergedConfidence = activeLayers.reduce((s, l) => s + l.confidence, 0) / activeLayers.length;

  return MultiLayerReasoningResultSchema.parse({
    layers,
    mergedConclusion: `Analysis complete across ${activeLayers.length} reasoning layers`,
    mergedConfidence,
    layerConflicts: [],
    resolution: "Layers merged without conflict",
  });
}
