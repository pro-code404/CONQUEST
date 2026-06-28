import { z } from "zod";

export const WORKFLOW_STATUSES = [
  "draft",
  "active",
  "paused",
  "disabled",
  "pending_approval",
  "archived",
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

export const TRIGGER_TYPES = ["manual", "schedule", "event"] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const EXECUTION_STATUSES = ["pending", "running", "succeeded", "failed", "cancelled"] as const;
export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export interface WorkflowTrigger {
  type: TriggerType;
  eventName?: string;
}

export interface WorkflowSchedule {
  enabled: boolean;
  cron: string;
  timezone: string;
}

export interface WorkflowSummaryView {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  enabled: boolean;
  triggerType: TriggerType;
  successRate: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  pendingApproval: boolean;
}

export interface WorkflowDetailView extends WorkflowSummaryView {
  trigger: WorkflowTrigger;
  schedule: WorkflowSchedule | null;
  conditions: string[];
  actions: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionStepView {
  name: string;
  status: string;
  timestamp: string;
}

export interface ExecutionRecordView {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt: string | null;
  message: string;
  triggerType: TriggerType;
  steps: ExecutionStepView[];
}

export interface AutomationCenterView {
  workflows: WorkflowSummaryView[];
  pendingApprovalsCount: number;
}

export interface PendingApprovalView {
  workflowId: string;
  name: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  triggerType: TriggerType;
}

export const WorkflowTriggerSchema = z.object({
  type: z.enum(TRIGGER_TYPES),
  eventName: z.string().min(1).max(120).optional(),
});

export const WorkflowScheduleSchema = z.object({
  enabled: z.boolean(),
  cron: z.string().min(1).max(120),
  timezone: z.string().min(1).max(80),
});

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).default(""),
  trigger: WorkflowTriggerSchema,
  schedule: WorkflowScheduleSchema.nullable().optional(),
  conditions: z.array(z.string().min(1).max(240)).max(20).default([]),
  actions: z.array(z.string().min(1).max(240)).min(1).max(20),
  submitForApproval: z.boolean().optional(),
});

export type CreateWorkflowInput = z.input<typeof CreateWorkflowSchema>;

export const UpdateWorkflowSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  trigger: WorkflowTriggerSchema.optional(),
  schedule: WorkflowScheduleSchema.nullable().optional(),
  conditions: z.array(z.string().min(1).max(240)).max(20).optional(),
  actions: z.array(z.string().min(1).max(240)).min(1).max(20).optional(),
});

export type UpdateWorkflowInput = z.input<typeof UpdateWorkflowSchema>;

export function automationCenterRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/automation`;
}

export function automationDetailRoute(workspaceId: string, workflowId: string): string {
  return `/app/w/${workspaceId}/automation/${workflowId}`;
}

export function automationLogRoute(workspaceId: string, workflowId: string): string {
  return `/app/w/${workspaceId}/automation/${workflowId}/log`;
}
