import type {
  AiControlsView,
  AutomationPoliciesView,
  AuditCategory,
  AuditEventInput,
  IntegrationView,
  MemoryControlsView,
  NotificationPreferences,
  SecurityPreferences,
  UserPreferences,
} from "@conquest/contracts";
import type {
  OrganizationRecord,
  ServerSession,
  UserRecord,
  CreateUserInput,
  WorkspaceIntelligenceStatus,
  WorkspaceRecord,
} from "./types.js";
import type {
  PrivacyRequestRecord,
  BillingRecord,
  TeamInviteRecord,
  OrgInviteRecord,
  WorkflowRecord,
  ExecutionRecord,
  AuditEventRecord,
  MfaRecord,
  TrustedDeviceRecord,
  DataSourceRecord,
  WorkspaceGoalRecord,
  IntelligenceFeedItemRecord,
  AdvisoryRecommendationRecord,
  ResearchSourceRecord,
  ResearchSessionRecord,
  SavedAnalyticsViewRecord,
  FeatureFlagRecord,
} from "./memory-repository.js";
import type { EmailDeliveryRecord } from "./email/types.js";
import type { LegalAcceptanceRecord } from "./types.js";

/** Persistence contract — async for Postgres; MemoryAuthRepository implements for CI. */
export interface AuthRepository {
  // Identity
  createOrg(name: string): Promise<OrganizationRecord>;
  findOrg(orgId: string): Promise<OrganizationRecord | null>;
  createUser(user: CreateUserInput): Promise<UserRecord>;
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserById(id: string): Promise<UserRecord | null>;
  listUsersForOrg(orgId: string): Promise<UserRecord[]>;
  updateUser(user: UserRecord): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Workspace
  createWorkspace(workspace: WorkspaceRecord): Promise<WorkspaceRecord>;
  findWorkspace(id: string): Promise<WorkspaceRecord | null>;
  updateWorkspace(workspace: WorkspaceRecord): Promise<void>;
  listWorkspacesForOrg(orgId: string): Promise<WorkspaceRecord[]>;
  addWorkspaceMember(workspaceId: string, userId: string): Promise<void>;
  removeWorkspaceMember(workspaceId: string, userId: string): Promise<void>;
  listWorkspaceMembers(workspaceId: string): Promise<UserRecord[]>;
  getWorkspaceStatus(workspaceId: string): Promise<WorkspaceIntelligenceStatus>;
  updateWorkspaceStatus(
    workspaceId: string,
    patch: Partial<WorkspaceIntelligenceStatus>,
  ): Promise<WorkspaceIntelligenceStatus>;

