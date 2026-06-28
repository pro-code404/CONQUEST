import { describe, it, expect } from "vitest";
import { parseTenantScope } from "@conquest/core";
import { MemoryPlatform } from "./memory-platform/index.js";

describe("Memory platform (Phase 8E)", () => {
  it("stores workspace-scoped memory", async () => {
    const platform = new MemoryPlatform();
    const scope = parseTenantScope({
      orgId: "550e8400-e29b-41d4-a716-446655440000",
      workspaceId: "660e8400-e29b-41d4-a716-446655440001",
    });
    await platform.workspace().put(scope, "goal", { title: "Grow revenue" });
    const entry = await platform.workspace().get(scope, "goal");
    expect(entry?.value).toEqual({ title: "Grow revenue" });
  });

  it("isolates organization memory by tenant", async () => {
    const platform = new MemoryPlatform();
    const orgA = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    const orgB = parseTenantScope({ orgId: "660e8400-e29b-41d4-a716-446655440001" });
    await platform.organization().put(orgA, "policy", "A");
    await platform.organization().put(orgB, "policy", "B");
    expect((await platform.organization().get(orgA, "policy"))?.value).toBe("A");
    expect((await platform.organization().get(orgB, "policy"))?.value).toBe("B");
  });

  it("expires temporary memory", async () => {
    const platform = new MemoryPlatform();
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await platform.temporary().put(scope, "scratch", "data", Date.now() + 1);
    await new Promise((r) => setTimeout(r, 5));
    expect(await platform.temporary().get(scope, "scratch")).toBeNull();
  });
});
