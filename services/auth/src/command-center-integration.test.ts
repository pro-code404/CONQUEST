import { describe, it, expect } from "vitest";
import { buildCommandCenterDashboard } from "./command-center-integration.js";

describe("Command Center integration (Build-2 M1)", () => {
  it("builds zones from real service data without fabrication", () => {
    const dashboard = buildCommandCenterDashboard({
      workspaceId: "550e8400-e29b-41d4-a716-446655440001",
      status: { workspaceId: "550e8400-e29b-41d4-a716-446655440001", state: "ready" },
      feedItems: [],
      recommendations: [
        {
          id: "rec-1",
          workspaceId: "550e8400-e29b-41d4-a716-446655440001",
          title: "Test recommendation",
          summary: "Based on evidence",
          rationale: "Explainable",
          evidenceRefs: ["ev-1"],
          priority: "high",
          confidence: 0.9,
          status: "pending",
          recommendedActions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      goals: [{ id: "g1", title: "Grow revenue", status: "active", progress: 40 }],
      pendingApprovals: 1,
      enabledWorkflowCount: 2,
      platformHealthy: true,
      cognitiveRequestCount: 3,
      primaryGoal: "Expand market share",
    });

    expect(dashboard.zones).toHaveLength(8);
    const recommendations = dashboard.zones.find((z) => z.id === "recommendations");
    expect(recommendations?.items[0]?.label).toBe("Test recommendation");
    expect(dashboard.cognitiveRequestCount).toBe(3);
  });
});
