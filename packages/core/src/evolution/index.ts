import { z } from "zod";
import { ConfidenceSchema, MemoryDeltaSchema } from "../pipeline/artifacts.js";

export const WeaknessCategorySchema = z.enum([
  "factual", "completeness", "calibration", "communication",
  "routing", "efficiency", "workflow",
]);

export const WeaknessSchema = z.object({
  category: WeaknessCategorySchema,
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  detectedAt: z.string().datetime(),
});

export const ImprovementActionSchema = z.object({
  type: z.enum(["routing", "prompt", "workflow", "memory", "communication", "confidence_threshold"]),
  description: z.string(),
  payload: z.record(z.unknown()),
  requiresHumanApproval: z.boolean(),
  priority: z.number(),
});

export const RoutingUpdateSchema = z.object({
  taskType: z.string(),
  domain: z.string(),
  engine: z.string(),
  metric: z.enum(["accuracy", "latency", "cost", "verification_pass_rate"]),
  delta: z.number(),
});

export const PerformanceSnapshotSchema = z.object({
  accuracy: ConfidenceSchema,
  latencyP50Ms: z.number(),
  costPerTask: z.number(),
  sampleSize: z.number(),
  lastUpdated: z.string().datetime(),
});

export const EngineSelectionSchema = z.object({
  engine: z.string(),
  provider: z.string().optional(),
  weight: ConfidenceSchema,
  rationale: z.string(),
});

export const RoutingDecisionSchema = z.object({
  taskType: z.string(),
  domain: z.string(),
  selectedEngines: z.array(EngineSelectionSchema),
  rationale: z.string(),
  historicalPerformance: PerformanceSnapshotSchema,
  confidence: ConfidenceSchema,
});

export type RoutingDecision = z.infer<typeof RoutingDecisionSchema>;
export type PerformanceSnapshot = z.infer<typeof PerformanceSnapshotSchema>;
export type RoutingUpdate = z.infer<typeof RoutingUpdateSchema>;
export type Weakness = z.infer<typeof WeaknessSchema>;
export type ImprovementAction = z.infer<typeof ImprovementActionSchema>;

export const EvolutionRecordSchema = z.object({
  requestId: z.string().uuid(),
  correlationId: z.string().uuid(),
  timestamp: z.string().datetime(),
  performanceScore: ConfidenceSchema,
  weaknesses: z.array(WeaknessSchema),
  improvements: z.array(ImprovementActionSchema),
  routingRecommendations: z.array(RoutingUpdateSchema),
  memoryUpdates: MemoryDeltaSchema,
  promptRecommendations: z.array(z.object({ templateId: z.string(), change: z.string() })),
  workflowRecommendations: z.array(z.object({ workflowId: z.string(), change: z.string() })),
  approved: z.boolean(),
  appliedAt: z.string().datetime().nullable(),
});

export type EvolutionRecord = z.infer<typeof EvolutionRecordSchema>;

/** Changes the evolution engine may apply autonomously */
export const AUTONOMOUS_IMPROVEMENT_TYPES = new Set([
  "routing", "prompt", "workflow", "memory", "communication", "confidence_threshold",
]);

/** Changes requiring human approval before application */
export const HUMAN_APPROVAL_TYPES = new Set(["code", "infrastructure", "schema", "security"]);

export function classifyImprovement(action: z.infer<typeof ImprovementActionSchema>): "autonomous" | "human_review" {
  if (action.requiresHumanApproval) return "human_review";
  if (AUTONOMOUS_IMPROVEMENT_TYPES.has(action.type)) return "autonomous";
  return "human_review";
}
