import type { TenantScope } from "@conquest/core";

export const MEMORY_KINDS = [
  "workspace",
  "organization",
  "user",
  "conversation",
  "temporary",
] as const;

export type MemoryKind = (typeof MEMORY_KINDS)[number];

export interface MemoryEntry {
  id: string;
  kind: MemoryKind;
  key: string;
  value: unknown;
  scope: TenantScope;
  createdAt: number;
  expiresAt: number | null;
}

export interface MemoryStore {
  readonly kind: MemoryKind;
  get(scope: TenantScope, key: string): Promise<MemoryEntry | null>;
  put(scope: TenantScope, key: string, value: unknown, expiresAt?: number | null): Promise<MemoryEntry>;
  delete(scope: TenantScope, key: string): Promise<boolean>;
  list(scope: TenantScope, limit?: number): Promise<MemoryEntry[]>;
}
