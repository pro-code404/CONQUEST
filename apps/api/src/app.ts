import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { canAccessModuleRead } from "@conquest/gis";
import {
  IdentityService,
  createAuthRepository,
  SESSION_COOKIE_NAME,
  sessionCookieMaxAgeSec,
  SettingsService,
  WorkspaceService,
  AutomationService,
  SecurityService,
  AuditService,
  IntelligenceService,
  ResearchService,
  AnalyticsService,
  OperationsService,
  AdministrationService,
  NotificationService,
  LegalService,
  createEmailProvider,
  buildCommandCenterDashboard,
  type IntelligenceCognitiveProvider,
  type AuthRepository,
  type RepositoryMode,
} from "@conquest/auth";
import { createPlatformServices, getPlatformHealthReport, getCognitiveMetricsSnapshot } from "@conquest/platform";
import { toStructuredError } from "@conquest/config";
import { SetOnboardingStageSchema } from "@conquest/contracts";
import { correlationIdMiddleware } from "./middleware/correlation-id.js";
import { rateLimitMiddleware } from "./middleware/rate-limit.js";

const isProduction = process.env.NODE_ENV === "production";

function setSessionCookie(c: Parameters<typeof setCookie>[0], sessionId: string) {
  setCookie(c, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "Lax",
    secure: isProduction,
    path: "/",
    maxAge: sessionCookieMaxAgeSec(),
  });
}

function sessionIdFrom(c: { req: { header: (name: string) => string | undefined } }) {
  return getCookie(c as Parameters<typeof getCookie>[0], SESSION_COOKIE_NAME);
}

async function cognitiveScope(repo: AuthRepository, sessionId: string, workspaceId: string) {
  const session = await repo.findSession(sessionId);
  if (!session || session.revoked || session.expiresAt < Date.now()) {
    throw new Error("Session expired");
  }
  const ws = await repo.findWorkspace(workspaceId);
  if (!ws) throw new Error("Workspace not found");
  if (session.orgId !== ws.orgId) throw new Error("Tenant isolation violation");
  return { orgId: session.orgId, workspaceId };
}

