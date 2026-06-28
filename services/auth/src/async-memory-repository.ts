import type { AuthRepository } from "./auth-repository.js";
import { MemoryAuthRepository } from "./memory-repository.js";

/** Async facade over sync in-memory store — used for CI when MEMORY_REPO=true. */
export class AsyncMemoryAuthRepository implements AuthRepository {
  constructor(private readonly inner = new MemoryAuthRepository()) {}

  /** Expose underlying store for tests that need direct mutation (legacy). */
  get sync(): MemoryAuthRepository {
    return this.inner;
  }

  createOrg = (name: string) => Promise.resolve(this.inner.createOrg(name));
  findOrg = (orgId: string) => Promise.resolve(this.inner.findOrg(orgId));
  createUser = (user: Parameters<MemoryAuthRepository["createUser"]>[0]) =>
    Promise.resolve(this.inner.createUser(user));
  findUserByEmail = (email: string) => Promise.resolve(this.inner.findUserByEmail(email));
  findUserById = (id: string) => Promise.resolve(this.inner.findUserById(id));
  listUsersForOrg = (orgId: string) => Promise.resolve(this.inner.listUsersForOrg(orgId));
  updateUser = (user: Parameters<MemoryAuthRepository["updateUser"]>[0]) =>
    Promise.resolve(this.inner.updateUser(user));
  deleteUser = (userId: string) => Promise.resolve(this.inner.deleteUser(userId));

  createWorkspace = (workspace: Parameters<MemoryAuthRepository["createWorkspace"]>[0]) =>
    Promise.resolve(this.inner.createWorkspace(workspace));
  findWorkspace = (id: string) => Promise.resolve(this.inner.findWorkspace(id));
  updateWorkspace = (workspace: Parameters<MemoryAuthRepository["updateWorkspace"]>[0]) =>
    Promise.resolve(this.inner.updateWorkspace(workspace));
  listWorkspacesForOrg = (orgId: string) => Promise.resolve(this.inner.listWorkspacesForOrg(orgId));
  addWorkspaceMember = (workspaceId: string, userId: string) =>
    Promise.resolve(this.inner.addWorkspaceMember(workspaceId, userId));
  removeWorkspaceMember = (workspaceId: string, userId: string) =>
    Promise.resolve(this.inner.removeWorkspaceMember(workspaceId, userId));
  listWorkspaceMembers = (workspaceId: string) =>
    Promise.resolve(this.inner.listWorkspaceMembers(workspaceId));
  getWorkspaceStatus = (workspaceId: string) => Promise.resolve(this.inner.getWorkspaceStatus(workspaceId));
  updateWorkspaceStatus = (
    workspaceId: string,
    patch: Parameters<MemoryAuthRepository["updateWorkspaceStatus"]>[1],
  ) => Promise.resolve(this.inner.updateWorkspaceStatus(workspaceId, patch));

  saveSession = (session: Parameters<MemoryAuthRepository["saveSession"]>[0]) =>
    Promise.resolve(this.inner.saveSession(session));
  findSession = (id: string) => Promise.resolve(this.inner.findSession(id));
  updateSession = (session: Parameters<MemoryAuthRepository["updateSession"]>[0]) =>
    Promise.resolve(this.inner.updateSession(session));
  revokeSession = (id: string) => Promise.resolve(this.inner.revokeSession(id));
  revokeAllForUser = (userId: string) => Promise.resolve(this.inner.revokeAllForUser(userId));
  revokeSessionsForUserDevice = (userId: string, deviceId: string) =>
    Promise.resolve(this.inner.revokeSessionsForUserDevice(userId, deviceId));
  listSessionsForUser = (userId: string) => Promise.resolve(this.inner.listSessionsForUser(userId));
  countActiveSessionsForOrg = (orgId: string) => Promise.resolve(this.inner.countActiveSessionsForOrg(orgId));

  storeVerificationToken = (userId: string, token: string) =>
    Promise.resolve(this.inner.storeVerificationToken(userId, token));
  consumeVerificationToken = (token: string) => Promise.resolve(this.inner.consumeVerificationToken(token));
  storePasswordResetToken = (userId: string, token: string) =>
    Promise.resolve(this.inner.storePasswordResetToken(userId, token));
  consumePasswordResetToken = (token: string) => Promise.resolve(this.inner.consumePasswordResetToken(token));
  findInvite = (token: string) => Promise.resolve(this.inner.findInvite(token));
  consumeInvite = (token: string) => Promise.resolve(this.inner.consumeInvite(token));
  createTeamInvite = (record: Parameters<MemoryAuthRepository["createTeamInvite"]>[0]) =>
    Promise.resolve(this.inner.createTeamInvite(record));
  listTeamInvites = (workspaceId: string) => Promise.resolve(this.inner.listTeamInvites(workspaceId));
  createOrgInvite = (record: Parameters<MemoryAuthRepository["createOrgInvite"]>[0]) =>
    Promise.resolve(this.inner.createOrgInvite(record));
  listOrgInvites = (orgId: string) => Promise.resolve(this.inner.listOrgInvites(orgId));

