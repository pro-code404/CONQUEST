import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
import { LEGAL_DOCUMENT_VERSIONS } from "@conquest/contracts";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { LegalService } from "./legal-service.js";
import { hashPassword } from "./password.js";

describe("LegalService", () => {
  let repo: AsyncMemoryAuthRepository;
  let service: LegalService;
  let sessionId: string;

  beforeEach(async () => {
    repo = new AsyncMemoryAuthRepository();
    service = new LegalService(repo);
    const org = await repo.createOrg("Legal Org");
    const userId = randomUUID();
    await repo.createUser({
      id: userId,
      orgId: org.id,
      email: "legal@test.io",
      passwordHash: hashPassword("password"),
      role: "owner",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "complete",
      displayName: "Legal",
      createdAt: Date.now(),
    });
    sessionId = randomUUID();
    await repo.saveSession({
      id: sessionId,
      userId,
      orgId: org.id,
      activeWorkspaceId: null,
      authStrength: "password",
      deviceId: "device-1",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
  });

  it("records legal acceptance durably", async () => {
    const acceptance = await service.recordAcceptance(sessionId, {
      documentType: "terms",
      documentVersion: LEGAL_DOCUMENT_VERSIONS.terms,
    });
    expect(acceptance.documentType).toBe("terms");

    const status = await service.getUserStatus(sessionId);
    expect(status.acceptances).toHaveLength(1);
    expect(status.requiresAction).toBe(true);
  });

  it("records cookie consent for authenticated users", async () => {
    const result = await service.recordCookieConsent(sessionId, {
      documentVersion: LEGAL_DOCUMENT_VERSIONS.cookies,
    });
    expect(result.recorded).toBe(true);
    const status = await service.getUserStatus(sessionId);
    expect(status.cookieConsentRecorded).toBe(true);
  });
});
