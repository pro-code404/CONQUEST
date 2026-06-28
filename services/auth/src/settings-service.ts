import { SERVICE_NAMES } from "@conquest/core";
import { randomBytes, randomUUID } from "node:crypto";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_USER_PREFERENCES,
  SETTINGS_CATEGORIES,
  UpdateNotificationPreferencesSchema,
  UpdateProfileSchema,
  settingsTeamRoute,
  settingsSourcesRoute,
  settingsGoalsRoute,
  InviteOrgMemberSchema,
  UpdateOrganizationMemberRoleSchema,
  type InviteOrgMemberInput,
  type PendingOrgInviteView,
  type UpdateOrganizationMemberRoleInput,
  settingsWorkspaceRoute,
  type AccountProfileView,
  type BillingSettingsView,
  type IntegrationView,
  type NotificationPreferences,
  type OrganizationMemberView,
  type OrganizationSettingsView,
  type PrivacyRequestResult,
  type PrivacySettingsView,
  type SettingsCategoryId,
  type ThemePreference,
  type UpdateNotificationPreferencesInput,
  type UpdatePreferencesInput,
  type UserPreferences,
  type UserRole,
  UpdateAutomationPoliciesSchema,
  UpdateAiControlsSchema,
  UpdateMemoryControlsSchema,
  type AutomationPoliciesView,
  type UpdateAutomationPoliciesInput,
  type AiControlsView,
  type UpdateAiControlsInput,
  type MemoryControlsView,
  type UpdateMemoryControlsInput,
} from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";

