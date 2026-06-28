import type {
  AdvisoryRecommendationDetailView,
  AdvisoryRecommendationView,
  IntelligenceFeedView,
  IntelligenceHomeView,
  IntelligenceTimelineView,
  IntelligenceFeedItemView,
  UpdateAdvisoryStatusInput,
} from "@conquest/contracts";

const API_BASE = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(`${response.status}: ${body.error ?? response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchIntelligenceHome(workspaceId: string) {
  return request<{ home: IntelligenceHomeView }>(`/api/workspaces/${workspaceId}/intelligence/home`);
}

export async function fetchIntelligenceFeed(
  workspaceId: string,
  params?: { category?: string; search?: string },
) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<{ feed: IntelligenceFeedView }>(`/api/workspaces/${workspaceId}/intelligence/feed${suffix}`);
}

export async function fetchRecommendations(workspaceId: string) {
  return request<{ recommendations: AdvisoryRecommendationView[] }>(
    `/api/workspaces/${workspaceId}/intelligence/recommendations`,
  );
}

export async function fetchRecommendation(workspaceId: string, recommendationId: string) {
  return request<{ recommendation: AdvisoryRecommendationDetailView }>(
    `/api/workspaces/${workspaceId}/intelligence/recommendations/${recommendationId}`,
  );
}

export async function updateRecommendationStatus(
  workspaceId: string,
  recommendationId: string,
  body: UpdateAdvisoryStatusInput,
) {
  return request<{ recommendation: AdvisoryRecommendationDetailView }>(
    `/api/workspaces/${workspaceId}/intelligence/recommendations/${recommendationId}/status`,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function fetchOpportunities(workspaceId: string) {
  return request<{ opportunities: IntelligenceFeedItemView[] }>(
    `/api/workspaces/${workspaceId}/intelligence/opportunities`,
  );
}

export async function fetchRisks(workspaceId: string) {
  return request<{ risks: IntelligenceFeedItemView[] }>(`/api/workspaces/${workspaceId}/intelligence/risks`);
}

export async function fetchIntelligenceTimeline(workspaceId: string) {
  return request<{ timeline: IntelligenceTimelineView }>(`/api/workspaces/${workspaceId}/intelligence/timeline`);
}
