import { z } from "zod";
import type { UserRole } from "../auth/schemas.js";

export interface PendingOrgInviteView {
  inviteId: string;
  email: string;
  role: UserRole;
  inviterName: string;
  expiresAt: string;
}

export const InviteOrgMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "manager", "member", "viewer"]),
});

export type InviteOrgMemberInput = z.infer<typeof InviteOrgMemberSchema>;

export const UpdateOrganizationMemberRoleSchema = z.object({
  role: z.enum(["admin", "manager", "member", "viewer"]),
});

export type UpdateOrganizationMemberRoleInput = z.infer<typeof UpdateOrganizationMemberRoleSchema>;

export const ORGANIZATION_ROLE_PERMISSIONS: ReadonlyArray<{
  role: UserRole;
  description: string;
}> = [
  { role: "owner", description: "Full organization control including billing" },
  { role: "admin", description: "Manage members, integrations, and policies" },
  { role: "manager", description: "Manage workspaces and invite team members" },
  { role: "member", description: "Access assigned workspaces and collaborate" },
  { role: "viewer", description: "Read-only access to assigned workspaces" },
];

export function settingsOrganizationMembersRoute(): string {
  return "/app/settings/organization/members";
}
