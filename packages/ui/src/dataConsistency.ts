export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  display: string;
  change: number;
  changeLabel: string;
  confidence: number;
  sparkSeed: number;
}

export interface PlatformRank {
  rank: number;
  name: string;
  reach: number;
  reachDisplay: string;
  growth: number;
  growthDisplay: string;
  share: number;
}

export interface DashboardData {
  kpis: KpiMetric[];
  revenueTotal: number;
  revenueDisplay: string;
  reachTotal: number;
  platforms: PlatformRank[];
  chartSeries: { content: number[]; product: number[] };
}

const PLATFORM_RAW: Omit<PlatformRank, "rank" | "share">[] = [
  { name: "Instagram", reach: 1_600_000, reachDisplay: "1.6M", growth: 22, growthDisplay: "+22%" },
  { name: "TikTok", reach: 520_000, reachDisplay: "520K", growth: 18, growthDisplay: "+18%" },
  { name: "X", reach: 280_000, reachDisplay: "280K", growth: 8, growthDisplay: "+8%" },
  { name: "LinkedIn", reach: 180_000, reachDisplay: "180K", growth: 14, growthDisplay: "+14%" },
  { name: "YouTube", reach: 120_000, reachDisplay: "120K", growth: 11, growthDisplay: "+11%" },
];

export function buildDashboardData(): DashboardData {
  const reachTotal = PLATFORM_RAW.reduce((s, p) => s + p.reach, 0);
  const platforms: PlatformRank[] = PLATFORM_RAW.map((p, i) => ({
    ...p,
    rank: i + 1,
    share: Math.round((p.reach / reachTotal) * 1000) / 10,
  }));

  const revenueTotal = 48_200;
  const kpis: KpiMetric[] = [
    { id: "revenue", label: "Revenue", value: revenueTotal, display: "$48.2K", change: 18, changeLabel: "+18% vs prior", confidence: 0.92, sparkSeed: 101 },
    { id: "reach", label: "Total Reach", value: reachTotal, display: "2.7M", change: 22, changeLabel: "+22% vs prior", confidence: 0.88, sparkSeed: 202 },
    { id: "engagement", label: "Engagement", value: 6.8, display: "6.8%", change: 2.4, changeLabel: "+2.4% vs prior", confidence: 0.85, sparkSeed: 303 },
    { id: "growth", label: "Net Growth", value: 12.1, display: "+12.1%", change: 12.1, changeLabel: "30d trajectory", confidence: 0.87, sparkSeed: 404 },
  ];

  const chartSeries = {
    content: generateAlignedSeries(72, 48, 0.2, 101),
    product: generateAlignedSeries(72, 28, 0.12, 202),
  };

  return sanitize({ kpis, revenueTotal, revenueDisplay: "$48.2K", reachTotal, platforms, chartSeries });
}

function generateAlignedSeries(len: number, base: number, trend: number, seed: number): number[] {
  let v = base;
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    const noise = Math.sin(i / 7 + seed) * 3 + (Math.sin(i * 0.31 + seed) * 1.5);
    v += trend + noise * 0.4;
    out.push(Math.max(5, v));
  }
  return out;
}

export function sanitize(data: DashboardData): DashboardData {
  const platformReach = data.platforms.reduce((s, p) => s + p.reach, 0);
  if (Math.abs(platformReach - data.reachTotal) > data.reachTotal * 0.05) {
    data.reachTotal = platformReach;
    const reachKpi = data.kpis.find((k) => k.id === "reach");
    if (reachKpi) {
      reachKpi.value = platformReach;
      reachKpi.display = platformReach >= 1_000_000
        ? `${(platformReach / 1_000_000).toFixed(1)}M`
        : `${Math.round(platformReach / 1000)}K`;
    }
  }

  const shareSum = data.platforms.reduce((s, p) => s + p.share, 0);
  if (shareSum < 99 || shareSum > 101) {
    const total = data.platforms.reduce((s, p) => s + p.reach, 0);
    data.platforms = data.platforms.map((p) => ({
      ...p,
      share: Math.round((p.reach / total) * 1000) / 10,
    }));
  }

  const revKpi = data.kpis.find((k) => k.id === "revenue");
  if (revKpi && revKpi.value !== data.revenueTotal) {
    data.revenueTotal = revKpi.value;
    data.revenueDisplay = revKpi.display;
  }

  return data;
}

export interface LayoutSpec {
  cardPadding: number;
  cardRadius: number;
  gridGutter: number;
  kpiHeight: number;
}

export const LAYOUT_SPEC: LayoutSpec = {
  cardPadding: 16,
  cardRadius: 12,
  gridGutter: 16,
  kpiHeight: 144,
};

export function validateLayoutSpec(spec: LayoutSpec): LayoutSpec {
  const normalized = { ...spec };
  for (const key of Object.keys(normalized) as (keyof LayoutSpec)[]) {
    const v = normalized[key];
    if (v % 8 !== 0 && v % 4 === 0) continue;
    normalized[key] = Math.round(v / 8) * 8 || 8;
  }
  return normalized;
}
