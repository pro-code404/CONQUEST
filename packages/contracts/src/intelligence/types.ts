import { z } from "zod";

export const INTELLIGENCE_FEED_CATEGORIES = [
  "recommendation",
  "opportunity",
  "risk",
  "insight",
  "alert",
] as const;

export type IntelligenceFeedCategory = (typeof INTELLIGENCE_FEED_CATEGORIES)[number];

export interface IntelligenceHomeView {
  workspaceId: string;
  summary: string;
  feedCount: number;
  recommendationCount: number;
  opportunityCount: number;
  riskCount: number;
  insightCount: number;
  lastUpdatedAt: string | null;
}

export interface IntelligenceFeedItemView {
  id: string;
  category: IntelligenceFeedCategory;
  title: string;
  summary: string;
  confidence: number;
  timestamp: string;
  status: "new" | "reviewed" | "dismissed";
}

export interface IntelligenceFeedView {
  items: IntelligenceFeedItemView[];
  categories: IntelligenceFeedCategory[];
}

export interface IntelligenceTimelineEntryView {
  id: string;
  title: string;
  category: IntelligenceFeedCategory;
  timestamp: string;
  actor: string;
}

export interface IntelligenceTimelineView {
  entries: IntelligenceTimelineEntryView[];
}

export function intelligenceHomeRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence`;
}

export function intelligenceFeedRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence/feed`;
}

export function intelligenceRecommendationsRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence/recommendations`;
}

export function intelligenceOpportunitiesRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence/opportunities`;
}

export function intelligenceRisksRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence/risks`;
}

export function intelligenceTimelineRoute(workspaceId: string): string {
  return `/app/w/${workspaceId}/intelligence/timeline`;
}

export const IntelligenceFeedQuerySchema = z.object({
  category: z.enum(INTELLIGENCE_FEED_CATEGORIES).optional(),
  search: z.string().max(200).optional(),
});

export type IntelligenceFeedQuery = z.infer<typeof IntelligenceFeedQuerySchema>;