  // Session
  saveSession(session: ServerSession): Promise<void>;
  findSession(id: string): Promise<ServerSession | null>;
  updateSession(session: ServerSession): Promise<void>;
  revokeSession(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  revokeSessionsForUserDevice(userId: string, deviceId: string): Promise<void>;
  listSessionsForUser(userId: string): Promise<ServerSession[]>;
  countActiveSessionsForOrg(orgId: string): Promise<number>;

  // Tokens & invites
  storeVerificationToken(userId: string, token: string): Promise<void>;
  consumeVerificationToken(token: string): Promise<string | null>;
  storePasswordResetToken(userId: string, token: string): Promise<void>;
  consumePasswordResetToken(token: string): Promise<string | null>;
  findInvite(token: string): Promise<{
    workspaceId: string;
    role: import("@conquest/contracts").UserRole;
    inviterName: string;
    expiresAt: number;
    consumed: boolean;
  } | null>;
  consumeInvite(token: string): Promise<void>;
  createTeamInvite(record: TeamInviteRecord): Promise<TeamInviteRecord>;
  listTeamInvites(workspaceId: string): Promise<TeamInviteRecord[]>;
  createOrgInvite(record: OrgInviteRecord): Promise<OrgInviteRecord>;
  listOrgInvites(orgId: string): Promise<OrgInviteRecord[]>;

  // Settings
  getPreferences(userId: string): Promise<UserPreferences>;
  savePreferences(userId: string, preferences: UserPreferences): Promise<void>;
  getNotificationPreferences(userId: string): Promise<NotificationPreferences>;
  saveNotificationPreferences(userId: string, preferences: NotificationPreferences): Promise<void>;
  getPrivacyRequests(userId: string): Promise<PrivacyRequestRecord>;
  savePrivacyRequests(userId: string, record: PrivacyRequestRecord): Promise<void>;
  getBilling(orgId: string): Promise<BillingRecord>;
  listIntegrations(orgId: string): Promise<IntegrationView[]>;
  saveIntegrations(orgId: string, integrations: IntegrationView[]): Promise<void>;
  getAutomationPolicies(orgId: string): Promise<AutomationPoliciesView>;
  saveAutomationPolicies(orgId: string, policies: AutomationPoliciesView): Promise<void>;
  getAiControls(userId: string): Promise<AiControlsView>;
  saveAiControls(userId: string, controls: AiControlsView): Promise<void>;
  getMemoryControls(orgId: string): Promise<MemoryControlsView>;
  saveMemoryControls(orgId: string, controls: MemoryControlsView): Promise<void>;
  getFeatureFlags(orgId: string): Promise<FeatureFlagRecord[]>;
  saveFeatureFlags(orgId: string, flags: FeatureFlagRecord[]): Promise<void>;

  // Security
  getMfa(userId: string): Promise<MfaRecord>;
  saveMfa(userId: string, record: MfaRecord): Promise<void>;
  getSecurityPreferences(userId: string): Promise<SecurityPreferences>;
  saveSecurityPreferences(userId: string, prefs: SecurityPreferences): Promise<void>;
  listTrustedDevices(userId: string): Promise<TrustedDeviceRecord[]>;
  upsertTrustedDevice(userId: string, device: TrustedDeviceRecord): Promise<void>;
  removeTrustedDevice(userId: string, deviceId: string): Promise<void>;

  // Automation
  saveWorkflow(workflow: WorkflowRecord): Promise<void>;
  findWorkflow(id: string): Promise<WorkflowRecord | null>;
  listWorkflowsForWorkspace(workspaceId: string): Promise<WorkflowRecord[]>;
  saveExecution(execution: ExecutionRecord): Promise<void>;
  listExecutionsForWorkflow(workflowId: string): Promise<ExecutionRecord[]>;

  // Intelligence
  listIntelligenceFeed(workspaceId: string): Promise<IntelligenceFeedItemRecord[]>;
  saveIntelligenceFeed(workspaceId: string, items: IntelligenceFeedItemRecord[]): Promise<void>;
  listAdvisories(workspaceId: string): Promise<AdvisoryRecommendationRecord[]>;
  saveAdvisories(workspaceId: string, items: AdvisoryRecommendationRecord[]): Promise<void>;
  findAdvisory(workspaceId: string, advisoryId: string): Promise<AdvisoryRecommendationRecord | null>;

  // Research
  listResearchSessionsForWorkspace(workspaceId: string): Promise<ResearchSessionRecord[]>;
  findResearchSession(sessionId: string): Promise<ResearchSessionRecord | null>;
  saveResearchSession(session: ResearchSessionRecord): Promise<void>;
  listResearchSources(orgId: string): Promise<ResearchSourceRecord[]>;
  saveResearchSources(orgId: string, sources: ResearchSourceRecord[]): Promise<void>;

  // Analytics
  listSavedAnalyticsViews(workspaceId: string): Promise<SavedAnalyticsViewRecord[]>;
  saveSavedAnalyticsViews(workspaceId: string, views: SavedAnalyticsViewRecord[]): Promise<void>;

  // Workspace data sources & goals
  listDataSources(workspaceId: string): Promise<DataSourceRecord[]>;
  saveDataSources(workspaceId: string, sources: DataSourceRecord[]): Promise<void>;
  listGoals(workspaceId: string): Promise<WorkspaceGoalRecord[]>;
  saveGoals(workspaceId: string, goals: WorkspaceGoalRecord[]): Promise<void>;

  // Audit
  appendAuditEvent(input: AuditEventInput): Promise<AuditEventRecord>;
  listAuditEvents(
    orgId: string,
    filter?: {
      category?: AuditCategory;
      search?: string;
      workspaceId?: string;
      limit?: number;
    },
  ): Promise<AuditEventRecord[]>;

  // Email delivery audit (B2-M2 Slice 2E)
  recordEmailDelivery(record: EmailDeliveryRecord): Promise<EmailDeliveryRecord>;
  listEmailDeliveries(filter: { userId?: string; orgId?: string; limit?: number }): Promise<EmailDeliveryRecord[]>;

  // Legal acceptance (B2-M2 Slice 2F)
  recordLegalAcceptance(record: LegalAcceptanceRecord): Promise<LegalAcceptanceRecord>;
  listLegalAcceptances(userId: string): Promise<LegalAcceptanceRecord[]>;
  hasLegalAcceptance(userId: string, documentType: string, documentVersion: string): Promise<boolean>;
}
