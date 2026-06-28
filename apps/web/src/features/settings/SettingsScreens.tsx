import { type FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AccountSettingsView,
  BillingSettingsView,
  IntegrationsSettingsView,
  NotificationsSettingsView,
  PrivacySettingsView,
  SettingsHomeView,
  SettingsSectionView,
  TeamManagementView,
  WorkspaceSettingsFormView,
  authLinkStyle,
} from "@conquest/presentation";
import type {
  AccountProfileView,
  BillingSettingsView as BillingView,
  IntegrationView,
  NotificationPreferences,
  PrivacySettingsView as PrivacyView,
  TeamMemberView,
  PendingTeamInviteView,
  ThemePreference,
  UserPreferences,
  WorkspaceSettingsView,
} from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { useAuth } from "../../auth/AuthContext.js";
import * as client from "../../auth/client.js";
import { ROUTES } from "../../shared/config/routes.js";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";

function SettingsBackLink() {
  return (
    <p>
      <Link to={ROUTES.settings.home} style={authLinkStyle}>
        ← Settings
      </Link>
    </p>
  );
}

/** SET-01 */
export function SettingsHomeScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Array<{ id: string; label: string; route: string }>>([]);

  useEffect(() => {
    logScreenEvent("SET-01", "view");
    client.fetchSettingsCategories().then((data) => setCategories(data.categories));
  }, []);

  if (!user) return null;
  return <SettingsHomeView categories={categories} />;
}

/** SET-02 */
export function AccountSettingsScreen() {
  const [profile, setProfile] = useState<AccountProfileView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-02", "view");
    client.fetchAccountProfile().then((data) => setProfile(data.profile));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const next = await client.updateAccountProfile({ displayName: String(data.get("displayName")) });
      setProfile(next.profile);
      setMessage("Profile updated.");
      logScreenEvent("SET-02", "saved");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  if (!profile) return <p role="status">{GisStateLabels[GisState.Load]}</p>;

  return (
    <>
      <SettingsBackLink />
      <AccountSettingsView profile={profile} loading={loading} error={error} message={message} onSubmit={onSubmit} />
    </>
  );
}

/** SET-03 — implemented in GovernanceScreens.tsx */

/** SET-04 */
export function NotificationsSettingsScreen() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-04", "view");
    client.fetchNotificationPreferences().then((data) => setPreferences(data.notifications));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    const categories = {
      alerts: data.get("category-alerts") === "on",
      recommendations: data.get("category-recommendations") === "on",
      reports: data.get("category-reports") === "on",
      automation: data.get("category-automation") === "on",
      security: data.get("category-security") === "on",
    };
    try {
      const next = await client.updateNotificationPreferences({
        emailDigest: data.get("emailDigest") === "on",
        quietHoursEnabled: data.get("quietHoursEnabled") === "on",
        categories,
      });
      setPreferences(next.notifications);
      setMessage("Notification preferences saved.");
      logScreenEvent("SET-04", "saved");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  if (!preferences) return <p role="status">{GisStateLabels[GisState.Load]}</p>;

  return (
    <>
      <SettingsBackLink />
      <NotificationsSettingsView
        preferences={preferences}
        loading={loading}
        message={message}
        error={error}
        onSubmit={onSubmit}
      />
    </>
  );
}

/** SET-05 */
export function PrivacySettingsScreen() {
  const [privacy, setPrivacy] = useState<PrivacyView | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-05", "view");
    client.fetchPrivacySettings().then((data) => setPrivacy(data.privacy));
  }, []);

  async function onExport() {
    setLoading(true);
    try {
      const result = await client.requestPrivacyExport();
      setMessage(result.message);
      const refreshed = await client.fetchPrivacySettings();
      setPrivacy(refreshed.privacy);
      logScreenEvent("SET-05", "export_requested");
    } finally {
      setLoading(false);
    }
  }

  async function onDeletion() {
    setLoading(true);
    try {
      const result = await client.requestPrivacyDeletion();
      setMessage(result.message);
      const refreshed = await client.fetchPrivacySettings();
      setPrivacy(refreshed.privacy);
      logScreenEvent("SET-05", "deletion_requested");
    } finally {
      setLoading(false);
    }
  }

  if (!privacy) return <p role="status">{GisStateLabels[GisState.Load]}</p>;

  return (
    <>
      <SettingsBackLink />
      <PrivacySettingsView
        privacy={privacy}
        loading={loading}
        message={message}
        onExport={() => void onExport()}
        onDeletion={() => void onDeletion()}
      />
    </>
  );
}

