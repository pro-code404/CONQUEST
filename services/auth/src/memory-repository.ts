import { randomUUID } from "node:crypto";
import type {
  AiControlsView,
  AutomationPoliciesView,
  AuditCategory,
  AuditEventInput,
  BillingPlan,
  DataSourceView,
  ExecutionStatus,
  IntegrationView,
  MemoryControlsView,
  NotificationPreferences,
  SecurityPreferences,
  ThemePreference,
  TriggerType,
  UserPreferences,
  WorkflowSchedule,
  WorkflowStatus,
  WorkflowTrigger,
  WorkspaceGoalView,
} from "@conquest/contracts";
import {
  DEFAULT_AI_CONTROLS,
  DEFAULT_AUTOMATION_POLICIES,
  DEFAULT_MEMORY_CONTROLS,
  DEFAULT_SECURITY_PREFERENCES,
} from "@conquest/contracts";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@conquest/contracts";
import type {
  OrganizationRecord,
  ServerSession,
  UserRecord,
  CreateUserInput,
  WorkspaceIntelligenceStatus,
  WorkspaceRecord,
} from "./types.js";
import type { UserRole } from "@conquest/contracts";

export interface PrivacyRequestRecord {
  exportRequestedAt: number | null;
  deletionRequestedAt: number | null;
}

export interface BillingRecord {
  plan: BillingPlan;
  seatLimit: number;
  status: "active" | "past_due";
  renewalDate: number;
}

export interface TeamInviteRecord {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  inviterUserId: string;
  inviterName: string;
  token: string;
  expiresAt: number;
}

export interface OrgInviteRecord {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  inviterUserId: string;
  inviterName: string;
  token: string;
  expiresAt: number;
}

export interface WorkflowRecord {
  id: string;
  workspaceId: string;
  orgId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  enabled: boolean;
  archived: boolean;
  trigger: WorkflowTrigger;
  schedule: WorkflowSchedule | null;
  conditions: string[];
  actions: string[];
  createdBy: string;
  createdByName: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  workspaceId: string;
  orgId: string;
  status: ExecutionStatus;
  startedAt: number;
  completedAt: number | null;
  message: string;
  steps: Array<{ name: string; status: string; timestamp: number }>;
  triggeredBy: string;
  triggerType: TriggerType;
}

export interface AuditEventRecord {
  id: string;
  category: AuditCategory;
  action: string;
  actorId: string;
  actorName: string;
  resourceType: string;
  resourceId: string;
  workspaceId: string | null;
  orgId: string;
  summary: string;
  timestamp: number;
  metadata?: Record<string, string>;
}

export interface MfaRecord {
  pendingSecret: string | null;
  recoveryCodeHashes: string[];
}

export interface TrustedDeviceRecord {
  deviceId: string;
  label: string;
  trusted: boolean;
  lastSeenAt: number;
}

export interface DataSourceRecord {
  id: string;
  workspaceId: string;
  name: string;
  type: string;
  status: DataSourceView["status"];
  lastSyncAt: number | null;
}

export interface WorkspaceGoalRecord {
  id: string;
  workspaceId: string;
  title: string;
  status: WorkspaceGoalView["status"];
  progress: number;
}

export interface IntelligenceFeedItemRecord {
  id: string;
  workspaceId: string;
  category: "recommendation" | "opportunity" | "risk" | "insight" | "alert";
  title: string;
  summary: string;
  confidence: number;
  timestamp: number;
  status: "new" | "reviewed" | "dismissed";
}

