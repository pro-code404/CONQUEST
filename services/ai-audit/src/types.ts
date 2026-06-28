export interface AiAuditRecord {
  id: string;
  provider: string;
  model: string;
  orgId: string;
  workspaceId: string | null;
  userId: string | null;
  tokenCount: number;
  estimatedCostUsd: number;
  latencyMs: number;
  toolsUsed: string[];
  success: boolean;
  correlationId: string;
  timestamp: string;
  /** Only populated when explicitly configured — never by default. */
  promptExcerpt?: string;
}

export interface AiAuditRecordInput {
  provider: string;
  model: string;
  orgId: string;
  workspaceId?: string | null;
  userId?: string | null;
  tokenCount: number;
  estimatedCostUsd: number;
  latencyMs: number;
  toolsUsed?: string[];
  success: boolean;
  correlationId: string;
  promptExcerpt?: string;
}

export interface AiAuditStore {
  append(record: AiAuditRecord): void;
  list(filter?: { orgId?: string; correlationId?: string; limit?: number }): AiAuditRecord[];
}
