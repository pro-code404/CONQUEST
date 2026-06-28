import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "@conquest/auth";
import { createApiApp, type ApiApp } from "./app.js";

type ApiContext = Awaited<ReturnType<typeof createApiApp>>;

async function createTestApi(): Promise<ApiContext> {
  return createApiApp({ repo: new AsyncMemoryAuthRepository() });
}

function extractCookie(setCookie: string | null): string {
  expect(setCookie).toBeTruthy();
  return setCookie!.split(";")[0]!;
}

describe("Auth API integration (Phase 1)", () => {
  let app: ApiApp;

  beforeEach(async () => {
    const testCtx = await createTestApi();
    app = testCtx.app;
  });

  it("logs in, returns session, and logs out", async () => {
    const signup = await app.request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "login-flow@example.com",
        password: "password123",
        displayName: "Login Flow",
      }),
    });
    const signupBody = (await signup.json()) as { verificationToken?: string };
    const verify = await app.request("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: extractCookie(signup.headers.get("set-cookie")),
      },
      body: JSON.stringify({ token: signupBody.verificationToken }),
    });
    const verifyCookie = extractCookie(verify.headers.get("set-cookie"));

    await app.request("/api/auth/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: verifyCookie },
      body: JSON.stringify({
        workspaceName: "Flow Workspace",
        workspaceType: "team",
        primaryGoal: "Operate command center",
      }),
    });
    await app.request("/api/auth/onboarding/finish", {
      method: "POST",
      headers: { Cookie: verifyCookie },
    });

    const login = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "login-flow@example.com",
        password: "password123",
        deviceId: "550e8400-e29b-41d4-a716-446655440000",
      }),
    });
    expect(login.status).toBe(200);
    const loginCookie = extractCookie(login.headers.get("set-cookie"));

    const session = await app.request("/api/auth/session", {
      headers: { Cookie: loginCookie },
    });
    const sessionBody = (await session.json()) as { user: { email: string } | null };
    expect(sessionBody.user?.email).toBe("login-flow@example.com");

    const logout = await app.request("/api/auth/logout", {
      method: "POST",
      headers: { Cookie: loginCookie },
    });
    expect(logout.status).toBe(200);

    const afterLogout = await app.request("/api/auth/session", {
      headers: { Cookie: loginCookie },
    });
    const afterBody = (await afterLogout.json()) as { user: null };
    expect(afterBody.user).toBeNull();
  });

  it("bootstraps workspace selection for authenticated user", async () => {
    const signup = await app.request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "workspace-select@example.com",
        password: "password123",
        displayName: "Workspace Select",
      }),
    });
    const signupBody = (await signup.json()) as { verificationToken?: string };
    const signupCookie = extractCookie(signup.headers.get("set-cookie"));

    const verify = await app.request("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: signupCookie },
      body: JSON.stringify({ token: signupBody.verificationToken }),
    });
    const sessionCookie = extractCookie(verify.headers.get("set-cookie"));

    const onboard = await app.request("/api/auth/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: sessionCookie },
      body: JSON.stringify({
        workspaceName: "Selected Workspace",
        workspaceType: "team",
        primaryGoal: "Test workspace",
      }),
    });
    const onboardBody = (await onboard.json()) as { user: { activeWorkspaceId: string } };
    await app.request("/api/auth/onboarding/finish", {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    const workspaceId = onboardBody.user.activeWorkspaceId;

    const select = await app.request(`/api/auth/workspace/${workspaceId}/select`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    expect(select.status).toBe(200);
    const selectBody = (await select.json()) as { user: { activeWorkspaceId: string } };
    expect(selectBody.user.activeWorkspaceId).toBe(workspaceId);
  });
});

async function createOnboardedSession(
  ctx: ApiContext,
): Promise<{ cookie: string; workspaceId: string; repo: ApiContext["repo"] }> {
  const { app, repo } = ctx;
  const signup = await app.request("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `phase2-${crypto.randomUUID()}@example.com`,
      password: "password123",
      displayName: "Phase 2 User",
    }),
  });
  const signupBody = (await signup.json()) as { verificationToken?: string };
  const verify = await app.request("/api/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: extractCookie(signup.headers.get("set-cookie")),
    },
    body: JSON.stringify({ token: signupBody.verificationToken }),
  });
  const cookie = extractCookie(verify.headers.get("set-cookie"));
  const onboard = await app.request("/api/auth/onboarding/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      workspaceName: "Phase 2 Workspace",
      workspaceType: "team",
      primaryGoal: "Validate routing",
    }),
  });
  await app.request("/api/auth/onboarding/finish", {
    method: "POST",
    headers: { Cookie: cookie },
  });
  const onboardBody = (await onboard.json()) as { user: { activeWorkspaceId: string } };
  return { cookie, workspaceId: onboardBody.user.activeWorkspaceId, repo };
}

