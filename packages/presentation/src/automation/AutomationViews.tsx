import type { FormEvent } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type {
  AutomationCenterView,
  ExecutionRecordView,
  PendingApprovalView,
  WorkflowDetailView,
  WorkflowSummaryView,
  WorkflowTrigger,
} from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

const fieldStyle = { display: "block", width: "100%", marginBottom: spacing.md };

export interface AutomationCenterViewProps {
  center: AutomationCenterView | null;
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  newWorkflowHref: string;
  approvalsHref: string;
  detailHref: (workflowId: string) => string;
}

export function AutomationCenterView({
  center,
  loading,
  error,
  search,
  onSearchChange,
  onSearchSubmit,
  newWorkflowHref,
  approvalsHref,
  detailHref,
}: AutomationCenterViewProps) {
  return (
    <section aria-labelledby="automation-heading" style={{ padding: spacing.lg }}>
      <header style={{ marginBottom: spacing.lg }}>
        <h1 id="automation-heading" style={{ fontSize: typography.fontSizeXl }}>
          Automation Center
        </h1>
        <p>Catalog and monitor automated workflows.</p>
      </header>
      <div style={{ display: "flex", gap: spacing.md, marginBottom: spacing.lg, flexWrap: "wrap" }}>
        <a href={newWorkflowHref}>Create automation</a>
        <a href={approvalsHref}>
          Approvals{center ? ` (${center.pendingApprovalsCount})` : ""}
        </a>
      </div>
      <form onSubmit={onSearchSubmit} role="search" aria-label="Search workflows">
        <label htmlFor="workflow-search">Search workflows</label>
        <input
          id="workflow-search"
          name="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={fieldStyle}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !center ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {center && center.workflows.length === 0 ? (
        <p role="status">No automations yet — create one to get started.</p>
      ) : null}
      {center?.workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} detailHref={detailHref(workflow.id)} />
      ))}
    </section>
  );
}

function WorkflowCard({
  workflow,
  detailHref,
}: {
  workflow: WorkflowSummaryView;
  detailHref: string;
}) {
  return (
    <article style={cardStyle} aria-label={`Workflow ${workflow.name}`}>
      <h2 style={{ fontSize: typography.fontSizeLg, margin: 0 }}>
        <a href={detailHref}>{workflow.name}</a>
      </h2>
      <p>{workflow.description || "No description"}</p>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: spacing.xs }}>
        <dt>Status</dt>
        <dd>{workflow.status}</dd>
        <dt>Trigger</dt>
        <dd>{workflow.triggerType}</dd>
        <dt>Success rate</dt>
        <dd>{workflow.successRate}%</dd>
        {workflow.pendingApproval ? (
          <>
            <dt>Approval</dt>
            <dd>Pending</dd>
          </>
        ) : null}
      </dl>
    </article>
  );
}

export interface AutomationBuilderViewProps {
  loading: boolean;
  error: string | null;
  message: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  cancelHref: string;
}

export function AutomationBuilderView({
  loading,
  error,
  message,
  onSubmit,
  cancelHref,
}: AutomationBuilderViewProps) {
  return (
    <section aria-labelledby="builder-heading" style={{ padding: spacing.lg, maxWidth: "40rem" }}>
      <h1 id="builder-heading" style={{ fontSize: typography.fontSizeXl }}>
        Create automation
      </h1>
      <form onSubmit={onSubmit} aria-busy={loading}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required style={fieldStyle} />
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} style={fieldStyle} />
        <label htmlFor="triggerType">Trigger type</label>
        <select id="triggerType" name="triggerType" defaultValue="manual" style={fieldStyle}>
          <option value="manual">Manual</option>
          <option value="schedule">Schedule</option>
          <option value="event">Event</option>
        </select>
        <label htmlFor="eventName">Event name (for event triggers)</label>
        <input id="eventName" name="eventName" style={fieldStyle} />
        <fieldset style={{ marginBottom: spacing.md }}>
          <legend>Schedule (for schedule triggers)</legend>
          <label>
            <input type="checkbox" name="scheduleEnabled" /> Enable schedule
          </label>
          <label htmlFor="cron">Cron expression</label>
          <input id="cron" name="cron" placeholder="0 9 * * *" style={fieldStyle} />
          <label htmlFor="timezone">Timezone</label>
          <input id="timezone" name="timezone" defaultValue="UTC" style={fieldStyle} />
        </fieldset>
        <label htmlFor="actions">Actions (one per line)</label>
        <textarea id="actions" name="actions" required rows={4} style={fieldStyle} />
        <label>
          <input type="checkbox" name="submitForApproval" /> Submit for approval
        </label>
        {error ? <p role="alert">{error}</p> : null}
        {message ? <p role="status">{message}</p> : null}
        <div style={{ display: "flex", gap: spacing.md, marginTop: spacing.md }}>
          <button type="submit" disabled={loading}>
            {loading ? GisStateLabels[GisState.Load] : "Save workflow"}
          </button>
          <a href={cancelHref}>Cancel</a>
        </div>
      </form>
    </section>
  );
}

