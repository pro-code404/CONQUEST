import type { AdministrationDashboardView } from "@conquest/contracts";

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

export async function fetchAdministrationDashboard() {
  return request<{ dashboard: AdministrationDashboardView }>("/api/settings/administration");
}

export async function updateFeatureFlag(flagId: string, enabled: boolean) {
  return request<{ dashboard: AdministrationDashboardView }>(`/api/settings/administration/feature-flags/${flagId}`, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}
