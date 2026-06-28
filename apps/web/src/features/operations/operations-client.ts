import type { OperationsDashboardView } from "@conquest/contracts";

const API_BASE = "";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(`${response.status}: ${body.error ?? response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchOperationsDashboard(workspaceId: string) {
  return request<{ dashboard: OperationsDashboardView }>(
    `/api/workspaces/${workspaceId}/operations/dashboard`,
  );
}
