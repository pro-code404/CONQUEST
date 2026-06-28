import type { ServiceName } from "@conquest/core";
import { assertOrgAccess, type TenantScope } from "@conquest/core";
import type { TelemetryEmitter } from "@conquest/core";
import { createHealthResult } from "../health.js";
import type { ServiceHealthResult } from "../types/health.js";
import type { ServiceRequestContext } from "../types/service-context.js";

/**
 * Base for domain/application services (auth, settings, workspace) that sit outside
 * the cognitive pipeline but share health, tenant isolation, and telemetry hooks.
 */
export abstract class ApplicationServiceBase {
  abstract readonly serviceName: ServiceName;
  readonly version = "1.0.0";

  constructor(protected readonly telemetry?: TelemetryEmitter) {}

  async healthCheck(): Promise<ServiceHealthResult> {
    return createHealthResult({
      healthy: true,
      service: this.serviceName,
      version: this.version,
      details: `${this.serviceName} v${this.version}`,
    });
  }

  protected requireTenant(ctx: ServiceRequestContext): TenantScope {
    if (!ctx.tenant) {
      throw new Error(`Tenant scope required for ${this.serviceName}`);
    }
    return ctx.tenant;
  }

  protected assertTenantAccess(scope: TenantScope, resourceOrgId: string): void {
    assertOrgAccess(scope, resourceOrgId);
  }

  protected emit(
    event: string,
    level: "debug" | "info" | "warn" | "error",
    metadata?: Record<string, unknown>,
  ): void {
    if (metadata !== undefined) {
      this.telemetry?.emit({
        service: this.serviceName,
        event,
        level,
        metadata,
      });
      return;
    }
    this.telemetry?.emit({
      service: this.serviceName,
      event,
      level,
    });
  }
}
