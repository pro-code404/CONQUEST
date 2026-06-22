import { z } from "zod";

export const ConfidenceSchema = z.number().min(0).max(1);
export const IsoTimestampSchema = z.string().datetime();

export const EvidenceSchema = z.object({
  source: z.string(),
  content: z.string(),
  reliability: ConfidenceSchema,
  freshness: IsoTimestampSchema.optional(),
});

export const NormalizedRequestSchema = z.object({
  text: z.string(),
  modality: z.enum(["text", "voice", "image", "video", "document", "api", "webhook"]),
  metadata: z.record(z.unknown()).optional(),
});

export const ObservationContextSchema = z.object({
  requestId: z.string().uuid(),
  timestamp: IsoTimestampSchema,
  rawRequest: NormalizedRequestSchema,
  attachments: z.array(z.object({ id: z.string(), type: z.string(), uri: z.string() })),
  conversationSnapshot: z.object({ messageCount: z.number(), lastMessages: z.array(z.string()) }),
  workspace: z.record(z.unknown()).optional(),
  activeTasks: z.array(z.object({ id: z.string(), title: z.string(), status: z.string() })),
  calendar: z.record(z.unknown()).nullable(),
  availableTools: z.array(z.object({ id: z.string(), name: z.string(), capabilities: z.array(z.string()) })),
  connectedSystems: z.array(z.object({ id: z.string(), type: z.string(), status: z.string() })),
  environment: z.object({ nodeEnv: z.string(), timezone: z.string().optional() }),
  availableModels: z.array(z.object({ id: z.string(), provider: z.string(), capabilities: z.array(z.string()) })),
});

export const HumanContextSchema = z.object({
  expertiseLevel: z.enum(["novice", "intermediate", "advanced", "expert"]),
  emotionalSignals: z.array(z.string()),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  decisionStage: z.string(),
  trustLevel: z.enum(["low", "medium", "high"]),
  communicationPreference: z.string(),
  intent: z.string(),
  objectives: z.array(z.string()),
  constraints: z.array(z.string()),
  confidence: ConfidenceSchema,
  sessionScoped: z.literal(true),
});

export const CommunicationStrategySchema = z.object({
  tone: z.string(),
  evidenceLevel: z.enum(["low", "medium", "high"]),
  explanationDepth: z.enum(["minimal", "moderate", "detailed"]),
  preferredFormat: z.enum(["analogical", "technical", "visual", "step-by-step"]).optional(),
  askForClarification: z.boolean(),
});

export const ReconstructedContextSchema = z.object({
  project: z.object({ id: z.string(), name: z.string() }).nullable(),
  activeGoals: z.array(z.object({ id: z.string(), description: z.string() })),
  priorDecisions: z.array(z.object({ id: z.string(), summary: z.string() })),
  existingAssumptions: z.array(z.object({ id: z.string(), assumption: z.string() })),
  completedTasks: z.array(z.object({ id: z.string(), title: z.string() })),
  relevantMemories: z.array(z.object({ id: z.string(), store: z.string(), summary: z.string() })),
  externalData: z.array(z.object({ source: z.string(), summary: z.string() })),
  toolAvailability: z.record(z.boolean()),
});

export const SuccessTypeSchema = z.enum([
  "explain", "research", "decide", "create", "execute",
  "automate", "collaborate", "monitor", "learn", "predict",
]);

export const SuccessCriteriaSchema = z.object({
  primaryGoal: SuccessTypeSchema,
  secondaryGoals: z.array(SuccessTypeSchema),
  measurableOutcomes: z.array(z.object({ description: z.string(), metric: z.string().optional() })),
  constraints: z.array(z.object({ type: z.string(), description: z.string() })),
  confidenceRequired: ConfidenceSchema,
  timeBudgetMs: z.number().nullable(),
});

export const PlanStepSchema = z.object({
  id: z.string(),
  action: z.string(),
  engine: z.string(),
  dependencies: z.array(z.string()),
});

export const ExecutionPlanSchema = z.object({
  planId: z.string().uuid(),
  steps: z.array(PlanStepSchema),
  requiredEngines: z.array(z.object({ engine: z.string(), purpose: z.string() })),
  parallelizable: z.boolean(),
  estimatedDurationMs: z.number(),
  fallbackStrategy: z.string(),
  humanContextApplied: z.boolean(),
  communicationStrategy: CommunicationStrategySchema,
});

export const EngineOutputSchema = z.object({
  engine: z.string(),
  output: z.unknown(),
  confidence: ConfidenceSchema,
  durationMs: z.number(),
});

export const OrchestrationResultSchema = z.object({
  correlationId: z.string().uuid(),
  engineOutputs: z.array(EngineOutputSchema),
  aggregatedConfidence: ConfidenceSchema,
  executionLog: z.array(z.object({ timestamp: IsoTimestampSchema, message: z.string(), level: z.string() })),
  traceId: z.string(),
});

export const VerificationCheckSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  details: z.string().optional(),
});

export const VerificationReportSchema = z.object({
  passed: z.boolean(),
  checks: z.array(VerificationCheckSchema),
  confidence: ConfidenceSchema,
  rerouteCondition: z.string().nullable(),
  refinementInstructions: z.string().nullable(),
});

export const ExecutionResultSchema = z.object({
  result: z.unknown(),
  confidence: ConfidenceSchema,
  evidence: z.array(EvidenceSchema),
  executionLog: z.array(z.object({ timestamp: IsoTimestampSchema, message: z.string() })),
  validationStatus: z.enum(["pending", "verified", "failed"]),
  actionsPerformed: z.array(z.object({ type: z.string(), target: z.string(), status: z.string() })),
});

export const ReflectionRecordSchema = z.object({
  goalAchieved: z.boolean(),
  successes: z.array(z.string()),
  failures: z.array(z.string()),
  wrongAssumptions: z.array(z.string()),
  optimizationActions: z.array(z.object({ type: z.string(), description: z.string(), priority: z.number() })),
  routingRecommendations: z.array(z.object({ taskType: z.string(), recommendation: z.string() })),
});

export const MemoryStoreUpdateSchema = z.object({
  store: z.string(),
  operation: z.enum(["upsert", "delete", "expire"]),
  key: z.string(),
  value: z.unknown().optional(),
  confidence: ConfidenceSchema,
});

export const MemoryDeltaSchema = z.object({
  stores: z.array(MemoryStoreUpdateSchema),
  patternsExtracted: z.array(z.object({ pattern: z.string(), confidence: ConfidenceSchema })),
  workflowsRecorded: z.array(z.object({ workflowId: z.string(), success: z.boolean() })),
  knowledgeVerified: z.array(z.object({ claim: z.string(), evidence: z.array(EvidenceSchema) })),
  expiredEntries: z.array(z.string()),
});

export type ObservationContext = z.infer<typeof ObservationContextSchema>;
export type HumanContext = z.infer<typeof HumanContextSchema>;
export type CommunicationStrategy = z.infer<typeof CommunicationStrategySchema>;
export type ReconstructedContext = z.infer<typeof ReconstructedContextSchema>;
export type SuccessCriteria = z.infer<typeof SuccessCriteriaSchema>;
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>;
export type OrchestrationResult = z.infer<typeof OrchestrationResultSchema>;
export type VerificationReport = z.infer<typeof VerificationReportSchema>;
export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;
export type ReflectionRecord = z.infer<typeof ReflectionRecordSchema>;
export type MemoryDelta = z.infer<typeof MemoryDeltaSchema>;
