import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OperationsDashboardScreenView } from "@conquest/presentation";
import type { OperationsDashboardView } from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./operations-client.js";

export function OperationsDashboardScreen() {
  const { workspaceId = "" } = useParams();
  const [dashboard, setDashboard] = useState<OperationsDashboardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("OPS-01", "view");
    void (async () => {
      try {
        const data = await api.fetchOperationsDashboard(workspaceId);
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return <OperationsDashboardScreenView dashboard={dashboard} loading={loading} error={error} />;
}
