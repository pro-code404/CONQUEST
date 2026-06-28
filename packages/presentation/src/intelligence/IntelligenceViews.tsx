import type { FormEvent } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type {
  AdvisoryRecommendationDetailView,
  AdvisoryRecommendationView,
  IntelligenceFeedItemView,
  IntelligenceFeedView,
  IntelligenceHomeView,
  IntelligenceTimelineView,
} from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

export interface IntelligenceHomeViewProps {
  home: IntelligenceHomeView | null;
  loading: boolean;
  error: string | null;
  feedHref: string;
  recommendationsHref: string;
  opportunitiesHref: string;
  risksHref: string;
  timelineHref: string;
}

export function IntelligenceHomeScreenView({
  home,
  loading,
  error,
  feedHref,
  recommendationsHref,
  opportunitiesHref,
  risksHref,
  timelineHref,
}: IntelligenceHomeViewProps) {
  return (
    <section aria-labelledby="intelligence-heading" style={{ padding: spacing.lg }}>
      <header style={{ marginBottom: spacing.lg }}>
        <h1 id="intelligence-heading" style={{ fontSize: typography.fontSizeXl }}>
          Intelligence
        </h1>
        {home ? <p>{home.summary}</p> : null}
      </header>
      <nav aria-label="Intelligence sections" style={{ display: "flex", gap: spacing.md, flexWrap: "wrap", marginBottom: spacing.lg }}>
        <a href={feedHref}>Feed{home ? ` (${home.feedCount})` : ""}</a>
        <a href={recommendationsHref}>Recommendations{home ? ` (${home.recommendationCount})` : ""}</a>
        <a href={opportunitiesHref}>Opportunities{home ? ` (${home.opportunityCount})` : ""}</a>
        <a href={risksHref}>Risks{home ? ` (${home.riskCount})` : ""}</a>
        <a href={timelineHref}>Timeline</a>
      </nav>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !home ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {home ? (
        <div style={cardStyle}>
          <p>Insights: {home.insightCount}</p>
          <p>Last updated: {home.lastUpdatedAt ?? "—"}</p>
        </div>
      ) : null}
    </section>
  );
}

export interface IntelligenceFeedScreenViewProps {
  feed: IntelligenceFeedView | null;
  loading: boolean;
  error: string | null;
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFilterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  homeHref: string;
}

