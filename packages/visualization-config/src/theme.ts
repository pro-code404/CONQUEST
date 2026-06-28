import { color } from "@conquest/gis";

/** Chart color system — uses GIS tokens, not prototype hard-coded hex. */
export const chartPalette = {
  primary: color.accent,
  secondary: color.success,
  tertiary: color.warning,
  negative: color.error,
  grid: color.border,
  label: color.textSecondary,
  series: [color.accent, color.success, color.warning, "#8b5cf6", "#06b6d4"] as const,
} as const;

export type ChartTheme = typeof chartPalette;

export const defaultChartTheme: ChartTheme = chartPalette;
