import { useCallback, useEffect, useState } from "react";
import { AdministrationDashboardScreenView } from "@conquest/presentation";
import type { AdministrationDashboardView } from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./administration-client.js";

export function AdministrationDashboardScreen() {
  const [dashboard, setDashboard] = useState<AdministrationDashboardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchAdministrationDashboard();
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    logScreenEvent("ADM-01", "view");
    void load();
  }, [load]);

  async function onToggleFlag(flagId: string, enabled: boolean) {
    setLoading(true);
    try {
      const data = await api.updateFeatureFlag(flagId, enabled);
      setDashboard(data.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdministrationDashboardScreenView
      dashboard={dashboard}
      loading={loading}
      error={error}
      onToggleFlag={(flagId, enabled) => void onToggleFlag(flagId, enabled)}
    />
  );
}
