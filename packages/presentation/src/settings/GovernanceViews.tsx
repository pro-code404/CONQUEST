import type { FormEvent } from "react";
import { GisState, GisStateLabels, spacing, typography } from "@conquest/gis";
import type {
  AiControlsView,
  AuditEventView,
  AutomationPoliciesView,
  DataSourceView,
  MemoryControlsView,
  PasswordPolicyIndicator,
  SecuritySettingsView,
  WorkspaceGoalView,
} from "@conquest/contracts";
import { SettingsSectionView } from "./SettingsSectionViews.js";

const fieldStyle = { display: "block", width: "100%", marginBottom: spacing.md };

export interface SecurityCenterViewProps {
  security: SecuritySettingsView | null;
  loading: boolean;
  error: string | null;
  mfaHref: string;
  sessionsHref: string;
}

export function SecurityCenterView({
  security,
  loading,
  error,
  mfaHref,
  sessionsHref,
}: SecurityCenterViewProps) {
  return (
    <SettingsSectionView title="Security" subtitle="Password, MFA, and session controls.">
      {error ? <p role="alert">{error}</p> : null}
      {loading && !security ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {security ? (
        <>
          <p>MFA: {security.mfaEnrolled ? "Enrolled" : security.mfaPending ? "Enrollment pending" : "Not enrolled"}</p>
          <p>
            <a href={mfaHref}>Manage MFA</a> · <a href={sessionsHref}>Active sessions</a>
          </p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Password policy</h2>
          <PolicyList indicators={security.passwordPolicy} />
        </>
      ) : null}
    </SettingsSectionView>
  );
}

function PolicyList({ indicators }: { indicators: PasswordPolicyIndicator[] }) {
  return (
    <ul>
      {indicators.map((item) => (
        <li key={item.id}>
          {item.met ? "✓" : "○"} {item.label}
        </li>
      ))}
    </ul>
  );
}

export interface MfaEnrollmentViewProps {
  loading: boolean;
  error: string | null;
  message: string | null;
  recoveryCodes: string[] | null;
  onEnroll: () => void;
  onConfirm: (event: FormEvent<HTMLFormElement>) => void;
  securityHref: string;
}

export function MfaEnrollmentView({
  loading,
  error,
  message,
  recoveryCodes,
  onEnroll,
  onConfirm,
  securityHref,
}: MfaEnrollmentViewProps) {
  return (
    <SettingsSectionView title="MFA enrollment" subtitle="Protect your account with multi-factor authentication.">
      <p>
        <a href={securityHref}>← Security</a>
      </p>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {!recoveryCodes ? (
        <button type="button" onClick={onEnroll} disabled={loading}>
          Start MFA enrollment
        </button>
      ) : (
        <>
          <p>Save these recovery codes — they will not be shown again.</p>
          <ul>
            {recoveryCodes.map((code) => (
              <li key={code}>
                <code>{code}</code>
              </li>
            ))}
          </ul>
          <form onSubmit={onConfirm}>
            <label htmlFor="recoveryCode">Confirm with a recovery code</label>
            <input id="recoveryCode" name="recoveryCode" required style={fieldStyle} />
            <button type="submit" disabled={loading}>
              Confirm enrollment
            </button>
          </form>
        </>
      )}
    </SettingsSectionView>
  );
}

export interface ActivityLogViewProps {
  events: AuditEventView[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ActivityLogView({
  events,
  loading,
  error,
  search,
  onSearchChange,
  onSearchSubmit,
}: ActivityLogViewProps) {
  return (
    <SettingsSectionView title="Activity log" subtitle="Audit trail of significant actions.">
      <form onSubmit={onSearchSubmit} role="search">
        <label htmlFor="activity-search">Search activity</label>
        <input
          id="activity-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={fieldStyle}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {loading && events.length === 0 ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: spacing.sm }}>
            <strong>{event.category}</strong> — {event.summary}
            <br />
            <small>
              {event.actorName} · {event.timestamp}
            </small>
          </li>
        ))}
      </ul>
      <p role="status">Export support is planned for a subsequent release.</p>
    </SettingsSectionView>
  );
}