describe("Navigation authorization (Phase 2)", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("validates workspace navigation for authorized segment", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(
      `/api/auth/workspace/${workspaceId}/validate?segment=command-center`,
      { headers: { Cookie: cookie } },
    );
    expect(res.status).toBe(200);
  });

  it("returns 403 when role lacks module permission", async () => {
    const { cookie, workspaceId, repo } = await createOnboardedSession(ctx);
    const users = [...repo.sync.users.values()];
    const user = users[users.length - 1]!;
    user.role = "viewer";
    repo.sync.updateUser(user);

    const res = await ctx.app.request(
      `/api/auth/workspace/${workspaceId}/validate?segment=automation`,
      { headers: { Cookie: cookie } },
    );
    expect(res.status).toBe(403);
  });

  it("returns 401 for expired session on validate", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    await ctx.app.request("/api/auth/logout", { method: "POST", headers: { Cookie: cookie } });

    const res = await ctx.app.request(
      `/api/auth/workspace/${workspaceId}/validate?segment=command-center`,
      { headers: { Cookie: cookie } },
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for cross-tenant workspace access", async () => {
    const { cookie, repo } = await createOnboardedSession(ctx);
    const foreignOrg = repo.sync.createOrg("Foreign");
    const foreignWs = repo.sync.createWorkspace({
      id: crypto.randomUUID(),
      orgId: foreignOrg.id,
      name: "Foreign",
      slug: "foreign",
      workspaceType: "general",
      primaryGoal: "Test",
      archived: false,
      createdAt: Date.now(),
    });

    const res = await ctx.app.request(
      `/api/auth/workspace/${foreignWs.id}/validate?segment=command-center`,
      { headers: { Cookie: cookie } },
    );
    expect(res.status).toBe(403);
  });

  it("rejects unauthenticated validate requests", async () => {
    const res = await ctx.app.request(
      "/api/auth/workspace/550e8400-e29b-41d4-a716-446655440000/validate?segment=command-center",
    );
    expect(res.status).toBe(401);
  });
});

describe("Auth API contract (B-22)", () => {
  let app: ApiApp;

  beforeEach(async () => {
    const testCtx = await createTestApi();
    app = testCtx.app;
  });

  it("signs up, verifies, completes onboarding, and accesses workspace", async () => {
    const signup = await app.request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "contract@example.com",
        password: "password123",
        displayName: "Contract User",
      }),
    });
    expect(signup.status).toBe(200);
    const signupBody = (await signup.json()) as {
      user: { emailVerified: boolean };
      verificationToken?: string;
    };
    expect(signupBody.user.emailVerified).toBe(false);
    expect(signupBody.verificationToken).toBeTruthy();

    const cookie = signup.headers.get("set-cookie");
    expect(cookie).toContain("conquest_session");

    const verify = await app.request("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      body: JSON.stringify({ token: signupBody.verificationToken }),
    });
    expect(verify.status).toBe(200);
    const verifyCookie = verify.headers.get("set-cookie") ?? cookie ?? "";

    const onboarding = await app.request("/api/auth/onboarding/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: verifyCookie,
      },
      body: JSON.stringify({
        workspaceName: "Ops Workspace",
        workspaceType: "team",
        primaryGoal: "Operate command center",
      }),
    });
    expect(onboarding.status).toBe(200);
    const onboardBody = (await onboarding.json()) as { user: { onboardingComplete: boolean; onboardingStage: string } };
    expect(onboardBody.user.onboardingComplete).toBe(false);
    expect(onboardBody.user.onboardingStage).toBe("connect");

    const finish = await app.request("/api/auth/onboarding/finish", {
      method: "POST",
      headers: { Cookie: verifyCookie },
    });
    expect(finish.status).toBe(200);

    const session = await app.request("/api/auth/session", {
      headers: { Cookie: verifyCookie },
    });
    const sessionBody = (await session.json()) as {
      user: { activeWorkspaceId: string; onboardingComplete: boolean };
    };
    expect(sessionBody.user.activeWorkspaceId).toBeTruthy();
    expect(sessionBody.user.onboardingComplete).toBe(true);
  });

  it("rejects unauthenticated workspace selection", async () => {
    const res = await app.request("/api/auth/workspace/ws-1/select", { method: "POST" });
    expect(res.status).toBe(401);
  });
});

