import type {
  ResearchSessionDetailView,
  ResearchSessionView,
  ResearchSourceView,
  ResearchAnalysisResultView,
  CreateResearchSessionInput,
  RegisterResearchSourceInput,
} from "@conquest/contracts";

const API_BASE = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(`${response.status}: ${body.error ?? response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchResearchHome(workspaceId: string) {
  return request<{ sessions: ResearchSessionView[]; sources: ResearchSourceView[] }>(
    `/api/workspaces/${workspaceId}/research/sessions`,
  );
}

export async function createResearchSession(workspaceId: string, body: CreateResearchSessionInput) {
  return request<{ session: ResearchSessionDetailView }>(`/api/workspaces/${workspaceId}/research/sessions`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchResearchSession(workspaceId: string, sessionId: string) {
  return request<{ session: ResearchSessionDetailView }>(
    `/api/workspaces/${workspaceId}/research/sessions/${sessionId}`,
  );
}

export async function registerResearchSource(
  workspaceId: string,
  sessionId: string,
  body: RegisterResearchSourceInput,
) {
  return request<{ session: ResearchSessionDetailView }>(
    `/api/workspaces/${workspaceId}/research/sessions/${sessionId}/sources`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function analyzeResearchSession(workspaceId: string, sessionId: string) {
  return request<{ analysis: ResearchAnalysisResultView }>(
    `/api/workspaces/${workspaceId}/research/sessions/${sessionId}/analyze`,
    { method: "POST", body: JSON.stringify({}) },
  );
}
