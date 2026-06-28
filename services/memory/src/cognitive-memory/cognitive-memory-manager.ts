import { createHash } from "node:crypto";
import type { TenantScope } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import {
  MemoryRetrieveSchema,
  MemoryStoreSchema,
  type CognitiveMemoryRecordView,
  type CognitiveMemorySegment,
  type MemoryRetrieveInput,
  type MemoryStoreInput,
} from "@conquest/contracts";
import { MemoryServiceBase } from "@conquest/service-shared";
import type { MemoryPlatform } from "../memory-platform/memory-platform.js";
import type { MemoryEntry } from "../memory-platform/types.js";

const SEGMENT_TO_KIND = {
  workspace: "workspace",
  research: "workspace",
  recommendation_history: "workspace",
  decision_history: "workspace",
  conversation_summary: "conversation",
  organization_knowledge: "organization",
} as const satisfies Record<CognitiveMemorySegment, "workspace" | "organization" | "conversation">;

function segmentKey(segment: CognitiveMemorySegment, key: string): string {
  return `${segment}/${key}`;
}

/** Sole write facade for cognitive memory — tenant-scoped retrieval interfaces. */
export class CognitiveMemoryManager extends MemoryServiceBase {
  readonly serviceName = SERVICE_NAMES.MEMORY;

  constructor(private readonly platform: MemoryPlatform) {
    super();
  }

  async store(scope: TenantScope, input: MemoryStoreInput): Promise<CognitiveMemoryRecordView> {
    const parsed = MemoryStoreSchema.parse(input);
    const store = this.resolveStore(parsed.segment);
    const entry = await store.put(
      scope,
      segmentKey(parsed.segment, parsed.key),
      { ...parsed.value, summary: parsed.summary },
    );
    return this.toView(parsed.segment, entry);
  }

  async retrieve(scope: TenantScope, input: MemoryRetrieveInput): Promise<CognitiveMemoryRecordView[]> {
    const parsed = MemoryRetrieveSchema.parse(input);
    const store = this.resolveStore(parsed.segment);
    const limit = parsed.limit ?? 50;
    const entries = await store.list(scope, limit);
    const prefix = `${parsed.segment}/`;
    const query = parsed.query?.trim().toLowerCase() ?? "";

    return entries
      .filter((entry) => entry.key.startsWith(prefix))
      .filter((entry) => {
        if (!query) return true;
        const summary = String((entry.value as { summary?: string }).summary ?? entry.key);
        return summary.toLowerCase().includes(query) || entry.key.toLowerCase().includes(query);
      })
      .map((entry) => this.toView(parsed.segment, entry));
  }

  async storeReasoningSummary(
    scope: TenantScope,
    workspaceId: string,
    reasoningId: string,
    summary: string,
  ): Promise<void> {
    await this.store(scope, {
      workspaceId,
      segment: "recommendation_history",
      key: reasoningId,
      value: { reasoningId, summary },
      summary,
    });
  }

  async storeDecisionRecord(
    scope: TenantScope,
    workspaceId: string,
    decisionId: string,
    summary: string,
  ): Promise<void> {
    await this.store(scope, {
      workspaceId,
      segment: "decision_history",
      key: decisionId,
      value: { decisionId, summary },
      summary,
    });
  }

  fingerprint(value: string): string {
    return createHash("sha256").update(value).digest("hex").slice(0, 16);
  }

  private resolveStore(segment: CognitiveMemorySegment) {
    const kind = SEGMENT_TO_KIND[segment];
    if (kind === "organization") return this.platform.organization();
    if (kind === "conversation") return this.platform.conversation();
    return this.platform.workspace();
  }

  private toView(segment: CognitiveMemorySegment, entry: MemoryEntry): CognitiveMemoryRecordView {
    return {
      id: entry.id,
      segment,
      key: entry.key.replace(`${segment}/`, ""),
      summary: String((entry.value as { summary?: string }).summary ?? entry.key),
      createdAt: new Date(entry.createdAt).toISOString(),
    };
  }
}
