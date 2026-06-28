import type { CSSProperties, FormEvent, ReactNode } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type {
  AccountProfileView,
  BillingSettingsView,
  IntegrationView,
  NotificationPreferences,
  PrivacySettingsView,
  TeamMemberView,
  PendingTeamInviteView,
  WorkspaceSettingsView,
} from "@conquest/contracts";

export interface SettingsSectionViewProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SettingsSectionView({ title, subtitle, children }: SettingsSectionViewProps) {
  return (
    <section aria-labelledby="settings-section-heading">
      <h1 id="settings-section-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
        {title}
      </h1>
      {subtitle ? <p style={{ color: color.textSecondary }}>{subtitle}</p> : null}
      {children}
    </section>
  );
}

const fieldStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: spacing.md,
  padding: spacing.sm,
};

export interface AccountSettingsViewProps {
  profile: AccountProfileView;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AccountSettingsView({ profile, loading, error, message, onSubmit }: AccountSettingsViewProps) {
  return (
    <SettingsSectionView title="Account" subtitle="Manage your profile and identity.">
      <form onSubmit={onSubmit} aria-busy={loading}>
        <label htmlFor="displayName">Full name</label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={profile.displayName}
          required
          style={fieldStyle}
        />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" value={profile.email} readOnly style={fieldStyle} aria-readonly="true" />
        <label htmlFor="orgName">Organization</label>
        <input id="orgName" name="orgName" value={profile.orgName} readOnly style={fieldStyle} aria-readonly="true" />
        {error ? <p role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? GisStateLabels[GisState.Load] : "Save profile"}
        </button>
      </form>
    </SettingsSectionView>
  );
}

export interface NotificationsSettingsViewProps {
  preferences: NotificationPreferences;
  loading: boolean;
  message: string | null;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function NotificationsSettingsView({
  preferences,
  loading,
  message,
  error,
  onSubmit,
}: NotificationsSettingsViewProps) {
  return (
    <SettingsSectionView title="Notifications" subtitle="Control channels and categories.">
      <form onSubmit={onSubmit} aria-busy={loading}>
        <label style={{ display: "block", marginBottom: spacing.sm }}>
          <input type="checkbox" name="emailDigest" defaultChecked={preferences.emailDigest} /> Email digest
        </label>
        <label style={{ display: "block", marginBottom: spacing.sm }}>
          <input type="checkbox" name="quietHoursEnabled" defaultChecked={preferences.quietHoursEnabled} /> Quiet hours
        </label>
        <fieldset>
          <legend>Categories</legend>
          {Object.entries(preferences.categories).map(([key, enabled]) => (
            <label key={key} style={{ display: "block", marginBottom: spacing.xs }}>
              <input type="checkbox" name={`category-${key}`} defaultChecked={enabled} /> {key}
            </label>
          ))}
        </fieldset>
        {error ? <p role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? GisStateLabels[GisState.Load] : "Save preferences"}
        </button>
      </form>
    </SettingsSectionView>
  );
}

export interface PrivacySettingsViewProps {
  privacy: PrivacySettingsView;
  loading: boolean;
  message: string | null;
  onExport: () => void;
  onDeletion: () => void;
}

export function PrivacySettingsView({ privacy, loading, message, onExport, onDeletion }: PrivacySettingsViewProps) {
  return (
    <SettingsSectionView title="Privacy" subtitle="Data export and deletion requests.">
      <p>{privacy.retentionSummary}</p>
      {privacy.exportRequestedAt ? <p role="status">Export requested: {privacy.exportRequestedAt}</p> : null}
      {privacy.deletionRequestedAt ? <p role="status">Deletion requested: {privacy.deletionRequestedAt}</p> : null}
      <button type="button" disabled={loading} onClick={onExport} style={{ marginRight: spacing.sm }}>
        Request data export
      </button>
      <button type="button" disabled={loading} onClick={onDeletion}>
        Request account deletion
      </button>
      {message ? <p role="status">{message}</p> : null}
    </SettingsSectionView>
  );
}

export interface BillingSettingsViewProps {
  billing: BillingSettingsView;
}

export function BillingSettingsView({ billing }: BillingSettingsViewProps) {
  return (
    <SettingsSectionView title="Billing" subtitle="Subscription and usage.">
      <dl>
        <dt>Plan</dt>
        <dd>{billing.plan}</dd>
        <dt>Seats</dt>
        <dd>
          {billing.seatsUsed} / {billing.seatLimit}
        </dd>
        <dt>Status</dt>
        <dd>{billing.status}</dd>
        <dt>Renewal</dt>
        <dd>{billing.renewalDate}</dd>
      </dl>
    </SettingsSectionView>
  );
}

export interface IntegrationsSettingsViewProps {
  integrations: IntegrationView[];
  loading: boolean;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function IntegrationsSettingsView({
  integrations,
  loading,
  onConnect,
  onDisconnect,
}: IntegrationsSettingsViewProps) {
  return (
    <SettingsSectionView title="Integrations" subtitle="Connected services inventory.">
      <ul style={{ listStyle: "none", padding: 0 }}>
        {integrations.map((integration) => (
          <li
            key={integration.id}
            style={{
              border: `1px solid ${color.border}`,
              borderRadius: "0.5rem",
              padding: spacing.md,
              marginBottom: spacing.sm,
            }}
          >
            <strong>{integration.name}</strong> — {integration.status}
            <div style={{ marginTop: spacing.sm }}>
              {integration.status === "connected" ? (
                <button type="button" disabled={loading} onClick={() => onDisconnect(integration.id)}>
                  Disconnect
                </button>
              ) : (
                <button type="button" disabled={loading} onClick={() => onConnect(integration.id)}>
                  Connect
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SettingsSectionView>
  );
}

export interface WorkspaceSettingsFormViewProps {
  workspace: WorkspaceSettingsView;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function WorkspaceSettingsFormView({
  workspace,
  loading,
  error,
  message,
  onSubmit,
}: WorkspaceSettingsFormViewProps) {
  return (
    <SettingsSectionView title="Workspace settings" subtitle={`State: ${workspace.state}`}>
      <form onSubmit={onSubmit} aria-busy={loading}>
        <label htmlFor="workspaceName">Name</label>
        <input id="workspaceName" name="name" defaultValue={workspace.name} required style={fieldStyle} />
        <label htmlFor="workspaceType">Type</label>
        <input id="workspaceType" name="workspaceType" defaultValue={workspace.workspaceType} required style={fieldStyle} />
        <label htmlFor="primaryGoal">Primary goal</label>
        <input id="primaryGoal" name="primaryGoal" defaultValue={workspace.primaryGoal} required style={fieldStyle} />
        {error ? <p role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? GisStateLabels[GisState.Load] : "Save workspace"}
        </button>
      </form>
    </SettingsSectionView>
  );
}

export interface TeamManagementViewProps {
  members: TeamMemberView[];
  invites: PendingTeamInviteView[];
  loading: boolean;
  error: string | null;
  message: string | null;
  onInvite: (event: FormEvent<HTMLFormElement>) => void;
  onRemove: (userId: string) => void;
}

export function TeamManagementView({
  members,
  invites,
  loading,
  error,
  message,
  onInvite,
  onRemove,
}: TeamManagementViewProps) {
  return (
    <SettingsSectionView title="Team management" subtitle="Members and pending invitations.">
      <form onSubmit={onInvite} aria-busy={loading} style={{ marginBottom: spacing.lg }}>
        <label htmlFor="inviteEmail">Invite by email</label>
        <input id="inviteEmail" name="email" type="email" required style={fieldStyle} />
        <label htmlFor="inviteRole">Role</label>
        <select id="inviteRole" name="role" defaultValue="member" style={fieldStyle}>
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
            {member.displayName} ({member.email}) — {member.role}
            <button type="button" style={{ marginLeft: spacing.sm }} onClick={() => onRemove(member.userId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2 style={{ fontSize: typography.fontSizeLg }}>Pending invites</h2>
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