export class SettingsService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.SETTINGS;

  constructor(
    private readonly repo: AuthRepository,
    private readonly notifications?: import("./notification-service.js").NotificationService,
  ) {
    super();
  }

  async listCategories(
    role: UserRole,
    activeWorkspaceId: string | null,
  ): Promise<Array<{ id: string; label: string; route: string; minRole: UserRole }>> {
    return SETTINGS_CATEGORIES.filter((category) => ROLE_RANK[role] >= ROLE_RANK[category.minRole])
      .filter((category) => {
        if ("workspaceScoped" in category && category.workspaceScoped) {
          return Boolean(activeWorkspaceId);
        }
        return true;
      })
      .map((category) => {
        if (category.id === "workspace" && activeWorkspaceId) {
          return { ...category, route: settingsWorkspaceRoute(activeWorkspaceId) };
        }
        if (category.id === "team" && activeWorkspaceId) {
          return { ...category, route: settingsTeamRoute(activeWorkspaceId) };
        }
        if (category.id === "sources" && activeWorkspaceId) {
          return { ...category, route: settingsSourcesRoute(activeWorkspaceId) };
        }
        if (category.id === "goals" && activeWorkspaceId) {
          return { ...category, route: settingsGoalsRoute(activeWorkspaceId) };
        }
        return category;
      });
  }

  async getAccountProfile(sessionId: string): Promise<AccountProfileView> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    const org = await this.repo.findOrg(user.orgId);
    return {
      displayName: user.displayName,
      email: user.email,
      orgName: org?.name ?? "Organization",
    };
  }

  async updateProfile(sessionId: string, raw: unknown): Promise<AccountProfileView> {
    const input = UpdateProfileSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    user.displayName = input.displayName;
    await this.repo.updateUser(user);
    this.emit("profile_updated", "info", { userId: user.id });
    return this.getAccountProfile(sessionId);
  }

  async getPreferences(sessionId: string): Promise<UserPreferences> {
    const session = await this.requireSession(sessionId);
    return this.repo.getPreferences(session.userId);
  }

  async updatePreferences(sessionId: string, input: UpdatePreferencesInput): Promise<UserPreferences> {
    const session = await this.requireSession(sessionId);
    const current = await this.repo.getPreferences(session.userId);
    const next: UserPreferences = {
      theme: input.theme ?? current.theme,
      emailDigest: input.emailDigest ?? current.emailDigest,
      quietHoursEnabled: input.quietHoursEnabled ?? current.quietHoursEnabled,
    };
    this.validateTheme(next.theme);
    await this.repo.savePreferences(session.userId, next);
    return next;
  }

  async getNotificationPreferences(sessionId: string): Promise<NotificationPreferences> {
    const session = await this.requireSession(sessionId);
    return this.repo.getNotificationPreferences(session.userId);
  }

  async updateNotificationPreferences(
    sessionId: string,
    raw: UpdateNotificationPreferencesInput,
  ): Promise<NotificationPreferences> {
    const input = UpdateNotificationPreferencesSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const current = await this.repo.getNotificationPreferences(session.userId);
    const next: NotificationPreferences = {
      emailDigest: input.emailDigest ?? current.emailDigest,
      quietHoursEnabled: input.quietHoursEnabled ?? current.quietHoursEnabled,
      quietHoursStart: input.quietHoursStart ?? current.quietHoursStart,
      quietHoursEnd: input.quietHoursEnd ?? current.quietHoursEnd,
      categories: {
        alerts: input.categories?.alerts ?? current.categories.alerts,
        recommendations: input.categories?.recommendations ?? current.categories.recommendations,
        reports: input.categories?.reports ?? current.categories.reports,
        automation: input.categories?.automation ?? current.categories.automation,
        security: input.categories?.security ?? current.categories.security,
      },
    };
    await this.repo.saveNotificationPreferences(session.userId, next);
    this.emit("notifications_updated", "info", { userId: session.userId });
    return next;
  }

  async getPrivacySettings(sessionId: string): Promise<PrivacySettingsView> {
    const session = await this.requireSession(sessionId);
    const record = await this.repo.getPrivacyRequests(session.userId);
    return {
      exportRequestedAt: record.exportRequestedAt ? new Date(record.exportRequestedAt).toISOString() : null,
      deletionRequestedAt: record.deletionRequestedAt
        ? new Date(record.deletionRequestedAt).toISOString()
        : null,
      retentionSummary: "Workspace data retained per organization policy (Build-1).",
    };
  }

  async requestPrivacyExport(sessionId: string): Promise<PrivacyRequestResult> {
    const session = await this.requireSession(sessionId);
    const record = await this.repo.getPrivacyRequests(session.userId);
    const requestedAt = Date.now();
    record.exportRequestedAt = requestedAt;
    await this.repo.savePrivacyRequests(session.userId, record);
    this.emit("privacy_export_requested", "info", { userId: session.userId });
    return {
      ok: true,
      message: "Export request received. You will be notified when your data export is ready.",
      requestedAt: new Date(requestedAt).toISOString(),
    };
  }

  async requestPrivacyDeletion(sessionId: string): Promise<PrivacyRequestResult> {
    const session = await this.requireSession(sessionId);
    const record = await this.repo.getPrivacyRequests(session.userId);
    const requestedAt = Date.now();
    record.deletionRequestedAt = requestedAt;
    await this.repo.savePrivacyRequests(session.userId, record);
    this.emit("privacy_deletion_requested", "warn", { userId: session.userId });
    return {
      ok: true,
      message: "Deletion request received. Our team will contact you to confirm account deletion.",
      requestedAt: new Date(requestedAt).toISOString(),
    };
  }

  async getBillingSettings(sessionId: string): Promise<BillingSettingsView> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.owner) {
      throw new Error("Owner access required");
    }
    const billing = await this.repo.getBilling(user.orgId);
    const seatsUsed = (await this.repo.listUsersForOrg(user.orgId)).length;
    return {
      plan: billing.plan,
      seatsUsed,
      seatLimit: billing.seatLimit,
      status: billing.status,
      renewalDate: new Date(billing.renewalDate).toISOString().slice(0, 10),
    };
  }

  async listIntegrations(sessionId: string): Promise<IntegrationView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required");
    }
    return this.repo.listIntegrations(user.orgId);
  }

  async connectIntegration(sessionId: string, integrationId: string): Promise<IntegrationView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const integrations = (await this.repo.listIntegrations(user.orgId)).map((item) =>
      item.id === integrationId
        ? { ...item, status: "connected" as const, connectedAt: new Date().toISOString() }
        : item,
    );
    await this.repo.saveIntegrations(user.orgId, integrations);
    this.emit("integration_connected", "info", { integrationId });
    return integrations;
  }

  async disconnectIntegration(sessionId: string, integrationId: string): Promise<IntegrationView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const integrations = (await this.repo.listIntegrations(user.orgId)).map((item) =>
      item.id === integrationId
        ? { ...item, status: "disconnected" as const, connectedAt: null }
        : item,
    );
    await this.repo.saveIntegrations(user.orgId, integrations);
    this.emit("integration_disconnected", "info", { integrationId });
    return integrations;
  }

  async getOrganizationSettings(sessionId: string): Promise<OrganizationSettingsView> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required");
    }
    const org = await this.repo.findOrg(user.orgId);
    if (!org) throw new Error("Organization not found");
    return {
      id: org.id,
      name: org.name,
      workspaceCount: (await this.repo.listWorkspacesForOrg(org.id)).length,
      memberCount: (await this.repo.listUsersForOrg(org.id)).length,
    };
  }

  async listOrganizationMembers(sessionId: string): Promise<OrganizationMemberView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required");
    }
    return (await this.repo.listUsersForOrg(user.orgId)).map((member) => ({
      userId: member.id,
      displayName: member.displayName,
      email: member.email,
      role: member.role,
    }));
  }

  async listOrganizationInvites(sessionId: string): Promise<PendingOrgInviteView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    return (await this.repo.listOrgInvites(user.orgId)).map((invite) => ({
      inviteId: invite.id,
      email: invite.email,
      role: invite.role,
      inviterName: invite.inviterName,
      expiresAt: new Date(invite.expiresAt).toISOString(),
    }));
  }

  async inviteOrganizationMember(sessionId: string, raw: InviteOrgMemberInput): Promise<PendingOrgInviteView> {
    const input = InviteOrgMemberSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const token = randomBytes(24).toString("base64url");
    const invite = await this.repo.createOrgInvite({
      id: randomUUID(),
      orgId: user.orgId,
      email: input.email.toLowerCase(),
      role: input.role,
      inviterUserId: user.id,
      inviterName: user.displayName,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    const org = await this.repo.findOrg(user.orgId);
    if (this.notifications && org) {
      await this.notifications.sendOrgInviteEmail({
        orgId: user.orgId,
        inviterUserId: user.id,
        recipient: invite.email,
        orgName: org.name,
        token,
      });
    }
    this.emit("org_invite_created", "info", { orgId: user.orgId, email: input.email });
    return {
      inviteId: invite.id,
      email: invite.email,
      role: invite.role,
      inviterName: invite.inviterName,
      expiresAt: new Date(invite.expiresAt).toISOString(),
    };
  }

  async updateOrganizationMemberRole(
    sessionId: string,
    memberUserId: string,
    raw: UpdateOrganizationMemberRoleInput,
  ): Promise<OrganizationMemberView[]> {
    const input = UpdateOrganizationMemberRoleSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const member = await this.repo.findUserById(memberUserId);
    if (!member || member.orgId !== user.orgId) throw new Error("Member not found");
    if (member.role === "owner") throw new Error("Cannot change owner role");
    member.role = input.role;
    await this.repo.updateUser(member);
    this.emit("org_member_role_updated", "info", { memberUserId, role: input.role });
    return this.listOrganizationMembers(sessionId);
  }

  async removeOrganizationMember(sessionId: string, memberUserId: string): Promise<OrganizationMemberView[]> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    if (memberUserId === user.id) throw new Error("Cannot remove yourself");
    const member = await this.repo.findUserById(memberUserId);
    if (!member || member.orgId !== user.orgId) throw new Error("Member not found");
    if (member.role === "owner") throw new Error("Cannot remove organization owner");
    await this.repo.revokeAllForUser(memberUserId);
    await this.repo.deleteUser(memberUserId);
    this.emit("org_member_removed", "warn", { memberUserId });
    return this.listOrganizationMembers(sessionId);
  }

  async categoryRoute(categoryId: SettingsCategoryId): Promise<string> {
    const category = SETTINGS_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) throw new Error("Unknown settings category");
    return category.route;
  }

  async getAutomationPolicies(sessionId: string): Promise<AutomationPoliciesView> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    return this.repo.getAutomationPolicies(user.orgId);
  }

  async updateAutomationPolicies(
    sessionId: string,
    raw: UpdateAutomationPoliciesInput,
  ): Promise<AutomationPoliciesView> {
    const input = UpdateAutomationPoliciesSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const current = await this.repo.getAutomationPolicies(user.orgId);
    const next: AutomationPoliciesView = {
      requireApproval: input.requireApproval ?? current.requireApproval,
      managerApprovalThreshold: input.managerApprovalThreshold ?? current.managerApprovalThreshold,
      maxConcurrentRuns: input.maxConcurrentRuns ?? current.maxConcurrentRuns,
      emergencyDisabled: input.emergencyDisabled ?? current.emergencyDisabled,
      defaultOwnership: input.defaultOwnership ?? current.defaultOwnership,
      executionPermission: input.executionPermission ?? current.executionPermission,
      workspaceDefaultsEnabled: input.workspaceDefaultsEnabled ?? current.workspaceDefaultsEnabled,
    };
    await this.repo.saveAutomationPolicies(user.orgId, next);
    await this.repo.appendAuditEvent({
      category: "automation",
      action: "policies.updated",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "organization",
      resourceId: user.orgId,
      orgId: user.orgId,
      summary: "Automation policies updated",
    });
    return next;
  }

  async getAiControls(sessionId: string): Promise<AiControlsView> {
    const session = await this.requireSession(sessionId);
    return this.repo.getAiControls(session.userId);
  }

  async updateAiControls(sessionId: string, raw: UpdateAiControlsInput): Promise<AiControlsView> {
    const input = UpdateAiControlsSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const current = await this.repo.getAiControls(session.userId);
    const next: AiControlsView = {
      ...current,
      preferredProvider: input.preferredProvider ?? current.preferredProvider,
      depthPreference: input.depthPreference ?? current.depthPreference,
      transparencyEnabled: true,
    };
    await this.repo.saveAiControls(session.userId, next);
    return next;
  }

  async getMemoryControls(sessionId: string): Promise<MemoryControlsView> {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) throw new Error("Admin access required");
    return this.repo.getMemoryControls(user.orgId);
  }

  async updateMemoryControls(sessionId: string, raw: UpdateMemoryControlsInput): Promise<MemoryControlsView> {
    const input = UpdateMemoryControlsSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.requireAdmin(session);
    const current = await this.repo.getMemoryControls(user.orgId);
    const next: MemoryControlsView = {
      ...current,
      retentionDays: input.retentionDays ?? current.retentionDays,
    };
    await this.repo.saveMemoryControls(user.orgId, next);
    return next;
  }

  private async requireAdmin(session: { userId: string }) {
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required");
    }
    return user;
  }

  private validateTheme(theme: ThemePreference): void {
    if (theme !== "light" && theme !== "dark" && theme !== "system") {
      throw new Error("Invalid theme preference");
    }
  }

  private async requireSession(sessionId: string) {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }
}

export { DEFAULT_USER_PREFERENCES, DEFAULT_NOTIFICATION_PREFERENCES, SETTINGS_CATEGORIES };
