export type ChartKind = "line" | "bar" | "donut" | "sparkline" | "area";

export interface ChartSeriesConfig {
  id: string;
  label: string;
  colorKey: keyof import("./theme.js").ChartTheme | "series";
  data: number[];
}

export interface ChartConfig {
  kind: ChartKind;
  title: string;
  series: ChartSeriesConfig[];
  xLabels?: string[];
  responsive?: boolean;
}

export interface ResponsiveChartSize {
  width: number;
  height: number;
}

export function resolveChartSize(
  containerWidth: number,
  aspectRatio = 2,
  minHeight = 200,
): ResponsiveChartSize {
  const width = Math.max(280, Math.min(containerWidth, 1100));
  const height = Math.max(minHeight, Math.round(width / aspectRatio));
  return { width, height };
}
