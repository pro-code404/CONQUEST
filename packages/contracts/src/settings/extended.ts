import { z } from "zod";
import type { UserRole } from "../auth/schemas.js";

export const NOTIFICATION_CATEGORIES = [
  "alerts",
  "recommendations",
  "reports",
  "automation",
  "security",
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export interface NotificationPreferences {
  emailDigest: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  categories: Record<NotificationCategory, boolean>;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailDigest: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  categories: {
    alerts: true,
    recommendations: true,
    reports: true,
    automation: false,
    security: true,
  },
};

export const UpdateNotificationPreferencesSchema = z.object({
  emailDigest: z.boolean().optional(),
  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  quietHoursEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  categories: z
    .object({
      alerts: z.boolean().optional(),
      recommendations: z.boolean().optional(),
      reports: z.boolean().optional(),
      automation: z.boolean().optional(),
      security: z.boolean().optional(),
    })
    .optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<typeof UpdateNotificationPreferencesSchema>;

export interface PrivacySettingsView {
  exportRequestedAt: string | null;
  deletionRequestedAt: string | null;
  retentionSummary: string;
}

export interface PrivacyRequestResult {
  ok: true;
  message: string;
  requestedAt: string;
}

export type BillingPlan = "starter" | "professional" | "enterprise";

export interface BillingSettingsView {
  plan: BillingPlan;
  seatsUsed: number;
  seatLimit: number;
  status: "active" | "past_due";
  renewalDate: string;
}

export type IntegrationStatus = "connected" | "degraded" | "disconnected";

export interface IntegrationView {
  id: string;
  name: string;
  type: string;
  status: IntegrationStatus;
  connectedAt: string | null;
}

export interface WorkspaceSettingsView {
  id: string;
  name: string;
  slug: string;
  workspaceType: string;
  primaryGoal: string;
  archived: boolean;
  state: string;
}

export const UpdateWorkspaceSettingsSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  workspaceType: z.string().min(1).max(80).optional(),
  primaryGoal: z.string().min(1).max(240).optional(),
});

export type UpdateWorkspaceSettingsInput = z.infer<typeof UpdateWorkspaceSettingsSchema>;

export interface TeamMemberView {
  userId: string;
  displayName: string;
  email: string;
  role: UserRole;
}

export interface PendingTeamInviteView {
  inviteId: string;
  email: string;
  role: UserRole;
  inviterName: string;
  expiresAt: string;
}

export const InviteTeamMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "manager", "member", "viewer"]),
});

export type InviteTeamMemberInput = z.infer<typeof InviteTeamMemberSchema>;

export const UpdateTeamMemberRoleSchema = z.object({
  role: z.enum(["admin", "manager", "member", "viewer"]),
});

export type UpdateTeamMemberRoleInput = z.infer<typeof UpdateTeamMemberRoleSchema>;

export function settingsWorkspaceRoute(workspaceId: string): string {
  return `/app/settings/workspace/${workspaceId}`;
}

export function settingsTeamRoute(workspaceId: string): string {
  return `/app/settings/workspace/${workspaceId}/team`;
}

export { settingsSourcesRoute, settingsGoalsRoute } from "../workspace/config.js";
