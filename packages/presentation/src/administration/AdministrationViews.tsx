import { color, spacing, typography } from "@conquest/gis";
import type { AdministrationDashboardView } from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

export interface AdministrationDashboardScreenViewProps {
  dashboard: AdministrationDashboardView | null;
  loading: boolean;
  error: string | null;
  onToggleFlag: (flagId: string, enabled: boolean) => void;
}

export function AdministrationDashboardScreenView({
  dashboard,
  loading,
  error,
  onToggleFlag,
}: AdministrationDashboardScreenViewProps) {
  return (
    <section aria-labelledby="administration-heading" style={{ padding: spacing.lg }}>
      <h1 id="administration-heading" style={{ fontSize: typography.fontSizeXl }}>
        Administration
      </h1>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !dashboard ? <p role="status">Loading…</p> : null}
      {dashboard ? (
        <>
          <p>
            {dashboard.orgName} — {dashboard.memberCount} members · {dashboard.workspaceCount} workspaces
          </p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Feature flags</h2>
          {dashboard.featureFlags.map((flag) => (
            <article key={flag.id} style={cardStyle}>
              <strong>{flag.label}</strong>
              <p>{flag.description}</p>
              <label>
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={(e) => onToggleFlag(flag.id, e.target.checked)}
                />
                Enabled
              </label>
            </article>
          ))}
          <h2 style={{ fontSize: typography.fontSizeLg }}>AI providers</h2>
          <ul>
            {dashboard.providers.map((provider) => (
              <li key={provider.id}>
                {provider.name} — {provider.status}
                {provider.configured ? " · configured" : ""}
              </li>
            ))}
          </ul>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Security overview</h2>
          <p>MFA enrolled: {dashboard.security.mfaEnrolledUsers}</p>
          <p>Active sessions: {dashboard.security.activeSessions}</p>
          <p>Recent security events: {dashboard.security.recentSecurityEvents}</p>
        </>
      ) : null}
    </section>
  );
}