export async function createApiApp(deps?: { repo?: AuthRepository; persistenceMode?: RepositoryMode }) {
  let repo: AuthRepository;
  let persistenceMode: RepositoryMode;
  if (deps?.repo) {
    repo = deps.repo;
    persistenceMode = deps.persistenceMode ?? "memory";
  } else {
    const created = await createAuthRepository();
    repo = created.repo;
    persistenceMode = created.mode;
  }
  const notifications = new NotificationService(repo, createEmailProvider(), {
    ...(process.env.APP_BASE_URL ? { appBaseUrl: process.env.APP_BASE_URL } : {}),
  });
  const identity = new IdentityService(repo, undefined, notifications);
  const workspace = new WorkspaceService(repo, notifications);
  const settings = new SettingsService(repo, notifications);
  const legal = new LegalService(repo);
  const automation = new AutomationService(repo);
  const security = new SecurityService(repo);
  const audit = new AuditService(repo);
  const platform = createPlatformServices();

  const cognitiveProvider: IntelligenceCognitiveProvider = {
    async analyze(scope, input) {
      const response = await platform.cognitive.run(scope, {
        workspaceId: scope.workspaceId!,
        objective: input.objective,
        ...(input.constraints ? { constraints: input.constraints } : {}),
        ...(input.correlationId ? { correlationId: input.correlationId } : {}),
      });
      return {
        requestId: response.requestId,
        correlationId: response.correlationId,
        recommendationSummary: response.recommendationSummary ?? "No recommendation produced",
        confidence: response.confidence,
        evidenceCount: response.evidenceCount,
        evidenceRefs: response.evidenceRefs ?? [],
        evidenceItems: (response.evidenceSummaries ?? []).map((item) => ({
          sourceId: item.sourceId,
          title: item.title,
          excerpt: item.excerpt,
        })),
        reasoningId: response.recommendationId,
        decisionId: response.decisionId,
      };
    },
  };

  const intelligence = new IntelligenceService(repo, cognitiveProvider);
  const research = new ResearchService(repo);
  const analytics = new AnalyticsService(repo);
  const operations = new OperationsService(repo, {
    getQueueMetrics: () => platform.jobs.getMetrics(),
    getCacheStatus: () => {
      const metrics = platform.cache.getMetrics();
      return {
        provider: platform.cacheLabel,
        healthy: true,
        hits: metrics.hits,
        misses: metrics.misses,
      };
    },
    listAiProviderStatus: () =>
      platform.aiProvider.listProviderStatus().map((provider) => ({
        id: provider.id,
        name: provider.name,
        status: provider.status,
      })),
  });
  const administration = new AdministrationService(repo);
  const app = new Hono();

  app.use("*", correlationIdMiddleware);
  app.use(
    "/api/*",
    rateLimitMiddleware,
    cors({
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    }),
  );

  app.get("/api/health", async (c) => {
    const [authHealth, workspaceHealth, settingsHealth, automationHealth, platformHealth] =
      await Promise.all([
        await identity.healthCheck(),
        await workspace.healthCheck(),
        await settings.healthCheck(),
        await automation.healthCheck(),
        getPlatformHealthReport(platform),
      ]);
    const healthy =
      authHealth.healthy &&
      workspaceHealth.healthy &&
      settingsHealth.healthy &&
      automationHealth.healthy &&
      platformHealth.status === "healthy";
    return c.json({
      ok: healthy,
      service: "conquest-api",
      persistence: persistenceMode,
      correlationId: c.get("correlationId"),
      dependencies: {
        auth: authHealth,
        workspace: workspaceHealth,
        settings: settingsHealth,
        automation: automationHealth,
        platform: platformHealth,
      },
      cognitiveMetrics: getCognitiveMetricsSnapshot(platform),
    });
  });

  app.get("/api/health/live", (c) => c.json({ ok: true, service: "conquest-api" }));

  app.get("/api/health/ready", async (c) => {
    try {
      if (persistenceMode === "postgres") {
        await repo.listAuditEvents("00000000-0000-0000-0000-000000000000", { limit: 1 });
      }
      return c.json({ ok: true, persistence: persistenceMode });
    } catch {
      return c.json({ ok: false, persistence: persistenceMode }, 503);
    }
  });

  app.get("/api/legal/documents", (c) => c.json(legal.getPublicStatus()));

  app.get("/api/legal/status", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json(legal.getPublicStatus());
    try {
      return c.json(await legal.getUserStatus(sessionId));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401);
    }
  });

  app.post("/api/legal/accept", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const body = (await c.req.json()) as {
        documentType: string;
        documentVersion: string;
      };
      const acceptance = await legal.recordAcceptance(sessionId, {
        documentType: body.documentType as import("@conquest/contracts").LegalDocumentType,
        documentVersion: body.documentVersion,
        ...(c.req.header("x-forwarded-for") ? { ipAddress: c.req.header("x-forwarded-for")! } : {}),
        ...(c.req.header("user-agent") ? { userAgent: c.req.header("user-agent")! } : {}),
      });
      return c.json({ acceptance });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Accept failed" }, 400);
    }
  });

  app.post("/api/legal/cookie-consent", async (c) => {
    try {
      const body = (await c.req.json()) as { documentVersion: string };
      const sessionId = sessionIdFrom(c);
      const result = await legal.recordCookieConsent(sessionId ?? null, {
        documentVersion: body.documentVersion,
        ...(c.req.header("x-forwarded-for") ? { ipAddress: c.req.header("x-forwarded-for")! } : {}),
        ...(c.req.header("user-agent") ? { userAgent: c.req.header("user-agent")! } : {}),
      });
      return c.json(result);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Consent failed" }, 400);
    }
  });

  app.get("/api/auth/session", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ user: null });
    const user = await identity.getSession(sessionId);
    return c.json({ user });
  });

  app.post("/api/auth/signup", async (c) => {
    try {
      const body = await c.req.json();
      const result = await identity.signUp(body);
      setSessionCookie(c, result.session.id);
      return c.json({
        user: result.view,
        verificationToken: isProduction ? undefined : result.verificationToken,
      });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Signup failed" }, 400);
    }
  });

  app.post("/api/auth/login", async (c) => {
    try {
      const body = await c.req.json();
      const result = await identity.login(body);
      setSessionCookie(c, result.session.id);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Login failed" }, 401);
    }
  });

  app.post("/api/auth/logout", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (sessionId) await identity.logout(sessionId);
    deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" });
    return c.json({ ok: true });
  });

  app.post("/api/auth/verify-email", async (c) => {
    try {
      const { token } = await c.req.json();
      const result = await identity.verifyEmail(String(token ?? ""));
      setSessionCookie(c, result.session.id);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Verification failed" }, 400);
    }
  });

  app.post("/api/auth/verify-email/resend", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const result = await identity.resendVerificationEmail(sessionId, isProduction);
      return c.json(result);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Resend failed" }, 400);
    }
  });

  app.post("/api/auth/onboarding/complete", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const body = await c.req.json();
      const result = await identity.completeOnboarding(sessionId, body);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Onboarding failed" }, 400);
    }
  });

  app.post("/api/auth/onboarding/stage", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const body = SetOnboardingStageSchema.parse(await c.req.json());
      const result = await identity.setOnboardingStage(sessionId, body.stage);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Stage update failed" }, 400);
    }
  });

  app.post("/api/auth/onboarding/finish", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const result = await identity.finishOnboarding(sessionId);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Finish failed" }, 400);
    }
  });

  app.post("/api/auth/password/forgot", async (c) => {
    try {
      const { email } = await c.req.json();
      await identity.requestPasswordReset(String(email ?? ""));
      return c.json({ ok: true, message: "If an account exists, a reset email has been sent." });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Request failed" }, 400);
    }
  });

  app.post("/api/auth/password/reset", async (c) => {
    try {
      const { token, password } = await c.req.json();
      await identity.resetPassword(String(token ?? ""), String(password ?? ""));
      return c.json({ ok: true });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Reset failed" }, 400);
    }
  });

  app.get("/api/auth/invite/:token", async (c) => {
    try {
      const preview = await identity.getInvitePreview(c.req.param("token"));
      return c.json(preview);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Invalid invite" }, 400);
    }
  });

  app.post("/api/auth/invite/:token/accept", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const result = await identity.acceptInvite(sessionId, c.req.param("token"));
      setSessionCookie(c, result.session.id);
      return c.json({ user: result.view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Accept failed" }, 400);
    }
  });

  app.post("/api/auth/workspace/:workspaceId/select", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const user = await identity.assertWorkspaceAccess(sessionId, c.req.param("workspaceId"));
      return c.json({ user });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Access denied" }, 403);
    }
  });

  app.get("/api/auth/workspace/:workspaceId/validate", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);

    const current = await identity.getSession(sessionId);
    if (!current) return c.json({ error: "Session expired" }, 401);

    const workspaceId = c.req.param("workspaceId");
    const segment = c.req.query("segment") ?? "command-center";

    try {
      const user = await identity.assertWorkspaceAccess(sessionId, workspaceId);
      if (!canAccessModuleRead(user.role, segment)) {
        return c.json({ error: "Forbidden", reason: "forbidden_role" }, 403);
      }
      return c.json({ user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Access denied";
      if (message.includes("not found") || message.includes("Not found")) {
        return c.json({ error: message }, 404);
      }
      return c.json({ error: message }, 403);
    }
  });

  app.get("/api/workspaces", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ workspaces: await workspace.listWorkspaces(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/command-center/status", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json(await workspace.getCommandCenterStatus(sessionId, c.req.param("workspaceId")));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/command-center/dashboard", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      const status = await workspace.getCommandCenterStatus(sessionId, workspaceId);
      const feed = await intelligence.getFeed(sessionId, workspaceId);
      const recommendations = await intelligence.listRecommendations(sessionId, workspaceId);
      const goals = await workspace.listGoals(sessionId, workspaceId);
      const automationCenter = await automation.listWorkflows(sessionId, workspaceId);
      const enabledWorkflowCount = automationCenter.workflows.filter((w) => w.enabled).length;
      const wsSettings = await workspace.getWorkspaceSettings(sessionId, workspaceId);
      const platformHealth = await getPlatformHealthReport(platform);
      const cognitiveMetrics = getCognitiveMetricsSnapshot(platform);

      const dashboard = buildCommandCenterDashboard({
        workspaceId,
        status,
        feedItems: feed.items,
        recommendations,
        goals,
        pendingApprovals: automationCenter.pendingApprovalsCount,
        enabledWorkflowCount,
        platformHealthy: platformHealth.status === "healthy",
        cognitiveRequestCount: cognitiveMetrics.requestCount,
        primaryGoal: wsSettings.primaryGoal,
      });
      return c.json({ dashboard });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 403);
    }
  });

  app.get("/api/settings/categories", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    const user = await identity.getSession(sessionId);
    if (!user) return c.json({ error: "Session expired" }, 401);
    return c.json({
      categories: await settings.listCategories(user.role, user.activeWorkspaceId),
    });
  });

  app.get("/api/settings/account", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ profile: await settings.getAccountProfile(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/settings/account", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const profile = await settings.updateProfile(sessionId, await c.req.json());
      return c.json({ profile });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/preferences", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ preferences: await settings.getPreferences(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/settings/preferences", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const preferences = await settings.updatePreferences(sessionId, await c.req.json());
      return c.json({ preferences });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/organization", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ organization: await settings.getOrganizationSettings(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/organization/members", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({
        members: await settings.listOrganizationMembers(sessionId),
        invites: await settings.listOrganizationInvites(sessionId),
      });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/organization/members/invite", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const invite = await settings.inviteOrganizationMember(sessionId, await c.req.json());
      return c.json({ invite });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/settings/organization/members/:userId/role", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const members = await settings.updateOrganizationMemberRole(
        sessionId,
        c.req.param("userId"),
        await c.req.json(),
      );
      return c.json({ members });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/settings/organization/members/:userId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const members = await settings.removeOrganizationMember(sessionId, c.req.param("userId"));
      return c.json({ members });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/notifications", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ notifications: await settings.getNotificationPreferences(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/settings/notifications", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const notifications = await settings.updateNotificationPreferences(sessionId, await c.req.json());
      return c.json({ notifications });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/privacy", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ privacy: await settings.getPrivacySettings(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/settings/privacy/export", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json(await settings.requestPrivacyExport(sessionId));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/settings/privacy/deletion", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json(await settings.requestPrivacyDeletion(sessionId));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/billing", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ billing: await settings.getBillingSettings(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/integrations", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ integrations: await settings.listIntegrations(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/integrations/:integrationId/connect", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const integrations = await settings.connectIntegration(sessionId, c.req.param("integrationId"));
      return c.json({ integrations });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/integrations/:integrationId/disconnect", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const integrations = await settings.disconnectIntegration(sessionId, c.req.param("integrationId"));
      return c.json({ integrations });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/workspace/:workspaceId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ workspace: await workspace.getWorkspaceSettings(sessionId, c.req.param("workspaceId")) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.put("/api/settings/workspace/:workspaceId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const ws = await workspace.updateWorkspaceSettings(sessionId, c.req.param("workspaceId"), await c.req.json());
      return c.json({ workspace: ws });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/workspace/:workspaceId/team", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      return c.json({
        members: await workspace.listTeamMembers(sessionId, workspaceId),
        invites: await workspace.listPendingInvites(sessionId, workspaceId),
      });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/workspace/:workspaceId/team/invite", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const invite = await workspace.inviteTeamMember(
        sessionId,
        c.req.param("workspaceId"),
        await c.req.json(),
      );
      return c.json({ invite });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/settings/workspace/:workspaceId/team/:userId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const members = await workspace.removeTeamMember(sessionId, c.req.param("workspaceId"), c.req.param("userId"));
      return c.json({ members });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/profile", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ profile: await identity.getProfileSummary(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/profile/sessions", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ sessions: await identity.listActiveSessions(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/profile/sessions/:sessionId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const sessions = await identity.revokeActiveSession(sessionId, c.req.param("sessionId"));
      return c.json({ sessions });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/automation/workflows", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const search = c.req.query("search");
      const status = c.req.query("status");
      const center = await automation.listWorkflows(sessionId, c.req.param("workspaceId"), {
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      });
      return c.json(center);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/automation/workflows/:workflowId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.getWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Not found" }, 404);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.createWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        await c.req.json(),
      );
      return c.json({ workflow }, 201);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/workspaces/:workspaceId/automation/workflows/:workflowId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.updateWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
        await c.req.json(),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/workspaces/:workspaceId/automation/workflows/:workflowId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.archiveWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/enable", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.enableWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/disable", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.disableWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/pause", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.pauseWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/resume", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.resumeWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/workflows/:workflowId/run", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const execution = await automation.manualRun(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ execution });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/automation/workflows/:workflowId/executions", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const executions = await automation.listExecutions(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ executions });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Not found" }, 404);
    }
  });

  app.get("/api/workspaces/:workspaceId/automation/approvals", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const approvals = await automation.listApprovals(sessionId, c.req.param("workspaceId"));
      return c.json({ approvals });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/approvals/:workflowId/approve", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.approveWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/automation/approvals/:workflowId/reject", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workflow = await automation.rejectWorkflow(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("workflowId"),
      );
      return c.json({ workflow });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/automation/validate/trigger", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const body = (await c.req.json()) as { trigger: Parameters<typeof automation.validateTriggerInput>[0] };
      return c.json(await automation.validateTriggerInput(body.trigger));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/automation/validate/schedule", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const body = (await c.req.json()) as { schedule: Parameters<typeof automation.validateScheduleInput>[0] };
      return c.json(await automation.validateScheduleInput(body.schedule));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/security", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json(toStructuredError("Not authenticated", { correlationId: c.get("correlationId") }), 401);
    try {
      return c.json({ security: await security.getSecuritySettings(sessionId) });
    } catch (error) {
      return c.json(toStructuredError(error instanceof Error ? error.message : "Failed", { correlationId: c.get("correlationId") }), 400);
    }
  });

  app.post("/api/settings/security/mfa/enroll", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json(await security.enrollMfa(sessionId));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/settings/security/mfa/confirm", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const securityView = await security.confirmMfaEnrollment(sessionId, await c.req.json());
      return c.json({ security: securityView });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/settings/security/mfa/regenerate", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json(await security.regenerateRecoveryCodes(sessionId));
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/security/devices", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ devices: await security.listTrustedDevices(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/settings/security/devices/:deviceId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const devices = await security.revokeTrustedDevice(sessionId, c.req.param("deviceId"));
      return c.json({ devices });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/automation-policies", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ policies: await settings.getAutomationPolicies(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.put("/api/settings/automation-policies", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const policies = await settings.updateAutomationPolicies(sessionId, await c.req.json());
      return c.json({ policies });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/advanced", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ ai: await settings.getAiControls(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.put("/api/settings/advanced", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const ai = await settings.updateAiControls(sessionId, await c.req.json());
      return c.json({ ai });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/memory", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ memory: await settings.getMemoryControls(sessionId) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.put("/api/settings/memory", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const memory = await settings.updateMemoryControls(sessionId, await c.req.json());
      return c.json({ memory });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/activity", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const category = c.req.query("category");
      const search = c.req.query("search");
      const workspaceId = c.req.query("workspaceId");
      const log = await audit.listActivityLog(sessionId, {
        ...(category ? { category: category as import("@conquest/contracts").AuditCategory } : {}),
        ...(search ? { search } : {}),
        ...(workspaceId ? { workspaceId } : {}),
      });
      return c.json(log);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/workspace/:workspaceId/sources", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const sources = await workspace.listDataSources(sessionId, c.req.param("workspaceId"));
      return c.json({ sources });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/workspace/:workspaceId/sources", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const sources = await workspace.connectDataSource(sessionId, c.req.param("workspaceId"), await c.req.json());
      return c.json({ sources });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.delete("/api/settings/workspace/:workspaceId/sources/:sourceId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const sources = await workspace.disconnectDataSource(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("sourceId"),
      );
      return c.json({ sources });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/workspace/:workspaceId/goals", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const goals = await workspace.listGoals(sessionId, c.req.param("workspaceId"));
      return c.json({ goals });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/settings/workspace/:workspaceId/goals", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const goals = await workspace.createGoal(sessionId, c.req.param("workspaceId"), await c.req.json());
      return c.json({ goals });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/home", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      return c.json({ home: await intelligence.getHome(sessionId, c.req.param("workspaceId")) });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/feed", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const category = c.req.query("category");
      const search = c.req.query("search");
      const feed = await intelligence.getFeed(sessionId, c.req.param("workspaceId"), {
        ...(category ? { category: category as "recommendation" | "opportunity" | "risk" | "insight" | "alert" } : {}),
        ...(search ? { search } : {}),
      });
      return c.json({ feed });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/recommendations", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const recommendations = await intelligence.listRecommendations(sessionId, c.req.param("workspaceId"));
      return c.json({ recommendations });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/recommendations/:recommendationId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const recommendation = await intelligence.getRecommendation(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("recommendationId"),
      );
      return c.json({ recommendation });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/intelligence/recommendations/:recommendationId/status", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const recommendation = await intelligence.updateRecommendationStatus(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("recommendationId"),
        await c.req.json(),
      );
      return c.json({ recommendation });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/opportunities", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const opportunities = await intelligence.listOpportunities(sessionId, c.req.param("workspaceId"));
      return c.json({ opportunities });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/risks", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const risks = await intelligence.listRisks(sessionId, c.req.param("workspaceId"));
      return c.json({ risks });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/intelligence/timeline", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const timeline = await intelligence.getTimeline(sessionId, c.req.param("workspaceId"));
      return c.json({ timeline });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/research/sessions", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const sessions = await research.listSessions(sessionId, c.req.param("workspaceId"));
      const sources = await research.listOrgSources(sessionId, c.req.param("workspaceId"));
      return c.json({ sessions, sources });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/research/sessions", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const session = await research.createSession(sessionId, c.req.param("workspaceId"), await c.req.json());
      return c.json({ session });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/research/sessions/:researchSessionId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const session = await research.getSession(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("researchSessionId"),
      );
      return c.json({ session });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/research/sessions/:researchSessionId/sources", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const session = await research.registerSource(
        sessionId,
        c.req.param("workspaceId"),
        c.req.param("researchSessionId"),
        await c.req.json(),
      );
      return c.json({ session });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/research/sessions/:researchSessionId/analyze", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      const correlationId = c.get("correlationId") as string | undefined;
      const analysis = await intelligence.analyzeFromResearch(
        sessionId,
        workspaceId,
        c.req.param("researchSessionId"),
        correlationId,
      );
      return c.json({ analysis });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed";
      const forbidden = message.includes("Workspace") || message.includes("Tenant") || message.includes("Session");
      return c.json({ error: message }, forbidden ? 403 : 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/analytics/dashboard", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const timeRange = c.req.query("timeRange");
      const category = c.req.query("category");
      const dashboard = await analytics.getDashboard(sessionId, c.req.param("workspaceId"), {
        ...(timeRange ? { timeRange: timeRange as "7d" } : {}),
        ...(category ? { category } : {}),
      });
      return c.json({ dashboard });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/analytics/metrics", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const metrics = await analytics.getMetricRegistry(sessionId, c.req.param("workspaceId"));
      return c.json({ metrics });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/workspaces/:workspaceId/analytics/saved-views", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const views = await analytics.listSavedViews(sessionId, c.req.param("workspaceId"));
      return c.json({ views });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/analytics/saved-views", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const view = await analytics.saveView(sessionId, c.req.param("workspaceId"), await c.req.json());
      return c.json({ view });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/operations/dashboard", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const dashboard = await operations.getDashboard(sessionId, c.req.param("workspaceId"));
      return c.json({ dashboard });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.get("/api/settings/administration", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const dashboard = await administration.getDashboard(sessionId);
      return c.json({ dashboard });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.put("/api/settings/administration/feature-flags/:flagId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const dashboard = await administration.updateFeatureFlag(
        sessionId,
        c.req.param("flagId"),
        await c.req.json(),
      );
      return c.json({ dashboard });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/cognitive/run", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      const scope = await cognitiveScope(repo, sessionId, workspaceId);
      const correlationId = c.get("correlationId") as string | undefined;
      const body = (await c.req.json()) as Record<string, unknown>;
      const response = await platform.cognitive.run(scope, {
        workspaceId,
        objective: String(body.objective ?? ""),
        ...(body.context ? { context: body.context as Record<string, string> } : {}),
        ...(body.constraints ? { constraints: body.constraints as string[] } : {}),
        ...(correlationId ? { correlationId } : {}),
        ...(body.async === true ? { async: true } : {}),
      });
      return c.json({ response });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed";
      const forbidden =
        message.includes("Workspace") ||
        message.includes("Tenant") ||
        message.includes("Session") ||
        message.includes("scope mismatch");
      return c.json({ error: message }, forbidden ? 403 : 400);
    }
  });

  app.get("/api/workspaces/:workspaceId/cognitive/requests/:requestId", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      await cognitiveScope(repo, sessionId, c.req.param("workspaceId"));
      const lifecycle = platform.cognitive.getLifecycle(c.req.param("requestId"));
      return c.json({ lifecycle });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Forbidden" }, 403);
    }
  });

  app.post("/api/workspaces/:workspaceId/cognitive/evidence", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      await cognitiveScope(repo, sessionId, workspaceId);
      const portfolio = platform.evidence.collect(workspaceId, await c.req.json());
      return c.json({ portfolio });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/cognitive/reasoning", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      await cognitiveScope(repo, sessionId, workspaceId);
      const result = platform.reasoning.reason(workspaceId, await c.req.json());
      return c.json({ result });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/cognitive/decisions", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const workspaceId = c.req.param("workspaceId");
      await cognitiveScope(repo, sessionId, workspaceId);
      const evaluation = platform.decision.evaluate(workspaceId, await c.req.json());
      return c.json({ evaluation });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.get("/api/settings/prompts", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    return c.json({ templates: platform.prompts.listTemplates() });
  });

  app.post("/api/settings/prompts", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      const template = platform.prompts.registerTemplate(await c.req.json());
      return c.json({ template });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  app.post("/api/workspaces/:workspaceId/cognitive/providers/route", async (c) => {
    const sessionId = sessionIdFrom(c);
    if (!sessionId) return c.json({ error: "Not authenticated" }, 401);
    try {
      await cognitiveScope(repo, sessionId, c.req.param("workspaceId"));
      const route = platform.aiProvider.route(await c.req.json());
      return c.json({ route });
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : "Failed" }, 400);
    }
  });

  return {
    app,
    identity,
    workspace,
    settings,
    automation,
    security,
    audit,
    intelligence,
    research,
    analytics,
    operations,
    administration,
    legal,
    repo,
    persistenceMode,
  };
}

export type ApiApp = Awaited<ReturnType<typeof createApiApp>>["app"];
