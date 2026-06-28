import { describe, it, expect } from "vitest";
import { AiAuditService } from "./index.js";

describe("AI Audit (Phase 8F)", () => {
  it("records AI operation metadata without prompt by default", () => {
    const audit = new AiAuditService();
    const record = audit.record({
      provider: "openai",
      model: "gpt-4",
      orgId: "550e8400-e29b-41d4-a716-446655440000",
      workspaceId: "660e8400-e29b-41d4-a716-446655440001",
      userId: "user-1",
      tokenCount: 120,
      estimatedCostUsd: 0.002,
      latencyMs: 340,
      toolsUsed: ["search"],
      success: true,
      correlationId: "corr-audit-1",
      promptExcerpt: "secret prompt",
    });
    expect(record.promptExcerpt).toBeUndefined();
    expect(record.toolsUsed).toEqual(["search"]);
    expect(audit.list({ correlationId: "corr-audit-1" }).length).toBe(1);
  });

  it("logs prompt excerpt only when explicitly enabled", () => {
    const audit = new AiAuditService({ logPromptContent: true });
    const record = audit.record({
      provider: "anthropic",
      model: "claude",
      orgId: "550e8400-e29b-41d4-a716-446655440000",
      tokenCount: 50,
      estimatedCostUsd: 0.001,
      latencyMs: 200,
      success: true,
      correlationId: "corr-audit-2",
      promptExcerpt: "allowed excerpt",
    });
    expect(record.promptExcerpt).toBe("allowed excerpt");
  });
});
