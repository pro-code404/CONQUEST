/**
 * @conquest/gis — Global Interaction Standards (UXMD-III) design tokens.
 * All visual values for Presentation layer must reference these tokens.
 */

export const color = {
  surface: "var(--cq-color-surface, #0f1419)",
  surfaceElevated: "var(--cq-color-surface-elevated, #1a2332)",
  textPrimary: "var(--cq-color-text-primary, #f4f6f8)",
  textSecondary: "var(--cq-color-text-secondary, #9aa5b4)",
  border: "var(--cq-color-border, #2d3a4d)",
  accent: "var(--cq-color-accent, #3b82f6)",
  error: "var(--cq-color-error, #ef4444)",
  success: "var(--cq-color-success, #22c55e)",
  warning: "var(--cq-color-warning, #f59e0b)",
  focusRing: "var(--cq-color-focus-ring, #60a5fa)",
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
} as const;

export const radius = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "9999px",
} as const;

export const timing = {
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
} as const;

export const opacity = {
  disabled: 0.5,
  muted: 0.72,
} as const;

export const sizing = {
  shellHeaderHeight: "3.5rem",
  primaryNavWidth: "15rem",
  utilityBarHeight: "2.75rem",
  maxContentWidth: "90rem",
} as const;

export const typography = {
  fontFamily: "var(--cq-font-family, system-ui, -apple-system, Segoe UI, sans-serif)",
  fontSizeSm: "0.875rem",
  fontSizeMd: "1rem",
  fontSizeLg: "1.125rem",
  fontSizeXl: "1.25rem",
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
} as const;

export const tokens = { color, spacing, radius, timing, opacity, sizing, typography };
