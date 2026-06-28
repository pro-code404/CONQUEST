import { z } from "zod";

export const TIME_RANGES = ["7d", "30d", "90d", "ytd", "custom"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export interface MetricDefinitionView {
  id: string;
  label: string;
  unit: string;
  category: string;
}

export interface KpiValueView {
  metricId: string;
  label: string;
  value: number;
  previousValue: number | null;
  trend: "up" | "down" | "flat";
  formatted: string;
}

export interface AnalyticsDashboardView {
  workspaceId: string;
  timeRange: TimeRange;
  kpis: KpiValueView[];
  metrics: MetricDefinitionView[];
  exportAvailable: boolean;
}

export interface SavedAnalyticsView {
  id: string;
  name: string;
  timeRange: TimeRange;
  filters: Record<string, string>;
  createdAt: string;
}

export const AnalyticsFilterSchema = z.object({
  timeRange: z.enum(TIME_RANGES).optional(),
  category: z.string().max(64).optional(),
});

export const SaveAnalyticsViewSchema = z.object({
  name: z.string().min(1).max(120),
  timeRange: z.enum(TIME_RANGES),
  filters: z.record(z.string()).optional(),
});

export type AnalyticsFilterInput = z.infer<typeof AnalyticsFilterSchema>;
export type SaveAnalyticsViewInput = z.infer<typeof SaveAnalyticsViewSchema>;

export function analyticsHomeRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/reports`;
}

export function analyticsSavedViewsRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/reports/saved`;
}
