import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";
import type { OperationsDashboardView } from "@conquest/contracts";

const cardStyle = {
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: spacing.md,
  marginBottom: spacing.md,
  background: color.surfaceElevated,
};

export interface OperationsDashboardScreenViewProps {
  dashboard: OperationsDashboardView | null;
  loading: boolean;
  error: string | null;
}

export function OperationsDashboardScreenView({
  dashboard,
  loading,
  error,
}: OperationsDashboardScreenViewProps) {
  return (
    <section aria-labelledby="operations-heading" style={{ padding: spacing.lg }}>
      <h1 id="operations-heading" style={{ fontSize: typography.fontSizeXl }}>
        Operations
      </h1>
      <p>Platform health, jobs, cache, and AI provider status.</p>
      {error ? <p role="alert">{error}</p> : null}
      {loading && !dashboard ? <p role="status">{GisStateLabels[GisState.Load]}</p> : null}
      {dashboard ? (
        <>
          <p>System: {dashboard.systemHealthy ? "Healthy" : "Degraded"}</p>
          <p>Last checked: {dashboard.lastCheckedAt}</p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Services</h2>
          {dashboard.services.map((service) => (
            <article key={service.name} style={cardStyle}>
              <strong>{service.name}</strong> — {service.healthy ? "healthy" : "unhealthy"}
              {service.details ? <p>{service.details}</p> : null}
            </article>
          ))}
          <h2 style={{ fontSize: typography.fontSizeLg }}>Job queue</h2>
          <p>
            Queued {dashboard.queue.queued} · Running {dashboard.queue.running} · Failed{" "}
            {dashboard.queue.failed} · DLQ {dashboard.queue.deadLetter}
          </p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>Cache</h2>
          <p>
            {dashboard.cache.provider} — hits {dashboard.cache.hits} · misses {dashboard.cache.misses}
          </p>
          <h2 style={{ fontSize: typography.fontSizeLg }}>AI providers</h2>
          <ul>
            {dashboard.aiProviders.map((provider) => (
              <li key={provider.id}>
                {provider.name}: {provider.status}
              </li>
            ))}
          </ul>
          <p>Audit events (org): {dashboard.auditEventCount}</p>
        </>
      ) : null}
    </section>
  );
}
