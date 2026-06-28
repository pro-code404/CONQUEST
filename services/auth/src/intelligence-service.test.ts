import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import {
  IntelligenceService,
  type IntelligenceCognitiveProvider,
} from "./intelligence-service.js";

describe("IntelligenceService (Build-2 M1)", () => {
  let repo: AsyncMemoryAuthRepository;
  let sessionId: string;
  let workspaceId: string;

  const cognitive: IntelligenceCognitiveProvider = {
    async analyze() {
      return {
        requestId: "req-1",
        correlationId: "corr-1",
        recommendationSummary: "Prioritize connector health based on evidence",
        confidence: 0.82,
        evidenceCount: 2,
        evidenceRefs: ["ev-1", "ev-2"],
        evidenceItems: [
          { sourceId: "research.session", title: "Session context", excerpt: "Risk elevated in sync window" },
        ],
        reasoningId: "reason-1",
        decisionId: "dec-1",
      };
    },
  };

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    const org = repo.sync.createOrg("Org");
    const user = repo.sync.createUser({
      id: "550e8400-e29b-41d4-a716-446655440010",
      orgId: org.id,
      email: "member@example.com",
      passwordHash: "hash",
      role: "member",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Member",
      createdAt: Date.now(),
    });
    const workspace = repo.sync.createWorkspace({
      id: "550e8400-e29b-41d4-a716-446655440001",
      orgId: org.id,
      name: "Workspace",
      slug: "workspace",
      workspaceType: "team",
      primaryGoal: "Intel",
      archived: false,
      createdAt: Date.now(),
    });
    workspaceId = workspace.id;
    repo.sync.addWorkspaceMember(workspace.id, user.id);
    sessionId = "session-1";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: workspace.id,
      authStrength: "password",
      deviceId: "device",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
    repo.sync.saveResearchSession({
      id: "rs-1",
      workspaceId,
      orgId: org.id,
      title: "Market scan",
      status: "active",
      sources: [{ id: "s1", orgId: org.id, name: "Internal KB", type: "internal", trusted: true }],
      citations: [],
      notes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });

  it("returns honest empty home without seeded mock data", async () => {
    const service = new IntelligenceService(repo);
    const home = await service.getHome(sessionId, workspaceId);
    expect(home.feedCount).toBe(0);
    expect(home.recommendationCount).toBe(0);
    expect(home.summary).toContain("No intelligence signals yet");
  });

  it("materializes cognitive analysis into recommendations and feed", async () => {
    const service = new IntelligenceService(repo, cognitive);
    const analysis = await service.analyzeFromResearch(sessionId, workspaceId, "rs-1", "corr-test");
    expect(analysis.recommendationId).toBeTruthy();
    expect(analysis.evidenceCount).toBe(2);

    const home = await service.getHome(sessionId, workspaceId);
    expect(home.recommendationCount).toBe(1);
    expect(home.feedCount).toBeGreaterThan(0);

    const recs = await service.listRecommendations(sessionId, workspaceId);
    expect(recs[0]?.evidenceRefs).toContain("ev-1");
  });
});
