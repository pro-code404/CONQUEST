import type { FormEvent } from "react";
import { GisState, GisStateLabels, spacing, typography } from "@conquest/gis";
import type {
  OrganizationMemberView,
  OrganizationSettingsView,
  PendingOrgInviteView,
  UserRole,
} from "@conquest/contracts";
import { ORGANIZATION_ROLE_PERMISSIONS } from "@conquest/contracts";
import { SettingsSectionView } from "../settings/SettingsSectionViews.js";

const fieldStyle = { display: "block", width: "100%", marginBottom: spacing.md };

export interface OrganizationOverviewViewProps {
  organization: OrganizationSettingsView | null;
  loading: boolean;
  error: string | null;
  membersHref: string;
}

export function OrganizationOverviewView({
  organization,
  loading,
  error,
  membersHref,
}: OrganizationOverviewViewProps) {
  return (
    <SettingsSectionView title="Organization" subtitle="Organization governance and overview.">
      {error ? <p role="alert">{error}</p> : null}
      {loading && !organization ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {organization ? (
        <>
          <dl>
            <dt>Name</dt>
            <dd>{organization.name}</dd>
            <dt>Workspaces</dt>
            <dd>{organization.workspaceCount}</dd>
            <dt>Members</dt>
            <dd>{organization.memberCount}</dd>
          </dl>
          <p style={{ marginTop: spacing.lg }}>
            <a href={membersHref}>Manage members and invitations</a>
          </p>
          <h2 style={{ fontSize: typography.fontSizeLg, marginTop: spacing.xl }}>Roles and permissions</h2>
          <ul>
            {ORGANIZATION_ROLE_PERMISSIONS.map((entry) => (
              <li key={entry.role} style={{ marginBottom: spacing.sm }}>
                <strong>{entry.role}</strong> — {entry.description}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </SettingsSectionView>
  );
}

export interface OrganizationMembersViewProps {
  members: OrganizationMemberView[];
  invites: PendingOrgInviteView[];
  loading: boolean;
  error: string | null;
  message: string | null;
  onInvite: (event: FormEvent<HTMLFormElement>) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  onRemove: (userId: string) => void;
}

export function OrganizationMembersView({
  members,
  invites,
  loading,
  error,
  message,
  onInvite,
  onRoleChange,
  onRemove,
}: OrganizationMembersViewProps) {
  return (
    <SettingsSectionView title="Member directory" subtitle="Organization members, roles, and invitations.">
      <form onSubmit={onInvite} aria-busy={loading} style={{ marginBottom: spacing.lg }}>
        <label htmlFor="orgInviteEmail">Invite by email</label>
        <input id="orgInviteEmail" name="email" type="email" required style={fieldStyle} />
        <label htmlFor="orgInviteRole">Role</label>
        <select id="orgInviteRole" name="role" defaultValue="member" style={fieldStyle}>
          <option value="viewer">Viewer</option>
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          Send invite
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      <h2 style={{ fontSize: typography.fontSizeLg }}>Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.userId} style={{ marginBottom: spacing.sm }}>
            {member.displayName} ({member.email})
            {member.role === "owner" ? (
              <span> — owner</span>
            ) : (
              <>
                {" "}
                <select
                  aria-label={`Role for ${member.displayName}`}
                  value={member.role}
                  onChange={(event) => onRoleChange(member.userId, event.target.value as UserRole)}
                  disabled={loading}
                >
                  <option value="viewer">viewer</option>
                  <option value="member">member</option>
                  <option value="manager">manager</option>
                  <option value="admin">admin</option>
                </select>
                <button type="button" style={{ marginLeft: spacing.sm }} onClick={() => onRemove(member.userId)}>
                  Remove
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2 style={{ fontSize: typography.fontSizeLg }}>Pending invitations</h2>
      <ul>
        {invites.map((invite) => (
          <li key={invite.inviteId}>
            {invite.email} — {invite.role} (expires {invite.expiresAt})
          </li>
        ))}
      </ul>
    </SettingsSectionView>
  );
}
