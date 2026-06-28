import type { TenantScope } from "@conquest/core";

/** Request-scoped context shared across application and gateway services. */
export interface ServiceRequestContext {
  traceId: string;
  correlationId: string;
  requestId: string;
  tenant?: TenantScope;
}
