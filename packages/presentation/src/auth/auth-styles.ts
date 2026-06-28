import type { CSSProperties } from "react";
import { color, radius, spacing, typography } from "@conquest/gis";

export const authFieldStyle: CSSProperties = {
  width: "100%",
  marginBottom: spacing.md,
  padding: spacing.sm,
  borderRadius: radius.md,
  border: `1px solid ${color.border}`,
  background: color.surface,
  color: color.textPrimary,
  fontSize: typography.fontSizeMd,
};

export const authButtonStyle: CSSProperties = {
  width: "100%",
  padding: spacing.sm,
  border: "none",
  borderRadius: radius.md,
  background: color.accent,
  color: color.textPrimary,
  cursor: "pointer",
  fontSize: typography.fontSizeMd,
  fontWeight: 600,
};

export const authLinkStyle: CSSProperties = {
  color: color.accent,
  textDecoration: "none",
};

export const authCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: "28rem",
  padding: spacing.xl,
  border: `1px solid ${color.border}`,
  borderRadius: radius.lg,
  background: color.surfaceElevated,
};

export const authPageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: spacing.lg,
};

export const authLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: spacing.xs,
  fontSize: typography.fontSizeSm,
  color: color.textSecondary,
};
