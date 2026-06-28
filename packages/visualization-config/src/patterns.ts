/**
 * Reusable visualization patterns — migrated from archived prototype concepts.
 * Prototype used innerHTML SVG generation; production uses React component configs only.
 *
 * Archived reference: docs/archive/prototype/apps/gateway/public/preview-charts.js
 * - performance line chart → ChartKind "area" with dual series
 * - sparkline → ChartKind "sparkline"
 * - donut breakdown → ChartKind "donut"
 * - catmull-rom smoothing → implement in future ChartLine component (Build-2)
 */

import type { ChartConfig } from "./types.js";

export function performanceChartConfig(
  title: string,
  primary: number[],
  secondary: number[],
  labels: string[],
): ChartConfig {
  return {
    kind: "area",
    title,
    xLabels: labels,
    responsive: true,
    series: [
      { id: "primary", label: "Primary", colorKey: "primary", data: primary },
      { id: "secondary", label: "Secondary", colorKey: "secondary", data: secondary },
    ],
  };
}

export function kpiSparklineConfig(title: string, data: number[]): ChartConfig {
  return {
    kind: "sparkline",
    title,
    series: [{ id: "value", label: title, colorKey: "primary", data }],
  };
}
