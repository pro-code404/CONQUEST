import type {
  AnalyticsDashboardView,
  SavedAnalyticsView,
  SaveAnalyticsViewInput,
  TimeRange,
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

export async function fetchAnalyticsDashboard(
  workspaceId: string,
  params?: { timeRange?: TimeRange; category?: string },
) {
  const query = new URLSearchParams();
  if (params?.timeRange) query.set("timeRange", params.timeRange);
  if (params?.category) query.set("category", params.category);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<{ dashboard: AnalyticsDashboardView }>(
    `/api/workspaces/${workspaceId}/analytics/dashboard${suffix}`,
  );
}

export async function fetchSavedViews(workspaceId: string) {
  return request<{ views: SavedAnalyticsView[] }>(`/api/workspaces/${workspaceId}/analytics/saved-views`);
}

export async function saveAnalyticsView(workspaceId: string, body: SaveAnalyticsViewInput) {
  return request<{ view: SavedAnalyticsView }>(`/api/workspaces/${workspaceId}/analytics/saved-views`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
