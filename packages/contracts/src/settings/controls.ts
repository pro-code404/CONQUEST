import { z } from "zod";

export const AI_PROVIDERS = ["auto", "openai", "anthropic", "google"] as const;
export type AiProviderPreference = (typeof AI_PROVIDERS)[number];

export const AI_DEPTH_PREFERENCES = ["balanced", "deep", "fast"] as const;
export type AiDepthPreference = (typeof AI_DEPTH_PREFERENCES)[number];

export interface AiProviderStatusView {
  id: string;
  name: string;
  status: "available" | "degraded" | "unavailable";
}

export interface AiControlsView {
  preferredProvider: AiProviderPreference;
  depthPreference: AiDepthPreference;
  transparencyEnabled: true;
  providers: AiProviderStatusView[];
}

export const DEFAULT_AI_CONTROLS: AiControlsView = {
  preferredProvider: "auto",
  depthPreference: "balanced",
  transparencyEnabled: true,
  providers: [
    { id: "openai", name: "OpenAI", status: "available" },
    { id: "anthropic", name: "Anthropic", status: "available" },
    { id: "google", name: "Google Gemini", status: "available" },
  ],
};

export const UpdateAiControlsSchema = z.object({
  preferredProvider: z.enum(AI_PROVIDERS).optional(),
  depthPreference: z.enum(AI_DEPTH_PREFERENCES).optional(),
});

export type UpdateAiControlsInput = z.infer<typeof UpdateAiControlsSchema>;

export interface MemoryControlsView {
  retentionDays: number;
  exportAvailable: boolean;
  forgetRequestAvailable: boolean;
  workspacePolicySummary: string;
}

export const DEFAULT_MEMORY_CONTROLS: MemoryControlsView = {
  retentionDays: 365,
  exportAvailable: true,
  forgetRequestAvailable: true,
  workspacePolicySummary: "Workspace memory retained per organization policy. Export and forget requests are governed.",
};

export const UpdateMemoryControlsSchema = z.object({
  retentionDays: z.number().int().min(30).max(3650).optional(),
});

export type UpdateMemoryControlsInput = z.infer<typeof UpdateMemoryControlsSchema>;
