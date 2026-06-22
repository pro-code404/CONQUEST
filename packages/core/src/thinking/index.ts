import { z } from "zod";
import { ConfidenceSchema, EvidenceSchema } from "../pipeline/artifacts.js";

export const ConfidenceAssessmentSchema = z.object({
  score: ConfidenceSchema,
  evidence: z.array(EvidenceSchema),
  contradictions: z.array(z.object({ claim: z.string(), conflict: z.string() })),
  gaps: z.array(z.object({ topic: z.string(), severity: z.string() })),
  recommendedAction: z.enum(["answer", "research", "clarify", "refuse"]),
  reasoning: z.string(),
});

export type ConfidenceAssessment = z.infer<typeof ConfidenceAssessmentSchema>;

export function confidenceAction(score: number): ConfidenceAssessment["recommendedAction"] {
  if (score >= 0.99) return "answer";
  if (score >= 0.8) return "answer";
  if (score >= 0.4) return "research";
  return "refuse";
}

export const LayerResultSchema = z.object({
  conclusion: z.string(),
  confidence: ConfidenceSchema,
  reasoning: z.string(),
});

export const MultiLayerReasoningResultSchema = z.object({
  layers: z.object({
    logical: LayerResultSchema.optional(),
    numerical: LayerResultSchema.optional(),
    business: LayerResultSchema.optional(),
    psychological: LayerResultSchema.optional(),
    risk: LayerResultSchema.optional(),
    ethical: LayerResultSchema.optional(),
    predictive: LayerResultSchema.optional(),
  }),
  mergedConclusion: z.string(),
  mergedConfidence: ConfidenceSchema,
  layerConflicts: z.array(z.object({ layers: z.array(z.string()), description: z.string() })),
  resolution: z.string(),
});

export type MultiLayerReasoningResult = z.infer<typeof MultiLayerReasoningResultSchema>;

export const PredictionSchema = z.object({
  subject: z.string(),
  probability: ConfidenceSchema,
  expectedRange: z.object({ min: z.number(), max: z.number(), unit: z.string().optional() }),
  confidence: ConfidenceSchema,
  risk: z.object({ level: z.enum(["low", "medium", "high", "critical"]), factors: z.array(z.string()) }),
  supportingEvidence: z.array(EvidenceSchema),
  invalidationConditions: z.array(z.string()),
  assumptions: z.array(z.string()),
  modelInputs: z.record(z.unknown()),
});

export type Prediction = z.infer<typeof PredictionSchema>;

export const DeepAnalyticsResultSchema = z.object({
  rawMetrics: z.array(z.object({ name: z.string(), value: z.number(), unit: z.string().optional() })),
  interpretations: z.array(z.object({ metric: z.string(), insight: z.string() })),
  causalHypotheses: z.array(z.object({ hypothesis: z.string(), confidence: ConfidenceSchema })),
  predictions: z.array(PredictionSchema),
  recommendedActions: z.array(z.object({ action: z.string(), priority: z.number() })),
  confidence: ConfidenceSchema,
});

export type DeepAnalyticsResult = z.infer<typeof DeepAnalyticsResultSchema>;
