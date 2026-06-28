import { scopeStorageKey, type TenantScope } from "@conquest/core";

const CACHE_PREFIX = "cache";

/** Tenant-scoped cache key (org-level). */
export function buildTenantCacheKey(scope: TenantScope, segment: string): string {
  return `${CACHE_PREFIX}:${scopeStorageKey(scope, segment)}`;
}

/** Workspace-scoped cache key (requires workspaceId). */
export function buildWorkspaceCacheKey(scope: TenantScope, segment: string): string {
  if (!scope.workspaceId) {
    throw new Error("workspaceId required for workspace cache key");
  }
  return buildTenantCacheKey(scope, segment);
}

/** Global platform key (non-tenant data such as provider metadata). */
export function buildPlatformCacheKey(segment: string): string {
  return `${CACHE_PREFIX}:platform/${segment}`;
}
