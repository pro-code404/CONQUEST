import { randomBytes, randomUUID } from "node:crypto";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  CompleteOnboardingSchema,
  LoginInputSchema,
  SignUpInputSchema,
  type CompleteOnboardingInput,
  type LoginInput,
  type OnboardingStage,
  type SignUpInput,
  type ActiveSessionView,
  type ProfileSummaryView,
} from "@conquest/contracts";
import { hashPassword, verifyPassword } from "./password.js";
import type { AuthRepository } from "./auth-repository.js";
import { SESSION_TTL_MS, SLIDING_REFRESH_MS } from "./session-config.js";
import type { AuthResult, ServerSession, SessionPublicView, UserRecord, UserRole } from "./types.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "workspace";
}

export class IdentityService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTH;

  constructor(
    private readonly repo: AuthRepository,
    private readonly sessionTtlMs = SESSION_TTL_MS,
    private readonly notifications?: import("./notification-service.js").NotificationService,
  ) {
    super();
  }

  async signUp(raw: SignUpInput): Promise<AuthResult> {
    const input = SignUpInputSchema.parse(raw);
    if (await this.repo.findUserByEmail(input.email)) {
      throw new Error("An account with this email already exists");
    }

    const org = await this.repo.createOrg(input.orgName ?? `${input.displayName}'s Organization`);
    const user: UserRecord = {
      id: randomUUID(),
      orgId: org.id,
      email: input.email.toLowerCase(),
      passwordHash: hashPassword(input.password),
      role: "owner",
      emailVerified: false,
      onboardingComplete: false,
      onboardingStage: "welcome",
      displayName: input.displayName,
      createdAt: Date.now(),
      passwordChangedAt: Date.now(),
      mfaEnrolled: false,
    };
    await this.repo.createUser(user);

    const verificationToken = randomBytes(24).toString("base64url");
    await this.repo.storeVerificationToken(user.id, verificationToken);
    if (this.notifications) {
      await this.notifications.sendVerificationEmail({
        userId: user.id,
        orgId: org.id,
        recipient: user.email,
        token: verificationToken,
      });
    }

    const session = await this.createSession(user, null, "password");
    this.emit("signup", "info", { userId: user.id });
    return {
      session,
      view: this.toView(user, session),
      verificationToken,
    };
  }

  async login(raw: LoginInput): Promise<AuthResult> {
    const input = LoginInputSchema.parse(raw);
    const user = await this.repo.findUserByEmail(input.email);
    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new Error("Invalid email or password");
    }

    const workspaces = await this.repo.listWorkspacesForOrg(user.orgId);
    const activeWorkspaceId = user.onboardingComplete ? workspaces[0]?.id ?? null : null;

    const authStrength = user.mfaEnrolled ? "mfa" : "password";
    const session = await this.createSession(user, activeWorkspaceId, authStrength, input.deviceId);
    const prefs = await this.repo.getSecurityPreferences(user.id);
    if (prefs.trustDeviceOnLogin) {
      await this.repo.upsertTrustedDevice(user.id, {
        deviceId: session.deviceId,
        label: `Device ${session.deviceId.slice(0, 8)}`,
        trusted: true,
        lastSeenAt: Date.now(),
      });
    }
    await this.repo.appendAuditEvent({
      category: "authentication",
      action: "auth.login",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "session",
      resourceId: session.id,
      orgId: user.orgId,
      summary: "User signed in",
    });
    return { session, view: this.toView(user, session) };
  }

  async getSession(sessionId: string): Promise<SessionPublicView | null> {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      return null;
    }
    const user = await this.repo.findUserById(session.userId);
    if (!user) return null;

    if (session.expiresAt - Date.now() < SLIDING_REFRESH_MS) {
      session.expiresAt = Date.now() + this.sessionTtlMs;
      await this.repo.saveSession(session);
    }

    return this.toView(user, session);
  }

  async logout(sessionId: string): Promise<void> {
    await this.repo.revokeSession(sessionId);
  }

  async getProfileSummary(sessionId: string): Promise<ProfileSummaryView> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    const org = await this.repo.findOrg(user.orgId);
    return {
      displayName: user.displayName,
      email: user.email,
      orgName: org?.name ?? "Organization",
      role: user.role,
    };
  }

  async listActiveSessions(sessionId: string): Promise<ActiveSessionView[]> {
    const session = await this.requireSession(sessionId);
    return (await this.repo.listSessionsForUser(session.userId)).map((item) => ({
      sessionId: item.id,
      deviceId: item.deviceId,
      createdAt: new Date(item.createdAt).toISOString(),
      expiresAt: new Date(item.expiresAt).toISOString(),
      isCurrent: item.id === session.id,
    }));
  }

  async revokeActiveSession(sessionId: string, targetSessionId: string): Promise<ActiveSessionView[]> {
    const session = await this.requireSession(sessionId);
    const target = await this.repo.findSession(targetSessionId);
    if (!target || target.userId !== session.userId) {
      throw new Error("Session not found");
    }
    if (target.id === session.id) {
      throw new Error("Cannot revoke current session from this screen");
    }
    await this.repo.revokeSession(targetSessionId);
    this.emit("session_revoked", "info", { targetSessionId });
    return this.listActiveSessions(sessionId);
  }

  async verifyEmail(token: string): Promise<AuthResult> {
    const userId = await this.repo.consumeVerificationToken(token);
    if (!userId) throw new Error("Invalid or expired verification link");

    const user = await this.repo.findUserById(userId);
    if (!user) throw new Error("User not found");

    user.emailVerified = true;
    await this.repo.updateUser(user);

    await this.repo.revokeAllForUser(user.id);
    const session = await this.createSession(user, null, "password");
    return { session, view: this.toView(user, session) };
  }

  async resendVerificationEmail(
    sessionId: string,
    isProduction: boolean,
  ): Promise<{ ok: true; verificationToken?: string }> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (user.emailVerified) throw new Error("Email is already verified");

    const verificationToken = randomBytes(24).toString("base64url");
    await this.repo.storeVerificationToken(user.id, verificationToken);
    if (this.notifications) {
      await this.notifications.sendVerificationEmail({
        userId: user.id,
        orgId: user.orgId,
        recipient: user.email,
        token: verificationToken,
      });
    }
    this.emit("verification_resent", "info", { userId: user.id });
    return isProduction ? { ok: true } : { ok: true, verificationToken };
  }

  async completeOnboarding(sessionId: string, raw: CompleteOnboardingInput | string): Promise<AuthResult> {
    const input =
      typeof raw === "string"
        ? CompleteOnboardingSchema.parse({
            workspaceName: raw,
            workspaceType: "general",
            primaryGoal: "Operate my intelligence command center",
          })
        : CompleteOnboardingSchema.parse(raw);

    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");

    const workspace = await this.repo.createWorkspace({
      id: randomUUID(),
      orgId: user.orgId,
      name: input.workspaceName.trim(),
      slug: slugify(input.workspaceName),
      workspaceType: input.workspaceType,
      primaryGoal: input.primaryGoal,
      archived: false,
      createdAt: Date.now(),
    });
    await this.repo.addWorkspaceMember(workspace.id, user.id);

    user.onboardingStage = "connect";
    user.onboardingComplete = false;
    await this.repo.updateUser(user);

    session.activeWorkspaceId = workspace.id;
    session.expiresAt = Date.now() + this.sessionTtlMs;
    await this.repo.saveSession(session);

    return { session, view: this.toView(user, session) };
  }

  async setOnboardingStage(sessionId: string, stage: OnboardingStage): Promise<AuthResult> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (user.onboardingComplete) throw new Error("Onboarding already complete");

    user.onboardingStage = stage;
    await this.repo.updateUser(user);

    if (session.activeWorkspaceId) {
      if (stage === "initializing") {
        await this.repo.updateWorkspaceStatus(session.activeWorkspaceId, {
          initializationInProgress: true,
          dataSourceConnected: true,
        });
      }
      if (stage === "complete") {
        await this.repo.updateWorkspaceStatus(session.activeWorkspaceId, {
          initializationInProgress: false,
          dataSourceConnected: true,
        });
      }
    }

    return { session, view: this.toView(user, session) };
  }

  async finishOnboarding(sessionId: string): Promise<AuthResult> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (!session.activeWorkspaceId) throw new Error("Workspace required before finishing onboarding");

    user.onboardingStage = "done";
    user.onboardingComplete = true;
    await this.repo.updateUser(user);

    return { session, view: this.toView(user, session) };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) throw new Error("Invalid email format");
    const user = await this.repo.findUserByEmail(normalized);
    if (user) {
      const token = randomBytes(24).toString("base64url");
      await this.repo.storePasswordResetToken(user.id, token);
      if (this.notifications) {
        await this.notifications.sendPasswordResetEmail({
          userId: user.id,
          orgId: user.orgId,
          recipient: user.email,
          token,
        });
      }
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    const userId = await this.repo.consumePasswordResetToken(token);
    if (!userId) throw new Error("Invalid or expired reset link");
    const user = await this.repo.findUserById(userId);
    if (!user) throw new Error("User not found");
    user.passwordHash = hashPassword(password);
    await this.repo.updateUser(user);
    await this.repo.revokeAllForUser(user.id);
  }

  async getInvitePreview(token: string): Promise<{ workspaceName: string; role: UserRole; inviterName: string }> {
    const invite = await this.repo.findInvite(token);
    if (!invite || invite.expiresAt < Date.now() || invite.consumed) {
      throw new Error("Invite expired or invalid");
    }
    const workspace = await this.repo.findWorkspace(invite.workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    return { workspaceName: workspace.name, role: invite.role, inviterName: invite.inviterName };
  }

  async acceptInvite(sessionId: string, token: string): Promise<AuthResult> {
    const invite = await this.repo.findInvite(token);
    if (!invite || invite.expiresAt < Date.now() || invite.consumed) {
      throw new Error("Invite expired or invalid");
    }
    const workspace = await this.repo.findWorkspace(invite.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");

    assertOrgAccess({ orgId: session.orgId }, workspace.orgId);

    session.activeWorkspaceId = workspace.id;
    await this.repo.saveSession(session);
    await this.repo.consumeInvite(token);
    this.emit("invite_accepted", "info", { workspaceId: workspace.id, userId: user.id });

    return { session, view: this.toView(user, session) };
  }

  async assertWorkspaceAccess(sessionId: string, workspaceId: string): Promise<SessionPublicView> {
    const session = await this.requireSession(sessionId);
    const workspace = await this.repo.findWorkspace(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    assertOrgAccess({ orgId: session.orgId }, workspace.orgId);

    if (session.activeWorkspaceId !== workspaceId) {
      session.activeWorkspaceId = workspaceId;
      await this.repo.saveSession(session);
    }

    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    return this.toView(user, session);
  }

  private async requireSession(sessionId: string): Promise<ServerSession> {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }

  private async createSession(
    user: UserRecord,
    activeWorkspaceId: string | null,
    authStrength: "password" | "mfa",
    deviceId?: string,
  ): Promise<ServerSession> {
    const session: ServerSession = {
      id: randomUUID(),
      userId: user.id,
      orgId: user.orgId,
      activeWorkspaceId,
      authStrength,
      deviceId: deviceId ?? randomUUID(),
      expiresAt: Date.now() + this.sessionTtlMs,
      revoked: false,
      createdAt: Date.now(),
    };
    await this.repo.saveSession(session);
    return session;
  }

  private toView(user: UserRecord, session: ServerSession): SessionPublicView {
    return {
      sessionId: session.id,
      userId: user.id,
      orgId: user.orgId,
      activeWorkspaceId: session.activeWorkspaceId,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      emailVerified: user.emailVerified,
      onboardingComplete: user.onboardingComplete,
      onboardingStage: user.onboardingStage,
      authStrength: session.authStrength,
    };
  }
}
