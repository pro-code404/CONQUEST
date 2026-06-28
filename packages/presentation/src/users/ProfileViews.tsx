import { GisState, GisStateLabels, spacing, typography } from "@conquest/gis";
import type { ActiveSessionView, ProfileSummaryView } from "@conquest/contracts";

const sectionStyle = {
  maxWidth: "40rem",
  margin: "0 auto",
  padding: spacing.lg,
};

export interface ProfileViewProps {
  profile: ProfileSummaryView | null;
  loading: boolean;
  error: string | null;
  sessionsHref: string;
  settingsHref: string;
}

export function ProfileView({ profile, loading, error, sessionsHref, settingsHref }: ProfileViewProps) {
  return (
    <section style={sectionStyle} aria-labelledby="profile-heading">
      <h1 id="profile-heading" style={{ fontSize: typography.fontSizeXl }}>
        Profile
      </h1>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !profile ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {profile ? (
        <>
          <dl>
            <dt>Name</dt>
            <dd>{profile.displayName}</dd>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
            <dt>Organization</dt>
            <dd>{profile.orgName}</dd>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </dl>
          <p style={{ marginTop: spacing.lg }}>
            <a href={settingsHref}>Account settings</a>
            {" · "}
            <a href={sessionsHref}>Active sessions</a>
          </p>
        </>
      ) : null}
    </section>
  );
}

export interface ActiveSessionsViewProps {
  sessions: ActiveSessionView[];
  loading: boolean;
  error: string | null;
  message: string | null;
  profileHref: string;
  onRevoke: (sessionId: string) => void;
}

export function ActiveSessionsView({
  sessions,
  loading,
  error,
  message,
  profileHref,
  onRevoke,
}: ActiveSessionsViewProps) {
  return (
    <section style={sectionStyle} aria-labelledby="sessions-heading">
      <h1 id="sessions-heading" style={{ fontSize: typography.fontSizeXl }}>
        Active sessions
      </h1>
      <p>
        <a href={profileHref}>Back to profile</a>
      </p>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {loading && sessions.length === 0 ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <ul>
        {sessions.map((session) => (
          <li key={session.sessionId} style={{ marginBottom: spacing.md }}>
            Device {session.deviceId.slice(0, 8)}… — signed in {session.createdAt}
            {session.isCurrent ? (
              <strong> (current)</strong>
            ) : (
              <button
                type="button"
                style={{ marginLeft: spacing.sm }}
                disabled={loading}
                onClick={() => onRevoke(session.sessionId)}
              >
                Revoke
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
