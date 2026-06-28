import { describe, it, expect, afterEach } from "vitest";
import { randomUUID } from "node:crypto";
import {
  assertOrgAccess,
  scopeStorageKey,
  TenantIsolationError,
  parseTenantScope,
} from "./tenant-scope.js";

describe("Tenant scope (INF-1)", () => {
  const orgA = randomUUID();
  const orgB = randomUUID();
  const ws = randomUUID();

  it("allows access within same org", () => {
    expect(() => assertOrgAccess({ orgId: orgA }, orgA)).not.toThrow();
  });

  it("denies cross-org access", () => {
    expect(() => assertOrgAccess({ orgId: orgA }, orgB)).toThrow(TenantIsolationError);
  });

  it("scopes storage keys by org and workspace", () => {
    const key = scopeStorageKey({ orgId: orgA, workspaceId: ws }, "memories");
    expect(key).toBe(`org:${orgA}/ws:${ws}/memories`);
  });

  it("rejects invalid org id format", () => {
    expect(() => parseTenantScope({ orgId: "not-a-uuid" })).toThrow();
  });
});
