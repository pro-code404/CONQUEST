import { scopeStorageKey, type TenantScope } from "@conquest/core";
import { ApplicationServiceBase } from "./application-service.js";

/** Memory services enforce tenant-scoped storage keys (ADR-0008, ADR-0029). */
export abstract class MemoryServiceBase extends ApplicationServiceBase {
  readonly domain = "memory" as const;

  protected scopedKey(scope: TenantScope, segment: string): string {
    return scopeStorageKey(scope, segment);
  }

  protected requireWorkspace(scope: TenantScope): string {
    if (!scope.workspaceId) {
      throw new Error("Workspace scope required for memory operation");
    }
    return scope.workspaceId;
  }
}
