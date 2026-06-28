import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IntelligenceCategoryListView,
  IntelligenceFeedScreenView,
  IntelligenceHomeScreenView,
  IntelligenceRecommendationDetailView,
  IntelligenceRecommendationsView,
  IntelligenceTimelineScreenView,
} from "@conquest/presentation";
import type {
  AdvisoryRecommendationDetailView,
  AdvisoryRecommendationView,
  IntelligenceFeedView,
  IntelligenceHomeView,
  IntelligenceFeedItemView,
  IntelligenceTimelineView,
} from "@conquest/contracts";
import {
  advisoryDetailRoute,
  intelligenceFeedRoute,
  intelligenceHomeRoute,
  intelligenceOpportunitiesRoute,
  intelligenceRecommendationsRoute,
  intelligenceRisksRoute,
  intelligenceTimelineRoute,
} from "@conquest/contracts";
import { GisStateLabels, GisState } from "@conquest/gis";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";
import * as api from "./intelligence-client.js";

/** INT-01 */
export function IntelligenceHomeScreen() {
  const { workspaceId = "" } = useParams();
  const [home, setHome] = useState<IntelligenceHomeView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("INT-01", "view");
    void (async () => {
      try {
        const data = await api.fetchIntelligenceHome(workspaceId);
        setHome(data.home);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return (
    <IntelligenceHomeScreenView
      home={home}
      loading={loading}
      error={error}
      feedHref={intelligenceFeedRoute(workspaceId)}
      recommendationsHref={intelligenceRecommendationsRoute(workspaceId)}
      opportunitiesHref={intelligenceOpportunitiesRoute(workspaceId)}
      risksHref={intelligenceRisksRoute(workspaceId)}
      timelineHref={intelligenceTimelineRoute(workspaceId)}
    />
  );
}

/** INT-02 */
export function IntelligenceFeedScreen() {
  const { workspaceId = "" } = useParams();
  const [feed, setFeed] = useState<IntelligenceFeedView | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (params?: { category?: string; search?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchIntelligenceFeed(workspaceId, params);
        setFeed(data.feed);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    logScreenEvent("INT-02", "view");
    void load();
  }, [load]);

  function onFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load({ ...(category ? { category } : {}), ...(search ? { search } : {}) });
  }

  return (
    <IntelligenceFeedScreenView
      feed={feed}
      loading={loading}
      error={error}
      search={search}
      category={category}
      onSearchChange={setSearch}
      onCategoryChange={setCategory}
      onFilterSubmit={onFilterSubmit}
      homeHref={intelligenceHomeRoute(workspaceId)}
    />
  );
}

/** INT-03 */
export function IntelligenceRecommendationsScreen() {
  const { workspaceId = "" } = useParams();
  const [items, setItems] = useState<AdvisoryRecommendationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("INT-03", "view");
    void (async () => {
      try {
        const data = await api.fetchRecommendations(workspaceId);
        setItems(data.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return (
    <IntelligenceRecommendationsView
      items={items}
      loading={loading}
      error={error}
      detailHref={(id) => advisoryDetailRoute(workspaceId, id)}
      homeHref={intelligenceHomeRoute(workspaceId)}
    />
  );
}

export function IntelligenceRecommendationDetailScreen() {
  const { workspaceId = "", recommendationId = "" } = useParams();
  const [item, setItem] = useState<AdvisoryRecommendationDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchRecommendation(workspaceId, recommendationId);
      setItem(data.recommendation);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, recommendationId]);

  useEffect(() => {
    logScreenEvent("INT-03", "view");
    void load();
  }, [load]);

  async function updateStatus(status: "approved" | "rejected") {
    setLoading(true);
    setMessage(null);
    try {
      const data = await api.updateRecommendationStatus(workspaceId, recommendationId, { status });
      setItem(data.recommendation);
      setMessage(`Recommendation ${status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <IntelligenceRecommendationDetailView
      item={item}
      loading={loading}
      error={error}
      message={message}
      onApprove={() => void updateStatus("approved")}
      onReject={() => void updateStatus("rejected")}
      listHref={intelligenceRecommendationsRoute(workspaceId)}
    />
  );
}

/** INT-04 */
export function IntelligenceOpportunitiesScreen() {
  const { workspaceId = "" } = useParams();
  const [items, setItems] = useState<IntelligenceFeedItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("INT-04", "view");
    void (async () => {
      try {
        const data = await api.fetchOpportunities(workspaceId);
        setItems(data.opportunities);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return (
    <IntelligenceCategoryListView
      title="Opportunities"
      items={items}
      loading={loading}
      error={error}
      homeHref={intelligenceHomeRoute(workspaceId)}
    />
  );
}

/** INT-05 */
export function IntelligenceRisksScreen() {
  const { workspaceId = "" } = useParams();
  const [items, setItems] = useState<IntelligenceFeedItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("INT-05", "view");
    void (async () => {
      try {
        const data = await api.fetchRisks(workspaceId);
        setItems(data.risks);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return (
    <IntelligenceCategoryListView
      title="Risk detection"
      items={items}
      loading={loading}
      error={error}
      homeHref={intelligenceHomeRoute(workspaceId)}
    />
  );
}

/** INT-06 */
export function IntelligenceTimelineScreen() {
  const { workspaceId = "" } = useParams();
  const [timeline, setTimeline] = useState<IntelligenceTimelineView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logScreenEvent("INT-06", "view");
    void (async () => {
      try {
        const data = await api.fetchIntelligenceTimeline(workspaceId);
        setTimeline(data.timeline);
      } catch (err) {
        setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      } finally {
        setLoading(false);
      }
    })();
  }, [workspaceId]);

  return (
    <IntelligenceTimelineScreenView
      timeline={timeline}
      loading={loading}
      error={error}
      homeHref={intelligenceHomeRoute(workspaceId)}
    />
  );
}
