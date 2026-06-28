import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResearchHomeView, ResearchSessionScreenView } from "@conquest/presentation";
import type { ResearchSessionDetailView, ResearchSessionView, ResearchSourceView } from "@conquest/contracts";
import { researchHomeRoute, researchSessionRoute } from "@conquest/contracts";
import { GisState, GisStateLabels } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./research-client.js";

export function ResearchHomeScreen() {
  const { workspaceId = "" } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ResearchSessionView[]>([]);
  const [sources, setSources] = useState<ResearchSourceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchResearchHome(workspaceId);
      setSessions(data.sessions);
      setSources(data.sources);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    logScreenEvent("RES-01", "view");
    void load();
  }, [load]);

  async function onCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const title = String(new FormData(event.currentTarget).get("title") ?? "");
      const { session } = await api.createResearchSession(workspaceId, { title });
      navigate(researchSessionRoute(workspaceId, session.id));
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setCreating(false);
    }
  }

  return (
    <ResearchHomeView
      sessions={sessions}
      sources={sources}
      loading={loading}
      error={error}
      sessionHref={(id) => researchSessionRoute(workspaceId, id)}
      onCreateSubmit={onCreateSubmit}
      creating={creating}
    />
  );
}

export function ResearchSessionScreen() {
  const { workspaceId = "", researchSessionId = "" } = useParams();
  const [session, setSession] = useState<ResearchSessionDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [recommendationHref, setRecommendationHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchResearchSession(workspaceId, researchSessionId);
      setSession(data.session);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, researchSessionId]);

  useEffect(() => {
    logScreenEvent("RES-02", "view");
    void load();
  }, [load]);

  async function onRegisterSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistering(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      const data = await api.registerResearchSource(workspaceId, researchSessionId, {
        name: String(form.get("name") ?? ""),
        type: String(form.get("type") ?? ""),
      });
      setSession(data.session);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setRegistering(false);
    }
  }

  async function onAnalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      const { analysis } = await api.analyzeResearchSession(workspaceId, researchSessionId);
      setAnalysisSummary(analysis.recommendationSummary);
      setRecommendationHref(analysis.recommendationHref);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <ResearchSessionScreenView
      session={session}
      loading={loading}
      error={error}
      homeHref={researchHomeRoute(workspaceId)}
      onRegisterSource={onRegisterSource}
      registering={registering}
      onAnalyze={() => void onAnalyze()}
      analyzing={analyzing}
      analysisSummary={analysisSummary}
      recommendationHref={recommendationHref}
    />
  );
}
