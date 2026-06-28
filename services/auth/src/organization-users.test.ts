import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { SettingsService } from "./settings-service.js";
import { IdentityService } from "./identity-service.js";

describe("Organization module (Phase 5B)", () => {
  let repo: AsyncMemoryAuthRepository;
  let settings: SettingsService;
  let sessionId: string;
  let memberId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    settings = new SettingsService(repo);
    const org = repo.sync.createOrg("Acme Corp");
    const owner = repo.sync.createUser({
      id: "owner-1",
      orgId: org.id,
      email: "owner@example.com",
      passwordHash: "hash",
      role: "owner",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Owner",
      createdAt: Date.now(),
    });
    const member = repo.sync.createUser({
      id: "member-1",
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
    memberId = member.id;
    sessionId = "session-org";
    repo.sync.saveSession({
      id: sessionId,
      userId: owner.id,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device-owner",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
  });

  it("lists organization members and invites", async () => {
    const members = await settings.listOrganizationMembers(sessionId);
    expect(members).toHaveLength(2);
    const invite = await settings.inviteOrganizationMember(sessionId, {
      email: "new@example.com",
      role: "viewer",
    });
    expect(invite.email).toBe("new@example.com");
    expect((await settings.listOrganizationInvites(sessionId))).toHaveLength(1);
  });

  it("updates member role and removes member", async () => {
    const updated = await settings.updateOrganizationMemberRole(sessionId, memberId, { role: "manager" });
    expect(updated.find((m) => m.userId === memberId)?.role).toBe("manager");
    const remaining = await settings.removeOrganizationMember(sessionId, memberId);
    expect(remaining).toHaveLength(1);
  });
});

describe("Users module (Phase 5C)", () => {
  let repo: AsyncMemoryAuthRepository;
  let identity: IdentityService;
  let sessionId: string;
  let otherSessionId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    identity = new IdentityService(repo);
    const org = repo.sync.createOrg("Org");
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "user@example.com",
      passwordHash: "hash",
      role: "member",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "User",
      createdAt: Date.now(),
    });
    sessionId = "session-current";
    otherSessionId = "session-other";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device-a",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
    repo.sync.saveSession({
      id: otherSessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device-b",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now() - 1000,
    });
  });

  it("returns profile summary", async () => {
    const profile = await identity.getProfileSummary(sessionId);
    expect(profile.displayName).toBe("User");
    expect(profile.role).toBe("member");
  });

  it("lists and revokes active sessions", async () => {
    const sessions = await identity.listActiveSessions(sessionId);
    expect(sessions).toHaveLength(2);
    const after = await identity.revokeActiveSession(sessionId, otherSessionId);
    expect(after).toHaveLength(1);
    expect(after[0]?.isCurrent).toBe(true);
  });
});
