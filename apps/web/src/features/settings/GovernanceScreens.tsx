import { type FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActivityLogView,
  AiControlsSettingsView,
  AutomationPoliciesSettingsView,
  DataSourcesView,
  MfaEnrollmentView,
  MemoryControlsSettingsView,
  SecurityCenterView,
  WorkspaceGoalsView,
} from "@conquest/presentation";
import type {
  AiControlsView,
  AuditEventView,
  AutomationPoliciesView,
  DataSourceView,
  MemoryControlsView,
  SecuritySettingsView,
  WorkspaceGoalView,
} from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { ROUTES } from "../../shared/config/routes.js";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as client from "../../auth/client.js";

function SettingsBackLink() {
  return (
    <p>
      <a href={ROUTES.settings.home}>← Settings</a>
    </p>
  );
}

/** SET-03 */
export function SecuritySettingsScreen() {
  const [security, setSecurity] = useState<SecuritySettingsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-03", "view");
    client
      .fetchSecuritySettings()
      .then((data) => setSecurity(data.security))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SettingsBackLink />
      <SecurityCenterView
        security={security}
        loading={loading}
        error={error}
        mfaHref={ROUTES.settings.mfa}
        sessionsHref={ROUTES.profile.sessions}
      />
    </>
  );
}

/** SET-03a */
export function MfaEnrollmentScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  useEffect(() => {
    logScreenEvent("SET-03a", "view");
  }, []);

  async function onEnroll() {
    setLoading(true);
    setError(null);
    try {
      const result = await client.enrollMfa();
      setRecoveryCodes(result.recoveryCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  async function onConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("recoveryCode"));
    setLoading(true);
    setError(null);
    try {
      await client.confirmMfaEnrollment({ recoveryCode: code });
      setMessage("MFA enrollment complete.");
      logScreenEvent("SET-03a", "enrolled");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MfaEnrollmentView
        loading={loading}
        error={error}
        message={message}
        recoveryCodes={recoveryCodes}
        onEnroll={() => void onEnroll()}
        onConfirm={(event) => void onConfirm(event)}
        securityHref={ROUTES.settings.security}
      />
    </>
  );
}

/** SET-18 */
export function ActivityLogScreen() {
  const [events, setEvents] = useState<AuditEventView[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load(query?: string) {
    setLoading(true);
    client
      .fetchActivityLog(query ? { search: query } : {})
      .then((data) => setEvents(data.events))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("SET-18", "view");
    load();
  }, []);

  return (
    <>
      <SettingsBackLink />
      <ActivityLogView
        events={events}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(event) => {
          event.preventDefault();
          load(search);
        }}
      />
    </>
  );
}

/** SET-16 */
export function AutomationPoliciesScreen() {
  const [policies, setPolicies] = useState<AutomationPoliciesView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-16", "view");
    client
      .fetchAutomationPolicies()
      .then((data) => setPolicies(data.policies))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const result = await client.updateAutomationPolicies({
        requireApproval: data.get("requireApproval") === "on",
        emergencyDisabled: data.get("emergencyDisabled") === "on",
        maxConcurrentRuns: Number(data.get("maxConcurrentRuns")),
      });
      setPolicies(result.policies);
      setMessage("Policies saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <AutomationPoliciesSettingsView
        policies={policies}
        loading={loading}
        error={error}
        message={message}
        onSubmit={(event) => void onSubmit(event)}
      />
    </>
  );
}

/** SET-14 */
export function AdvancedSettingsScreen() {
  const [ai, setAi] = useState<AiControlsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-14", "view");
    client
      .fetchAiControls()
      .then((data) => setAi(data.ai))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await client.updateAiControls({
        preferredProvider: String(data.get("preferredProvider")) as AiControlsView["preferredProvider"],
        depthPreference: String(data.get("depthPreference")) as AiControlsView["depthPreference"],
      });
      setAi(result.ai);
      setMessage("Preferences saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <AiControlsSettingsView
        ai={ai}
        loading={loading}
        error={error}
        message={message}
        onSubmit={(event) => void onSubmit(event)}
      />
    </>
  );
}

/** SET-15 */
export function MemoryControlsScreen() {
  const [memory, setMemory] = useState<MemoryControlsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("SET-15", "view");
    client
      .fetchMemoryControls()
      .then((data) => setMemory(data.memory))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const days = Number(new FormData(event.currentTarget).get("retentionDays"));
      const result = await client.updateMemoryControls({ retentionDays: days });
      setMemory(result.memory);
      setMessage("Retention updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <MemoryControlsSettingsView
        memory={memory}
        loading={loading}
        error={error}
        message={message}
        onSubmit={(event) => void onSubmit(event)}
      />
    </>
  );
}

/** SET-11 */
export function DataSourcesScreen() {
  const { workspaceId = "" } = useParams();
  const [sources, setSources] = useState<DataSourceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    client
      .fetchDataSources(workspaceId)
      .then((data) => setSources(data.sources))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("SET-11", "view");
    load();
  }, [workspaceId]);

  async function onConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await client.connectDataSource(workspaceId, {
        name: String(data.get("name")),
        type: String(data.get("type")),
      });
      setSources(result.sources);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <DataSourcesView sources={sources} loading={loading} error={error} onConnect={(e) => void onConnect(e)} />
    </>
  );
}

/** SET-13 */
export function WorkspaceGoalsScreen() {
  const { workspaceId = "" } = useParams();
  const [goals, setGoals] = useState<WorkspaceGoalView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    client
      .fetchWorkspaceGoals(workspaceId)
      .then((data) => setGoals(data.goals))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("SET-13", "view");
    load();
  }, [workspaceId]);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = String(new FormData(event.currentTarget).get("title"));
    setLoading(true);
    try {
      const result = await client.createWorkspaceGoal(workspaceId, { title });
      setGoals(result.goals);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SettingsBackLink />
      <WorkspaceGoalsView goals={goals} loading={loading} error={error} onCreate={(e) => void onCreate(e)} />
    </>
  );
}
