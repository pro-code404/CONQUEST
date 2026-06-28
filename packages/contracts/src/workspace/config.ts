import { z } from "zod";

export type DataSourceStatus = "connected" | "disconnected" | "error";

export interface DataSourceView {
  id: string;
  name: string;
  type: string;
  status: DataSourceStatus;
  lastSyncAt: string | null;
}

export interface WorkspaceGoalView {
  id: string;
  title: string;
  status: "active" | "completed" | "archived";
  progress: number;
}

export const ConnectDataSourceSchema = z.object({
  type: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
});

export type ConnectDataSourceInput = z.infer<typeof ConnectDataSourceSchema>;

export const CreateWorkspaceGoalSchema = z.object({
  title: z.string().min(1).max(200),
});

export type CreateWorkspaceGoalInput = z.infer<typeof CreateWorkspaceGoalSchema>;

export function settingsSourcesRoute(workspaceId: string): string {
  return `/app/settings/workspace/${workspaceId}/sources`;
}

export function settingsSourceConnectRoute(workspaceId: string, type: string): string {
  return `/app/settings/workspace/${workspaceId}/sources/connect/${type}`;
}

export function settingsGoalsRoute(workspaceId: string): string {
  return `/app/settings/workspace/${workspaceId}/goals`;
}
