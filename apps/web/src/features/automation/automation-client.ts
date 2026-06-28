import type {
  AutomationCenterView,
  CreateWorkflowInput,
  ExecutionRecordView,
  PendingApprovalView,
  TriggerType,
  WorkflowDetailView,
} from "@conquest/contracts";

const API_BASE = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(`${response.status}: ${body.error ?? response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchAutomationCenter(
  workspaceId: string,
  params?: { search?: string; status?: string },
) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<AutomationCenterView>(`/api/workspaces/${workspaceId}/automation/workflows${suffix}`);
}

export async function fetchWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}`,
  );
}

export async function createWorkflow(workspaceId: string, body: CreateWorkflowInput) {
  return request<{ workflow: WorkflowDetailView }>(`/api/workspaces/${workspaceId}/automation/workflows`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function enableWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/enable`,
    { method: "POST" },
  );
}

export async function disableWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/disable`,
    { method: "POST" },
  );
}

export async function pauseWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/pause`,
    { method: "POST" },
  );
}

export async function resumeWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/resume`,
    { method: "POST" },
  );
}

export async function archiveWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/archive`,
    { method: "POST" },
  );
}

export async function manualRunWorkflow(workspaceId: string, workflowId: string) {
  return request<{ execution: ExecutionRecordView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/run`,
    { method: "POST" },
  );
}

export async function fetchExecutions(workspaceId: string, workflowId: string) {
  return request<{ executions: ExecutionRecordView[] }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/executions`,
  );
}

export async function fetchApprovals(workspaceId: string) {
  return request<{ approvals: PendingApprovalView[] }>(
    `/api/workspaces/${workspaceId}/automation/approvals`,
  );
}

export async function approveWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/approve`,
    { method: "POST" },
  );
}

export async function rejectWorkflow(workspaceId: string, workflowId: string) {
  return request<{ workflow: WorkflowDetailView }>(
    `/api/workspaces/${workspaceId}/automation/workflows/${workflowId}/reject`,
    { method: "POST" },
  );
}

export function parseBuilderForm(form: FormData): CreateWorkflowInput {
  const triggerType = String(form.get("triggerType")) as TriggerType;
  const scheduleEnabled = form.get("scheduleEnabled") === "on";
  const trigger =
    triggerType === "event"
      ? { type: triggerType, eventName: String(form.get("eventName") || "") }
      : { type: triggerType };
  const actions = String(form.get("actions") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    name: String(form.get("name")),
    description: String(form.get("description") || ""),
    trigger,
    schedule:
      triggerType === "schedule" || scheduleEnabled
        ? {
            enabled: scheduleEnabled || triggerType === "schedule",
            cron: String(form.get("cron") || "0 9 * * *"),
            timezone: String(form.get("timezone") || "UTC"),
          }
        : null,
    actions,
    submitForApproval: form.get("submitForApproval") === "on",
  };
}
