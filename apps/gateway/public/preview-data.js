/**
 * CONQUEST INTELLIGENCE OS — Reference dashboard data
 */
const ConquestData = (() => {
  const NAV = [
    { id: "command", icon: "layout-grid", label: "Command Center" },
    { id: "intelligence", icon: "brain", label: "Intelligence" },
    { id: "analysis", icon: "bar-chart-3", label: "Analysis" },
    { id: "models", icon: "cpu", label: "Models" },
    { id: "predictions", icon: "target", label: "Predictions" },
    { id: "automation", icon: "zap", label: "Automation" },
    { id: "data-sources", icon: "database", label: "Data Sources" },
    { id: "research", icon: "search", label: "Research" },
    { id: "reports", icon: "file-text", label: "Reports" },
    { id: "knowledge", icon: "book-marked", label: "Knowledge" },
    { id: "memory", icon: "hard-drive", label: "Memory" },
    { id: "marketplace", icon: "store", label: "Marketplace" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  const KPIS = [
    { id: "revenue", label: "Total Revenue", display: "$2.45M", change: "+18.6%", color: "#2F6FFF", seed: 11 },
    { id: "reach", label: "Total Reach", display: "24.82M", change: "+14.2%", color: "#16C784", seed: 22 },
    { id: "engagement", label: "Engagement", display: "3.87M", change: "+22.5%", color: "#8A5CFF", seed: 33 },
    { id: "conversions", label: "Conversions", display: "89.7K", change: "+16.3%", color: "#16C784", seed: 44 },
    { id: "profit", label: "Net Profit", display: "$612.7K", change: "+21.8%", color: "#2F6FFF", seed: 55 },
  ];

  const PLATFORMS = [
    {
      name: "Instagram", icon: "instagram", reach: "8.28M", change: "+18.6%",
      share: 33.4, rank: 1, color: "#E4405F", seed: 11,
      engagement: "4.82%", content: "142 posts", clicks: "312K", conv: "2.4%",
      insight: "Reels account for 61% of net reach growth this period.",
    },
    {
      name: "TikTok", icon: "music-2", reach: "5.91M", change: "+32.1%",
      share: 23.8, rank: 2, color: "#25F4EE", seed: 22,
      engagement: "6.14%", content: "89 posts", clicks: "284K", conv: "3.1%",
      insight: "Fastest growth — engagement 2.3× portfolio average.",
    },
    {
      name: "YouTube", icon: "youtube", reach: "4.12M", change: "+12.4%",
      share: 16.6, rank: 3, color: "#FF0000", seed: 33,
      engagement: "3.28%", content: "24 videos", clicks: "198K", conv: "1.9%",
      insight: "Long-form watch time up 18% — strong retention curve.",
    },
    {
      name: "Facebook", icon: "facebook", reach: "3.45M", change: "+8.7%",
      share: 13.9, rank: 4, color: "#1877F2", seed: 44,
      engagement: "2.91%", content: "76 posts", clicks: "156K", conv: "1.6%",
      insight: "Groups channel outperforming feed by +22% reach.",
    },
    {
      name: "X", icon: "twitter", reach: "2.41M", change: "+15.2%",
      share: 9.7, rank: 5, color: "#1DA1F2", seed: 55,
      engagement: "3.54%", content: "210 posts", clicks: "124K", conv: "1.4%",
      insight: "Thread format posts driving 47% of profile visits.",
    },
  ];

  const PLATFORMS_META = {
    period: "Last 30 Days",
    totalReach: "24.82M",
    avgEngagement: "4.14%",
    topPlatform: "Instagram",
    insight: "TikTok leads velocity (+32.1%) while Instagram holds largest reach share.",
  };

  const AI_INSIGHTS = [
    { text: "Content reach increased 27% after influencer campaign on May 6", impact: "High Impact", conf: 92, level: "high" },
    { text: "TikTok engagement rate 2.3× higher than platform average", impact: "High Impact", conf: 88, level: "high" },
    { text: "Product reach lagging content reach by 18% — conversion opportunity", impact: "Medium Impact", conf: 71, level: "mid" },
    { text: "Email subscriber growth accelerating — up 34% this week", impact: "Medium Impact", conf: 76, level: "mid" },
  ];

  const REVENUE_BREAKDOWN = [
    { label: "Products", pct: 48.2, amount: "$1.18M", change: "+21.4%", color: "#2F6FFF", trend: "up" },
    { label: "Services", pct: 23.6, amount: "$578K", change: "+14.8%", color: "#16C784", trend: "up" },
    { label: "Subscriptions", pct: 16.3, amount: "$399K", change: "+24.1%", color: "#8A5CFF", trend: "up" },
    { label: "Ads", pct: 7.4, amount: "$181K", change: "+6.2%", color: "#F59E0B", trend: "up" },
    { label: "Others", pct: 4.5, amount: "$110K", change: "-2.1%", color: "#667085", trend: "down" },
  ];

  const REVENUE_META = {
    totalDisplay: "$2.45M",
    change: "+18.6%",
    period: "Last 30 Days",
    recurringShare: "64.5%",
    recurringLabel: "Recurring Revenue",
    arpu: "$42.80",
    arpuLabel: "Avg Revenue / User",
    margin: "38.2%",
    marginLabel: "Gross Margin",
    topDriver: "Products",
    insight: "Subscriptions grew fastest (+24.1%) — highest-margin recurring stream this period.",
  };

  const RECOMMENDATIONS = [
    { text: "Increase ad spend on TikTok", gain: "+$142K revenue" },
    { text: "Launch video campaign on YouTube", gain: "+$98K revenue" },
    { text: "Optimize conversion funnel", gain: "+$84K revenue" },
  ];

  const PREDICTIONS = [
    { label: "Revenue", value: "$2.62M projected", seed: 61 },
    { label: "Reach", value: "26.1M projected", seed: 62 },
    { label: "Conversions", value: "94.2K projected", seed: 63 },
  ];

  const ACTIVITY = [
    { text: "Report generated", time: "2m ago", type: "normal" },
    { text: "Data sync completed", time: "5m ago", type: "normal" },
    { text: "Anomaly detected", time: "8m ago", type: "alert" },
    { text: "Model updated", time: "15m ago", type: "normal" },
  ];

  const CHART_DAYS = [
    "Apr 29", "Apr 30", "May 1", "May 2", "May 3", "May 4", "May 5", "May 6",
    "May 7", "May 8", "May 9", "May 10", "May 11", "May 12", "May 13", "May 14", "May 15",
  ];

  const CHART_EVENTS = [
    { idx: 3, label: "Apr 30", title: "Content Reach Drop", value: "-18%", type: "down", series: "content" },
    { idx: 14, label: "May 6", title: "Campaign Launch", subtitle: "Influencer Push", type: "up", series: "content" },
    { idx: 26, label: "May 12", title: "Product Update", value: "+32% Reach", type: "up", series: "product" },
  ];

  const CONTENT_RISES = [
    "Viral reel breakout",
    "Hashtag trend lift",
    "Influencer repost surge",
    "Story views spike",
    "UGC campaign push",
  ];

  const PRODUCT_RISES = [
    "Feature launch buzz",
    "App store featuring",
    "Product demo viral clip",
    "Referral loop spike",
    "Onboarding funnel lift",
  ];

  /** Rhythmic reach flow — smooth trend with natural volatility (0–30M) */
  function generateFlowSeries(len, seed, base, trend) {
    let v = base;
    const out = [];
    for (let i = 0; i < len; i++) {
      const wave1 = Math.sin(i * 0.52 + seed * 0.11) * 3.2;
      const wave2 = Math.sin(i * 1.28 + seed * 0.28) * 1.6;
      const wave3 = Math.sin(i * 2.35 + seed * 0.47) * 0.95;
      const shard = Math.sin(i * 3.8 + seed * 1.3) * 0.55;
      v += trend + (wave1 + wave2 + wave3) * 0.2 + shard;
      if (i > 2 && i % 8 === 0) v -= 1.8 + (seed % 4) * 0.35;
      if (i > 2 && i % 10 === 4) v += 1.6 + (seed % 3) * 0.4;
      out.push(Math.max(3, Math.min(30, v)));
    }
    if (len > 3) {
      out[2] = Math.min(30, out[1] + 1.8);
      out[3] = Math.max(3, out[2] * 0.82);
    }
    if (len > 14) {
      out[13] = out[12];
      out[14] = Math.min(30, out[13] + 4.8);
    }
    if (len > 26) {
      out[25] = out[24];
      out[26] = Math.min(30, out[25] + 5.2);
    }
    return out;
  }

  function findPeaks(data) {
    const peaks = [];
    for (let i = 2; i < data.length - 2; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] >= 14) peaks.push(i);
    }
    return peaks;
  }

  function buildPeakEvents(content, product) {
    const peaks = [];
    let cRise = 0;
    let pRise = 0;
    findPeaks(content).forEach((idx) => {
      const known = CHART_EVENTS.find((e) => e.idx === idx && e.type === "up" && e.series === "content");
      if (known) {
        peaks.push({ series: "content", idx, label: known.label, title: known.title, subtitle: known.subtitle, value: known.value, type: "up" });
        return;
      }
      if (content[idx] < 18) return;
      peaks.push({
        series: "content",
        idx,
        label: `+${Math.max(8, Math.round(content[idx]))}%`,
        title: CONTENT_RISES[cRise % CONTENT_RISES.length],
        type: "up",
      });
      cRise += 1;
    });
    findPeaks(product).forEach((idx) => {
      const known = CHART_EVENTS.find((e) => e.idx === idx && e.type === "up" && e.series === "product");
      if (known) {
        peaks.push({ series: "product", idx, label: known.label, title: known.title, subtitle: known.subtitle, value: known.value, type: "up" });
        return;
      }
      if (product[idx] < 16) return;
      peaks.push({
        series: "product",
        idx,
        label: `+${Math.max(6, Math.round(product[idx]))}%`,
        title: PRODUCT_RISES[pRise % PRODUCT_RISES.length],
        type: "up",
      });
      pRise += 1;
    });
    return peaks;
  }

  function build() {
    const chartLen = 33;
    const chartSeries = {
      content: generateFlowSeries(chartLen, 101, 9.5, 0.38),
      product: generateFlowSeries(chartLen, 202, 6.2, 0.32),
    };
    const chartPeaks = buildPeakEvents(chartSeries.content, chartSeries.product);
    return {
      kpis: KPIS,
      platforms: PLATFORMS,
      platformsMeta: PLATFORMS_META,
      aiInsights: AI_INSIGHTS,
      revenueBreakdown: REVENUE_BREAKDOWN,
      revenueTotal: REVENUE_META.totalDisplay,
      revenueMeta: REVENUE_META,
      recommendations: RECOMMENDATIONS,
      predictions: PREDICTIONS,
      activity: ACTIVITY,
      chartDays: CHART_DAYS,
      chartSeries,
      chartEvents: CHART_EVENTS,
      chartPeaks,
      uptime: 98.7,
    };
  }

  return { build, NAV };
})();

if (typeof window !== "undefined") window.ConquestData = ConquestData;
