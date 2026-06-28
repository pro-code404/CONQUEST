import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./password.js";
import type { AuthRepository } from "./auth-repository.js";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import type { UserRecord } from "./types.js";

/** Shared contract tests for any AuthRepository implementation. */
export function authRepositoryContractSuite(
  name: string,
  factory: () => AuthRepository | Promise<AuthRepository>,
) {
  describe(`AuthRepository contract — ${name}`, () => {
    let repo: AuthRepository;

    beforeEach(async () => {
      repo = await factory();
    });

    it("creates org and user with tenant isolation", async () => {
      const org = await repo.createOrg("Acme Corp");
      const user: UserRecord = {
        id: randomUUID(),
        orgId: org.id,
        email: "owner@acme.test",
        passwordHash: hashPassword("password123"),
        role: "owner",
        emailVerified: true,
        onboardingComplete: true,
        onboardingStage: "complete",
        displayName: "Owner",
        createdAt: Date.now(),
        passwordChangedAt: Date.now(),
        mfaEnrolled: false,
      };
      await repo.createUser(user);
      const found = await repo.findUserByEmail("owner@acme.test");
      expect(found?.orgId).toBe(org.id);
      expect(await repo.findOrg(org.id)).toEqual(org);
    });

    it("persists workspace and session across repository operations", async () => {
      const org = await repo.createOrg("Persist Org");
      const userId = randomUUID();
      await repo.createUser({
        id: userId,
        orgId: org.id,
        email: "persist@test.io",
        passwordHash: hashPassword("x"),
        role: "owner",
        emailVerified: true,
        onboardingComplete: true,
        onboardingStage: "complete",
        displayName: "Persist User",
        createdAt: Date.now(),
      });
      const wsId = randomUUID();
      await repo.createWorkspace({
        id: wsId,
        orgId: org.id,
        name: "Main",
        slug: "main",
        workspaceType: "standard",
        primaryGoal: "Test persistence",
        archived: false,
        createdAt: Date.now(),
      });
      await repo.addWorkspaceMember(wsId, userId);
      const sessionId = randomUUID();
      await repo.saveSession({
        id: sessionId,
        userId,
        orgId: org.id,
        activeWorkspaceId: wsId,
        authStrength: "password",
        deviceId: "device-1",
        expiresAt: Date.now() + 60_000,
        revoked: false,
        createdAt: Date.now(),
      });

      const session = await repo.findSession(sessionId);
      expect(session?.activeWorkspaceId).toBe(wsId);
      expect((await repo.listWorkspacesForOrg(org.id)).map((w) => w.id)).toContain(wsId);
      expect(await repo.countActiveSessionsForOrg(org.id)).toBe(1);
    });

    it("stores and retrieves intelligence advisories", async () => {
      const org = await repo.createOrg("Intel Org");
      const wsId = randomUUID();
      await repo.createWorkspace({
        id: wsId,
        orgId: org.id,
        name: "Intel WS",
        slug: "intel",
        workspaceType: "standard",
        primaryGoal: "",
        archived: false,
        createdAt: Date.now(),
      });
      const advisory = {
        id: randomUUID(),
        workspaceId: wsId,
        orgId: org.id,
        title: "Test recommendation",
        summary: "Summary",
        rationale: "Because",
        evidenceRefs: ["ev-1"],
        priority: "medium" as const,
        confidence: 0.8,
        status: "pending" as const,
        recommendedActions: ["Review"],
        approvalRequired: true,
        approvedBy: null,
        approvedAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await repo.saveAdvisories(wsId, [advisory]);
      const found = await repo.findAdvisory(wsId, advisory.id);
      expect(found?.title).toBe("Test recommendation");
    });

    it("appends audit events with org filter", async () => {
      const org = await repo.createOrg("Audit Org");
      await repo.appendAuditEvent({
        category: "security",
        action: "test.action",
        actorId: "user-1",
        actorName: "Tester",
        resourceType: "test",
        resourceId: "res-1",
        orgId: org.id,
        summary: "Contract test event",
      });
      const events = await repo.listAuditEvents(org.id, { category: "security", limit: 10 });
      expect(events.some((e) => e.summary === "Contract test event")).toBe(true);
    });

    it("records email delivery and legal acceptance", async () => {
      const org = await repo.createOrg("Compliance Org");
      const userId = randomUUID();
      await repo.createUser({
        id: userId,
        orgId: org.id,
        email: "legal@test.io",
        passwordHash: hashPassword("x"),
        role: "owner",
        emailVerified: true,
        onboardingComplete: true,
        onboardingStage: "complete",
        displayName: "Legal User",
        createdAt: Date.now(),
      });
      await repo.recordEmailDelivery({
        id: randomUUID(),
        orgId: org.id,
        userId,
        emailType: "verification",
        recipient: "legal@test.io",
        status: "sent",
        provider: "console",
        providerMessageId: "msg-1",
        errorMessage: null,
        createdAt: Date.now(),
      });
      const deliveries = await repo.listEmailDeliveries({ userId, limit: 5 });
      expect(deliveries).toHaveLength(1);

      await repo.recordLegalAcceptance({
        id: randomUUID(),
        userId,
        documentType: "privacy",
        documentVersion: "2026-06-28",
        acceptedAt: Date.now(),
      });
      expect(await repo.hasLegalAcceptance(userId, "privacy", "2026-06-28")).toBe(true);
    });
  });
}

authRepositoryContractSuite("memory", () => new AsyncMemoryAuthRepository());

const postgresUrl = process.env.DATABASE_URL;
const wantPostgres = process.env.RUN_POSTGRES_TESTS === "true" && postgresUrl;

if (wantPostgres && postgresUrl) {
  const { isPostgresReachable } = await import("./postgres-probe.js");
  const reachable = await isPostgresReachable(postgresUrl);
  if (reachable) {
    authRepositoryContractSuite("postgres", async () => {
      const { createAuthRepository } = await import("./create-repository.js");
      const { repo } = await createAuthRepository({
        connectionString: postgresUrl,
        skipMigrations: false,
      });
      return repo;
    });
  } else {
    describe.skip("AuthRepository contract — postgres (database unreachable)", () => {
      it("skipped — start Postgres or unset RUN_POSTGRES_TESTS", () => undefined);
    });
  }
}
