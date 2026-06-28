import type { FormEvent } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type { AnalyticsDashboardView, SavedAnalyticsView, TimeRange } from "@conquest/contracts";
import { TIME_RANGES } from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

export interface AnalyticsDashboardScreenViewProps {
  dashboard: AnalyticsDashboardView | null;
  loading: boolean;
  error: string | null;
  timeRange: TimeRange;
  category: string;
  onTimeRangeChange: (value: TimeRange) => void;
  onCategoryChange: (value: string) => void;
  onFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  savedViewsHref: string;
  exportLabel: string;
}

export function AnalyticsDashboardScreenView({
  dashboard,
  loading,
  error,
  timeRange,
  category,
  onTimeRangeChange,
  onCategoryChange,
  onFilterSubmit,
  savedViewsHref,
  exportLabel,
}: AnalyticsDashboardScreenViewProps) {
  return (
    <section aria-labelledby="analytics-heading" style={{ padding: spacing.lg }}>
      <header style={{ marginBottom: spacing.lg }}>
        <h1 id="analytics-heading" style={{ fontSize: typography.fontSizeXl }}>
          Reports & Analytics
        </h1>
        <a href={savedViewsHref}>Saved views</a>
      </header>
      <form onSubmit={onFilterSubmit} aria-label="Analytics filters">
        <label htmlFor="time-range">Time range</label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          style={{ display: "block", marginBottom: spacing.md }}
        >
          {TIME_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <label htmlFor="metric-category">Category</label>
        <input id="metric-category" value={category} onChange={(e) => onCategoryChange(e.target.value)} style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
        <button type="submit" disabled={loading}>
          Apply filters
        </button>
      </form>
      {dashboard?.exportAvailable ? <p>{exportLabel}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {loading && !dashboard ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <div style={{ display: "grid", gap: spacing.md, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {dashboard?.kpis.map((kpi) => (
          <article key={kpi.metricId} style={cardStyle} aria-label={kpi.label}>
            <h2 style={{ fontSize: typography.fontSizeMd }}>{kpi.label}</h2>
            <p style={{ fontSize: typography.fontSizeXl }}>{kpi.formatted}</p>
            <p>Trend: {kpi.trend}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export interface AnalyticsSavedViewsScreenViewProps {
  views: SavedAnalyticsView[];
  loading: boolean;
  error: string | null;
  dashboardHref: string;
  onSaveSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}

export function AnalyticsSavedViewsScreenView({
  views,
  loading,
  error,
  dashboardHref,
  onSaveSubmit,
  saving,
}: AnalyticsSavedViewsScreenViewProps) {
  return (
    <section aria-labelledby="saved-views-heading" style={{ padding: spacing.lg }}>
      <h1 id="saved-views-heading" style={{ fontSize: typography.fontSizeXl }}>
        Saved analytics views
      </h1>
      <a href={dashboardHref}>Back to dashboard</a>
      <form onSubmit={onSaveSubmit} style={{ margin: `${spacing.lg} 0` }}>
        <label htmlFor="view-name">View name</label>
        <input id="view-name" name="name" required style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
        <label htmlFor="view-range">Time range</label>
        <select id="view-range" name="timeRange" defaultValue="30d" style={{ display: "block", marginBottom: spacing.md }}>
          {TIME_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <button type="submit" disabled={saving}>
          Save current filters
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <ul>
        {views.map((view) => (
          <li key={view.id} style={cardStyle}>
            {view.name} — {view.timeRange} — {view.createdAt}
          </li>
        ))}
      </ul>
    </section>
  );
}
