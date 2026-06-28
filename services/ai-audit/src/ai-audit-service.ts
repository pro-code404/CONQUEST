import { randomUUID } from "node:crypto";
import { AI_AUDIT_CONSTANTS } from "@conquest/config";
import { SERVICE_NAMES } from "@conquest/core";
import { ApplicationServiceBase } from "@conquest/service-shared";
import type { AiAuditRecord, AiAuditRecordInput, AiAuditStore } from "./types.js";

export class InMemoryAiAuditStore implements AiAuditStore {
  private readonly records: AiAuditRecord[] = [];

  append(record: AiAuditRecord): void {
    this.records.push(record);
  }

  list(filter?: { orgId?: string; correlationId?: string; limit?: number }): AiAuditRecord[] {
    const limit = filter?.limit ?? 50;
    return this.records
      .filter((r) => (filter?.orgId ? r.orgId === filter.orgId : true))
      .filter((r) => (filter?.correlationId ? r.correlationId === filter.correlationId : true))
      .slice(-limit);
  }
}

export interface AiAuditServiceOptions {
  store?: AiAuditStore;
  logPromptContent?: boolean;
}

/**
 * AI operation audit — records provider, model, cost, latency, tools.
 * Prompt content is excluded unless explicitly enabled.
 */
export class AiAuditService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AI_AUDIT;

  private readonly store: AiAuditStore;
  private readonly logPromptContent: boolean;

  constructor(options: AiAuditServiceOptions = {}) {
    super();
    this.store = options.store ?? new InMemoryAiAuditStore();
    this.logPromptContent = options.logPromptContent ?? AI_AUDIT_CONSTANTS.LOG_PROMPT_CONTENT_DEFAULT;
  }

  record(input: AiAuditRecordInput): AiAuditRecord {
    const record: AiAuditRecord = {
      id: randomUUID(),
      provider: input.provider,
      model: input.model,
      orgId: input.orgId,
      workspaceId: input.workspaceId ?? null,
      userId: input.userId ?? null,
      tokenCount: input.tokenCount,
      estimatedCostUsd: input.estimatedCostUsd,
      latencyMs: input.latencyMs,
      toolsUsed: (input.toolsUsed ?? []).slice(0, AI_AUDIT_CONSTANTS.MAX_TOOL_NAMES),
      success: input.success,
      correlationId: input.correlationId,
      timestamp: new Date().toISOString(),
    };
    if (this.logPromptContent && input.promptExcerpt) {
      record.promptExcerpt = input.promptExcerpt;
    }
    this.store.append(record);
    this.emit("ai_audit_recorded", "info", {
      provider: record.provider,
      model: record.model,
      correlationId: record.correlationId,
      success: record.success,
    });
    return record;
  }

  list(filter?: { orgId?: string; correlationId?: string; limit?: number }): AiAuditRecord[] {
    return this.store.list(filter);
  }
}
