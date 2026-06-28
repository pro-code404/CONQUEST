import { describe, it, expect } from "vitest";
import { MemoryPlatform } from "../memory-platform/memory-platform.js";
import { CognitiveMemoryManager } from "./cognitive-memory-manager.js";

describe("CognitiveMemoryManager (Phase 10C)", () => {
  it("isolates memory by tenant scope", async () => {
    const platform = new MemoryPlatform();
    const manager = new CognitiveMemoryManager(platform);
    const scopeA = { orgId: "550e8400-e29b-41d4-a716-446655440010", workspaceId: "550e8400-e29b-41d4-a716-446655440011" };
    const scopeB = { orgId: "550e8400-e29b-41d4-a716-446655440020", workspaceId: "550e8400-e29b-41d4-a716-446655440021" };

    await manager.store(scopeA, {
      workspaceId: "550e8400-e29b-41d4-a716-446655440011",
      segment: "workspace",
      key: "goal",
      value: { text: "A" },
      summary: "Goal A",
    });
    await manager.store(scopeB, {
      workspaceId: "550e8400-e29b-41d4-a716-446655440021",
      segment: "workspace",
      key: "goal",
      value: { text: "B" },
      summary: "Goal B",
    });

    const aRecords = await manager.retrieve(scopeA, { workspaceId: "550e8400-e29b-41d4-a716-446655440011", segment: "workspace" });
    const bRecords = await manager.retrieve(scopeB, { workspaceId: "550e8400-e29b-41d4-a716-446655440021", segment: "workspace" });
    expect(aRecords).toHaveLength(1);
    expect(bRecords).toHaveLength(1);
    expect(aRecords[0]?.summary).toBe("Goal A");
    expect(bRecords[0]?.summary).toBe("Goal B");
  });
});
