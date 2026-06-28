export interface AuditRecordInput {
  category: string;
  action: string;
  actorId: string;
  actorName: string;
  resourceType: string;
  resourceId: string;
  workspaceId?: string | null;
  orgId: string;
  summary: string;
  metadata?: Record<string, string>;
}

/** AI operation audit input — separate from governance audit (Phase 8F). */
export interface AiOperationAuditInput {
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
}

export interface AuditEmitter {
  record(event: AuditRecordInput): void;
  recordAiOperation?(event: AiOperationAuditInput): void;
}
