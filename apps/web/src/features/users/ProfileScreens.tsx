import { useEffect, useState } from "react";
import { ActiveSessionsView, ProfileView } from "@conquest/presentation";
import type { ActiveSessionView, ProfileSummaryView } from "@conquest/contracts";
import * as client from "../../auth/client.js";
import { ROUTES } from "../../shared/config/routes.js";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";

/** PRF-01 — Profile */
export function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileSummaryView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logScreenEvent("PRF-01", "view");
    client
      .fetchProfile()
      .then((data) => setProfile(data.profile))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProfileView
      profile={profile}
      loading={loading}
      error={error}
      sessionsHref={ROUTES.profile.sessions}
      settingsHref={ROUTES.settings.account}
    />
  );
}

/** PRF-02 — Active sessions */
export function ActiveSessionsScreen() {
  const [sessions, setSessions] = useState<ActiveSessionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    setLoading(true);
    client
      .fetchActiveSessions()
      .then((data) => setSessions(data.sessions))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("PRF-02", "view");
    load();
  }, []);

  async function onRevoke(sessionId: string) {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const result = await client.revokeActiveSession(sessionId);
      setSessions(result.sessions);
      setMessage("Session revoked.");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : "Failed to revoke session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ActiveSessionsView
      sessions={sessions}
      loading={loading}
      error={error}
      message={message}
      profileHref={ROUTES.profile.home}
      onRevoke={(sessionId) => void onRevoke(sessionId)}
    />
  );
}
