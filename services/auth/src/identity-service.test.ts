import { describe, it, expect, beforeEach } from "vitest";
import { IdentityService } from "./identity-service.js";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";

describe("IdentityService (ADR-0017)", () => {
  let service: IdentityService;
  let repo: AsyncMemoryAuthRepository;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    service = new IdentityService(repo);
  });

  it("signs up and returns unverified session", async () => {
    const result = await service.signUp({
      email: "user@example.com",
      password: "password123",
      displayName: "Test User",
    });
    expect(result.view.emailVerified).toBe(false);
    expect(result.view.onboardingComplete).toBe(false);
    expect(result.verificationToken).toBeTruthy();
  });

  it("rejects duplicate email on signup", async () => {
    await service.signUp({
      email: "dup@example.com",
      password: "password123",
      displayName: "First",
    });
    await expect(
      service.signUp({
        email: "dup@example.com",
        password: "password456",
        displayName: "Second",
      }),
    ).rejects.toThrow(/already exists/);
  });

  it("logs in with valid credentials", async () => {
    await service.signUp({
      email: "login@example.com",
      password: "password123",
      displayName: "Login User",
    });
    const user = repo.sync.findUserByEmail("login@example.com")!;
    user.emailVerified = true;
    user.onboardingComplete = true;
    user.onboardingStage = "done";
    repo.sync.updateUser(user);
    repo.sync.createWorkspace({
      id: "ws-1",
      orgId: user.orgId,
      name: "Main",
      slug: "main",
      workspaceType: "team",
      primaryGoal: "Operate",
      archived: false,
      createdAt: Date.now(),
    });
    repo.sync.addWorkspaceMember("ws-1", user.id);

    const result = await service.login({ email: "login@example.com", password: "password123" });
    expect(result.view.email).toBe("login@example.com");
    expect(result.view.activeWorkspaceId).toBe("ws-1");
  });

  it("rejects invalid login", async () => {
    await expect(service.login({ email: "nope@example.com", password: "x" })).rejects.toThrow(
      /Invalid email or password/,
    );
  });

  it("verifies email and issues new session", async () => {
    const signup = await service.signUp({
      email: "verify@example.com",
      password: "password123",
      displayName: "Verify User",
    });
    const verified = await service.verifyEmail(signup.verificationToken!);
    expect(verified.view.emailVerified).toBe(true);
  });

  it("completes onboarding with workspace", async () => {
    const signup = await service.signUp({
      email: "onboard@example.com",
      password: "password123",
      displayName: "Onboard User",
    });
    const verified = await service.verifyEmail(signup.verificationToken!);

    const result = await service.completeOnboarding(verified.session.id, {
      workspaceName: "My Workspace",
      workspaceType: "team",
      primaryGoal: "Operate intelligence command center",
    });
    expect(result.view.onboardingComplete).toBe(false);
    expect(result.view.onboardingStage).toBe("connect");
    expect(result.view.activeWorkspaceId).toBeTruthy();

    const finished = await service.finishOnboarding(result.session.id);
    expect(finished.view.onboardingComplete).toBe(true);
    expect(finished.view.onboardingStage).toBe("done");
  });

  it("enforces tenant isolation on workspace access", async () => {
    const signup = await service.signUp({
      email: "tenant@example.com",
      password: "password123",
      displayName: "Tenant User",
    });
    const otherOrg = repo.sync.createOrg("Other Org");
    const foreignWorkspace = repo.sync.createWorkspace({
      id: "foreign-ws",
      orgId: otherOrg.id,
      name: "Foreign",
      slug: "foreign",
      workspaceType: "general",
      primaryGoal: "Test",
      archived: false,
      createdAt: Date.now(),
    });

    await expect(service.assertWorkspaceAccess(signup.session.id, foreignWorkspace.id)).rejects.toThrow(
      /Tenant isolation/,
    );
  });

  it("revokes session on logout", async () => {
    const signup = await service.signUp({
      email: "logout@example.com",
      password: "password123",
      displayName: "Logout User",
    });
    await service.logout(signup.session.id);
    expect(await service.getSession(signup.session.id)).toBeNull();
  });

  it("extends sliding TTL when session nears expiry (RTM-INF-006)", async () => {
    const signup = await service.signUp({
      email: "slide@example.com",
      password: "password123",
      displayName: "Slide User",
    });
    const session = repo.sync.findSession(signup.session.id)!;
    session.expiresAt = Date.now() + 30 * 60 * 1000;
    repo.sync.saveSession(session);

    const before = session.expiresAt;
    const view = await service.getSession(session.id);
    expect(view).not.toBeNull();
    expect(repo.sync.findSession(session.id)!.expiresAt).toBeGreaterThan(before);
  });

  it("selects workspace and updates active workspace pointer", async () => {
    const signup = await service.signUp({
      email: "select@example.com",
      password: "password123",
      displayName: "Select User",
    });
    const user = repo.sync.findUserByEmail("select@example.com")!;
    user.emailVerified = true;
    user.onboardingComplete = true;
    user.onboardingStage = "done";
    repo.sync.updateUser(user);
    const ws = repo.sync.createWorkspace({
      id: "ws-select",
      orgId: user.orgId,
      name: "Primary",
      slug: "primary",
      workspaceType: "team",
      primaryGoal: "Operate",
      archived: false,
      createdAt: Date.now(),
    });
    repo.sync.addWorkspaceMember(ws.id, user.id);

    const view = await service.assertWorkspaceAccess(signup.session.id, ws.id);
    expect(view.activeWorkspaceId).toBe("ws-select");
  });

  it("issues new session id on email verification", async () => {
    const signup = await service.signUp({
      email: "rotate@example.com",
      password: "password123",
      displayName: "Rotate User",
    });
    const verified = await service.verifyEmail(signup.verificationToken!);
    expect(verified.session.id).not.toBe(signup.session.id);
    expect(await service.getSession(signup.session.id)).toBeNull();
  });
});