export function IntelligenceFeedScreenView({
  feed,
  loading,
  error,
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onFilterSubmit,
  homeHref,
}: IntelligenceFeedScreenViewProps) {
  return (
    <section aria-labelledby="intelligence-feed-heading" style={{ padding: spacing.lg }}>
      <header style={{ marginBottom: spacing.lg }}>
        <h1 id="intelligence-feed-heading" style={{ fontSize: typography.fontSizeXl }}>
          Intelligence Feed
        </h1>
        <a href={homeHref}>Back to intelligence home</a>
      </header>
      <form onSubmit={onFilterSubmit} role="search" aria-label="Filter feed">
        <label htmlFor="feed-search">Search</label>
        <input id="feed-search" value={search} onChange={(e) => onSearchChange(e.target.value)} style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
        <label htmlFor="feed-category">Category</label>
        <select id="feed-category" value={category} onChange={(e) => onCategoryChange(e.target.value)} style={{ display: "block", marginBottom: spacing.md }}>
          <option value="">All</option>
          {feed?.categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          Apply filters
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !feed ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {feed?.items.map((item) => (
        <FeedItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}

function FeedItemCard({ item }: { item: IntelligenceFeedItemView }) {
  return (
    <article style={cardStyle} aria-labelledby={`feed-${item.id}`}>
      <h2 id={`feed-${item.id}`} style={{ fontSize: typography.fontSizeLg }}>
        {item.title}
      </h2>
      <p>{item.summary}</p>
      <p>
        {item.category} · confidence {Math.round(item.confidence * 100)}% · {item.timestamp}
      </p>
    </article>
  );
}

export interface IntelligenceRecommendationsViewProps {
  items: AdvisoryRecommendationView[];
  loading: boolean;
  error: string | null;
  detailHref: (id: string) => string;
  homeHref: string;
}

export function IntelligenceRecommendationsView({
  items,
  loading,
  error,
  detailHref,
  homeHref,
}: IntelligenceRecommendationsViewProps) {
  return (
    <section aria-labelledby="recommendations-heading" style={{ padding: spacing.lg }}>
      <h1 id="recommendations-heading" style={{ fontSize: typography.fontSizeXl }}>
        Recommendations
      </h1>
      <a href={homeHref}>Back to intelligence home</a>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {items.map((item) => (
        <article key={item.id} style={cardStyle}>
          <h2 style={{ fontSize: typography.fontSizeLg }}>
            <a href={detailHref(item.id)}>{item.title}</a>
          </h2>
          <p>{item.summary}</p>
          <p>
            Priority: {item.priority} · confidence {Math.round(item.confidence * 100)}%
          </p>
        </article>
      ))}
    </section>
  );
}

export interface IntelligenceRecommendationDetailViewProps {
  item: AdvisoryRecommendationDetailView | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  onApprove: () => void;
  onReject: () => void;
  listHref: string;
}

export function IntelligenceRecommendationDetailView({
  item,
  loading,
  error,
  message,
  onApprove,
  onReject,
  listHref,
}: IntelligenceRecommendationDetailViewProps) {
  return (
    <section aria-labelledby="recommendation-detail-heading" style={{ padding: spacing.lg }}>
      <h1 id="recommendation-detail-heading" style={{ fontSize: typography.fontSizeXl }}>
        {item?.title ?? "Recommendation"}
      </h1>
      <a href={listHref}>Back to recommendations</a>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      {loading && !item ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {item ? (
        <div style={cardStyle}>
          <p>{item.summary}</p>
          <h2 style={{ fontSize: typography.fontSizeMd }}>Rationale</h2>
          <p>{item.rationale}</p>
          <h2 style={{ fontSize: typography.fontSizeMd }}>Evidence</h2>
          <ul>
            {item.evidenceRefs.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
          <h2 style={{ fontSize: typography.fontSizeMd }}>Recommended actions</h2>
          <ol>
            {item.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
          <p>Status: {item.status}</p>
          {item.approvalRequired && item.status === "pending" ? (
            <div style={{ display: "flex", gap: spacing.md }}>
              <button type="button" onClick={onApprove} disabled={loading}>
                Approve
              </button>
              <button type="button" onClick={onReject} disabled={loading}>
                Reject
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export interface IntelligenceCategoryListViewProps {
  title: string;
  items: IntelligenceFeedItemView[];
  loading: boolean;
  error: string | null;
  homeHref: string;
}

export function IntelligenceCategoryListView({
  title,
  items,
  loading,
  error,
  homeHref,
}: IntelligenceCategoryListViewProps) {
  return (
    <section aria-labelledby="category-list-heading" style={{ padding: spacing.lg }}>
      <h1 id="category-list-heading" style={{ fontSize: typography.fontSizeXl }}>
        {title}
      </h1>
      <a href={homeHref}>Back to intelligence home</a>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {items.map((item) => (
        <FeedItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}

export interface IntelligenceTimelineScreenViewProps {
  timeline: IntelligenceTimelineView | null;
  loading: boolean;
  error: string | null;
  homeHref: string;
}

export function IntelligenceTimelineScreenView({
  timeline,
  loading,
  error,
  homeHref,
}: IntelligenceTimelineScreenViewProps) {
  return (
    <section aria-labelledby="timeline-heading" style={{ padding: spacing.lg }}>
      <h1 id="timeline-heading" style={{ fontSize: typography.fontSizeXl }}>
        Insights Timeline
      </h1>
      <a href={homeHref}>Back to intelligence home</a>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !timeline ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <ol>
        {timeline?.entries.map((entry) => (
          <li key={entry.id} style={cardStyle}>
            <strong>{entry.title}</strong> — {entry.category} · {entry.timestamp} · {entry.actor}
          </li>
        ))}
      </ol>
    </section>
  );
}