  getPreferences = (userId: string) => Promise.resolve(this.inner.getPreferences(userId));
  savePreferences = (userId: string, preferences: Parameters<MemoryAuthRepository["savePreferences"]>[1]) =>
    Promise.resolve(this.inner.savePreferences(userId, preferences));
  getNotificationPreferences = (userId: string) => Promise.resolve(this.inner.getNotificationPreferences(userId));
  saveNotificationPreferences = (
    userId: string,
    preferences: Parameters<MemoryAuthRepository["saveNotificationPreferences"]>[1],
  ) => Promise.resolve(this.inner.saveNotificationPreferences(userId, preferences));
  getPrivacyRequests = (userId: string) => Promise.resolve(this.inner.getPrivacyRequests(userId));
  savePrivacyRequests = (userId: string, record: Parameters<MemoryAuthRepository["savePrivacyRequests"]>[1]) =>
    Promise.resolve(this.inner.savePrivacyRequests(userId, record));
  getBilling = (orgId: string) => Promise.resolve(this.inner.getBilling(orgId));
  listIntegrations = (orgId: string) => Promise.resolve(this.inner.listIntegrations(orgId));
  saveIntegrations = (orgId: string, integrations: Parameters<MemoryAuthRepository["saveIntegrations"]>[1]) =>
    Promise.resolve(this.inner.saveIntegrations(orgId, integrations));
  getAutomationPolicies = (orgId: string) => Promise.resolve(this.inner.getAutomationPolicies(orgId));
  saveAutomationPolicies = (
    orgId: string,
    policies: Parameters<MemoryAuthRepository["saveAutomationPolicies"]>[1],
  ) => Promise.resolve(this.inner.saveAutomationPolicies(orgId, policies));
  getAiControls = (userId: string) => Promise.resolve(this.inner.getAiControls(userId));
  saveAiControls = (userId: string, controls: Parameters<MemoryAuthRepository["saveAiControls"]>[1]) =>
    Promise.resolve(this.inner.saveAiControls(userId, controls));
  getMemoryControls = (orgId: string) => Promise.resolve(this.inner.getMemoryControls(orgId));
  saveMemoryControls = (orgId: string, controls: Parameters<MemoryAuthRepository["saveMemoryControls"]>[1]) =>
    Promise.resolve(this.inner.saveMemoryControls(orgId, controls));
  getFeatureFlags = (orgId: string) => Promise.resolve(this.inner.getFeatureFlags(orgId));
  saveFeatureFlags = (orgId: string, flags: Parameters<MemoryAuthRepository["saveFeatureFlags"]>[1]) =>
    Promise.resolve(this.inner.saveFeatureFlags(orgId, flags));

  getMfa = (userId: string) => Promise.resolve(this.inner.getMfa(userId));
  saveMfa = (userId: string, record: Parameters<MemoryAuthRepository["saveMfa"]>[1]) =>
    Promise.resolve(this.inner.saveMfa(userId, record));
  getSecurityPreferences = (userId: string) => Promise.resolve(this.inner.getSecurityPreferences(userId));
  saveSecurityPreferences = (
    userId: string,
    prefs: Parameters<MemoryAuthRepository["saveSecurityPreferences"]>[1],
  ) => Promise.resolve(this.inner.saveSecurityPreferences(userId, prefs));
  listTrustedDevices = (userId: string) => Promise.resolve(this.inner.listTrustedDevices(userId));
  upsertTrustedDevice = (userId: string, device: Parameters<MemoryAuthRepository["upsertTrustedDevice"]>[1]) =>
    Promise.resolve(this.inner.upsertTrustedDevice(userId, device));
  removeTrustedDevice = (userId: string, deviceId: string) =>
    Promise.resolve(this.inner.removeTrustedDevice(userId, deviceId));

