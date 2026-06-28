import { randomBytes, randomUUID } from "node:crypto";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  InviteTeamMemberSchema,
  UpdateTeamMemberRoleSchema,
  UpdateWorkspaceSettingsSchema,
  ConnectDataSourceSchema,
  CreateWorkspaceGoalSchema,
  toCommandCenterStatusResponse,
  type CommandCenterStatusResponse,
  type ConnectDataSourceInput,
  type CreateWorkspaceGoalInput,
  type DataSourceView,
  type InviteTeamMemberInput,
  type PendingTeamInviteView,
  type TeamMemberView,
  type UpdateTeamMemberRoleInput,
  type UpdateWorkspaceSettingsInput,
  type WorkspaceGoalView,
  type WorkspaceSettingsView,
  type WorkspaceSummary,
} from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";
import type { UserRole } from "@conquest/contracts";

export class WorkspaceService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.WORKSPACE;

  constructor(
    private readonly repo: AuthRepository,
    private readonly notifications?: import("./notification-service.js").NotificationService,
  ) {
    super();
  }

  async listWorkspaces(sessionId: string): Promise<WorkspaceSummary[]> {
    const session = await this.requireSession(sessionId);
    return (await this.repo.listWorkspacesForOrg(session.orgId)).map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      orgId: workspace.orgId,
      workspaceType: workspace.workspaceType,
    }));
  }

  async getCommandCenterStatus(sessionId: string, workspaceId: string): Promise<CommandCenterStatusResponse> {
    const { workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    const status = await this.repo.getWorkspaceStatus(workspace.id);
    return toCommandCenterStatusResponse(workspace.id, status);
  }

  async getWorkspaceSettings(sessionId: string, workspaceId: string): Promise<WorkspaceSettingsView> {
    const { workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    const status = await this.repo.getWorkspaceStatus(workspace.id);
    const state = status.initializationInProgress
      ? "initializing"
      : status.dataSourceConnected
        ? "active"
        : "dormant";
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      workspaceType: workspace.workspaceType,
      primaryGoal: workspace.primaryGoal,
      archived: workspace.archived,
      state,
    };
  }

  async updateWorkspaceSettings(
    sessionId: string,
    workspaceId: string,
    raw: UpdateWorkspaceSettingsInput,
  ): Promise<WorkspaceSettingsView> {
    const input = UpdateWorkspaceSettingsSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    if (input.name !== undefined) workspace.name = input.name.trim();
    if (input.workspaceType !== undefined) workspace.workspaceType = input.workspaceType;
    if (input.primaryGoal !== undefined) workspace.primaryGoal = input.primaryGoal;
    await this.repo.updateWorkspace(workspace);
    this.emit("workspace_updated", "info", { workspaceId: workspace.id });
    return this.getWorkspaceSettings(sessionId, workspaceId);
  }

  async listTeamMembers(sessionId: string, workspaceId: string): Promise<TeamMemberView[]> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    return (await this.repo.listWorkspaceMembers(workspaceId)).map((member) => ({
      userId: member.id,
      displayName: member.displayName,
      email: member.email,
      role: member.role,
    }));
  }

  async listPendingInvites(sessionId: string, workspaceId: string): Promise<PendingTeamInviteView[]> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    return (await this.repo.listTeamInvites(workspaceId)).map((invite) => ({
      inviteId: invite.id,
      email: invite.email,
      role: invite.role,
      inviterName: invite.inviterName,
      expiresAt: new Date(invite.expiresAt).toISOString(),
    }));
  }

  async inviteTeamMember(
    sessionId: string,
    workspaceId: string,
    raw: InviteTeamMemberInput,
  ): Promise<PendingTeamInviteView> {
    const input = InviteTeamMemberSchema.parse(raw);
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const token = randomBytes(24).toString("base64url");
    const invite = await this.repo.createTeamInvite({
      id: randomUUID(),
      workspaceId,
      email: input.email.toLowerCase(),
      role: input.role,
      inviterUserId: user.id,
      inviterName: user.displayName,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    const workspace = await this.repo.findWorkspace(workspaceId);
    if (this.notifications && workspace) {
      await this.notifications.sendTeamInviteEmail({
        orgId: workspace.orgId,
        inviterUserId: user.id,
        recipient: invite.email,
        workspaceName: workspace.name,
        token,
      });
    }
    this.emit("team_invite_created", "info", { workspaceId, email: input.email });
    return {
      inviteId: invite.id,
      email: invite.email,
      role: invite.role,
      inviterName: invite.inviterName,
      expiresAt: new Date(invite.expiresAt).toISOString(),
    };
  }

  async updateTeamMemberRole(
    sessionId: string,
    workspaceId: string,
    memberUserId: string,
    raw: UpdateTeamMemberRoleInput,
  ): Promise<TeamMemberView[]> {
    const input = UpdateTeamMemberRoleSchema.parse(raw);
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const member = await this.repo.findUserById(memberUserId);
    if (!member) throw new Error("Member not found");
    member.role = input.role;
    await this.repo.updateUser(member);
    return this.listTeamMembers(sessionId, workspaceId);
  }

  async removeTeamMember(
    sessionId: string,
    workspaceId: string,
    memberUserId: string,
  ): Promise<TeamMemberView[]> {
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required to remove members");
    }
    if (memberUserId === user.id) throw new Error("Cannot remove yourself");
    await this.repo.removeWorkspaceMember(workspaceId, memberUserId);
    return this.listTeamMembers(sessionId, workspaceId);
  }

  async markOnboardingDataSourceConnected(
    sessionId: string,
    workspaceId: string,
  ): Promise<CommandCenterStatusResponse> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    await this.repo.updateWorkspaceStatus(workspaceId, {
      dataSourceConnected: true,
      initializationInProgress: true,
    });
    return this.getCommandCenterStatus(sessionId, workspaceId);
  }

  async completeInitialization(sessionId: string, workspaceId: string): Promise<CommandCenterStatusResponse> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    await this.repo.updateWorkspaceStatus(workspaceId, {
      dataSourceConnected: true,
      initializationInProgress: false,
    });
    return this.getCommandCenterStatus(sessionId, workspaceId);
  }

  async listDataSources(sessionId: string, workspaceId: string): Promise<DataSourceView[]> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    return (await this.repo.listDataSources(workspaceId)).map((source) => ({
      id: source.id,
      name: source.name,
      type: source.type,
      status: source.status,
      lastSyncAt: source.lastSyncAt ? new Date(source.lastSyncAt).toISOString() : null,
    }));
  }

  async connectDataSource(
    sessionId: string,
    workspaceId: string,
    raw: ConnectDataSourceInput,
  ): Promise<DataSourceView[]> {
    const input = ConnectDataSourceSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const sources = await this.repo.listDataSources(workspaceId);
    sources.push({
      id: randomUUID(),
      workspaceId,
      name: input.name,
      type: input.type,
      status: "connected",
      lastSyncAt: Date.now(),
    });
    await this.repo.saveDataSources(workspaceId, sources);
    await this.repo.appendAuditEvent({
      category: "workspace",
      action: "datasource.connected",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "workspace",
      resourceId: workspace.id,
      workspaceId: workspace.id,
      orgId: workspace.orgId,
      summary: `Connected data source ${input.name}`,
    });
    return this.listDataSources(sessionId, workspaceId);
  }

  async disconnectDataSource(
    sessionId: string,
    workspaceId: string,
    sourceId: string,
  ): Promise<DataSourceView[]> {
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const sources = (await this.repo.listDataSources(workspaceId)).map((source) =>
      source.id === sourceId ? { ...source, status: "disconnected" as const, lastSyncAt: null } : source,
    );
    await this.repo.saveDataSources(workspaceId, sources);
    await this.repo.appendAuditEvent({
      category: "workspace",
      action: "datasource.disconnected",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "workspace",
      resourceId: workspace.id,
      workspaceId: workspace.id,
      orgId: workspace.orgId,
      summary: "Data source disconnected",
    });
    return this.listDataSources(sessionId, workspaceId);
  }

  async listGoals(sessionId: string, workspaceId: string): Promise<WorkspaceGoalView[]> {
    await this.requireWorkspaceAccess(sessionId, workspaceId);
    return (await this.repo.listGoals(workspaceId)).map((goal) => ({
      id: goal.id,
      title: goal.title,
      status: goal.status,
      progress: goal.progress,
    }));
  }

  async createGoal(
    sessionId: string,
    workspaceId: string,
    raw: CreateWorkspaceGoalInput,
  ): Promise<WorkspaceGoalView[]> {
    const input = CreateWorkspaceGoalSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const goals = await this.repo.listGoals(workspaceId);
    goals.push({
      id: randomUUID(),
      workspaceId,
      title: input.title,
      status: "active",
      progress: 0,
    });
    await this.repo.saveGoals(workspaceId, goals);
    await this.repo.appendAuditEvent({
      category: "workspace",
      action: "goal.created",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "workspace",
      resourceId: workspace.id,
      workspaceId: workspace.id,
      orgId: workspace.orgId,
      summary: `Created goal ${input.title}`,
    });
    return this.listGoals(sessionId, workspaceId);
  }

  private async requireWorkspaceAccess(sessionId: string, workspaceId: string) {
    const session = await this.requireSession(sessionId);
    const workspace = await this.repo.findWorkspace(workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    assertOrgAccess({ orgId: session.orgId }, workspace.orgId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    return { session, user, workspace };
  }

  private requireManager(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.manager) {
      throw new Error("Manager access required");
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
