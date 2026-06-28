import { randomUUID } from "node:crypto";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  CreateWorkflowSchema,
  UpdateWorkflowSchema,
  validateTrigger,
  validateSchedule,
  validateWorkflowTriggerSchedule,
  type AutomationCenterView,
  type CreateWorkflowInput,
  type ExecutionRecordView,
  type PendingApprovalView,
  type TriggerType,
  type UpdateWorkflowInput,
  type WorkflowDetailView,
  type WorkflowSchedule,
  type WorkflowSummaryView,
  type WorkflowTrigger,
} from "@conquest/contracts";
import type { ExecutionRecord, WorkflowRecord } from "./memory-repository.js";
import type { AuthRepository } from "./auth-repository.js";
import type { UserRole } from "@conquest/contracts";

const ENGINE_MESSAGE =
  "Workflow validated and recorded — autonomous execution remains deferred per Build-2 governance.";

export class AutomationService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTOMATION;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async listWorkflows(
    sessionId: string,
    workspaceId: string,
    filter?: { search?: string; status?: string },
  ): Promise<AutomationCenterView> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    let workflows = await Promise.all(
      (await this.repo.listWorkflowsForWorkspace(workspaceId)).map((workflow) => this.toSummary(workflow)),
    );

    if (filter?.search?.trim()) {
      const q = filter.search.trim().toLowerCase();
      workflows = workflows.filter(
        (w) => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q),
      );
    }
    if (filter?.status) {
      workflows = workflows.filter((w) => w.status === filter.status);
    }

    const pendingApprovalsCount = workflows.filter((w) => w.pendingApproval).length;
    return { workflows, pendingApprovalsCount };
  }

  async getWorkflow(sessionId: string, workspaceId: string, workflowId: string): Promise<WorkflowDetailView> {
    const { workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    return this.toDetail(workflow);
  }

  async createWorkflow(
    sessionId: string,
    workspaceId: string,
    raw: CreateWorkflowInput,
  ): Promise<WorkflowDetailView> {
    const input = CreateWorkflowSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);

    const schedule = input.schedule ?? null;
    const validationError = validateWorkflowTriggerSchedule(
      normalizeTrigger(input.trigger),
      schedule,
    );
    if (validationError) throw new Error(validationError);
    if (input.actions.length === 0) throw new Error("At least one action is required");

    const now = Date.now();
    const status = input.submitForApproval ? "pending_approval" : "draft";
    const workflow: WorkflowRecord = {
      id: randomUUID(),
      workspaceId: workspace.id,
      orgId: workspace.orgId,
      name: input.name.trim(),
      description: input.description ?? "",
      status,
      enabled: false,
      archived: false,
      trigger: normalizeTrigger(input.trigger),
      schedule,
      conditions: input.conditions ?? [],
      actions: input.actions,
      createdBy: user.id,
      createdByName: user.displayName,
      createdAt: now,
      updatedAt: now,
    };
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_created", "info", { workflowId: workflow.id, workspaceId });
    return this.toDetail(workflow);
  }

  async updateWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
    raw: UpdateWorkflowInput,
  ): Promise<WorkflowDetailView> {
    const input = UpdateWorkflowSchema.parse(raw);
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireMember(user);
    if (workflow.archived) throw new Error("Cannot update archived workflow");

    if (input.name !== undefined) workflow.name = input.name.trim();
    if (input.description !== undefined) workflow.description = input.description;
    if (input.trigger !== undefined) workflow.trigger = normalizeTrigger(input.trigger);
    if (input.schedule !== undefined) workflow.schedule = input.schedule;
    if (input.conditions !== undefined) workflow.conditions = input.conditions;
    if (input.actions !== undefined) workflow.actions = input.actions;

    const validationError = validateWorkflowTriggerSchedule(workflow.trigger, workflow.schedule);
    if (validationError) throw new Error(validationError);

    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_updated", "info", { workflowId: workflow.id });
    return this.toDetail(workflow);
  }

  async archiveWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    workflow.archived = true;
    workflow.enabled = false;
    workflow.status = "archived";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_archived", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async enableWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    await this.assertAutomationAllowed(workflow.orgId);
    if (workflow.status === "pending_approval") {
      throw new Error("Workflow must be approved before enabling");
    }
    workflow.enabled = true;
    workflow.status = "active";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_enabled", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async disableWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    workflow.enabled = false;
    workflow.status = "disabled";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_disabled", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async pauseWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireMember(user);
    if (!workflow.enabled) throw new Error("Workflow is not active");
    workflow.status = "paused";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_paused", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async resumeWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    if (workflow.status !== "paused") throw new Error("Workflow is not paused");
    workflow.enabled = true;
    workflow.status = "active";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_resumed", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async manualRun(sessionId: string, workspaceId: string, workflowId: string): Promise<ExecutionRecordView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireMember(user);
    await this.assertAutomationAllowed(workflow.orgId);
    const policies = await this.repo.getAutomationPolicies(workflow.orgId);
    if (ROLE_RANK[user.role] < ROLE_RANK.manager && policies.executionPermission === "manager") {
      throw new Error("Manager permission required to run automations");
    }
    if (!workflow.enabled && workflow.status !== "active" && workflow.status !== "paused") {
      throw new Error("Enable workflow before running");
    }
    const execution = await this.recordExecution(workflow, user.id, "manual", user.displayName);
    this.emit("workflow_manual_run", "info", { workflowId, executionId: execution.id });
    return this.toExecutionView(execution);
  }

  async listExecutions(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<ExecutionRecordView[]> {
    await this.requireWorkflow(sessionId, workspaceId, workflowId);
    return (await this.repo.listExecutionsForWorkflow(workflowId)).map((e) => this.toExecutionView(e));
  }

  async listApprovals(sessionId: string, workspaceId: string): Promise<PendingApprovalView[]> {
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);
    return (await this.repo.listWorkflowsForWorkspace(workspaceId))
      .filter((w) => w.status === "pending_approval")
      .map((w) => ({
        workflowId: w.id,
        name: w.name,
        description: w.description,
        submittedBy: w.createdByName,
        submittedAt: new Date(w.createdAt).toISOString(),
        triggerType: w.trigger.type,
      }));
  }

  async approveWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    if (workflow.status !== "pending_approval") throw new Error("Workflow is not pending approval");
    workflow.status = "draft";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_approved", "info", { workflowId });
    return this.toDetail(workflow);
  }

  async rejectWorkflow(
    sessionId: string,
    workspaceId: string,
    workflowId: string,
  ): Promise<WorkflowDetailView> {
    const { user, workflow } = await this.requireWorkflow(sessionId, workspaceId, workflowId);
    this.requireManager(user);
    if (workflow.status !== "pending_approval") throw new Error("Workflow is not pending approval");
    workflow.status = "draft";
    workflow.updatedAt = Date.now();
    await this.repo.saveWorkflow(workflow);
    this.emit("workflow_rejected", "warn", { workflowId });
    return this.toDetail(workflow);
  }

  async validateTriggerInput(trigger: WorkflowTrigger): Promise<{ valid: boolean; error?: string }> {
    const error = validateTrigger(trigger);
    return error ? { valid: false, error } : { valid: true };
  }

  async validateScheduleInput(schedule: WorkflowSchedule): Promise<{ valid: boolean; error?: string }> {
    const error = validateSchedule(schedule);
    return error ? { valid: false, error } : { valid: true };
  }

  private async recordExecution(
    workflow: WorkflowRecord,
    userId: string,
    triggerType: TriggerType,
    actorName: string,
  ): Promise<ExecutionRecord> {
    const now = Date.now();
    const execution: ExecutionRecord = {
      id: randomUUID(),
      workflowId: workflow.id,
      workspaceId: workflow.workspaceId,
      orgId: workflow.orgId,
      status: "succeeded",
      startedAt: now,
      completedAt: now,
      message: ENGINE_MESSAGE,
      steps: [
        { name: "Validate workflow", status: "succeeded", timestamp: now },
        { name: "Record manual run", status: "succeeded", timestamp: now },
        { name: `Triggered by ${actorName}`, status: "info", timestamp: now },
      ],
      triggeredBy: userId,
      triggerType,
    };
    await this.repo.saveExecution(execution);
    return execution;
  }

  private async toSummary(workflow: WorkflowRecord): Promise<WorkflowSummaryView> {
    const executions = await this.repo.listExecutionsForWorkflow(workflow.id);
    const succeeded = executions.filter((e) => e.status === "succeeded").length;
    const successRate = executions.length > 0 ? Math.round((succeeded / executions.length) * 100) : 0;
    const last = executions[0];
    return {
      id: workflow.id,
      workspaceId: workflow.workspaceId,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      enabled: workflow.enabled,
      triggerType: workflow.trigger.type,
      successRate,
      lastRunAt: last ? new Date(last.startedAt).toISOString() : null,
      nextRunAt:
        workflow.enabled && workflow.schedule?.enabled
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          : null,
      pendingApproval: workflow.status === "pending_approval",
    };
  }

  private async toDetail(workflow: WorkflowRecord): Promise<WorkflowDetailView> {
    return {
      ...(await this.toSummary(workflow)),
      trigger: workflow.trigger,
      schedule: workflow.schedule,
      conditions: workflow.conditions,
      actions: workflow.actions,
      archived: workflow.archived,
      createdAt: new Date(workflow.createdAt).toISOString(),
      updatedAt: new Date(workflow.updatedAt).toISOString(),
    };
  }

  private toExecutionView(execution: ExecutionRecord): ExecutionRecordView {
    return {
      id: execution.id,
      workflowId: execution.workflowId,
      status: execution.status,
      startedAt: new Date(execution.startedAt).toISOString(),
      completedAt: execution.completedAt ? new Date(execution.completedAt).toISOString() : null,
      message: execution.message,
      triggerType: execution.triggerType,
      steps: execution.steps.map((step) => ({
        name: step.name,
        status: step.status,
        timestamp: new Date(step.timestamp).toISOString(),
      })),
    };
  }

  private async requireWorkflow(sessionId: string, workspaceId: string, workflowId: string) {
    const access = await this.requireWorkspaceAccess(sessionId, workspaceId);
    const workflow = await this.repo.findWorkflow(workflowId);
    if (!workflow || workflow.workspaceId !== workspaceId) {
      throw new Error("Workflow not found");
    }
    assertOrgAccess({ orgId: access.session.orgId }, workflow.orgId);
    return { ...access, workflow };
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

  private requireMember(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.member) {
      throw new Error("Member access required");
    }
  }

  private requireManager(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.manager) {
      throw new Error("Manager access required");
    }
  }

  private async assertAutomationAllowed(orgId: string): Promise<void> {
    const policies = await this.repo.getAutomationPolicies(orgId);
    if (policies.emergencyDisabled) {
      throw new Error("Automation is emergency-disabled by organization policy");
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

function normalizeTrigger(trigger: {
  type: WorkflowTrigger["type"];
  eventName?: string | undefined;
}): WorkflowTrigger {
  if (trigger.type === "event") {
    return trigger.eventName
      ? { type: "event", eventName: trigger.eventName }
      : { type: "event" };
  }
  return { type: trigger.type };
}
