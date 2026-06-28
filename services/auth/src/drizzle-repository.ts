import { randomUUID } from "node:crypto";
import {
  and,
  desc,
  eq,
  gt,
  sql,
} from "drizzle-orm";
import type { ConquestDatabase } from "@conquest/database";
import {
  authDomainAuditEvents,
  authEmailDeliveries,
  authExecutions,
  authLegalAcceptances,
  authOrgInvites,
  authOrgs,
  authResearchSessions,
  authScopedDocuments,
  authServerSessions,
  authTeamInvites,
  authTokens,
  authUsers,
  authWorkflows,
  authWorkspaceMembers,
  authWorkspaces,
} from "@conquest/database";
import type {
  AiControlsView,
  AutomationPoliciesView,
  AuditCategory,
  AuditEventInput,
  IntegrationView,
  MemoryControlsView,
  NotificationPreferences,
  SecurityPreferences,
  ThemePreference,
  UserPreferences,
} from "@conquest/contracts";
import {
  DEFAULT_AI_CONTROLS,
  DEFAULT_AUTOMATION_POLICIES,
  DEFAULT_MEMORY_CONTROLS,
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_SECURITY_PREFERENCES,
} from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";
import type {
  AdvisoryRecommendationRecord,
  AuditEventRecord,
  BillingRecord,
  DataSourceRecord,
  ExecutionRecord,
  FeatureFlagRecord,
  IntelligenceFeedItemRecord,
  MfaRecord,
  OrgInviteRecord,
  PrivacyRequestRecord,
  ResearchSessionRecord,
  ResearchSourceRecord,
  SavedAnalyticsViewRecord,
  TeamInviteRecord,
  TrustedDeviceRecord,
  WorkflowRecord,
  WorkspaceGoalRecord,
} from "./memory-repository.js";
import type {
  CreateUserInput,
  LegalAcceptanceRecord,
  OrganizationRecord,
  ServerSession,
  UserRecord,
  WorkspaceIntelligenceStatus,
  WorkspaceRecord,
} from "./types.js";
import type { EmailDeliveryRecord } from "./email/types.js";

type ScopeType = "user" | "org" | "workspace";

const DEFAULT_WORKSPACE_STATUS: WorkspaceIntelligenceStatus = {
  dataSourceConnected: false,
  initializationInProgress: false,
  warningCount: 0,
  degradedZoneCount: 0,
  offline: false,
};

function mapUser(row: typeof authUsers.$inferSelect): UserRecord {
  return {
    id: row.id,
    orgId: row.orgId,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role as UserRecord["role"],
    emailVerified: row.emailVerified,
    onboardingComplete: row.onboardingComplete,
    onboardingStage: row.onboardingStage as UserRecord["onboardingStage"],
    displayName: row.displayName,
    createdAt: row.createdAt,
    passwordChangedAt: row.passwordChangedAt,
    mfaEnrolled: row.mfaEnrolled,
  };
}

function mapSession(row: typeof authServerSessions.$inferSelect): ServerSession {
  return {
    id: row.id,
    userId: row.userId,
    orgId: row.orgId,
    activeWorkspaceId: row.activeWorkspaceId,
    authStrength: row.authStrength as ServerSession["authStrength"],
    deviceId: row.deviceId,
    expiresAt: row.expiresAt,
    revoked: row.revoked,
    createdAt: row.createdAt,
  };
}

function mapWorkspace(row: typeof authWorkspaces.$inferSelect): WorkspaceRecord {
  return {
    id: row.id,
    orgId: row.orgId,
    name: row.name,
    slug: row.slug,
    workspaceType: row.workspaceType,
    primaryGoal: row.primaryGoal,
    archived: row.archived,
    createdAt: row.createdAt,
  };
}

/** Postgres-backed auth repository — B2-M2 Slice 2A. */
export class DrizzleAuthRepository implements AuthRepository {
  constructor(private readonly db: ConquestDatabase) {}

