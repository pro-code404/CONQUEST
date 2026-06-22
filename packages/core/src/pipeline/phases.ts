import { z } from "zod";

/** Ten-phase Conquest Cognitive Pipeline */
export enum PipelinePhase {
  Perception = 1,
  HumanUnderstanding = 2,
  ContextReconstruction = 3,
  GoalReasoning = 4,
  StrategyPlanning = 5,
  IntelligenceOrchestration = 6,
  Verification = 7,
  Execution = 8,
  Reflection = 9,
  MemoryEvolution = 10,
}

export const PipelinePhaseName: Record<PipelinePhase, string> = {
  [PipelinePhase.Perception]: "Perception",
  [PipelinePhase.HumanUnderstanding]: "Human Understanding",
  [PipelinePhase.ContextReconstruction]: "Context Reconstruction",
  [PipelinePhase.GoalReasoning]: "Goal Reasoning",
  [PipelinePhase.StrategyPlanning]: "Strategy Planning",
  [PipelinePhase.IntelligenceOrchestration]: "Intelligence Orchestration",
  [PipelinePhase.Verification]: "Verification",
  [PipelinePhase.Execution]: "Execution",
  [PipelinePhase.Reflection]: "Reflection",
  [PipelinePhase.MemoryEvolution]: "Memory Evolution",
};

export const PHASE_ORDER: PipelinePhase[] = [
  PipelinePhase.Perception,
  PipelinePhase.HumanUnderstanding,
  PipelinePhase.ContextReconstruction,
  PipelinePhase.GoalReasoning,
  PipelinePhase.StrategyPlanning,
  PipelinePhase.IntelligenceOrchestration,
  PipelinePhase.Verification,
  PipelinePhase.Execution,
  PipelinePhase.Reflection,
  PipelinePhase.MemoryEvolution,
];

export const RerouteRuleSchema = z.object({
  condition: z.string(),
  rerouteTo: z.nativeEnum(PipelinePhase),
  description: z.string(),
});

export type RerouteRule = z.infer<typeof RerouteRuleSchema>;

/** Canonical reroute rules from cognitive-pipeline.md */
export const DEFAULT_REROUTE_RULES: RerouteRule[] = [
  {
    condition: "verification_factual_gap",
    rerouteTo: PipelinePhase.IntelligenceOrchestration,
    description: "Research engine activation for factual gap",
  },
  {
    condition: "verification_plan_inadequate",
    rerouteTo: PipelinePhase.StrategyPlanning,
    description: "Replan required",
  },
  {
    condition: "verification_goal_misunderstood",
    rerouteTo: PipelinePhase.GoalReasoning,
    description: "Goal reasoning revision",
  },
  {
    condition: "verification_context_incomplete",
    rerouteTo: PipelinePhase.ContextReconstruction,
    description: "Context reconstruction required",
  },
  {
    condition: "verification_human_misread",
    rerouteTo: PipelinePhase.HumanUnderstanding,
    description: "Human understanding revision",
  },
  {
    condition: "low_confidence_pre_planning",
    rerouteTo: PipelinePhase.IntelligenceOrchestration,
    description: "Research before planning",
  },
];

export function nextPhase(current: PipelinePhase): PipelinePhase | null {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx === PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[idx + 1] ?? null;
}

export function resolveReroute(condition: string, rules = DEFAULT_REROUTE_RULES): PipelinePhase | null {
  const rule = rules.find((r) => r.condition === condition);
  return rule?.rerouteTo ?? null;
}
