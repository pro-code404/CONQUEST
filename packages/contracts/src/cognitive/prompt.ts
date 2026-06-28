import { z } from "zod";

export const RegisterPromptTemplateSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z][a-z0-9._-]*$/),
  label: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  systemTemplate: z.string().min(1).max(8000),
  developerTemplate: z.string().max(8000).optional(),
  variables: z.array(z.string().min(1).max(64)).optional(),
});

export const RenderPromptSchema = z.object({
  templateId: z.string().min(1).max(64),
  version: z.string().min(1).max(32).optional(),
  variables: z.record(z.string()).optional(),
  userInput: z.string().min(1).max(8000),
});

export const TestPromptSchema = z.object({
  templateId: z.string().min(1).max(64),
  version: z.string().min(1).max(32).optional(),
  variables: z.record(z.string()).optional(),
  userInput: z.string().min(1).max(8000),
});

export type RegisterPromptTemplateInput = z.infer<typeof RegisterPromptTemplateSchema>;
export type RenderPromptInput = z.infer<typeof RenderPromptSchema>;
export type TestPromptInput = z.infer<typeof TestPromptSchema>;

export interface PromptTemplateView {
  id: string;
  label: string;
  description: string;
  currentVersion: string;
  variables: string[];
  updatedAt: string;
}

export interface PromptVersionView {
  templateId: string;
  version: string;
  systemTemplate: string;
  developerTemplate: string | null;
  variables: string[];
  createdAt: string;
}

export interface PromptTestResultView {
  templateId: string;
  version: string;
  valid: boolean;
  layerCount: number;
  errors: string[];
}
