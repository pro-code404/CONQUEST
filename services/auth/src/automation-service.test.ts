import { describe, it, expect, beforeEach } from "vitest";
import { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
import { AutomationService } from "./automation-service.js";

describe("AutomationService", () => {
  let repo: AsyncMemoryAuthRepository;
  let service: AutomationService;
  let sessionId: string;
  let workspaceId: string;
  let orgId: string;

  beforeEach(() => {
    repo = new AsyncMemoryAuthRepository();
    service = new AutomationService(repo);
    const org = repo.sync.createOrg("Org");
    orgId = org.id;
    const user = repo.sync.createUser({
      id: "user-1",
      orgId: org.id,
      email: "member@example.com",
      passwordHash: "hash",
      role: "manager",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Manager",
      createdAt: Date.now(),
    });
    const workspace = repo.sync.createWorkspace({
      id: "ws-1",
      orgId: org.id,
      name: "Workspace",
      slug: "workspace",
      workspaceType: "team",
      primaryGoal: "Automate",
      archived: false,
      createdAt: Date.now(),
    });
    workspaceId = workspace.id;
    repo.sync.addWorkspaceMember(workspace.id, user.id);
    sessionId = "session-1";
    repo.sync.saveSession({
      id: sessionId,
      userId: user.id,
      orgId: org.id,
      activeWorkspaceId: workspace.id,
      authStrength: "password",
      deviceId: "device",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
  });

  it("creates and lists workflows", async () => {
    const created = await service.createWorkflow(sessionId, workspaceId, {
      name: "Daily report",
      description: "Send daily summary",
      trigger: { type: "manual" },
      actions: ["Send email digest"],
    });
    expect(created.name).toBe("Daily report");
    const center = await service.listWorkflows(sessionId, workspaceId);
    expect(center.workflows).toHaveLength(1);
  });

  it("rejects invalid schedule trigger without schedule", async () => {
    await expect(
      service.createWorkflow(sessionId, workspaceId, {
        name: "Bad",
        trigger: { type: "schedule" },
        actions: ["act"],
      }),
    ).rejects.toThrow();
  });

  it("enables and disables workflow", async () => {
    const created = await service.createWorkflow(sessionId, workspaceId, {
      name: "Flow",
      trigger: { type: "manual" },
      actions: ["act"],
    });
    const enabled = await service.enableWorkflow(sessionId, workspaceId, created.id);
    expect(enabled.status).toBe("active");
    const disabled = await service.disableWorkflow(sessionId, workspaceId, created.id);
    expect(disabled.status).toBe("disabled");
  });

  it("records manual run without execution engine", async () => {
    const created = await service.createWorkflow(sessionId, workspaceId, {
      name: "Flow",
      trigger: { type: "manual" },
      actions: ["act"],
    });
    await service.enableWorkflow(sessionId, workspaceId, created.id);
    const execution = await service.manualRun(sessionId, workspaceId, created.id);
    expect(execution.message).toContain("autonomous execution remains deferred");
    const history = await service.listExecutions(sessionId, workspaceId, created.id);
    expect(history).toHaveLength(1);
  });

  it("filters workflows by search", async () => {
    await service.createWorkflow(sessionId, workspaceId, {
      name: "Alpha",
      trigger: { type: "manual" },
      actions: ["a"],
    });
    await service.createWorkflow(sessionId, workspaceId, {
      name: "Beta",
      trigger: { type: "manual" },
      actions: ["b"],
    });
    const center = await service.listWorkflows(sessionId, workspaceId, { search: "alpha" });
    expect(center.workflows).toHaveLength(1);
  });

  it("handles approval workflow lifecycle", async () => {
    const created = await service.createWorkflow(sessionId, workspaceId, {
      name: "Needs approval",
      trigger: { type: "manual" },
      actions: ["act"],
      submitForApproval: true,
    });
    expect(created.status).toBe("pending_approval");
    const approvals = await service.listApprovals(sessionId, workspaceId);
    expect(approvals).toHaveLength(1);
    await service.approveWorkflow(sessionId, workspaceId, created.id);
    const enabled = await service.enableWorkflow(sessionId, workspaceId, created.id);
    expect(enabled.enabled).toBe(true);
  });

  it("archives workflow", async () => {
    const created = await service.createWorkflow(sessionId, workspaceId, {
      name: "Archive me",
      trigger: { type: "manual" },
      actions: ["act"],
    });
    const archived = await service.archiveWorkflow(sessionId, workspaceId, created.id);
    expect(archived.archived).toBe(true);
    expect((await service.listWorkflows(sessionId, workspaceId)).workflows).toHaveLength(0);
  });

  it("validates trigger and schedule inputs", async () => {
    expect((await service.validateTriggerInput({ type: "event" })).valid).toBe(false);
    expect((await service.validateTriggerInput({ type: "manual" })).valid).toBe(true);
    expect(
      (await service.validateScheduleInput({ enabled: true, cron: "bad", timezone: "UTC" })).valid,
    ).toBe(false);
  });

  it("enforces member access", async () => {
    const viewer = repo.sync.createUser({
      id: "viewer-1",
      orgId,
      email: "viewer@example.com",
      passwordHash: "hash",
      role: "viewer",
      emailVerified: true,
      onboardingComplete: true,
      onboardingStage: "done",
      displayName: "Viewer",
      createdAt: Date.now(),
    });
    repo.sync.saveSession({
      id: "viewer-session",
      userId: viewer.id,
      orgId: viewer.orgId,
      activeWorkspaceId: workspaceId,
      authStrength: "password",
      deviceId: "device",
      expiresAt: Date.now() + 60_000,
      revoked: false,
      createdAt: Date.now(),
    });
    await expect(service.listWorkflows("viewer-session", workspaceId)).rejects.toThrow();
  });
});