export interface AdvisoryRecommendationRecord {
  id: string;
  workspaceId: string;
  orgId: string;
  title: string;
  summary: string;
  rationale: string;
  evidenceRefs: string[];
  priority: "low" | "medium" | "high" | "critical";
  confidence: number;
  status: "pending" | "approved" | "rejected" | "expired";
  recommendedActions: string[];
  approvalRequired: boolean;
  approvedBy: string | null;
  approvedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface ResearchSourceRecord {
  id: string;
  orgId: string;
  name: string;
  type: string;
  trusted: boolean;
}

export interface CitationRecord {
  sourceId: string;
  title: string;
  excerpt: string;
  retrievedAt: number;
}

export interface ResearchSessionRecord {
  id: string;
  workspaceId: string;
  orgId: string;
  title: string;
  status: "active" | "saved" | "archived";
  sources: ResearchSourceRecord[];
  citations: CitationRecord[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface SavedAnalyticsViewRecord {
  id: string;
  workspaceId: string;
  name: string;
  timeRange: "7d" | "30d" | "90d" | "ytd" | "custom";
  filters: Record<string, string>;
  createdAt: number;
}

export interface FeatureFlagRecord {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

/** In-memory persistence for dev/CI — replace with Drizzle repository for production. */
export class MemoryAuthRepository {
  readonly users = new Map<string, UserRecord>();
  readonly usersByEmail = new Map<string, string>();
  readonly orgs = new Map<string, OrganizationRecord>();
  readonly workspaces = new Map<string, WorkspaceRecord>();
  readonly sessions = new Map<string, ServerSession>();
  readonly verificationTokens = new Map<string, string>();
  readonly passwordResetTokens = new Map<string, string>();
  readonly preferences = new Map<string, UserPreferences>();
  readonly notificationPreferences = new Map<string, NotificationPreferences>();
  readonly privacyRequests = new Map<string, PrivacyRequestRecord>();
  readonly billingByOrg = new Map<string, BillingRecord>();
  readonly integrationsByOrg = new Map<string, IntegrationView[]>();
  readonly workspaceStatus = new Map<string, WorkspaceIntelligenceStatus>();
  readonly workspaceMembers = new Map<string, Set<string>>();
  readonly teamInvites = new Map<string, TeamInviteRecord>();
  readonly orgInvites = new Map<string, OrgInviteRecord>();
  readonly workflows = new Map<string, WorkflowRecord>();
  readonly executions = new Map<string, ExecutionRecord>();
  readonly auditEvents: AuditEventRecord[] = [];
  readonly mfaByUser = new Map<string, MfaRecord>();
  readonly trustedDevicesByUser = new Map<string, TrustedDeviceRecord[]>();
  readonly securityPreferencesByUser = new Map<string, SecurityPreferences>();
  readonly automationPoliciesByOrg = new Map<string, AutomationPoliciesView>();
  readonly aiControlsByUser = new Map<string, AiControlsView>();
  readonly memoryControlsByOrg = new Map<string, MemoryControlsView>();
  readonly dataSourcesByWorkspace = new Map<string, DataSourceRecord[]>();
  readonly goalsByWorkspace = new Map<string, WorkspaceGoalRecord[]>();
  readonly intelligenceFeedByWorkspace = new Map<string, IntelligenceFeedItemRecord[]>();
  readonly advisoriesByWorkspace = new Map<string, AdvisoryRecommendationRecord[]>();
  readonly researchSessions = new Map<string, ResearchSessionRecord>();
  readonly researchSourcesByOrg = new Map<string, ResearchSourceRecord[]>();
  readonly savedAnalyticsByWorkspace = new Map<string, SavedAnalyticsViewRecord[]>();
  readonly featureFlagsByOrg = new Map<string, FeatureFlagRecord[]>();
  readonly emailDeliveries: import("./email/types.js").EmailDeliveryRecord[] = [];
  readonly legalAcceptances = new Map<string, import("./types.js").LegalAcceptanceRecord[]>();
  readonly invites = new Map<
    string,
    { workspaceId: string; role: UserRole; inviterName: string; expiresAt: number; consumed: boolean }
  >();

  createOrg(name: string): OrganizationRecord {
    const org: OrganizationRecord = { id: randomUUID(), name, createdAt: Date.now() };
    this.orgs.set(org.id, org);
    this.billingByOrg.set(org.id, {
      plan: "starter",
      seatLimit: 10,
      status: "active",
      renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    this.integrationsByOrg.set(org.id, [
      {
        id: "int-slack",
        name: "Slack",
        type: "communication",
        status: "disconnected",
        connectedAt: null,
      },
      {
        id: "int-crm",
        name: "CRM Connector",
        type: "data",
        status: "disconnected",
        connectedAt: null,
      },
    ]);
    return org;
  }

  createUser(user: CreateUserInput): UserRecord {
    const record: UserRecord = {
      ...user,
      passwordChangedAt: user.passwordChangedAt ?? user.createdAt,
      mfaEnrolled: user.mfaEnrolled ?? false,
    };
    this.users.set(record.id, record);
    this.usersByEmail.set(record.email.toLowerCase(), record.id);
    return record;
  }

  findUserByEmail(email: string): UserRecord | null {
    const id = this.usersByEmail.get(email.toLowerCase());
    return id ? this.users.get(id) ?? null : null;
  }

  findUserById(id: string): UserRecord | null {
    return this.users.get(id) ?? null;
  }

  findOrg(orgId: string): OrganizationRecord | null {
    return this.orgs.get(orgId) ?? null;
  }

  deleteUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      this.usersByEmail.delete(user.email.toLowerCase());
    }
  }

  listUsersForOrg(orgId: string): UserRecord[] {
    return [...this.users.values()].filter((user) => user.orgId === orgId);
  }

  updateUser(user: UserRecord): void {
    this.users.set(user.id, user);
  }

  createWorkspace(workspace: WorkspaceRecord): WorkspaceRecord {
    this.workspaces.set(workspace.id, workspace);
    this.workspaceStatus.set(workspace.id, {
      dataSourceConnected: false,
      initializationInProgress: false,
      warningCount: 0,
      degradedZoneCount: 0,
      offline: false,
    });
    return workspace;
  }

  addWorkspaceMember(workspaceId: string, userId: string): void {
    const members = this.workspaceMembers.get(workspaceId) ?? new Set<string>();
    members.add(userId);
    this.workspaceMembers.set(workspaceId, members);
  }

  removeWorkspaceMember(workspaceId: string, userId: string): void {
    const members = this.workspaceMembers.get(workspaceId);
    if (members) {
      members.delete(userId);
      this.workspaceMembers.set(workspaceId, members);
    }
  }

  listWorkspaceMembers(workspaceId: string): UserRecord[] {
    const memberIds = this.workspaceMembers.get(workspaceId) ?? new Set<string>();
    return [...memberIds]
      .map((id) => this.findUserById(id))
      .filter((user): user is UserRecord => user !== null);
  }

  findWorkspace(id: string): WorkspaceRecord | null {
    return this.workspaces.get(id) ?? null;
  }

  updateWorkspace(workspace: WorkspaceRecord): void {
    this.workspaces.set(workspace.id, workspace);
  }

  listWorkspacesForOrg(orgId: string): WorkspaceRecord[] {
    return [...this.workspaces.values()].filter((w) => w.orgId === orgId);
  }

  getWorkspaceStatus(workspaceId: string): WorkspaceIntelligenceStatus {
    return (
      this.workspaceStatus.get(workspaceId) ?? {
        dataSourceConnected: false,
        initializationInProgress: false,
        warningCount: 0,
        degradedZoneCount: 0,
        offline: false,
      }
    );
  }

  updateWorkspaceStatus(workspaceId: string, patch: Partial<WorkspaceIntelligenceStatus>): WorkspaceIntelligenceStatus {
    const current = this.getWorkspaceStatus(workspaceId);
    const next = { ...current, ...patch };
    this.workspaceStatus.set(workspaceId, next);
    return next;
  }

  getPreferences(userId: string): UserPreferences {
    return (
      this.preferences.get(userId) ?? {
        theme: "system" as ThemePreference,
        emailDigest: true,
        quietHoursEnabled: false,
      }
    );
  }

  savePreferences(userId: string, preferences: UserPreferences): void {
    this.preferences.set(userId, preferences);
  }

  getNotificationPreferences(userId: string): NotificationPreferences {
    return this.notificationPreferences.get(userId) ?? { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }

  saveNotificationPreferences(userId: string, preferences: NotificationPreferences): void {
    this.notificationPreferences.set(userId, preferences);
  }

  getPrivacyRequests(userId: string): PrivacyRequestRecord {
    return (
      this.privacyRequests.get(userId) ?? {
        exportRequestedAt: null,
        deletionRequestedAt: null,
      }
    );
  }

  savePrivacyRequests(userId: string, record: PrivacyRequestRecord): void {
    this.privacyRequests.set(userId, record);
  }

  getBilling(orgId: string): BillingRecord {
    return (
      this.billingByOrg.get(orgId) ?? {
        plan: "starter",
        seatLimit: 10,
        status: "active",
        renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }
    );
  }

  listIntegrations(orgId: string): IntegrationView[] {
    return [...(this.integrationsByOrg.get(orgId) ?? [])];
  }

  saveIntegrations(orgId: string, integrations: IntegrationView[]): void {
    this.integrationsByOrg.set(orgId, integrations);
  }

  createTeamInvite(record: TeamInviteRecord): TeamInviteRecord {
    this.teamInvites.set(record.id, record);
    this.invites.set(record.token, {
      workspaceId: record.workspaceId,
      role: record.role,
      inviterName: record.inviterName,
      expiresAt: record.expiresAt,
      consumed: false,
    });
    return record;
  }

  listTeamInvites(workspaceId: string): TeamInviteRecord[] {
    return [...this.teamInvites.values()].filter(
      (invite) => invite.workspaceId === workspaceId && invite.expiresAt > Date.now(),
    );
  }

  createOrgInvite(record: OrgInviteRecord): OrgInviteRecord {
    this.orgInvites.set(record.id, record);
    return record;
  }

  listOrgInvites(orgId: string): OrgInviteRecord[] {
    return [...this.orgInvites.values()].filter(
      (invite) => invite.orgId === orgId && invite.expiresAt > Date.now(),
    );
  }

  listSessionsForUser(userId: string): ServerSession[] {
    const now = Date.now();
    return [...this.sessions.values()].filter(
      (session) => session.userId === userId && !session.revoked && session.expiresAt > now,
    );
  }

  saveWorkflow(workflow: WorkflowRecord): void {
    this.workflows.set(workflow.id, workflow);
  }

  findWorkflow(id: string): WorkflowRecord | null {
    return this.workflows.get(id) ?? null;
  }

  listWorkflowsForWorkspace(workspaceId: string): WorkflowRecord[] {
    return [...this.workflows.values()].filter(
      (workflow) => workflow.workspaceId === workspaceId && !workflow.archived,
    );
  }

  saveExecution(execution: ExecutionRecord): void {
    this.executions.set(execution.id, execution);
  }

  listExecutionsForWorkflow(workflowId: string): ExecutionRecord[] {
    return [...this.executions.values()]
      .filter((execution) => execution.workflowId === workflowId)
      .sort((a, b) => b.startedAt - a.startedAt);
  }

  saveSession(session: ServerSession): void {
    this.sessions.set(session.id, session);
  }

  updateSession(session: ServerSession): void {
    this.sessions.set(session.id, session);
  }

  findSession(id: string): ServerSession | null {
    return this.sessions.get(id) ?? null;
  }

  revokeSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.revoked = true;
      this.sessions.set(id, session);
    }
  }

  revokeAllForUser(userId: string): void {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId) {
        session.revoked = true;
        this.sessions.set(id, session);
      }
    }
  }

