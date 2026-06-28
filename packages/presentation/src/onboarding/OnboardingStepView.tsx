import type { ReactNode } from "react";
import { color, spacing, typography } from "@conquest/gis";
import { authButtonStyle } from "../auth/auth-styles.js";
import { PublicAuthLayout } from "../auth/PublicAuthLayout.js";

export interface OnboardingStepViewProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryAction: { label: string; onClick: () => void; disabled?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
}

/** ONB-* shared step layout — presentation only. */
export function OnboardingStepView({
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
}: OnboardingStepViewProps) {
  return (
    <PublicAuthLayout title={title} subtitle={subtitle}>
      <div style={{ color: color.textSecondary, lineHeight: typography.lineHeightNormal, marginBottom: spacing.lg }}>
        {children}
      </div>
      <button
        type="button"
        style={authButtonStyle}
        onClick={primaryAction.onClick}
        disabled={primaryAction.disabled}
        aria-busy={primaryAction.disabled}
      >
        {primaryAction.label}
      </button>
      {secondaryAction ? (
        <button
          type="button"
          style={{ ...authButtonStyle, marginTop: spacing.sm, background: color.surface, border: `1px solid ${color.border}` }}
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
        </button>
      ) : null}
    </PublicAuthLayout>
  );
}
