import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnalyticsDashboardScreenView, AnalyticsSavedViewsScreenView } from "@conquest/presentation";
import type { AnalyticsDashboardView, SavedAnalyticsView, TimeRange } from "@conquest/contracts";
import { analyticsHomeRoute, analyticsSavedViewsRoute } from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./analytics-client.js";

/** RPT-01 — Analytics dashboard shell */
export function AnalyticsDashboardScreen() {
  const { workspaceId = "" } = useParams();
  const [dashboard, setDashboard] = useState<AnalyticsDashboardView | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (params?: { timeRange?: TimeRange; category?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchAnalyticsDashboard(workspaceId, params);
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    logScreenEvent("RPT-01", "view");
    void load({ timeRange });
  }, [load, timeRange]);

  function onFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load({ timeRange, ...(category ? { category } : {}) });
  }

  return (
    <AnalyticsDashboardScreenView
      dashboard={dashboard}
      loading={loading}
      error={error}
      timeRange={timeRange}
      category={category}
      onTimeRangeChange={setTimeRange}
      onCategoryChange={setCategory}
      onFilterSubmit={onFilterSubmit}
      savedViewsHref={analyticsSavedViewsRoute(workspaceId)}
      exportLabel="Export architecture ready — chart rendering deferred to visualization-config consumers."
    />
  );
}

export function AnalyticsSavedViewsScreen() {
  const { workspaceId = "" } = useParams();
  const [views, setViews] = useState<SavedAnalyticsView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchSavedViews(workspaceId);
      setViews(data.views);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    logScreenEvent("RPT-02", "view");
    void load();
  }, [load]);

  async function onSaveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      await api.saveAnalyticsView(workspaceId, {
        name: String(form.get("name") ?? ""),
        timeRange: String(form.get("timeRange") ?? "30d") as TimeRange,
      });
      event.currentTarget.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnalyticsSavedViewsScreenView
      views={views}
      loading={loading}
      error={error}
      dashboardHref={analyticsHomeRoute(workspaceId)}
      onSaveSubmit={onSaveSubmit}
      saving={saving}
    />
  );
}
