import type { FormEvent } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type { ResearchSessionDetailView, ResearchSessionView, ResearchSourceView } from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

export interface ResearchHomeViewProps {
  sessions: ResearchSessionView[];
  sources: ResearchSourceView[];
  loading: boolean;
  error: string | null;
  sessionHref: (id: string) => string;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  creating: boolean;
}

export function ResearchHomeView({
  sessions,
  sources,
  loading,
  error,
  sessionHref,
  onCreateSubmit,
  creating,
}: ResearchHomeViewProps) {
  return (
    <section aria-labelledby="research-heading" style={{ padding: spacing.lg }}>
      <h1 id="research-heading" style={{ fontSize: typography.fontSizeXl }}>
        Research
      </h1>
      <p>Research sessions, evidence collection, and source registry — framework only.</p>
      <form onSubmit={onCreateSubmit} style={{ marginBottom: spacing.lg }}>
        <label htmlFor="session-title">New session title</label>
        <input id="session-title" name="title" required style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
        <button type="submit" disabled={creating}>
          Create session
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      <h2 style={{ fontSize: typography.fontSizeLg }}>Sessions</h2>
      {sessions.map((session) => (
        <article key={session.id} style={cardStyle}>
          <h3>
            <a href={sessionHref(session.id)}>{session.title}</a>
          </h3>
          <p>
            {session.status} · {session.sourceCount} sources · {session.evidenceCount} evidence
          </p>
        </article>
      ))}
      <h2 style={{ fontSize: typography.fontSizeLg }}>Source registry</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            {source.name} ({source.type}){source.trusted ? " · trusted" : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface ResearchSessionScreenViewProps {
  session: ResearchSessionDetailView | null;
  loading: boolean;
  error: string | null;
  homeHref: string;
  onRegisterSource: (event: FormEvent<HTMLFormElement>) => void;
  registering: boolean;
  onAnalyze?: () => void;
  analyzing?: boolean;
  analysisSummary?: string | null;
  recommendationHref?: string | null;
}

export function ResearchSessionScreenView({
  session,
  loading,
  error,
  homeHref,
  onRegisterSource,
  registering,
  onAnalyze,
  analyzing = false,
  analysisSummary,
  recommendationHref,
}: ResearchSessionScreenViewProps) {
  return (
    <section aria-labelledby="research-session-heading" style={{ padding: spacing.lg }}>
      <h1 id="research-session-heading" style={{ fontSize: typography.fontSizeXl }}>
        {session?.title ?? "Research session"}
      </h1>
      <a href={homeHref}>Back to research</a>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !session ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {session ? (
        <>
          <div style={cardStyle}>
            <p>Status: {session.status}</p>
            {analysisSummary ? (
              <div role="status" style={{ marginBottom: spacing.md }}>
                <h2 style={{ fontSize: typography.fontSizeMd }}>Cognitive analysis</h2>
                <p>{analysisSummary}</p>
                {recommendationHref ? (
                  <p>
                    <a href={recommendationHref}>View recommendation</a>
                  </p>
                ) : null}
              </div>
            ) : null}
            {onAnalyze ? (
              <button type="button" onClick={onAnalyze} disabled={analyzing} style={{ marginBottom: spacing.md }}>
                {analyzing ? "Analyzing…" : "Run cognitive analysis"}
              </button>
            ) : null}
            <h2 style={{ fontSize: typography.fontSizeMd }}>Citations</h2>
            {session.citations.length === 0 ? <p>No citations collected yet.</p> : null}
            <ul>
              {session.citations.map((citation) => (
                <li key={`${citation.sourceId}-${citation.title}`}>
                  {citation.title}: {citation.excerpt}
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={onRegisterSource}>
            <h2 style={{ fontSize: typography.fontSizeMd }}>Register source</h2>
            <label htmlFor="source-name">Name</label>
            <input id="source-name" name="name" required style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
            <label htmlFor="source-type">Type</label>
            <input id="source-type" name="type" required style={{ display: "block", width: "100%", marginBottom: spacing.md }} />
            <button type="submit" disabled={registering}>
              Add source
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
