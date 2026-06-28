import { SERVICE_NAMES } from "@conquest/core";
import {
  RegisterPromptTemplateSchema,
  RenderPromptSchema,
  TestPromptSchema,
  type PromptTemplateView,
  type PromptTestResultView,
  type PromptVersionView,
  type RegisterPromptTemplateInput,
  type RenderPromptInput,
  type TestPromptInput,
} from "@conquest/contracts";
import { createPromptBuilder } from "@conquest/prompt-security";
import type { BuiltPrompt } from "@conquest/prompt-security";
import { ApplicationServiceBase } from "@conquest/service-shared";

interface PromptVersionRecord {
  templateId: string;
  version: string;
  systemTemplate: string;
  developerTemplate: string | null;
  variables: string[];
  createdAt: number;
}

interface PromptTemplateRecord {
  id: string;
  label: string;
  description: string;
  currentVersion: string;
  variables: string[];
  updatedAt: number;
}

const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

function substitute(template: string, variables: Record<string, string>): string {
  return template.replace(VARIABLE_PATTERN, (_match, name: string) => {
    if (!(name in variables)) {
      throw new Error(`Missing prompt variable: ${name}`);
    }
    return variables[name] ?? "";
  });
}

function extractVariables(...templates: string[]): string[] {
  const names = new Set<string>();
  for (const template of templates) {
    for (const match of template.matchAll(VARIABLE_PATTERN)) {
      names.add(match[1]!);
    }
  }
  return [...names];
}

/** Centralized prompt registry — never concatenate prompts in application code. */
export class PromptRegistry extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.PROMPT_MANAGEMENT;

  private readonly templates = new Map<string, PromptTemplateRecord>();
  private readonly versions = new Map<string, PromptVersionRecord[]>();
  private readonly renderCache = new Map<string, BuiltPrompt>();
  private static readonly RENDER_CACHE_MAX = 64;

  registerTemplate(input: RegisterPromptTemplateInput): PromptTemplateView {
    const parsed = RegisterPromptTemplateSchema.parse(input);
    const variables = parsed.variables ?? extractVariables(parsed.systemTemplate, parsed.developerTemplate ?? "");
    const version = "1.0.0";
    const now = Date.now();
    const template: PromptTemplateRecord = {
      id: parsed.id,
      label: parsed.label,
      description: parsed.description ?? "",
      currentVersion: version,
      variables,
      updatedAt: now,
    };
    this.templates.set(parsed.id, template);
    this.versions.set(parsed.id, [
      {
        templateId: parsed.id,
        version,
        systemTemplate: parsed.systemTemplate,
        developerTemplate: parsed.developerTemplate ?? null,
        variables,
        createdAt: now,
      },
    ]);
    this.emit("prompt_template_registered", "info", { templateId: parsed.id, version });
    return this.toTemplateView(template);
  }

  listTemplates(): PromptTemplateView[] {
    return [...this.templates.values()].map((t) => this.toTemplateView(t));
  }

  getVersion(templateId: string, version?: string): PromptVersionView {
    const records = this.versions.get(templateId);
    if (!records?.length) throw new Error("Prompt template not found");
    const record = version
      ? records.find((v) => v.version === version)
      : records[records.length - 1];
    if (!record) throw new Error("Prompt version not found");
    return this.toVersionView(record);
  }

  render(input: RenderPromptInput): BuiltPrompt {
    const parsed = RenderPromptSchema.parse(input);
    const version = this.getVersion(parsed.templateId, parsed.version);
    const vars = parsed.variables ?? {};
    const cacheKey = `${parsed.templateId}:${version.version}:${JSON.stringify(vars)}:${parsed.userInput}`;
    const cached = this.renderCache.get(cacheKey);
    if (cached) return cached;

    const builder = createPromptBuilder();
    builder.system(substitute(version.systemTemplate, vars));
    if (version.developerTemplate) {
      builder.developer(substitute(version.developerTemplate, vars));
    }
    builder.user(parsed.userInput);
    const built = builder.build();

    if (this.renderCache.size >= PromptRegistry.RENDER_CACHE_MAX) {
      const first = this.renderCache.keys().next().value;
      if (first) this.renderCache.delete(first);
    }
    this.renderCache.set(cacheKey, built);
    return built;
  }

  test(input: TestPromptInput): PromptTestResultView {
    const parsed = TestPromptSchema.parse(input);
    const errors: string[] = [];
    try {
      const built = this.render(parsed);
      return {
        templateId: parsed.templateId,
        version: parsed.version ?? this.templates.get(parsed.templateId)?.currentVersion ?? "1.0.0",
        valid: true,
        layerCount: built.layers.length,
        errors,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Prompt test failed");
      return {
        templateId: parsed.templateId,
        version: parsed.version ?? "unknown",
        valid: false,
        layerCount: 0,
        errors,
      };
    }
  }

  ensureDefaults(): void {
    if (this.templates.size > 0) return;
    this.registerTemplate({
      id: "cognitive.reasoning",
      label: "Cognitive reasoning",
      description: "Deterministic reasoning orchestration prompt shell",
      systemTemplate: "You are Conquest cognitive reasoning. Objective: {{objective}}",
      developerTemplate: "Constraints: {{constraints}}",
      variables: ["objective", "constraints"],
    });
  }

  private toTemplateView(record: PromptTemplateRecord): PromptTemplateView {
    return {
      id: record.id,
      label: record.label,
      description: record.description,
      currentVersion: record.currentVersion,
      variables: [...record.variables],
      updatedAt: new Date(record.updatedAt).toISOString(),
    };
  }

  private toVersionView(record: PromptVersionRecord): PromptVersionView {
    return {
      templateId: record.templateId,
      version: record.version,
      systemTemplate: record.systemTemplate,
      developerTemplate: record.developerTemplate,
      variables: [...record.variables],
      createdAt: new Date(record.createdAt).toISOString(),
    };
  }
}

export { substitute, extractVariables };
