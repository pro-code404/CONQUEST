import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { SecurityService } from "./security-service.js";
import { AuditService } from "./audit-service.js";

describe("Security service (Phase 7)", () => {
  let repo: AsyncMemoryAuthRepository;
  let security: SecurityService;
  let sessionId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    security = new SecurityService(repo);
    const org = repo.sync.createOrg("Acme");
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "owner@acme.com",
      passwordHash: "scrypt:hash",
      role: "owner",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Owner",
      createdAt: Date.now(),
    });
    sessionId = "session-1";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device-current",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
  });

  it("enrolls and confirms MFA with recovery code", async () => {
    const enroll = await security.enrollMfa(sessionId);
    expect(enroll.recoveryCodes.length).toBeGreaterThan(0);
    const code = enroll.recoveryCodes[0]!;
    const settings = await security.confirmMfaEnrollment(sessionId, { recoveryCode: code });
    expect(settings.mfaEnrolled).toBe(true);
  });

  it("lists and revokes trusted devices", async () => {
    const user = repo.sync.findUserById("user-1")!;
    await security.touchTrustedDevice(user.id, "device-other", "Other");
    const devices = await security.listTrustedDevices(sessionId);
    expect(devices.some((d) => d.deviceId === "device-other")).toBe(true);
    const after = await security.revokeTrustedDevice(sessionId, "device-other");
    expect(after.some((d) => d.deviceId === "device-other")).toBe(false);
  });
});

describe("Audit service (Phase 7)", () => {
  let repo: AsyncMemoryAuthRepository;
  let audit: AuditService;
  let sessionId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    audit = new AuditService(repo);
    const org = repo.sync.createOrg("Acme");
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "manager@acme.com",
      passwordHash: "hash",
      role: "manager",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Manager",
      createdAt: Date.now(),
    });
    sessionId = "session-1";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
    repo.sync.appendAuditEvent({
      category: "authentication",
      action: "login",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "user",
      resourceId: user.id,
      orgId: org.id,
      summary: "User signed in",
    });
  });

  it("returns activity log for manager+", async () => {
    const log = await audit.listActivityLog(sessionId);
    expect(log.events.length).toBeGreaterThan(0);
    expect(log.exportAvailable).toBe(false);
  });
});
