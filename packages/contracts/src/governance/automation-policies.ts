import { z } from "zod";

export const APPROVAL_THRESHOLDS = ["low", "medium", "high"] as const;
export type ApprovalThreshold = (typeof APPROVAL_THRESHOLDS)[number];

export interface AutomationPoliciesView {
  requireApproval: boolean;
  managerApprovalThreshold: ApprovalThreshold;
  maxConcurrentRuns: number;
  emergencyDisabled: boolean;
  defaultOwnership: "creator" | "workspace_admin";
  executionPermission: "member" | "manager";
  workspaceDefaultsEnabled: boolean;
}

export const DEFAULT_AUTOMATION_POLICIES: AutomationPoliciesView = {
  requireApproval: true,
  managerApprovalThreshold: "medium",
  maxConcurrentRuns: 5,
  emergencyDisabled: false,
  defaultOwnership: "creator",
  executionPermission: "manager",
  workspaceDefaultsEnabled: true,
};

export const UpdateAutomationPoliciesSchema = z.object({
  requireApproval: z.boolean().optional(),
  managerApprovalThreshold: z.enum(APPROVAL_THRESHOLDS).optional(),
  maxConcurrentRuns: z.number().int().min(1).max(100).optional(),
  emergencyDisabled: z.boolean().optional(),
  defaultOwnership: z.enum(["creator", "workspace_admin"]).optional(),
  executionPermission: z.enum(["member", "manager"]).optional(),
  workspaceDefaultsEnabled: z.boolean().optional(),
});

export type UpdateAutomationPoliciesInput = z.infer<typeof UpdateAutomationPoliciesSchema>;