export interface AutomationPoliciesViewProps {
  policies: AutomationPoliciesView | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AutomationPoliciesSettingsView({
  policies,
  loading,
  error,
  message,
  onSubmit,
}: AutomationPoliciesViewProps) {
  return (
    <SettingsSectionView title="Automation policies" subtitle="Organization-wide automation governance.">
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {policies ? (
        <form onSubmit={onSubmit} aria-busy={loading}>
          <label>
            <input type="checkbox" name="requireApproval" defaultChecked={policies.requireApproval} /> Require approval
          </label>
          <label>
            <input type="checkbox" name="emergencyDisabled" defaultChecked={policies.emergencyDisabled} /> Emergency
            disable all automation
          </label>
          <label htmlFor="maxConcurrentRuns">Max concurrent runs</label>
          <input
            id="maxConcurrentRuns"
            name="maxConcurrentRuns"
            type="number"
            defaultValue={policies.maxConcurrentRuns}
            style={fieldStyle}
          />
          <button type="submit" disabled={loading}>
            Save policies
          </button>
        </form>
      ) : (
        !error && <p role="status">{GisStateLabels[GisState.Load]}</p>
      )}
    </SettingsSectionView>
  );
}

export interface AiControlsSettingsViewProps {
  ai: AiControlsView | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AiControlsSettingsView({ ai, loading, error, message, onSubmit }: AiControlsSettingsViewProps) {
  return (
    <SettingsSectionView title="Advanced / AI controls" subtitle="Bounded AI preferences and transparency.">
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {ai ? (
        <form onSubmit={onSubmit} aria-busy={loading}>
          <label htmlFor="preferredProvider">Preferred provider</label>
          <select id="preferredProvider" name="preferredProvider" defaultValue={ai.preferredProvider} style={fieldStyle}>
            <option value="auto">Auto</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
          <label htmlFor="depthPreference">Depth preference</label>
          <select id="depthPreference" name="depthPreference" defaultValue={ai.depthPreference} style={fieldStyle}>
            <option value="balanced">Balanced</option>
            <option value="deep">Deep</option>
            <option value="fast">Fast</option>
          </select>
          <p>Transparency: always on (cannot be disabled).</p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Provider status</h2>
          <ul>
            {ai.providers.map((provider) => (
              <li key={provider.id}>
                {provider.name} — {provider.status}
              </li>
            ))}
          </ul>
          <button type="submit" disabled={loading}>
            Save preferences
          </button>
        </form>
      ) : (
        !error && <p role="status">{GisStateLabels[GisState.Load]}</p>
      )}
    </SettingsSectionView>
  );
}

export interface MemoryControlsSettingsViewProps {
  memory: MemoryControlsView | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function MemoryControlsSettingsView({ memory, loading, error, message, onSubmit }: MemoryControlsSettingsViewProps) {
  return (
    <SettingsSectionView title="Memory controls" subtitle="Retention and workspace memory policy.">
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {memory ? (
        <>
          <p>{memory.workspacePolicySummary}</p>
          <form onSubmit={onSubmit} aria-busy={loading}>
            <label htmlFor="retentionDays">Retention (days)</label>
            <input
              id="retentionDays"
              name="retentionDays"
              type="number"
              defaultValue={memory.retentionDays}
              style={fieldStyle}
            />
            <button type="submit" disabled={loading}>
              Save retention
            </button>
          </form>
          <p>Export and forget requests are governed placeholders in Build-1.</p>
        </>
      ) : (
        !error && <p role="status">{GisStateLabels[GisState.Load]}</p>
      )}
    </SettingsSectionView>
  );
}

export interface DataSourcesViewProps {
  sources: DataSourceView[];
  loading: boolean;
  error: string | null;
  onConnect: (event: FormEvent<HTMLFormElement>) => void;
}

export function DataSourcesView({ sources, loading, error, onConnect }: DataSourcesViewProps) {
  return (
    <SettingsSectionView title="Data sources" subtitle="Connected workspace data sources.">
      <form onSubmit={onConnect} aria-busy={loading}>
        <label htmlFor="sourceName">Name</label>
        <input id="sourceName" name="name" required style={fieldStyle} />
        <label htmlFor="sourceType">Type</label>
        <input id="sourceType" name="type" defaultValue="crm" required style={fieldStyle} />
        <button type="submit" disabled={loading}>
          Connect source
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            {source.name} ({source.type}) — {source.status}
          </li>
        ))}
      </ul>
    </SettingsSectionView>
  );
}

export interface WorkspaceGoalsViewProps {
  goals: WorkspaceGoalView[];
  loading: boolean;
  error: string | null;
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
}

export function WorkspaceGoalsView({ goals, loading, error, onCreate }: WorkspaceGoalsViewProps) {
  return (
    <SettingsSectionView title="Goals & projects" subtitle="Workspace goal hierarchy.">
      <form onSubmit={onCreate} aria-busy={loading}>
        <label htmlFor="goalTitle">Goal title</label>
        <input id="goalTitle" name="title" required style={fieldStyle} />
        <button type="submit" disabled={loading}>
          Add goal
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.title} — {goal.status} ({goal.progress}%)
          </li>
        ))}
      </ul>
    </SettingsSectionView>
  );
}
