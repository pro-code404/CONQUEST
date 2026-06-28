import type {
  AdvisoryRecommendationView,
  CommandCenterDashboardView,
  CommandCenterStatusResponse,
  CommandCenterZoneView,
  IntelligenceFeedItemView,
  WorkspaceGoalView,
} from "@conquest/contracts";
import { advisoryDetailRoute, intelligenceFeedRoute } from "@conquest/contracts";

const ZONE_DEFS = [
  { id: "alerts", label: "Alerts" },
  { id: "recommendations", label: "Recommendations" },
  { id: "executive-summary", label: "Executive summary" },
  { id: "risks", label: "Risks" },
  { id: "opportunities", label: "Opportunities" },
  { id: "goals-kpis", label: "Goals & KPIs" },
  { id: "execution", label: "Execution" },
  { id: "activity", label: "Activity" },
] as const;

export interface CommandCenterIntegrationInput {
  workspaceId: string;
  status: CommandCenterStatusResponse;
  feedItems: IntelligenceFeedItemView[];
  recommendations: AdvisoryRecommendationView[];
  goals: WorkspaceGoalView[];
  pendingApprovals: number;
  enabledWorkflowCount: number;
  platformHealthy: boolean;
  cognitiveRequestCount: number;
  primaryGoal: string | null;
}

/** Assembles Command Center zones from existing service data — no fabricated intelligence. */
export function buildCommandCenterDashboard(input: CommandCenterIntegrationInput): CommandCenterDashboardView {
  const alerts = input.feedItems.filter((item) => item.category === "alert");
  const risks = input.feedItems.filter((item) => item.category === "risk");
  const opportunities = input.feedItems.filter((item) => item.category === "opportunity");
  const insights = input.feedItems.filter((item) => item.category === "insight");

  const zones: CommandCenterZoneView[] = ZONE_DEFS.map((zone) => {
    switch (zone.id) {
      case "alerts":
        return zoneFromFeed(zone.id, zone.label, alerts, input.workspaceId, "No alerts require attention.");
      case "recommendations":
        return {
          id: zone.id,
          label: zone.label,
          items: input.recommendations.slice(0, 5).map((rec) => ({
            id: rec.id,
            label: rec.title,
            summary: rec.summary,
            href: advisoryDetailRoute(input.workspaceId, rec.id),
            confidence: rec.confidence,
            status: rec.status,
          })),
          ...(input.recommendations.length === 0
            ? { emptyMessage: "Run research analysis to generate evidence-based recommendations." }
            : {}),
        };
      case "executive-summary":
        return {
          id: zone.id,
          label: zone.label,
          items:
            input.primaryGoal || insights.length > 0
              ? [
                  ...(input.primaryGoal
                    ? [
                        {
                          id: "primary-goal",
                          label: "Workspace goal",
                          summary: input.primaryGoal,
                        },
                      ]
                    : []),
                  ...insights.slice(0, 2).map((item) => ({
                    id: item.id,
                    label: item.title,
                    summary: item.summary,
                    href: intelligenceFeedRoute(input.workspaceId),
                    confidence: item.confidence,
                  })),
                ]
              : [],
          ...(!input.primaryGoal && insights.length === 0 ? { emptyMessage: "No executive summary yet." } : {}),
        };
      case "risks":
        return zoneFromFeed(zone.id, zone.label, risks, input.workspaceId, "No risks identified.");
      case "opportunities":
        return zoneFromFeed(
          zone.id,
          zone.label,
          opportunities,
          input.workspaceId,
          "No opportunities identified.",
        );
      case "goals-kpis":
        return {
          id: zone.id,
          label: zone.label,
          items: input.goals.map((goal) => ({
            id: goal.id,
            label: goal.title,
            summary: `${goal.status} · ${goal.progress}% complete`,
          })),
          ...(input.goals.length === 0 ? { emptyMessage: "Add goals in workspace settings." } : {}),
        };
      case "execution":
        return {
          id: zone.id,
          label: zone.label,
          items: [
            ...(input.pendingApprovals > 0
              ? [
                  {
                    id: "pending-approvals",
                    label: "Pending approvals",
                    summary: `${input.pendingApprovals} workflow(s) awaiting approval`,
                    href: `/app/w/${input.workspaceId}/automation/approvals`,
                  },
                ]
              : []),
            ...(input.enabledWorkflowCount > 0
              ? [
                  {
                    id: "active-workflows",
                    label: "Active workflows",
                    summary: `${input.enabledWorkflowCount} enabled workflow(s)`,
                    href: `/app/w/${input.workspaceId}/automation`,
                  },
                ]
              : []),
          ],
          ...(input.pendingApprovals === 0 && input.enabledWorkflowCount === 0
            ? { emptyMessage: "No automation execution activity." }
            : {}),
        };
      case "activity":
        return zoneFromFeed(
          zone.id,
          zone.label,
          input.feedItems.slice(0, 5),
          input.workspaceId,
          "No recent intelligence activity.",
        );
    }
  });

  return {
    workspaceId: input.workspaceId,
    status: input.status,
    zones,
    platformHealthy: input.platformHealthy,
    cognitiveRequestCount: input.cognitiveRequestCount,
    lastRefreshedAt: new Date().toISOString(),
  };
}

function zoneFromFeed(
  id: string,
  label: string,
  items: IntelligenceFeedItemView[],
  workspaceId: string,
  emptyMessage: string,
): CommandCenterZoneView {
  return {
    id,
    label,
    items: items.slice(0, 5).map((item) => ({
      id: item.id,
      label: item.title,
      summary: item.summary,
      href: intelligenceFeedRoute(workspaceId),
      confidence: item.confidence,
      status: item.status,
    })),
    ...(items.length === 0 ? { emptyMessage } : {}),
  };
}
