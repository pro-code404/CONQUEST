import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { SettingsService } from "./settings-service.js";

describe("SettingsService", () => {
  let repo: AsyncMemoryAuthRepository;
  let service: SettingsService;
  let sessionId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    service = new SettingsService(repo);
    const org = repo.sync.createOrg("Test Org");
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "user@example.com",
      passwordHash: "hash",
      role: "owner",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "User",
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
  });

  it("filters settings categories by role", async () => {
    const categories = await service.listCategories("viewer", null);
    expect(categories.some((c) => c.id === "billing")).toBe(false);
    expect(categories.some((c) => c.id === "account")).toBe(true);
  });

  it("updates profile display name", async () => {
    const profile = await service.updateProfile(sessionId, { displayName: "New Name" });
    expect(profile.displayName).toBe("New Name");
  });
});
