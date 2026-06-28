import { z } from "zod";

export const OrgIdSchema = z.string().uuid();
export const WorkspaceIdSchema = z.string().uuid();

export interface TenantScope {
  orgId: string;
  workspaceId?: string;
}

export function parseTenantScope(input: { orgId: string; workspaceId?: string }): TenantScope {
  return {
    orgId: OrgIdSchema.parse(input.orgId),
    workspaceId: input.workspaceId ? WorkspaceIdSchema.parse(input.workspaceId) : undefined,
  };
}

/**
 * Reject cross-tenant access when resource org does not match request scope (INF-1).
 */
export function assertOrgAccess(scope: TenantScope, resourceOrgId: string): void {
  const parsed = parseTenantScope(scope);
  if (parsed.orgId !== resourceOrgId) {
    throw new TenantIsolationError(parsed.orgId, resourceOrgId);
  }
}

export function scopeStorageKey(scope: TenantScope, segment: string): string {
  const parsed = parseTenantScope(scope);
  const base = `org:${parsed.orgId}`;
  return parsed.workspaceId ? `${base}/ws:${parsed.workspaceId}/${segment}` : `${base}/${segment}`;
}

export class TenantIsolationError extends Error {
  constructor(
    readonly requestOrgId: string,
    readonly resourceOrgId: string,
  ) {
    super(`Tenant isolation violation: request org ${requestOrgId} cannot access org ${resourceOrgId}`);
    this.name = "TenantIsolationError";
  }
}
