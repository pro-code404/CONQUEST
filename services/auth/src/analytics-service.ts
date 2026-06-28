import { randomUUID } from "node:crypto";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  AnalyticsFilterSchema,
  SaveAnalyticsViewSchema,
  type AnalyticsDashboardView,
  type AnalyticsFilterInput,
  type MetricDefinitionView,
  type SavedAnalyticsView,
  type SaveAnalyticsViewInput,
  type TimeRange,
} from "@conquest/contracts";
import type { UserRole } from "@conquest/contracts";
import type { SavedAnalyticsViewRecord } from "./memory-repository.js";
import type { AuthRepository } from "./auth-repository.js";

const METRIC_REGISTRY: MetricDefinitionView[] = [
  { id: "active_users", label: "Active users", unit: "count", category: "engagement" },
  { id: "automation_runs", label: "Automation runs", unit: "count", category: "automation" },
  { id: "data_freshness", label: "Data freshness", unit: "hours", category: "data" },
  { id: "goal_progress", label: "Goal progress", unit: "percent", category: "strategy" },
];

export class AnalyticsService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.ANALYTICS;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async getDashboard(
    sessionId: string,
    workspaceId: string,
    raw?: AnalyticsFilterInput,
  ): Promise<AnalyticsDashboardView> {
    const query = raw ? AnalyticsFilterSchema.parse(raw) : {};
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const timeRange: TimeRange = query.timeRange ?? "30d";
    const category = query.category;
    const metrics = category
      ? METRIC_REGISTRY.filter((metric) => metric.category === category)
      : METRIC_REGISTRY;

    return {
      workspaceId,
      timeRange,
      metrics,
      kpis: metrics.map((metric, index) => {
        const value = 100 - index * 7;
        const previous = value - 3;
        return {
          metricId: metric.id,
          label: metric.label,
          value,
          previousValue: previous,
          trend: value > previous ? "up" : value < previous ? "down" : "flat",
          formatted: metric.unit === "percent" ? `${value}%` : `${value}`,
        };
      }),
      exportAvailable: true,
    };
  }

  async listSavedViews(sessionId: string, workspaceId: string): Promise<SavedAnalyticsView[]> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    return (await this.repo.listSavedAnalyticsViews(workspaceId))
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((view) => this.toSavedView(view));
  }

  async saveView(
    sessionId: string,
    workspaceId: string,
    raw: SaveAnalyticsViewInput,
  ): Promise<SavedAnalyticsView> {
    const input = SaveAnalyticsViewSchema.parse(raw);
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);
    const record: SavedAnalyticsViewRecord = {
      id: randomUUID(),
      workspaceId,
      name: input.name.trim(),
      timeRange: input.timeRange,
      filters: input.filters ?? {},
      createdAt: Date.now(),
    };
    const views = await this.repo.listSavedAnalyticsViews(workspaceId);
    views.push(record);
    await this.repo.saveSavedAnalyticsViews(workspaceId, views);
    this.emit("analytics_view_saved", "info", { viewId: record.id, workspaceId });
    return this.toSavedView(record);
  }

  async getMetricRegistry(sessionId: string, workspaceId: string): Promise<MetricDefinitionView[]> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    return [...METRIC_REGISTRY];
  }

  private toSavedView(record: SavedAnalyticsViewRecord): SavedAnalyticsView {
    return {
      id: record.id,
      name: record.name,
      timeRange: record.timeRange,
      filters: { ...record.filters },
      createdAt: new Date(record.createdAt).toISOString(),
    };
  }

  private async requireWorkspaceAccess(sessionId: string, workspaceId: string) {
    const session = await this.requireSession(sessionId);
    const workspace = await this.repo.findWorkspace(workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    assertOrgAccess({ orgId: session.orgId }, workspace.orgId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    return { session, user, workspace };
  }

  private requireMember(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.member) {
      throw new Error("Member access required");
    }
  }

  private async requireSession(sessionId: string) {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }
}
