import { describe, it, expect } from "vitest";
import { createHealthResult } from "./health.js";
import { ApplicationServiceBase } from "./bases/application-service.js";
import { MemoryServiceBase } from "./bases/memory-service.js";
import { SERVICE_NAMES, type TenantScope } from "@conquest/core";

class TestApplicationService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTH;
}

class TestMemoryService extends MemoryServiceBase {
  readonly serviceName = SERVICE_NAMES.MEMORY;

  scopeForTest(scope: TenantScope, segment: string): string {
    return this.scopedKey(scope, segment);
  }
}

describe("@conquest/service-shared", () => {
  it("createHealthResult omits optional details when unset", () => {
    const result = createHealthResult({
      healthy: true,
      service: "auth",
      version: "1.0.0",
    });
    expect(result.details).toBeUndefined();
  });

  it("ApplicationServiceBase reports healthy by default", async () => {
    const service = new TestApplicationService();
    const health = await service.healthCheck();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe(SERVICE_NAMES.AUTH);
  });

  it("MemoryServiceBase scopes storage keys by tenant", () => {
    const service = new TestMemoryService();
    const key = service.scopeForTest(
      { orgId: "00000000-0000-4000-8000-000000000001", workspaceId: "00000000-0000-4000-8000-000000000002" },
      "entries",
    );
    expect(key).toContain("org:");
    expect(key).toContain("ws:");
    expect(key).toContain("entries");
  });
});
