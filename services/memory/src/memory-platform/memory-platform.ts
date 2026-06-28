import { randomUUID } from "node:crypto";
import { scopeStorageKey, type TenantScope } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { MemoryServiceBase } from "@conquest/service-shared";
import type { MemoryEntry, MemoryKind, MemoryStore } from "./types.js";

function scopedSegment(scope: TenantScope, kind: MemoryKind, key: string): string {
  return `${kind}/${scopeStorageKey(scope, key)}`;
}

class InMemoryKindStore implements MemoryStore {
  private readonly entries = new Map<string, MemoryEntry>();

  constructor(readonly kind: MemoryKind) {}

  async get(scope: TenantScope, key: string): Promise<MemoryEntry | null> {
    const entry = this.entries.get(scopedSegment(scope, this.kind, key));
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      await this.delete(scope, key);
      return null;
    }
    return entry;
  }

  async put(scope: TenantScope, key: string, value: unknown, expiresAt: number | null = null): Promise<MemoryEntry> {
    const entry: MemoryEntry = {
      id: randomUUID(),
      kind: this.kind,
      key,
      value,
      scope,
      createdAt: Date.now(),
      expiresAt,
    };
    this.entries.set(scopedSegment(scope, this.kind, key), entry);
    return entry;
  }

  async delete(scope: TenantScope, key: string): Promise<boolean> {
    return this.entries.delete(scopedSegment(scope, this.kind, key));
  }

  async list(scope: TenantScope, limit = 50): Promise<MemoryEntry[]> {
    const prefix = `${this.kind}/org:${scope.orgId}`;
    return [...this.entries.values()]
      .filter((e) => scopedSegment(e.scope, e.kind, e.key).startsWith(prefix))
      .slice(0, limit);
  }
}

/**
 * Memory platform — tenant-scoped storage interfaces without retrieval intelligence.
 */
export class MemoryPlatform extends MemoryServiceBase {
  readonly serviceName = SERVICE_NAMES.MEMORY;

  private readonly stores: Record<MemoryKind, MemoryStore>;

  constructor() {
    super();
    this.stores = {
      workspace: new InMemoryKindStore("workspace"),
      organization: new InMemoryKindStore("organization"),
      user: new InMemoryKindStore("user"),
      conversation: new InMemoryKindStore("conversation"),
      temporary: new InMemoryKindStore("temporary"),
    };
  }

  workspace(): MemoryStore {
    return this.stores.workspace;
  }

  organization(): MemoryStore {
    return this.stores.organization;
  }

  user(): MemoryStore {
    return this.stores.user;
  }

  conversation(): MemoryStore {
    return this.stores.conversation;
  }

  temporary(): MemoryStore {
    return this.stores.temporary;
  }
}
