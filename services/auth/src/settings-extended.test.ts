import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { SettingsService } from "./settings-service.js";
import { WorkspaceService } from "./workspace-service.js";

describe("Settings extended (Phase 5A)", () => {
  let repo: AsyncMemoryAuthRepository;
  let settings: SettingsService;
  let workspace: WorkspaceService;
  let sessionId: string;
  let workspaceId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    settings = new SettingsService(repo);
    workspace = new WorkspaceService(repo);
    const org = repo.sync.createOrg("Acme");
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "owner@acme.com",
      passwordHash: "hash",
      role: "owner",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Owner",
      createdAt: Date.now(),
    });
    const ws = repo.sync.createWorkspace({
      id: "ws-1",
      orgId: org.id,
      name: "Main",
      slug: "main",
      workspaceType: "team",
      primaryGoal: "Operate",
      archived: false,
      createdAt: Date.now(),
    });
    repo.sync.addWorkspaceMember(ws.id, user.id);
    workspaceId = ws.id;
    sessionId = "session-1";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: ws.id,
      authStrength: "password",
      deviceId: "device",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
  });

  it("updates notification preferences", async () => {
    const next = await settings.updateNotificationPreferences(sessionId, { emailDigest: false });
    expect(next.emailDigest).toBe(false);
  });

  it("records privacy export request", async () => {
    const result = await settings.requestPrivacyExport(sessionId);
    expect(result.ok).toBe(true);
  });

  it("returns billing for owner", async () => {
    const billing = await settings.getBillingSettings(sessionId);
    expect(billing.plan).toBe("starter");
  });

  it("updates workspace settings for manager+", async () => {
    const updated = await workspace.updateWorkspaceSettings(sessionId, workspaceId, { name: "Renamed" });
    expect(updated.name).toBe("Renamed");
  });

  it("creates team invite", async () => {
    const invite = await workspace.inviteTeamMember(sessionId, workspaceId, {
      email: "new@acme.com",
      role: "member",
    });
    expect(invite.email).toBe("new@acme.com");
  });
});