  revokeSessionsForUserDevice(userId: string, deviceId: string): void {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId && session.deviceId === deviceId) {
        session.revoked = true;
        this.sessions.set(id, session);
      }
    }
  }

  countActiveSessionsForOrg(orgId: string): number {
    const now = Date.now();
    return [...this.sessions.values()].filter(
      (s) => s.orgId === orgId && !s.revoked && s.expiresAt > now,
    ).length;
  }

  storeVerificationToken(userId: string, token: string): void {
    this.verificationTokens.set(token, userId);
  }

  consumeVerificationToken(token: string): string | null {
    const userId = this.verificationTokens.get(token) ?? null;
    if (userId) this.verificationTokens.delete(token);
    return userId;
  }

  storePasswordResetToken(userId: string, token: string): void {
    this.passwordResetTokens.set(token, userId);
  }

  consumePasswordResetToken(token: string): string | null {
    const userId = this.passwordResetTokens.get(token) ?? null;
    if (userId) this.passwordResetTokens.delete(token);
    return userId;
  }

  findInvite(token: string) {
    return this.invites.get(token) ?? null;
  }

  consumeInvite(token: string): void {
    const invite = this.invites.get(token);
    if (invite) {
      invite.consumed = true;
      this.invites.set(token, invite);
    }
  }

  appendAuditEvent(input: AuditEventInput): AuditEventRecord {
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
    this.auditEvents.unshift(event);
    return event;
  }

  listAuditEvents(orgId: string, filter?: { category?: AuditCategory; search?: string; workspaceId?: string; limit?: number }): AuditEventRecord[] {
    const limit = filter?.limit ?? 50;
    return this.auditEvents
      .filter((event) => event.orgId === orgId)
      .filter((event) => (filter?.category ? event.category === filter.category : true))
      .filter((event) => (filter?.workspaceId ? event.workspaceId === filter.workspaceId : true))
      .filter((event) =>
        filter?.search
          ? event.summary.toLowerCase().includes(filter.search.toLowerCase()) ||
            event.action.toLowerCase().includes(filter.search.toLowerCase())
          : true,
      )
      .slice(0, limit);
  }

  getMfa(userId: string): MfaRecord {
    return this.mfaByUser.get(userId) ?? { pendingSecret: null, recoveryCodeHashes: [] };
  }

  saveMfa(userId: string, record: MfaRecord): void {
    this.mfaByUser.set(userId, record);
  }

  getSecurityPreferences(userId: string): SecurityPreferences {
    return this.securityPreferencesByUser.get(userId) ?? DEFAULT_SECURITY_PREFERENCES;
  }

  saveSecurityPreferences(userId: string, prefs: SecurityPreferences): void {
    this.securityPreferencesByUser.set(userId, prefs);
  }

  listTrustedDevices(userId: string): TrustedDeviceRecord[] {
    return [...(this.trustedDevicesByUser.get(userId) ?? [])];
  }

  upsertTrustedDevice(userId: string, device: TrustedDeviceRecord): void {
    const devices = this.listTrustedDevices(userId).filter((d) => d.deviceId !== device.deviceId);
    devices.push(device);
    this.trustedDevicesByUser.set(userId, devices);
  }

  removeTrustedDevice(userId: string, deviceId: string): void {
    const devices = this.listTrustedDevices(userId).filter((d) => d.deviceId !== deviceId);
    this.trustedDevicesByUser.set(userId, devices);
  }

  getAutomationPolicies(orgId: string): AutomationPoliciesView {
    return this.automationPoliciesByOrg.get(orgId) ?? { ...DEFAULT_AUTOMATION_POLICIES };
  }

  saveAutomationPolicies(orgId: string, policies: AutomationPoliciesView): void {
    this.automationPoliciesByOrg.set(orgId, policies);
  }

  getAiControls(userId: string): AiControlsView {
    return this.aiControlsByUser.get(userId) ?? { ...DEFAULT_AI_CONTROLS };
  }

  saveAiControls(userId: string, controls: AiControlsView): void {
    this.aiControlsByUser.set(userId, controls);
  }

  getMemoryControls(orgId: string): MemoryControlsView {
    return this.memoryControlsByOrg.get(orgId) ?? { ...DEFAULT_MEMORY_CONTROLS };
  }

  saveMemoryControls(orgId: string, controls: MemoryControlsView): void {
    this.memoryControlsByOrg.set(orgId, controls);
  }

  listDataSources(workspaceId: string): DataSourceRecord[] {
    return [...(this.dataSourcesByWorkspace.get(workspaceId) ?? [])];
  }

  saveDataSources(workspaceId: string, sources: DataSourceRecord[]): void {
    this.dataSourcesByWorkspace.set(workspaceId, sources);
  }

  listGoals(workspaceId: string): WorkspaceGoalRecord[] {
    return [...(this.goalsByWorkspace.get(workspaceId) ?? [])];
  }

  saveGoals(workspaceId: string, goals: WorkspaceGoalRecord[]): void {
    this.goalsByWorkspace.set(workspaceId, goals);
  }

  listIntelligenceFeed(workspaceId: string): IntelligenceFeedItemRecord[] {
    return [...(this.intelligenceFeedByWorkspace.get(workspaceId) ?? [])];
  }

  saveIntelligenceFeed(workspaceId: string, items: IntelligenceFeedItemRecord[]): void {
    this.intelligenceFeedByWorkspace.set(workspaceId, items);
  }

  listAdvisories(workspaceId: string): AdvisoryRecommendationRecord[] {
    return [...(this.advisoriesByWorkspace.get(workspaceId) ?? [])];
  }

  saveAdvisories(workspaceId: string, items: AdvisoryRecommendationRecord[]): void {
    this.advisoriesByWorkspace.set(workspaceId, items);
  }

  findAdvisory(workspaceId: string, advisoryId: string): AdvisoryRecommendationRecord | null {
    return this.listAdvisories(workspaceId).find((item) => item.id === advisoryId) ?? null;
  }

  listResearchSessionsForWorkspace(workspaceId: string): ResearchSessionRecord[] {
    return [...this.researchSessions.values()].filter((session) => session.workspaceId === workspaceId);
  }

  findResearchSession(sessionId: string): ResearchSessionRecord | null {
    return this.researchSessions.get(sessionId) ?? null;
  }

  saveResearchSession(session: ResearchSessionRecord): void {
    this.researchSessions.set(session.id, session);
  }

  listResearchSources(orgId: string): ResearchSourceRecord[] {
    return [...(this.researchSourcesByOrg.get(orgId) ?? [])];
  }

  saveResearchSources(orgId: string, sources: ResearchSourceRecord[]): void {
    this.researchSourcesByOrg.set(orgId, sources);
  }

  listSavedAnalyticsViews(workspaceId: string): SavedAnalyticsViewRecord[] {
    return [...(this.savedAnalyticsByWorkspace.get(workspaceId) ?? [])];
  }

  saveSavedAnalyticsViews(workspaceId: string, views: SavedAnalyticsViewRecord[]): void {
    this.savedAnalyticsByWorkspace.set(workspaceId, views);
  }

  getFeatureFlags(orgId: string): FeatureFlagRecord[] {
    return [...(this.featureFlagsByOrg.get(orgId) ?? [])];
  }

  saveFeatureFlags(orgId: string, flags: FeatureFlagRecord[]): void {
    this.featureFlagsByOrg.set(orgId, flags);
  }

  recordEmailDelivery(record: import("./email/types.js").EmailDeliveryRecord): import("./email/types.js").EmailDeliveryRecord {
    this.emailDeliveries.push(record);
    return record;
  }

  listEmailDeliveries(filter: {
    userId?: string;
    orgId?: string;
    limit?: number;
  }): import("./email/types.js").EmailDeliveryRecord[] {
    const limit = filter.limit ?? 50;
    return this.emailDeliveries
      .filter((row) => (filter.userId ? row.userId === filter.userId : true))
      .filter((row) => (filter.orgId ? row.orgId === filter.orgId : true))
      .slice(-limit);
  }

  recordLegalAcceptance(record: import("./types.js").LegalAcceptanceRecord): import("./types.js").LegalAcceptanceRecord {
    const list = this.legalAcceptances.get(record.userId) ?? [];
    const without = list.filter(
      (row) => !(row.documentType === record.documentType && row.documentVersion === record.documentVersion),
    );
    without.push(record);
    this.legalAcceptances.set(record.userId, without);
    return record;
  }

  listLegalAcceptances(userId: string): import("./types.js").LegalAcceptanceRecord[] {
    return [...(this.legalAcceptances.get(userId) ?? [])];
  }

  hasLegalAcceptance(userId: string, documentType: string, documentVersion: string): boolean {
    return this.listLegalAcceptances(userId).some(
      (row) => row.documentType === documentType && row.documentVersion === documentVersion,
    );
  }
}
