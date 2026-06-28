import { describe, it, expect, beforeEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { NotificationService } from "./notification-service.js";
import type { EmailDeliveryProvider } from "./email/types.js";
import { hashPassword } from "./password.js";

describe("NotificationService", () => {
  let repo: AsyncMemoryAuthRepository;
  let provider: EmailDeliveryProvider;
  let service: NotificationService;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    provider = {
      name: "test",
      send: vi.fn().mockResolvedValue({ providerMessageId: "test-123" }),
    };
    service = new NotificationService(repo, provider, { appBaseUrl: "http://localhost:5173" });
  });

  it("sends verification email and records delivery", async () => {
    const org = await repo.createOrg("Test Org");
    const userId = randomUUID();
    await repo.createUser({
      id: userId,
      orgId: org.id,
      email: "notify@test.io",
      passwordHash: hashPassword("password"),
      role: "owner",
      emailVerified: false,
      onboardingComplete: false,
      onboardingStage: "welcome",
      displayName: "Notify",
      createdAt: Date.now(),
    });

    await service.sendVerificationEmail({
      userId,
      orgId: org.id,
      recipient: "notify@test.io",
      token: "verify-token",
    });

    expect(provider.send).toHaveBeenCalledOnce();
    const deliveries = await repo.listEmailDeliveries({ userId });
    expect(deliveries[0]?.status).toBe("sent");
    expect(deliveries[0]?.emailType).toBe("verification");
  });
});
