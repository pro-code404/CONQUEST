import type { AgentMessage, ServiceResponse } from "../messages/envelope.js";
import type { PipelineContext } from "../pipeline/context.js";

/** Universal service contract — SDD-I §5 */
export interface CognitiveService<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly version: string;
  process(input: TInput, ctx: PipelineContext): Promise<ServiceResponse<TOutput>>;
  handleMessage(message: AgentMessage): Promise<ServiceResponse<TOutput>>;
  healthCheck(): Promise<{ healthy: boolean; details?: string }>;
}

export interface PhaseHandler<TInput = unknown, TOutput = unknown> {
  readonly phase: number;
  readonly name: string;
  execute(input: TInput, ctx: PipelineContext): Promise<{ output: TOutput; ctx: PipelineContext }>;
}

export const SERVICE_NAMES = {
  GATEWAY: "api-gateway",
  AUTH: "auth",
  SESSION: "session",
  WORKSPACE: "workspace",
  SETTINGS: "settings",
  ORCHESTRATOR: "orchestrator",
  UNDERSTANDING: "understanding",
  MEMORY: "memory",
  RESEARCH: "research",
  PLANNING: "planning",
  REASONING: "reasoning",
  PREDICTION: "prediction",
  EXECUTION: "execution",
  ANALYTICS: "analytics",
  VERIFICATION: "verification",
  REFLECTION: "reflection",
  OPTIMIZATION: "optimization",
  LEARNING: "learning",
  AUTOMATION: "automation",
  CACHE: "cache",
  JOBS: "jobs",
  AI_GATEWAY: "ai-gateway",
  AI_AUDIT: "ai-audit",
  PERFORMANCE: "performance",
  INTELLIGENCE: "intelligence",
  OPERATIONS: "operations",
  ADMINISTRATION: "administration",
  COGNITIVE_ORCHESTRATOR: "cognitive-orchestrator",
  EVIDENCE: "evidence",
  DECISION: "decision",
  PROMPT_MANAGEMENT: "prompt-management",
} as const;

export type ServiceName = (typeof SERVICE_NAMES)[keyof typeof SERVICE_NAMES];