  private async getDoc<T>(scopeType: ScopeType, scopeId: string, documentKey: string): Promise<T | null> {
    const rows = await this.db
      .select()
      .from(authScopedDocuments)
      .where(
        and(
          eq(authScopedDocuments.scopeType, scopeType),
          eq(authScopedDocuments.scopeId, scopeId),
          eq(authScopedDocuments.documentKey, documentKey),
        ),
      )
      .limit(1);
    return rows[0] ? (rows[0].data as T) : null;
  }

  private async setDoc(scopeType: ScopeType, scopeId: string, documentKey: string, data: unknown): Promise<void> {
    const now = Date.now();
    await this.db
      .insert(authScopedDocuments)
      .values({
        scopeType,
        scopeId,
        documentKey,
        data,
        version: 1,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [authScopedDocuments.scopeType, authScopedDocuments.scopeId, authScopedDocuments.documentKey],
        set: {
          data,
          version: sql`${authScopedDocuments.version} + 1`,
          updatedAt: now,
        },
      });
  }

  async createOrg(name: string): Promise<OrganizationRecord> {
    const org: OrganizationRecord = { id: randomUUID(), name, createdAt: Date.now() };
    await this.db.insert(authOrgs).values(org);
    await this.setDoc("org", org.id, "billing", {
      plan: "starter",
      seatLimit: 10,
      status: "active",
      renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    } satisfies BillingRecord);
    await this.setDoc("org", org.id, "integrations", [
      { id: "int-slack", name: "Slack", type: "communication", status: "disconnected", connectedAt: null },
      { id: "int-crm", name: "CRM Connector", type: "data", status: "disconnected", connectedAt: null },
    ] satisfies IntegrationView[]);
    return org;
  }

  async findOrg(orgId: string): Promise<OrganizationRecord | null> {
    const rows = await this.db.select().from(authOrgs).where(eq(authOrgs.id, orgId)).limit(1);
    return rows[0] ?? null;
  }

