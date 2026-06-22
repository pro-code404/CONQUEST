import {
  type ObservationContext,
  ObservationContextSchema,
  PipelinePhase,
  recordPhaseTiming,
  type PipelineContext,
} from "@conquest/core";
import type { TelemetryCollector } from "@conquest/observability";

export interface PerceptionInput {
  requestId: string;
  text: string;
  modality?: ObservationContext["rawRequest"]["modality"];
  attachments?: ObservationContext["attachments"];
  sessionMessages?: string[];
  workspace?: Record<string, unknown>;
  activeTasks?: ObservationContext["activeTasks"];
}

/** Phase 1 — What exists? Collect reality without interpretation. */
export function perceive(input: PerceptionInput, ctx: PipelineContext, telemetry?: TelemetryCollector): PipelineContext {
  const start = Date.now();
  const observation = ObservationContextSchema.parse({
    requestId: input.requestId,
    timestamp: new Date().toISOString(),
    rawRequest: { text: input.text, modality: input.modality ?? "text" },
    attachments: input.attachments ?? [],
    conversationSnapshot: {
      messageCount: input.sessionMessages?.length ?? 0,
      lastMessages: input.sessionMessages ?? [],
    },
    workspace: input.workspace,
    activeTasks: input.activeTasks ?? [],
    calendar: null,
    availableTools: [
      { id: "research", name: "Research Engine", capabilities: ["web", "memory", "api"] },
      { id: "code", name: "Code Engine", capabilities: ["generate", "analyze", "refactor"] },
      { id: "automation", name: "Automation Engine", capabilities: ["schedule", "trigger", "workflow"] },
    ],
    connectedSystems: [],
    environment: { nodeEnv: process.env.NODE_ENV ?? "development" },
    availableModels: [
      { id: "gpt-4", provider: "openai", capabilities: ["reasoning", "code"] },
      { id: "claude", provider: "anthropic", capabilities: ["reasoning", "finance"] },
      { id: "gemini", provider: "google", capabilities: ["creative", "multimodal"] },
    ],
  });

  telemetry?.emit({ service: "perception", phase: "1", event: "observation_complete", level: "info", durationMs: Date.now() - start });
  return recordPhaseTiming({ ...ctx, observation }, PipelinePhase.Perception, Date.now() - start);
}
