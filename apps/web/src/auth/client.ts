import type {
  AccountProfileView,
  ActiveSessionView,
  AiControlsView,
  AuditEventView,
  AutomationPoliciesView,
  BillingSettingsView,
  CommandCenterStatusResponse,
  CommandCenterDashboardView,
  ConnectDataSourceInput,
  CreateWorkspaceGoalInput,
  DataSourceView,
  IntegrationView,
  MemoryControlsView,
  MfaEnrollResult,
  MfaVerifyEnrollmentInput,
  NotificationPreferences,
  OrganizationMemberView,
  OrganizationSettingsView,
  PendingOrgInviteView,
  PendingTeamInviteView,
  PrivacyRequestResult,
  PrivacySettingsView,
  ProfileSummaryView,
  SecuritySettingsView,
  TeamMemberView,
  TrustedDeviceView,
  UpdateAiControlsInput,
  UpdateAutomationPoliciesInput,
  UpdateMemoryControlsInput,
  UpdateNotificationPreferencesInput,
  UpdatePreferencesInput,
  UserPreferences,
  WorkspaceGoalView,
  WorkspaceSettingsView,
} from "@conquest/contracts";
import type { AuthResponse, SessionUser } from "./types.js";

const API_BASE = "";
const REQUEST_TIMEOUT_MS = 8_000;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error ?? "Request failed";
      throw new Error(`${response.status}: ${message}`);
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSession(): Promise<SessionUser | null> {
  try {
    const data = await request<{ user: SessionUser | null }>("/api/auth/session");
    return data.user;
  } catch {
    return null;
  }
}