describe("Milestone 2 production APIs", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("resends verification email for unverified session", async () => {
    const signup = await ctx.app.request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `resend-${crypto.randomUUID()}@example.com`,
        password: "password123",
        displayName: "Resend User",
      }),
    });
    const cookie = extractCookie(signup.headers.get("set-cookie"));
    const res = await ctx.app.request("/api/auth/verify-email/resend", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; verificationToken?: string };
    expect(body.ok).toBe(true);
    expect(body.verificationToken).toBeTruthy();
  });

  it("returns command center dormant status for new workspace", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/command-center/status`, {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { state: string };
    expect(body.state).toBe("dormant");
  });

  it("accepts workspace invite for authenticated user", async () => {
    const { cookie, workspaceId, repo } = await createOnboardedSession(ctx);
    const inviteToken = "test-invite-token";
    repo.sync.invites.set(inviteToken, {
      workspaceId,
      role: "member",
      inviterName: "Owner",
      expiresAt: Date.now() + 60_000,
      consumed: false,
    });

    const res = await ctx.app.request(`/api/auth/invite/${inviteToken}/accept`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { user: { activeWorkspaceId: string } };
    expect(body.user.activeWorkspaceId).toBe(workspaceId);
  });

  it("returns role-filtered settings categories", async () => {
    const { cookie } = await createOnboardedSession(ctx);
    const res = await ctx.app.request("/api/settings/categories", {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { categories: Array<{ id: string }> };
    expect(body.categories.some((c) => c.id === "account")).toBe(true);
  });

  it("updates account profile", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request("/api/settings/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ displayName: "Updated Name" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { profile: { displayName: string } };
    expect(body.profile.displayName).toBe("Updated Name");

    const teamRes = await ctx.app.request(`/api/settings/workspace/${workspaceId}/team`, {
      headers: { Cookie: cookie },
    });
    expect(teamRes.status).toBe(200);

    const notifyRes = await ctx.app.request("/api/settings/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ emailDigest: false }),
    });
    expect(notifyRes.status).toBe(200);

    const orgRes = await ctx.app.request("/api/settings/organization/members", {
      headers: { Cookie: cookie },
    });
    expect(orgRes.status).toBe(200);

    const profileRes = await ctx.app.request("/api/profile", {
      headers: { Cookie: cookie },
    });
    expect(profileRes.status).toBe(200);

    const sessionsRes = await ctx.app.request("/api/profile/sessions", {
      headers: { Cookie: cookie },
    });
    expect(sessionsRes.status).toBe(200);
  });
});

describe("Automation API (Phase 6D)", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("lists workflows for workspace", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/automation/workflows`, {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { workflows: unknown[] };
    expect(Array.isArray(body.workflows)).toBe(true);
  });

  it("creates workflow and returns detail", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const createRes = await ctx.app.request(`/api/workspaces/${workspaceId}/automation/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        name: "Test Flow",
        trigger: { type: "manual" },
        actions: ["Notify team"],
      }),
    });
    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { workflow: { id: string } };
    const detailRes = await ctx.app.request(
      `/api/workspaces/${workspaceId}/automation/workflows/${created.workflow.id}`,
      { headers: { Cookie: cookie } },
    );
    expect(detailRes.status).toBe(200);
  });

  it("validates trigger endpoint", async () => {
    const { cookie } = await createOnboardedSession(ctx);
    const res = await ctx.app.request("/api/automation/validate/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ trigger: { type: "event" } }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { valid: boolean };
    expect(body.valid).toBe(false);
  });

  it("enables workflow and records manual run", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const createRes = await ctx.app.request(`/api/workspaces/${workspaceId}/automation/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        name: "Runnable",
        trigger: { type: "manual" },
        actions: ["Run step"],
      }),
    });
    const { workflow } = (await createRes.json()) as { workflow: { id: string } };
    await ctx.app.request(`/api/workspaces/${workspaceId}/automation/workflows/${workflow.id}/enable`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    const runRes = await ctx.app.request(
      `/api/workspaces/${workspaceId}/automation/workflows/${workflow.id}/run`,
      { method: "POST", headers: { Cookie: cookie } },
    );
    expect(runRes.status).toBe(200);
    const logRes = await ctx.app.request(
      `/api/workspaces/${workspaceId}/automation/workflows/${workflow.id}/executions`,
      { headers: { Cookie: cookie } },
    );
    expect(logRes.status).toBe(200);
    const logBody = (await logRes.json()) as { executions: unknown[] };
    expect(logBody.executions.length).toBeGreaterThan(0);
  });

  it("returns approvals queue", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/automation/approvals`, {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
  });
});

describe("Governance API (Phase 7)", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("returns security settings and completes MFA enrollment", async () => {
    const { cookie } = await createOnboardedSession(ctx);
    const securityRes = await ctx.app.request("/api/settings/security", {
      headers: { Cookie: cookie },
    });
    expect(securityRes.status).toBe(200);

    const enrollRes = await ctx.app.request("/api/settings/security/mfa/enroll", {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(enrollRes.status).toBe(200);
    const enrollBody = (await enrollRes.json()) as { recoveryCodes: string[] };
    const confirmRes = await ctx.app.request("/api/settings/security/mfa/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ recoveryCode: enrollBody.recoveryCodes[0] }),
    });
    expect(confirmRes.status).toBe(200);
  });

  it("returns activity log and governance settings", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const activityRes = await ctx.app.request("/api/settings/activity", {
      headers: { Cookie: cookie },
    });
    expect(activityRes.status).toBe(200);

    const policiesRes = await ctx.app.request("/api/settings/automation-policies", {
      headers: { Cookie: cookie },
    });
    expect(policiesRes.status).toBe(200);

    const aiRes = await ctx.app.request("/api/settings/advanced", {
      headers: { Cookie: cookie },
    });
    expect(aiRes.status).toBe(200);

    const memoryRes = await ctx.app.request("/api/settings/memory", {
      headers: { Cookie: cookie },
    });
    expect(memoryRes.status).toBe(200);

    const sourcesRes = await ctx.app.request(`/api/settings/workspace/${workspaceId}/sources`, {
      headers: { Cookie: cookie },
    });
    expect(sourcesRes.status).toBe(200);

    const goalsRes = await ctx.app.request(`/api/settings/workspace/${workspaceId}/goals`, {
      headers: { Cookie: cookie },
    });
    expect(goalsRes.status).toBe(200);
  });

  it("includes correlation id on health check", async () => {
    const res = await ctx.app.request("/api/health");
    expect(res.status).toBe(200);
    expect(res.headers.get("x-correlation-id")).toBeTruthy();
    const body = (await res.json()) as { dependencies: Record<string, unknown> };
    expect(body.dependencies).toBeTruthy();
    expect(body.dependencies.auth).toBeTruthy();
  });
});

describe("Intelligence platform API (Phase 9)", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("returns intelligence home with honest empty state before analysis", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const homeRes = await ctx.app.request(`/api/workspaces/${workspaceId}/intelligence/home`, {
      headers: { Cookie: cookie },
    });
    expect(homeRes.status).toBe(200);
    const homeBody = (await homeRes.json()) as { home: { feedCount: number; recommendationCount: number } };
    expect(homeBody.home.feedCount).toBe(0);
    expect(homeBody.home.recommendationCount).toBe(0);

    const feedRes = await ctx.app.request(`/api/workspaces/${workspaceId}/intelligence/feed`, {
      headers: { Cookie: cookie },
    });
    expect(feedRes.status).toBe(200);
  });

  it("creates research session and analytics saved view", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const researchRes = await ctx.app.request(`/api/workspaces/${workspaceId}/research/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ title: "Market scan" }),
    });
    expect(researchRes.status).toBe(200);

    const analyticsRes = await ctx.app.request(`/api/workspaces/${workspaceId}/analytics/dashboard`, {
      headers: { Cookie: cookie },
    });
    expect(analyticsRes.status).toBe(200);

    const saveRes = await ctx.app.request(`/api/workspaces/${workspaceId}/analytics/saved-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ name: "Default", timeRange: "30d" }),
    });
    expect(saveRes.status).toBe(200);
  });

  it("returns operations dashboard with platform telemetry", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/operations/dashboard`, {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { dashboard: { queue: { queued: number }; aiProviders: unknown[] } };
    expect(body.dashboard.queue).toBeTruthy();
    expect(Array.isArray(body.dashboard.aiProviders)).toBe(true);
  });

  it("returns administration dashboard for org owner", async () => {
    const { cookie } = await createOnboardedSession(ctx);
    const res = await ctx.app.request("/api/settings/administration", {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { dashboard: { featureFlags: unknown[] } };
    expect(body.dashboard.featureFlags.length).toBeGreaterThan(0);
  });
});

