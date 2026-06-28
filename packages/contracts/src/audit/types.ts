export const AUDIT_CATEGORIES = [
  "account",
  "organization",
  "workspace",
  "authentication",
  "automation",
  "security",
] as const;

export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];

export interface AuditEventView {
  id: string;
  category: AuditCategory;
  action: string;
  actorId: string;
  actorName: string;
  resourceType: string;
  resourceId: string;
  workspaceId: string | null;
  orgId: string;
  timestamp: string;
  summary: string;
}

export interface AuditLogQuery {
  category?: AuditCategory;
  search?: string;
  workspaceId?: string;
  limit?: number;
}

export interface AuditLogView {
  events: AuditEventView[];
  exportAvailable: boolean;
}

export interface AuditEventInput {
  category: AuditCategory;
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