export async function signUp(body: {
  email: string;
  password: string;
  displayName: string;
  orgName?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function login(body: {
  email: string;
  password: string;
  deviceId?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function logout(): Promise<void> {
  await request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function verifyEmail(token: string): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function completeOnboarding(body: {
  workspaceName: string;
  workspaceType: string;
  primaryGoal: string;
}): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>("/api/auth/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function setOnboardingStage(stage: string): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>("/api/auth/onboarding/stage", {
    method: "POST",
    body: JSON.stringify({ stage }),
  });
}

export async function finishOnboarding(): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>("/api/auth/onboarding/finish", { method: "POST" });
}

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; message: string }> {
  return request<{ ok: boolean; message: string }>("/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function fetchInvitePreview(
  token: string,
): Promise<{ workspaceName: string; role: string; inviterName: string }> {
  return request(`/api/auth/invite/${token}`);
}

export async function acceptInvite(token: string): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>(`/api/auth/invite/${token}/accept`, { method: "POST" });
}

export async function resendVerificationEmail(): Promise<{ ok: true; verificationToken?: string }> {
  return request("/api/auth/verify-email/resend", { method: "POST" });
}

export async function fetchCommandCenterStatus(workspaceId: string): Promise<CommandCenterStatusResponse> {
  return request<CommandCenterStatusResponse>(`/api/workspaces/${workspaceId}/command-center/status`);
}

export async function fetchCommandCenterDashboard(workspaceId: string): Promise<CommandCenterDashboardView> {
  return request<{ dashboard: CommandCenterDashboardView }>(
    `/api/workspaces/${workspaceId}/command-center/dashboard`,
  ).then((body) => body.dashboard);
}

export async function fetchSettingsCategories() {
  return request<{ categories: Array<{ id: string; label: string; route: string; minRole: string }> }>(
    "/api/settings/categories",
  );
}

export async function fetchAccountProfile() {
  return request<{ profile: AccountProfileView }>("/api/settings/account");
}

export async function updateAccountProfile(body: { displayName: string }) {
  return request<{ profile: AccountProfileView }>("/api/settings/account", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchPreferences() {
  return request<{ preferences: UserPreferences }>("/api/settings/preferences");
}

export async function updatePreferences(body: UpdatePreferencesInput) {
  return request<{ preferences: UserPreferences }>("/api/settings/preferences", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchNotificationPreferences() {
  return request<{ notifications: NotificationPreferences }>("/api/settings/notifications");
}

export async function updateNotificationPreferences(body: UpdateNotificationPreferencesInput) {
  return request<{ notifications: NotificationPreferences }>("/api/settings/notifications", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchPrivacySettings() {
  return request<{ privacy: PrivacySettingsView }>("/api/settings/privacy");
}

export async function requestPrivacyExport(): Promise<PrivacyRequestResult> {
  return request<PrivacyRequestResult>("/api/settings/privacy/export", { method: "POST" });
}

export async function requestPrivacyDeletion(): Promise<PrivacyRequestResult> {
  return request<PrivacyRequestResult>("/api/settings/privacy/deletion", { method: "POST" });
}

export async function fetchBillingSettings() {
  return request<{ billing: BillingSettingsView }>("/api/settings/billing");
}

export async function fetchIntegrations() {
  return request<{ integrations: IntegrationView[] }>("/api/settings/integrations");
}

export async function connectIntegration(integrationId: string) {
  return request<{ integrations: IntegrationView[] }>(`/api/settings/integrations/${integrationId}/connect`, {
    method: "POST",
  });
}

export async function disconnectIntegration(integrationId: string) {
  return request<{ integrations: IntegrationView[] }>(`/api/settings/integrations/${integrationId}/disconnect`, {
    method: "POST",
  });
}

export async function fetchOrganizationSettings() {
  return request<{ organization: OrganizationSettingsView }>("/api/settings/organization");
}

export async function fetchOrganizationMembers() {
  return request<{ members: OrganizationMemberView[]; invites: PendingOrgInviteView[] }>(
    "/api/settings/organization/members",
  );
}

export async function inviteOrganizationMember(body: {
  email: string;
  role: "admin" | "manager" | "member" | "viewer";
}) {
  return request<{ invite: PendingOrgInviteView }>("/api/settings/organization/members/invite", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateOrganizationMemberRole(
  userId: string,
  body: { role: "admin" | "manager" | "member" | "viewer" },
) {
  return request<{ members: OrganizationMemberView[] }>(
    `/api/settings/organization/members/${userId}/role`,
    { method: "PUT", body: JSON.stringify(body) },
  );
}

export async function removeOrganizationMember(userId: string) {
  return request<{ members: OrganizationMemberView[] }>(`/api/settings/organization/members/${userId}`, {
    method: "DELETE",
  });
}

export async function fetchProfile() {
  return request<{ profile: ProfileSummaryView }>("/api/profile");
}

export async function fetchActiveSessions() {
  return request<{ sessions: ActiveSessionView[] }>("/api/profile/sessions");
}

export async function revokeActiveSession(targetSessionId: string) {
  return request<{ sessions: ActiveSessionView[] }>(`/api/profile/sessions/${targetSessionId}`, {
    method: "DELETE",
  });
}

export async function fetchWorkspaceSettings(workspaceId: string) {
  return request<{ workspace: WorkspaceSettingsView }>(`/api/settings/workspace/${workspaceId}`);
}

export async function updateWorkspaceSettings(
  workspaceId: string,
  body: { name?: string; workspaceType?: string; primaryGoal?: string },
) {
  return request<{ workspace: WorkspaceSettingsView }>(`/api/settings/workspace/${workspaceId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchTeam(workspaceId: string) {
  return request<{ members: TeamMemberView[]; invites: PendingTeamInviteView[] }>(
    `/api/settings/workspace/${workspaceId}/team`,
  );
}

export async function inviteTeamMember(
  workspaceId: string,
  body: { email: string; role: "admin" | "manager" | "member" | "viewer" },
) {
  return request<{ invite: PendingTeamInviteView }>(`/api/settings/workspace/${workspaceId}/team/invite`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function removeTeamMember(workspaceId: string, userId: string) {
  return request<{ members: TeamMemberView[] }>(`/api/settings/workspace/${workspaceId}/team/${userId}`, {
    method: "DELETE",
  });
}

export async function selectWorkspace(workspaceId: string): Promise<{ user: SessionUser }> {
  return request<{ user: SessionUser }>(`/api/auth/workspace/${workspaceId}/select`, {
    method: "POST",
  });
}

export async function validateWorkspaceAccess(
  workspaceId: string,
  segment: string,
): Promise<{ user: SessionUser }> {
  const params = new URLSearchParams({ segment });
  return request<{ user: SessionUser }>(
    `/api/auth/workspace/${workspaceId}/validate?${params.toString()}`,
  );
}

export async function fetchSecuritySettings() {
  return request<{ security: SecuritySettingsView }>("/api/settings/security");
}

export async function enrollMfa() {
  return request<MfaEnrollResult>("/api/settings/security/mfa/enroll", { method: "POST" });
}

export async function confirmMfaEnrollment(body: MfaVerifyEnrollmentInput) {
  return request<{ security: SecuritySettingsView }>("/api/settings/security/mfa/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function regenerateRecoveryCodes() {
  return request<{ recoveryCodes: string[] }>("/api/settings/security/mfa/recovery-codes", {
    method: "POST",
  });
}

export async function fetchTrustedDevices() {
  return request<{ devices: TrustedDeviceView[] }>("/api/settings/security/devices");
}

export async function revokeTrustedDevice(deviceId: string) {
  return request<{ devices: TrustedDeviceView[] }>(`/api/settings/security/devices/${deviceId}`, {
    method: "DELETE",
  });
}

export async function fetchAutomationPolicies() {
  return request<{ policies: AutomationPoliciesView }>("/api/settings/automation-policies");
}

export async function updateAutomationPolicies(body: UpdateAutomationPoliciesInput) {
  return request<{ policies: AutomationPoliciesView }>("/api/settings/automation-policies", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchAiControls() {
  return request<{ ai: AiControlsView }>("/api/settings/advanced");
}

export async function updateAiControls(body: UpdateAiControlsInput) {
  return request<{ ai: AiControlsView }>("/api/settings/advanced", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchMemoryControls() {
  return request<{ memory: MemoryControlsView }>("/api/settings/memory");
}

export async function updateMemoryControls(body: UpdateMemoryControlsInput) {
  return request<{ memory: MemoryControlsView }>("/api/settings/memory", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchActivityLog(query: { search?: string; category?: string; workspaceId?: string } = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.workspaceId) params.set("workspaceId", query.workspaceId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<{ events: AuditEventView[] }>(`/api/settings/activity${suffix}`);
}

export async function fetchDataSources(workspaceId: string) {
  return request<{ sources: DataSourceView[] }>(`/api/settings/workspace/${workspaceId}/sources`);
}

export async function connectDataSource(workspaceId: string, body: ConnectDataSourceInput) {
  return request<{ sources: DataSourceView[] }>(`/api/settings/workspace/${workspaceId}/sources`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function disconnectDataSource(workspaceId: string, sourceId: string) {
  return request<{ sources: DataSourceView[] }>(
    `/api/settings/workspace/${workspaceId}/sources/${sourceId}`,
    { method: "DELETE" },
  );
}

export async function fetchWorkspaceGoals(workspaceId: string) {
  return request<{ goals: WorkspaceGoalView[] }>(`/api/settings/workspace/${workspaceId}/goals`);
}

export async function createWorkspaceGoal(workspaceId: string, body: CreateWorkspaceGoalInput) {
  return request<{ goals: WorkspaceGoalView[] }>(`/api/settings/workspace/${workspaceId}/goals`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