describe("Cognitive platform API (Phase 10–11)", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("runs cognitive orchestration pipeline with telemetry", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/cognitive/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie, "x-correlation-id": "api-cog-001" },
      body: JSON.stringify({ objective: "Assess workspace readiness" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      response: { lifecycle: string; confidence: number; telemetry?: { auditId: string | null; phases: string[] } };
    };
    expect(body.response.lifecycle).toBe("completed");
    expect(body.response.confidence).toBeGreaterThan(0);
    expect(body.response.telemetry?.auditId).toBeTruthy();
    expect(body.response.telemetry?.phases).toContain("audit");
  });

  it("returns cache hit on repeated cognitive objective", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const objective = "Repeat objective for cache";
    const headers = { "Content-Type": "application/json", Cookie: cookie };
    const body = JSON.stringify({ objective });

    const cold = await ctx.app.request(`/api/workspaces/${workspaceId}/cognitive/run`, {
      method: "POST",
      headers,
      body,
    });
    const warm = await ctx.app.request(`/api/workspaces/${workspaceId}/cognitive/run`, {
      method: "POST",
      headers,
      body,
    });
    expect(cold.status).toBe(200);
    expect(warm.status).toBe(200);
    const coldBody = (await cold.json()) as { response: { telemetry?: { cacheHit: boolean } } };
    const warmBody = (await warm.json()) as { response: { telemetry?: { cacheHit: boolean } } };
    expect(coldBody.response.telemetry?.cacheHit).toBe(false);
    expect(warmBody.response.telemetry?.cacheHit).toBe(true);
  });

  it("rejects cross-workspace cognitive access", async () => {
    const { cookie } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(
      `/api/workspaces/550e8400-e29b-41d4-a716-446655440099/cognitive/run`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify({ objective: "Forbidden workspace" }),
      },
    );
    expect(res.status).toBe(403);
  });

  it("exposes platform health with cognitive metrics", async () => {
    const res = await ctx.app.request("/api/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      dependencies: { platform: { status: string } };
      cognitiveMetrics: { requestCount: number };
    };
    expect(body.dependencies.platform.status).toBe("healthy");
    expect(body.cognitiveMetrics).toBeTruthy();
  });

  it("collects evidence and evaluates decisions", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const evidenceRes = await ctx.app.request(`/api/workspaces/${workspaceId}/cognitive/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        workspaceId,
        sources: [{ sourceId: "doc", title: "Policy", excerpt: "Risk threshold exceeded" }],
      }),
    });
    expect(evidenceRes.status).toBe(200);
    const evidenceBody = (await evidenceRes.json()) as { portfolio: { items: Array<{ id: string }> } };
    const decisionRes = await ctx.app.request(`/api/workspaces/${workspaceId}/cognitive/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        workspaceId,
        candidates: [
          {
            id: "mitigate",
            title: "Mitigate",
            summary: "Reduce risk exposure",
            evidenceIds: evidenceBody.portfolio.items.map((i) => i.id),
          },
        ],
      }),
    });
    expect(decisionRes.status).toBe(200);
  });
});