/** SET-06 */
export function AppearanceSettingsScreen() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-06", "view");
    client.fetchPreferences().then((data) => setPreferences(data.preferences));
  }, []);

  async function saveTheme(theme: ThemePreference) {
    setLoading(true);
    try {
      const next = await client.updatePreferences({ theme });
      setPreferences(next.preferences);
      setMessage("Appearance saved.");
      logScreenEvent("SET-06", "saved");
    } finally {
      setLoading(false);
    }
  }

  if (!preferences) return <p role="status">{GisStateLabels[GisState.Load]}</p>;

  return (
    <>
      <SettingsBackLink />
      <SettingsSectionView title="Appearance" subtitle="Theme and display preferences.">
        <fieldset disabled={loading}>
          <legend>Theme</legend>
          {(["light", "dark", "system"] as const).map((theme) => (
            <label key={theme} style={{ display: "block", marginBottom: "0.5rem" }}>
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={preferences.theme === theme}
                onChange={() => void saveTheme(theme)}
              />{" "}
              {theme}
            </label>
          ))}
        </fieldset>
        {message ? <p role="status">{message}</p> : null}
      </SettingsSectionView>
    </>
  );
}

/** SET-07 */
export function BillingSettingsScreen() {
  const [billing, setBilling] = useState<BillingView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-07", "view");
    client
      .fetchBillingSettings()
      .then((data) => setBilling(data.billing))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")));
  }, []);

  return (
    <>
      <SettingsBackLink />
      {error ? <p role="alert">{error}</p> : null}
      {billing ? (
        <BillingSettingsView billing={billing} />
      ) : (
        !error && <p role="status">{GisStateLabels[GisState.Load]}</p>
      )}
    </>
  );
}

/** SET-08 */
export function IntegrationsSettingsScreen() {
  const [integrations, setIntegrations] = useState<IntegrationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-08", "view");
    client
      .fetchIntegrations()
      .then((data) => setIntegrations(data.integrations))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")));
  }, []);

  async function onConnect(id: string) {
    setLoading(true);
    try {
      const data = await client.connectIntegration(id);
      setIntegrations(data.integrations);
      logScreenEvent("SET-08", "connected", { integrationId: id });
    } finally {
      setLoading(false);
    }
  }

  async function onDisconnect(id: string) {
    setLoading(true);
    try {
      const data = await client.disconnectIntegration(id);
      setIntegrations(data.integrations);
      logScreenEvent("SET-08", "disconnected", { integrationId: id });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      {error ? <p role="alert">{error}</p> : null}
      <IntegrationsSettingsView
        integrations={integrations}
        loading={loading}
        onConnect={(id) => void onConnect(id)}
        onDisconnect={(id) => void onDisconnect(id)}
      />
    </>
  );
}

/** SET-09 */
export function WorkspaceSettingsScreen() {
  const { workspaceId = "" } = useParams();
  const [workspace, setWorkspace] = useState<WorkspaceSettingsView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-09", "view", { workspaceId });
    client
      .fetchWorkspaceSettings(workspaceId)
      .then((data) => setWorkspace(data.workspace))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")));
  }, [workspaceId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const next = await client.updateWorkspaceSettings(workspaceId, {
        name: String(data.get("name")),
        workspaceType: String(data.get("workspaceType")),
        primaryGoal: String(data.get("primaryGoal")),
      });
      setWorkspace(next.workspace);
      setMessage("Workspace updated.");
      logScreenEvent("SET-09", "saved");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  if (!workspace && !error) return <p role="status">{GisStateLabels[GisState.Load]}</p>;

  return (
    <>
      <SettingsBackLink />
      {workspace ? (
        <WorkspaceSettingsFormView
          workspace={workspace}
          loading={loading}
          error={error}
          message={message}
          onSubmit={onSubmit}
        />
      ) : (
        <p role="alert">{error}</p>
      )}
    </>
  );
}

/** SET-10 */
export function TeamManagementScreen() {
  const { workspaceId = "" } = useParams();
  const [members, setMembers] = useState<TeamMemberView[]>([]);
  const [invites, setInvites] = useState<PendingTeamInviteView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-10", "view", { workspaceId });
    client
      .fetchTeam(workspaceId)
      .then((data) => {
        setMembers(data.members);
        setInvites(data.invites);
      })
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")));
  }, [workspaceId]);

  async function onInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      await client.inviteTeamMember(workspaceId, {
        email: String(data.get("email")),
        role: String(data.get("role")) as "admin" | "manager" | "member" | "viewer",
      });
      const refreshed = await client.fetchTeam(workspaceId);
      setMembers(refreshed.members);
      setInvites(refreshed.invites);
      setMessage("Invitation sent.");
      logScreenEvent("SET-10", "invite_sent");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(userId: string) {
    setLoading(true);
    setError(null);
    try {
      const refreshed = await client.removeTeamMember(workspaceId, userId);
      setMembers(refreshed.members);
      logScreenEvent("SET-10", "member_removed");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <TeamManagementView
        members={members}
        invites={invites}
        loading={loading}
        error={error}
        message={message}
        onInvite={onInvite}
        onRemove={(userId) => void onRemove(userId)}
      />
    </>
  );
}

/** SET-17 moved to features/organization/OrganizationScreens.tsx */