  saveWorkflow = (workflow: Parameters<MemoryAuthRepository["saveWorkflow"]>[0]) =>
    Promise.resolve(this.inner.saveWorkflow(workflow));
  findWorkflow = (id: string) => Promise.resolve(this.inner.findWorkflow(id));
  listWorkflowsForWorkspace = (workspaceId: string) =>
    Promise.resolve(this.inner.listWorkflowsForWorkspace(workspaceId));
  saveExecution = (execution: Parameters<MemoryAuthRepository["saveExecution"]>[0]) =>
    Promise.resolve(this.inner.saveExecution(execution));
  listExecutionsForWorkflow = (workflowId: string) =>
    Promise.resolve(this.inner.listExecutionsForWorkflow(workflowId));

  listIntelligenceFeed = (workspaceId: string) => Promise.resolve(this.inner.listIntelligenceFeed(workspaceId));
  saveIntelligenceFeed = (
    workspaceId: string,
    items: Parameters<MemoryAuthRepository["saveIntelligenceFeed"]>[1],
  ) => Promise.resolve(this.inner.saveIntelligenceFeed(workspaceId, items));
  listAdvisories = (workspaceId: string) => Promise.resolve(this.inner.listAdvisories(workspaceId));
  saveAdvisories = (workspaceId: string, items: Parameters<MemoryAuthRepository["saveAdvisories"]>[1]) =>
    Promise.resolve(this.inner.saveAdvisories(workspaceId, items));
  findAdvisory = (workspaceId: string, advisoryId: string) =>
    Promise.resolve(this.inner.findAdvisory(workspaceId, advisoryId));

  listResearchSessionsForWorkspace = (workspaceId: string) =>
    Promise.resolve(this.inner.listResearchSessionsForWorkspace(workspaceId));
  findResearchSession = (sessionId: string) => Promise.resolve(this.inner.findResearchSession(sessionId));
  saveResearchSession = (session: Parameters<MemoryAuthRepository["saveResearchSession"]>[0]) =>
    Promise.resolve(this.inner.saveResearchSession(session));
  listResearchSources = (orgId: string) => Promise.resolve(this.inner.listResearchSources(orgId));
  saveResearchSources = (orgId: string, sources: Parameters<MemoryAuthRepository["saveResearchSources"]>[1]) =>
    Promise.resolve(this.inner.saveResearchSources(orgId, sources));

  listSavedAnalyticsViews = (workspaceId: string) =>
    Promise.resolve(this.inner.listSavedAnalyticsViews(workspaceId));
  saveSavedAnalyticsViews = (
    workspaceId: string,
    views: Parameters<MemoryAuthRepository["saveSavedAnalyticsViews"]>[1],
  ) => Promise.resolve(this.inner.saveSavedAnalyticsViews(workspaceId, views));

  listDataSources = (workspaceId: string) => Promise.resolve(this.inner.listDataSources(workspaceId));
  saveDataSources = (workspaceId: string, sources: Parameters<MemoryAuthRepository["saveDataSources"]>[1]) =>
    Promise.resolve(this.inner.saveDataSources(workspaceId, sources));
  listGoals = (workspaceId: string) => Promise.resolve(this.inner.listGoals(workspaceId));
  saveGoals = (workspaceId: string, goals: Parameters<MemoryAuthRepository["saveGoals"]>[1]) =>
    Promise.resolve(this.inner.saveGoals(workspaceId, goals));

  appendAuditEvent = (input: Parameters<MemoryAuthRepository["appendAuditEvent"]>[0]) =>
    Promise.resolve(this.inner.appendAuditEvent(input));
  listAuditEvents = (
    orgId: string,
    filter?: Parameters<MemoryAuthRepository["listAuditEvents"]>[1],
  ) => Promise.resolve(this.inner.listAuditEvents(orgId, filter));

  recordEmailDelivery = (record: Parameters<MemoryAuthRepository["recordEmailDelivery"]>[0]) =>
    Promise.resolve(this.inner.recordEmailDelivery(record));
  listEmailDeliveries = (filter: Parameters<MemoryAuthRepository["listEmailDeliveries"]>[0]) =>
    Promise.resolve(this.inner.listEmailDeliveries(filter));

  recordLegalAcceptance = (record: Parameters<MemoryAuthRepository["recordLegalAcceptance"]>[0]) =>
    Promise.resolve(this.inner.recordLegalAcceptance(record));
  listLegalAcceptances = (userId: string) => Promise.resolve(this.inner.listLegalAcceptances(userId));
  hasLegalAcceptance = (userId: string, documentType: string, documentVersion: string) =>
    Promise.resolve(this.inner.hasLegalAcceptance(userId, documentType, documentVersion));
}