  async createUser(user: CreateUserInput): Promise<UserRecord> {
    const record: UserRecord = {
      ...user,
      passwordChangedAt: user.passwordChangedAt ?? user.createdAt,
      mfaEnrolled: user.mfaEnrolled ?? false,
    };
    await this.db.insert(authUsers).values({
      id: record.id,
      orgId: record.orgId,
      email: record.email.toLowerCase(),
      passwordHash: record.passwordHash,
      role: record.role,
      emailVerified: record.emailVerified,
      onboardingComplete: record.onboardingComplete,
      onboardingStage: record.onboardingStage,
      displayName: record.displayName,
      createdAt: record.createdAt,
      passwordChangedAt: record.passwordChangedAt,
      mfaEnrolled: record.mfaEnrolled,
    });
    return record;
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const rows = await this.db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email.toLowerCase()))
      .limit(1);
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    const rows = await this.db.select().from(authUsers).where(eq(authUsers.id, id)).limit(1);
    return rows[0] ? mapUser(rows[0]) : null;
  }

  async listUsersForOrg(orgId: string): Promise<UserRecord[]> {
    const rows = await this.db.select().from(authUsers).where(eq(authUsers.orgId, orgId));
    return rows.map(mapUser);
  }

  async updateUser(user: UserRecord): Promise<void> {
    await this.db
      .update(authUsers)
      .set({
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash,
        role: user.role,
        emailVerified: user.emailVerified,
        onboardingComplete: user.onboardingComplete,
        onboardingStage: user.onboardingStage,
        displayName: user.displayName,
        passwordChangedAt: user.passwordChangedAt,
        mfaEnrolled: user.mfaEnrolled,
      })
      .where(eq(authUsers.id, user.id));
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.delete(authUsers).where(eq(authUsers.id, userId));
  }

  async createWorkspace(workspace: WorkspaceRecord): Promise<WorkspaceRecord> {
    await this.db.insert(authWorkspaces).values({
      id: workspace.id,
      orgId: workspace.orgId,
      name: workspace.name,
      slug: workspace.slug,
      workspaceType: workspace.workspaceType,
      primaryGoal: workspace.primaryGoal,
      archived: workspace.archived,
      createdAt: workspace.createdAt,
    });
    await this.setDoc("workspace", workspace.id, "status", DEFAULT_WORKSPACE_STATUS);
    return workspace;
  }

  async findWorkspace(id: string): Promise<WorkspaceRecord | null> {
    const rows = await this.db.select().from(authWorkspaces).where(eq(authWorkspaces.id, id)).limit(1);
    return rows[0] ? mapWorkspace(rows[0]) : null;
  }

  async updateWorkspace(workspace: WorkspaceRecord): Promise<void> {
    await this.db
      .update(authWorkspaces)
      .set({
        name: workspace.name,
        slug: workspace.slug,
        workspaceType: workspace.workspaceType,
        primaryGoal: workspace.primaryGoal,
        archived: workspace.archived,
      })
      .where(eq(authWorkspaces.id, workspace.id));
  }

  async listWorkspacesForOrg(orgId: string): Promise<WorkspaceRecord[]> {
    const rows = await this.db.select().from(authWorkspaces).where(eq(authWorkspaces.orgId, orgId));
    return rows.map(mapWorkspace);
  }

  async addWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    await this.db
      .insert(authWorkspaceMembers)
      .values({ workspaceId, userId })
      .onConflictDoNothing();
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    await this.db
      .delete(authWorkspaceMembers)
      .where(and(eq(authWorkspaceMembers.workspaceId, workspaceId), eq(authWorkspaceMembers.userId, userId)));
  }

  async listWorkspaceMembers(workspaceId: string): Promise<UserRecord[]> {
    const members = await this.db
      .select({ user: authUsers })
      .from(authWorkspaceMembers)
      .innerJoin(authUsers, eq(authWorkspaceMembers.userId, authUsers.id))
      .where(eq(authWorkspaceMembers.workspaceId, workspaceId));
    return members.map((row) => mapUser(row.user));
  }

  async getWorkspaceStatus(workspaceId: string): Promise<WorkspaceIntelligenceStatus> {
    return (await this.getDoc<WorkspaceIntelligenceStatus>("workspace", workspaceId, "status")) ?? {
      ...DEFAULT_WORKSPACE_STATUS,
    };
  }

  async updateWorkspaceStatus(
    workspaceId: string,
    patch: Partial<WorkspaceIntelligenceStatus>,
  ): Promise<WorkspaceIntelligenceStatus> {
    const current = await this.getWorkspaceStatus(workspaceId);
    const next = { ...current, ...patch };
    await this.setDoc("workspace", workspaceId, "status", next);
    return next;
  }

  async saveSession(session: ServerSession): Promise<void> {
    await this.db
      .insert(authServerSessions)
      .values({
        id: session.id,
        userId: session.userId,
        orgId: session.orgId,
        activeWorkspaceId: session.activeWorkspaceId,
        authStrength: session.authStrength,
        deviceId: session.deviceId,
        expiresAt: session.expiresAt,
        revoked: session.revoked,
        createdAt: session.createdAt,
      })
      .onConflictDoUpdate({
        target: authServerSessions.id,
        set: {
          activeWorkspaceId: session.activeWorkspaceId,
          authStrength: session.authStrength,
          expiresAt: session.expiresAt,
          revoked: session.revoked,
        },
      });
  }

  async findSession(id: string): Promise<ServerSession | null> {
    const rows = await this.db.select().from(authServerSessions).where(eq(authServerSessions.id, id)).limit(1);
    return rows[0] ? mapSession(rows[0]) : null;
  }

  async updateSession(session: ServerSession): Promise<void> {
    await this.saveSession(session);
  }

  async revokeSession(id: string): Promise<void> {
    await this.db.update(authServerSessions).set({ revoked: true }).where(eq(authServerSessions.id, id));
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db.update(authServerSessions).set({ revoked: true }).where(eq(authServerSessions.userId, userId));
  }

  async revokeSessionsForUserDevice(userId: string, deviceId: string): Promise<void> {
    await this.db
      .update(authServerSessions)
      .set({ revoked: true })
      .where(and(eq(authServerSessions.userId, userId), eq(authServerSessions.deviceId, deviceId)));
  }

  async listSessionsForUser(userId: string): Promise<ServerSession[]> {
    const now = Date.now();
    const rows = await this.db
      .select()
      .from(authServerSessions)
      .where(
        and(
          eq(authServerSessions.userId, userId),
          eq(authServerSessions.revoked, false),
          gt(authServerSessions.expiresAt, now),
        ),
      );
    return rows.map(mapSession);
  }

  async countActiveSessionsForOrg(orgId: string): Promise<number> {
    const now = Date.now();
    const rows = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(authServerSessions)
      .where(
        and(
          eq(authServerSessions.orgId, orgId),
          eq(authServerSessions.revoked, false),
          gt(authServerSessions.expiresAt, now),
        ),
      );
    return rows[0]?.count ?? 0;
  }

  async storeVerificationToken(userId: string, token: string): Promise<void> {
    await this.db.insert(authTokens).values({ token, tokenType: "verification", subjectId: userId, consumed: false });
  }

  async consumeVerificationToken(token: string): Promise<string | null> {
    const rows = await this.db.select().from(authTokens).where(eq(authTokens.token, token)).limit(1);
    const row = rows[0];
    if (!row || row.consumed || row.tokenType !== "verification" || !row.subjectId) return null;
    await this.db.update(authTokens).set({ consumed: true }).where(eq(authTokens.token, token));
    return row.subjectId;
  }

  async storePasswordResetToken(userId: string, token: string): Promise<void> {
    await this.db.insert(authTokens).values({ token, tokenType: "password_reset", subjectId: userId, consumed: false });
  }

  async consumePasswordResetToken(token: string): Promise<string | null> {
    const rows = await this.db.select().from(authTokens).where(eq(authTokens.token, token)).limit(1);
    const row = rows[0];
    if (!row || row.consumed || row.tokenType !== "password_reset" || !row.subjectId) return null;
    await this.db.update(authTokens).set({ consumed: true }).where(eq(authTokens.token, token));
    return row.subjectId;
  }

  async findInvite(token: string) {
    const rows = await this.db.select().from(authTokens).where(eq(authTokens.token, token)).limit(1);
    const row = rows[0];
    if (!row || row.tokenType !== "workspace_invite" || !row.payload) return null;
    const payload = row.payload as {
      workspaceId: string;
      role: import("@conquest/contracts").UserRole;
      inviterName: string;
      expiresAt: number;
      consumed: boolean;
    };
    return payload;
  }

  async consumeInvite(token: string): Promise<void> {
    const invite = await this.findInvite(token);
    if (!invite) return;
    await this.db
      .update(authTokens)
      .set({
        consumed: true,
        payload: { ...invite, consumed: true },
      })
      .where(eq(authTokens.token, token));
  }

  async createTeamInvite(record: TeamInviteRecord): Promise<TeamInviteRecord> {
    await this.db.insert(authTeamInvites).values(record);
    await this.db.insert(authTokens).values({
      token: record.token,
      tokenType: "workspace_invite",
      payload: {
        workspaceId: record.workspaceId,
        role: record.role,
        inviterName: record.inviterName,
        expiresAt: record.expiresAt,
        consumed: false,
      },
      expiresAt: record.expiresAt,
      consumed: false,
    });
    return record;
  }

  async listTeamInvites(workspaceId: string): Promise<TeamInviteRecord[]> {
    const now = Date.now();
    const rows = await this.db
      .select()
      .from(authTeamInvites)
      .where(and(eq(authTeamInvites.workspaceId, workspaceId), gt(authTeamInvites.expiresAt, now)));
    return rows.map((row) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      email: row.email,
      role: row.role as TeamInviteRecord["role"],
      inviterUserId: row.inviterUserId,
      inviterName: row.inviterName,
      token: row.token,
      expiresAt: row.expiresAt,
    }));
  }

  async createOrgInvite(record: OrgInviteRecord): Promise<OrgInviteRecord> {
    await this.db.insert(authOrgInvites).values(record);
    return record;
  }

  async listOrgInvites(orgId: string): Promise<OrgInviteRecord[]> {
    const now = Date.now();
    const rows = await this.db
      .select()
      .from(authOrgInvites)
      .where(and(eq(authOrgInvites.orgId, orgId), gt(authOrgInvites.expiresAt, now)));
    return rows.map((row) => ({
      id: row.id,
      orgId: row.orgId,
      email: row.email,
      role: row.role as OrgInviteRecord["role"],
      inviterUserId: row.inviterUserId,
      inviterName: row.inviterName,
      token: row.token,
      expiresAt: row.expiresAt,
    }));
  }

  // Settings — scoped documents
  async getPreferences(userId: string): Promise<UserPreferences> {
    return (
      (await this.getDoc<UserPreferences>("user", userId, "preferences")) ?? {
        theme: "system" as ThemePreference,
        emailDigest: true,
        quietHoursEnabled: false,
      }
    );
  }

  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    await this.setDoc("user", userId, "preferences", preferences);
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    return (
      (await this.getDoc<NotificationPreferences>("user", userId, "notification_preferences")) ?? {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
      }
    );
  }

  async saveNotificationPreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    await this.setDoc("user", userId, "notification_preferences", preferences);
  }

  async getPrivacyRequests(userId: string): Promise<PrivacyRequestRecord> {
    return (
      (await this.getDoc<PrivacyRequestRecord>("user", userId, "privacy_requests")) ?? {
        exportRequestedAt: null,
        deletionRequestedAt: null,
      }
    );
  }

  async savePrivacyRequests(userId: string, record: PrivacyRequestRecord): Promise<void> {
    await this.setDoc("user", userId, "privacy_requests", record);
  }

  async getBilling(orgId: string): Promise<BillingRecord> {
    return (
      (await this.getDoc<BillingRecord>("org", orgId, "billing")) ?? {
        plan: "starter",
        seatLimit: 10,
        status: "active",
        renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }
    );
  }

  async listIntegrations(orgId: string): Promise<IntegrationView[]> {
    return [...((await this.getDoc<IntegrationView[]>("org", orgId, "integrations")) ?? [])];
  }

  async saveIntegrations(orgId: string, integrations: IntegrationView[]): Promise<void> {
    await this.setDoc("org", orgId, "integrations", integrations);
  }

  async getAutomationPolicies(orgId: string): Promise<AutomationPoliciesView> {
    return (await this.getDoc<AutomationPoliciesView>("org", orgId, "automation_policies")) ?? {
      ...DEFAULT_AUTOMATION_POLICIES,
    };
  }

  async saveAutomationPolicies(orgId: string, policies: AutomationPoliciesView): Promise<void> {
    await this.setDoc("org", orgId, "automation_policies", policies);
  }

  async getAiControls(userId: string): Promise<AiControlsView> {
    return (await this.getDoc<AiControlsView>("user", userId, "ai_controls")) ?? { ...DEFAULT_AI_CONTROLS };
  }

  async saveAiControls(userId: string, controls: AiControlsView): Promise<void> {
    await this.setDoc("user", userId, "ai_controls", controls);
  }

  async getMemoryControls(orgId: string): Promise<MemoryControlsView> {
    return (await this.getDoc<MemoryControlsView>("org", orgId, "memory_controls")) ?? {
      ...DEFAULT_MEMORY_CONTROLS,
    };
  }

  async saveMemoryControls(orgId: string, controls: MemoryControlsView): Promise<void> {
    await this.setDoc("org", orgId, "memory_controls", controls);
  }

  async getFeatureFlags(orgId: string): Promise<FeatureFlagRecord[]> {
    return [...((await this.getDoc<FeatureFlagRecord[]>("org", orgId, "feature_flags")) ?? [])];
  }

  async saveFeatureFlags(orgId: string, flags: FeatureFlagRecord[]): Promise<void> {
    await this.setDoc("org", orgId, "feature_flags", flags);
  }

  async getMfa(userId: string): Promise<MfaRecord> {
    return (await this.getDoc<MfaRecord>("user", userId, "mfa")) ?? { pendingSecret: null, recoveryCodeHashes: [] };
  }

  async saveMfa(userId: string, record: MfaRecord): Promise<void> {
    await this.setDoc("user", userId, "mfa", record);
  }

  async getSecurityPreferences(userId: string): Promise<SecurityPreferences> {
    return (await this.getDoc<SecurityPreferences>("user", userId, "security_preferences")) ?? {
      ...DEFAULT_SECURITY_PREFERENCES,
    };
  }

  async saveSecurityPreferences(userId: string, prefs: SecurityPreferences): Promise<void> {
    await this.setDoc("user", userId, "security_preferences", prefs);
  }

  async listTrustedDevices(userId: string): Promise<TrustedDeviceRecord[]> {
    return [...((await this.getDoc<TrustedDeviceRecord[]>("user", userId, "trusted_devices")) ?? [])];
  }

  async upsertTrustedDevice(userId: string, device: TrustedDeviceRecord): Promise<void> {
    const devices = (await this.listTrustedDevices(userId)).filter((d) => d.deviceId !== device.deviceId);
    devices.push(device);
    await this.setDoc("user", userId, "trusted_devices", devices);
  }

  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    const devices = (await this.listTrustedDevices(userId)).filter((d) => d.deviceId !== deviceId);
    await this.setDoc("user", userId, "trusted_devices", devices);
  }

  async saveWorkflow(workflow: WorkflowRecord): Promise<void> {
    await this.db
      .insert(authWorkflows)
      .values({
        id: workflow.id,
        workspaceId: workflow.workspaceId,
        orgId: workflow.orgId,
        data: workflow,
        archived: workflow.archived,
        updatedAt: workflow.updatedAt,
      })
      .onConflictDoUpdate({
        target: authWorkflows.id,
        set: { data: workflow, archived: workflow.archived, updatedAt: workflow.updatedAt },
      });
  }

  async findWorkflow(id: string): Promise<WorkflowRecord | null> {
    const rows = await this.db.select().from(authWorkflows).where(eq(authWorkflows.id, id)).limit(1);
    return rows[0] ? (rows[0].data as WorkflowRecord) : null;
  }

  async listWorkflowsForWorkspace(workspaceId: string): Promise<WorkflowRecord[]> {
    const rows = await this.db
      .select()
      .from(authWorkflows)
      .where(and(eq(authWorkflows.workspaceId, workspaceId), eq(authWorkflows.archived, false)));
    return rows.map((row) => row.data as WorkflowRecord);
  }

  async saveExecution(execution: ExecutionRecord): Promise<void> {
    await this.db.insert(authExecutions).values({
      id: execution.id,
      workflowId: execution.workflowId,
      workspaceId: execution.workspaceId,
      orgId: execution.orgId,
      data: execution,
      startedAt: execution.startedAt,
    });
  }

  async listExecutionsForWorkflow(workflowId: string): Promise<ExecutionRecord[]> {
    const rows = await this.db
      .select()
      .from(authExecutions)
      .where(eq(authExecutions.workflowId, workflowId))
      .orderBy(desc(authExecutions.startedAt));
    return rows.map((row) => row.data as ExecutionRecord);
  }

  async listIntelligenceFeed(workspaceId: string): Promise<IntelligenceFeedItemRecord[]> {
    return [...((await this.getDoc<IntelligenceFeedItemRecord[]>("workspace", workspaceId, "intelligence_feed")) ?? [])];
  }

  async saveIntelligenceFeed(workspaceId: string, items: IntelligenceFeedItemRecord[]): Promise<void> {
    await this.setDoc("workspace", workspaceId, "intelligence_feed", items);
  }

  async listAdvisories(workspaceId: string): Promise<AdvisoryRecommendationRecord[]> {
    return [...((await this.getDoc<AdvisoryRecommendationRecord[]>("workspace", workspaceId, "advisories")) ?? [])];
  }

  async saveAdvisories(workspaceId: string, items: AdvisoryRecommendationRecord[]): Promise<void> {
    await this.setDoc("workspace", workspaceId, "advisories", items);
  }

  async findAdvisory(workspaceId: string, advisoryId: string): Promise<AdvisoryRecommendationRecord | null> {
    const items = await this.listAdvisories(workspaceId);
    return items.find((item) => item.id === advisoryId) ?? null;
  }

  async listResearchSessionsForWorkspace(workspaceId: string): Promise<ResearchSessionRecord[]> {
    const rows = await this.db
      .select()
      .from(authResearchSessions)
      .where(eq(authResearchSessions.workspaceId, workspaceId));
    return rows.map((row) => row.data as ResearchSessionRecord);
  }

  async findResearchSession(sessionId: string): Promise<ResearchSessionRecord | null> {
    const rows = await this.db
      .select()
      .from(authResearchSessions)
      .where(eq(authResearchSessions.id, sessionId))
      .limit(1);
    return rows[0] ? (rows[0].data as ResearchSessionRecord) : null;
  }

  async saveResearchSession(session: ResearchSessionRecord): Promise<void> {
    await this.db
      .insert(authResearchSessions)
      .values({
        id: session.id,
        workspaceId: session.workspaceId,
        orgId: session.orgId,
        data: session,
        updatedAt: session.updatedAt,
      })
      .onConflictDoUpdate({
        target: authResearchSessions.id,
        set: { data: session, updatedAt: session.updatedAt },
      });
  }

  async listResearchSources(orgId: string): Promise<ResearchSourceRecord[]> {
    return [...((await this.getDoc<ResearchSourceRecord[]>("org", orgId, "research_sources")) ?? [])];
  }

  async saveResearchSources(orgId: string, sources: ResearchSourceRecord[]): Promise<void> {
    await this.setDoc("org", orgId, "research_sources", sources);
  }

  async listSavedAnalyticsViews(workspaceId: string): Promise<SavedAnalyticsViewRecord[]> {
    return [...((await this.getDoc<SavedAnalyticsViewRecord[]>("workspace", workspaceId, "saved_analytics")) ?? [])];
  }

  async saveSavedAnalyticsViews(workspaceId: string, views: SavedAnalyticsViewRecord[]): Promise<void> {
    await this.setDoc("workspace", workspaceId, "saved_analytics", views);
  }

  async listDataSources(workspaceId: string): Promise<DataSourceRecord[]> {
    return [...((await this.getDoc<DataSourceRecord[]>("workspace", workspaceId, "data_sources")) ?? [])];
  }

  async saveDataSources(workspaceId: string, sources: DataSourceRecord[]): Promise<void> {
    await this.setDoc("workspace", workspaceId, "data_sources", sources);
  }

  async listGoals(workspaceId: string): Promise<WorkspaceGoalRecord[]> {
    return [...((await this.getDoc<WorkspaceGoalRecord[]>("workspace", workspaceId, "goals")) ?? [])];
  }

  async saveGoals(workspaceId: string, goals: WorkspaceGoalRecord[]): Promise<void> {
    await this.setDoc("workspace", workspaceId, "goals", goals);
  }

  async appendAuditEvent(input: AuditEventInput): Promise<AuditEventRecord> {
    const event: AuditEventRecord = {
      id: randomUUID(),
      category: input.category,
      action: input.action,
      actorId: input.actorId,
      actorName: input.actorName,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      workspaceId: input.workspaceId ?? null,
      orgId: input.orgId,
      summary: input.summary,
      timestamp: Date.now(),
      ...(input.metadata ? { metadata: input.metadata } : {}),
    };
    await this.db.insert(authDomainAuditEvents).values({
      id: event.id,
      orgId: event.orgId,
      workspaceId: event.workspaceId,
      data: event,
      timestamp: event.timestamp,
      category: event.category,
    });
    return event;
  }

  async listAuditEvents(
    orgId: string,
    filter?: { category?: AuditCategory; search?: string; workspaceId?: string; limit?: number },
  ): Promise<AuditEventRecord[]> {
    const limit = filter?.limit ?? 50;
    const conditions = [eq(authDomainAuditEvents.orgId, orgId)];
    if (filter?.category) conditions.push(eq(authDomainAuditEvents.category, filter.category));
    if (filter?.workspaceId) conditions.push(eq(authDomainAuditEvents.workspaceId, filter.workspaceId));

    let rows = await this.db
      .select()
      .from(authDomainAuditEvents)
      .where(and(...conditions))
      .orderBy(desc(authDomainAuditEvents.timestamp))
      .limit(limit * 3);

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter((row) => {
        const event = row.data as AuditEventRecord;
        return event.summary.toLowerCase().includes(q) || event.action.toLowerCase().includes(q);
      });
    }

    return rows.slice(0, limit).map((row) => row.data as AuditEventRecord);
  }

  async recordEmailDelivery(record: EmailDeliveryRecord): Promise<EmailDeliveryRecord> {
    await this.db.insert(authEmailDeliveries).values({
      id: record.id,
      orgId: record.orgId,
      userId: record.userId,
      emailType: record.emailType,
      recipient: record.recipient,
      status: record.status,
      provider: record.provider,
      providerMessageId: record.providerMessageId,
      errorMessage: record.errorMessage,
      createdAt: record.createdAt,
    });
    return record;
  }

  async listEmailDeliveries(filter: {
    userId?: string;
    orgId?: string;
    limit?: number;
  }): Promise<EmailDeliveryRecord[]> {
    const limit = filter.limit ?? 50;
    const conditions = [];
    if (filter.userId) conditions.push(eq(authEmailDeliveries.userId, filter.userId));
    if (filter.orgId) conditions.push(eq(authEmailDeliveries.orgId, filter.orgId));
    const rows = await (conditions.length > 0
      ? this.db
          .select()
          .from(authEmailDeliveries)
          .where(and(...conditions))
          .orderBy(desc(authEmailDeliveries.createdAt))
          .limit(limit)
      : this.db.select().from(authEmailDeliveries).orderBy(desc(authEmailDeliveries.createdAt)).limit(limit));
    return rows.map((row) => ({
      id: row.id,
      orgId: row.orgId,
      userId: row.userId,
      emailType: row.emailType as EmailDeliveryRecord["emailType"],
      recipient: row.recipient,
      status: row.status as EmailDeliveryRecord["status"],
      provider: row.provider,
      providerMessageId: row.providerMessageId,
      errorMessage: row.errorMessage,
      createdAt: row.createdAt,
    }));
  }

  async recordLegalAcceptance(record: LegalAcceptanceRecord): Promise<LegalAcceptanceRecord> {
    await this.db
      .insert(authLegalAcceptances)
      .values({
        id: record.id,
        userId: record.userId,
        documentType: record.documentType,
        documentVersion: record.documentVersion,
        acceptedAt: record.acceptedAt,
        ipAddress: record.ipAddress ?? null,
        userAgent: record.userAgent ?? null,
      })
      .onConflictDoUpdate({
        target: [authLegalAcceptances.userId, authLegalAcceptances.documentType, authLegalAcceptances.documentVersion],
        set: {
          acceptedAt: record.acceptedAt,
          ipAddress: record.ipAddress ?? null,
          userAgent: record.userAgent ?? null,
        },
      });
    return record;
  }

  async listLegalAcceptances(userId: string): Promise<LegalAcceptanceRecord[]> {
    const rows = await this.db
      .select()
      .from(authLegalAcceptances)
      .where(eq(authLegalAcceptances.userId, userId))
      .orderBy(desc(authLegalAcceptances.acceptedAt));
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      documentType: row.documentType,
      documentVersion: row.documentVersion,
      acceptedAt: row.acceptedAt,
      ...(row.ipAddress ? { ipAddress: row.ipAddress } : {}),
      ...(row.userAgent ? { userAgent: row.userAgent } : {}),
    }));
  }

  async hasLegalAcceptance(userId: string, documentType: string, documentVersion: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: authLegalAcceptances.id })
      .from(authLegalAcceptances)
      .where(
        and(
          eq(authLegalAcceptances.userId, userId),
          eq(authLegalAcceptances.documentType, documentType),
          eq(authLegalAcceptances.documentVersion, documentVersion),
        ),
      )
      .limit(1);
    return rows.length > 0;
  }
}