describe("Build-2 Milestone 1 integration", () => {
  let ctx: ApiContext;

  beforeEach(async () => {
    ctx = await createTestApi();
  });

  it("returns command center dashboard with integrated zones", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(`/api/workspaces/${workspaceId}/command-center/dashboard`, {
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { dashboard: { zones: unknown[]; status: { state: string } } };
    expect(body.dashboard.zones).toHaveLength(8);
    expect(body.dashboard.status.state).toBeTruthy();
  });

  it("runs research-to-cognitive-to-recommendation flow", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const createRes = await ctx.app.request(`/api/workspaces/${workspaceId}/research/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ title: "Integration research session" }),
    });
    expect(createRes.status).toBe(200);
    const created = (await createRes.json()) as { session: { id: string } };

    const analyzeRes = await ctx.app.request(
      `/api/workspaces/${workspaceId}/research/sessions/${created.session.id}/analyze`,
      { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie } },
    );
    expect(analyzeRes.status).toBe(200);
    const analysis = (await analyzeRes.json()) as {
      analysis: { recommendationId: string | null; evidenceCount: number; correlationId: string };
    };
    expect(analysis.analysis.recommendationId).toBeTruthy();
    expect(analysis.analysis.evidenceCount).toBeGreaterThan(0);

    const homeRes = await ctx.app.request(`/api/workspaces/${workspaceId}/intelligence/home`, {
      headers: { Cookie: cookie },
    });
    const home = (await homeRes.json()) as { home: { recommendationCount: number } };
    expect(home.home.recommendationCount).toBeGreaterThan(0);
  });

  it("validates intelligence module segment for workspace access", async () => {
    const { cookie, workspaceId } = await createOnboardedSession(ctx);
    const res = await ctx.app.request(
      `/api/auth/workspace/${workspaceId}/validate?segment=intelligence`,
      { headers: { Cookie: cookie } },
    );
    expect(res.status).toBe(200);
  });
});