export interface AutomationDetailViewProps {
  workflow: WorkflowDetailView | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  logHref: string;
  centerHref: string;
  onEnable: () => void;
  onDisable: () => void;
  onPause: () => void;
  onResume: () => void;
  onRun: () => void;
  onArchive: () => void;
}

export function AutomationDetailView({
  workflow,
  loading,
  error,
  message,
  logHref,
  centerHref,
  onEnable,
  onDisable,
  onPause,
  onResume,
  onRun,
  onArchive,
}: AutomationDetailViewProps) {
  return (
    <section aria-labelledby="detail-heading" style={{ padding: spacing.lg }}>
      <p>
        <a href={centerHref}>← Automation Center</a>
      </p>
      {loading && !workflow ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {workflow ? (
        <>
          <h1 id="detail-heading" style={{ fontSize: typography.fontSizeXl }}>
            {workflow.name}
          </h1>
          <p>{workflow.description}</p>
          <dl>
            <dt>Status</dt>
            <dd>{workflow.status}</dd>
            <dt>Trigger</dt>
            <dd>{formatTrigger(workflow.trigger)}</dd>
            <dt>Success rate</dt>
            <dd>{workflow.successRate}%</dd>
            <dt>Last run</dt>
            <dd>{workflow.lastRunAt ?? "Never"}</dd>
            <dt>Next run</dt>
            <dd>{workflow.nextRunAt ?? "—"}</dd>
          </dl>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Actions</h2>
          <ul>
            {workflow.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: spacing.sm, flexWrap: "wrap", marginTop: spacing.lg }}>
            <button type="button" onClick={onRun} disabled={loading}>
              Manual run
            </button>
            <button type="button" onClick={onEnable} disabled={loading}>
              Enable
            </button>
            <button type="button" onClick={onDisable} disabled={loading}>
              Disable
            </button>
            <button type="button" onClick={onPause} disabled={loading}>
              Pause
            </button>
            <button type="button" onClick={onResume} disabled={loading}>
              Resume
            </button>
            <button type="button" onClick={onArchive} disabled={loading}>
              Archive
            </button>
            <a href={logHref}>View execution log</a>
          </div>
        </>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
    </section>
  );
}

function formatTrigger(trigger: WorkflowTrigger): string {
  if (trigger.type === "event") return `event: ${trigger.eventName ?? ""}`;
  return trigger.type;
}

export interface AutomationExecutionLogViewProps {
  executions: ExecutionRecordView[];
  loading: boolean;
  error: string | null;
  detailHref: string;
}

export function AutomationExecutionLogView({
  executions,
  loading,
  error,
  detailHref,
}: AutomationExecutionLogViewProps) {
  return (
    <section aria-labelledby="log-heading" style={{ padding: spacing.lg }}>
      <p>
        <a href={detailHref}>← Workflow detail</a>
      </p>
      <h1 id="log-heading" style={{ fontSize: typography.fontSizeXl }}>
        Execution log
      </h1>
      {error ? <p role="alert">{error}</p> : null}
      {loading && executions.length === 0 ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {executions.length === 0 && !loading ? <p role="status">No executions recorded yet.</p> : null}
      <ul>
        {executions.map((execution) => (
          <li key={execution.id} style={cardStyle}>
            <strong>{execution.status}</strong> — {execution.startedAt}
            <p>{execution.message}</p>
            <ol>
              {execution.steps.map((step, index) => (
                <li key={`${execution.id}-${index}`}>
                  {step.name} ({step.status}) at {step.timestamp}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface AutomationApprovalsViewProps {
  approvals: PendingApprovalView[];
  loading: boolean;
  error: string | null;
  message: string | null;
  centerHref: string;
  onApprove: (workflowId: string) => void;
  onReject: (workflowId: string) => void;
}

export function AutomationApprovalsView({
  approvals,
  loading,
  error,
  message,
  centerHref,
  onApprove,
  onReject,
}: AutomationApprovalsViewProps) {
  return (
    <section aria-labelledby="approvals-heading" style={{ padding: spacing.lg }}>
      <p>
        <a href={centerHref}>← Automation Center</a>
      </p>
      <h1 id="approvals-heading" style={{ fontSize: typography.fontSizeXl }}>
        Approval queue
      </h1>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {loading && approvals.length === 0 ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {approvals.length === 0 && !loading ? <p role="status">No pending approvals.</p> : null}
      <ul>
        {approvals.map((item) => (
          <li key={item.workflowId} style={cardStyle}>
            <strong>{item.name}</strong> — {item.triggerType}
            <p>{item.description}</p>
            <p>
              Submitted by {item.submittedBy} at {item.submittedAt}
            </p>
            <button type="button" disabled={loading} onClick={() => onApprove(item.workflowId)}>
              Approve
            </button>
            <button
              type="button"
              disabled={loading}
              style={{ marginLeft: spacing.sm }}
              onClick={() => onReject(item.workflowId)}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
