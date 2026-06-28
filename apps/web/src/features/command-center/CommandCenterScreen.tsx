import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommandCenterHomeView } from "@conquest/presentation";
import type { CommandCenterBehavioralState, CommandCenterDashboardView } from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { ROUTES } from "../../shared/config/routes.js";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as client from "../../auth/client.js";

/** CC-01 — Command Center Home with integrated platform data. */
export function CommandCenterScreen() {
  const { workspaceId = "" } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<CommandCenterDashboardView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const next = await client.fetchCommandCenterDashboard(workspaceId);
      setDashboard(next);
      logScreenEvent("CC-01", "state", { state: next.status.state });
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    logScreenEvent("CC-01", "view", { workspaceId });
  }, [workspaceId]);

  if (loading && !dashboard) {
    return (
      <CommandCenterHomeView
        state={"initializing" satisfies CommandCenterBehavioralState}
        onRefresh={() => void loadDashboard()}
      />
    );
  }

  if (error && !dashboard) {
    return (
      <section aria-labelledby="cc-home-heading">
        <h1 id="cc-home-heading">Command Center</h1>
        <p role="alert">{error}</p>
        <button type="button" onClick={() => void loadDashboard()}>
          {GisStateLabels[GisState.Recover]}
        </button>
      </section>
    );
  }

  const status = dashboard?.status;
  const state = status?.state ?? "dormant";

  return (
    <CommandCenterHomeView
      state={state}
      zones={dashboard?.zones ?? []}
      {...(status?.offlineTimestamp !== undefined ? { offlineTimestamp: status.offlineTimestamp } : {})}
      {...(status?.warningMessage !== undefined ? { warningMessage: status.warningMessage } : {})}
      {...(status?.degradedZones !== undefined ? { degradedZones: status.degradedZones } : {})}
      onConnectData={() => navigate(ROUTES.onboarding.connect)}
      onRefresh={() => void loadDashboard()}
    />
  );
}
