import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AutomationApprovalsView,
  AutomationBuilderView,
  AutomationCenterView,
  AutomationDetailView,
  AutomationExecutionLogView,
} from "@conquest/presentation";
import type { AutomationCenterView as CenterData, WorkflowDetailView } from "@conquest/contracts";
import {
  automationCenterRoute,
  automationDetailRoute,
  automationLogRoute,
} from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./automation-client.js";

function approvalsRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/automation/approvals`;
}

function newWorkflowRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/automation/new`;
}

/** AUT-01 — Automation Center */
export function AutomationCenterScreen() {
  const { workspaceId = "" } = useParams();
  const [center, setCenter] = useState<CenterData | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (query?: string) => {
      if (!workspaceId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchAutomationCenter(workspaceId, query ? { search: query } : undefined);
        setCenter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    logScreenEvent("AUT-01", "view");
    void load();
  }, [load]);

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load(search);
  }

  return (
    <AutomationCenterView
      center={center}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      onSearchSubmit={onSearchSubmit}
      newWorkflowHref={newWorkflowRoute(workspaceId)}
      approvalsHref={approvalsRoute(workspaceId)}
      detailHref={(id) => automationDetailRoute(workspaceId, id)}
    />
  );
}

/** AUT-02 — Automation Builder */
export function AutomationBuilderScreen() {
  const { workspaceId = "" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("AUT-02", "view");
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const input = api.parseBuilderForm(new FormData(event.currentTarget));
      const { workflow } = await api.createWorkflow(workspaceId, input);
      setMessage("Workflow created.");
      navigate(automationDetailRoute(workspaceId, workflow.id));
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      setLoading(false);
    }
  }

  return (
    <AutomationBuilderView
      loading={loading}
      error={error}
      message={message}
      onSubmit={(event) => void onSubmit(event)}
      cancelHref={automationCenterRoute(workspaceId)}
    />
  );
}

/** AUT-03 — Automation Detail */
export function AutomationDetailScreen() {
  const { workspaceId = "", workflowId = "" } = useParams();
  const [workflow, setWorkflow] = useState<WorkflowDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workspaceId || !workflowId) return;
    setLoading(true);
    setError(null);
    try {
      const { workflow: data } = await api.fetchWorkflow(workspaceId, workflowId);
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, workflowId]);

  useEffect(() => {
    logScreenEvent("AUT-03", "view");
    void load();
  }, [load]);

  async function mutate(action: () => Promise<{ workflow: WorkflowDetailView }>, success: string) {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await action();
      setWorkflow(result.workflow);
      setMessage(success);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AutomationDetailView
      workflow={workflow}
      loading={loading}
      error={error}
      message={message}
      logHref={automationLogRoute(workspaceId, workflowId)}
      centerHref={automationCenterRoute(workspaceId)}
      onEnable={() => void mutate(() => api.enableWorkflow(workspaceId, workflowId), "Workflow enabled.")}
      onDisable={() => void mutate(() => api.disableWorkflow(workspaceId, workflowId), "Workflow disabled.")}
      onPause={() => void mutate(() => api.pauseWorkflow(workspaceId, workflowId), "Workflow paused.")}
      onResume={() => void mutate(() => api.resumeWorkflow(workspaceId, workflowId), "Workflow resumed.")}
      onArchive={() => void mutate(() => api.archiveWorkflow(workspaceId, workflowId), "Workflow archived.")}
      onRun={async () => {
        setLoading(true);
        setError(null);
        try {
          await api.manualRunWorkflow(workspaceId, workflowId);
          setMessage("Manual run recorded.");
          await load();
        } catch (err) {
          setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}

/** AUT-04 — Execution Log */
export function AutomationExecutionLogScreen() {
  const { workspaceId = "", workflowId = "" } = useParams();
  const [executions, setExecutions] = useState<Awaited<ReturnType<typeof api.fetchExecutions>>["executions"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("AUT-04", "view");
    if (!workspaceId || !workflowId) return;
    api
      .fetchExecutions(workspaceId, workflowId)
      .then((data) => setExecutions(data.executions))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, [workspaceId, workflowId]);

  return (
    <AutomationExecutionLogView
      executions={executions}
      loading={loading}
      error={error}
      detailHref={automationDetailRoute(workspaceId, workflowId)}
    />
  );
}

/** AUT-05 — Approval Queue */
export function AutomationApprovalsScreen() {
  const { workspaceId = "" } = useParams();
  const [approvals, setApprovals] = useState<Awaited<ReturnType<typeof api.fetchApprovals>>["approvals"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .fetchApprovals(workspaceId)
      .then((data) => setApprovals(data.approvals))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("AUT-05", "view");
    load();
  }, [workspaceId]);

  async function onApprove(workflowId: string) {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await api.approveWorkflow(workspaceId, workflowId);
      setMessage("Workflow approved.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      setLoading(false);
    }
  }

  async function onReject(workflowId: string) {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await api.rejectWorkflow(workspaceId, workflowId);
      setMessage("Workflow rejected.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      setLoading(false);
    }
  }

  return (
    <AutomationApprovalsView
      approvals={approvals}
      loading={loading}
      error={error}
      message={message}
      centerHref={automationCenterRoute(workspaceId)}
      onApprove={(id) => void onApprove(id)}
      onReject={(id) => void onReject(id)}
    />
  );
}
