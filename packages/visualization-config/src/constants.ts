/** Central chart sizing — extracted from archived prototype patterns, GIS-aligned. */
export const CHART_DIMENSIONS = {
  defaultWidth: 640,
  defaultHeight: 320,
  sparklineWidth: 120,
  sparklineHeight: 40,
  donutSize: 160,
  paddingLeft: 38,
  paddingRight: 8,
  paddingTop: 28,
  paddingBottom: 22,
  minBarWidth: 24,
  maxBarWidth: 64,
} as const;

export const CHART_ANIMATION = {
  durationMs: 320,
  easing: "ease-out",
} as const;
