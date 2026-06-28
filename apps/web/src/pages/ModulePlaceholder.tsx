import type { GisStateId } from "@conquest/gis";
import { GisStateLabels, color, spacing, typography } from "@conquest/gis";

export interface ModulePlaceholderProps {
  moduleId: string;
  title: string;
  gisState: GisStateId;
}

/**
 * Placeholder module surface — presentation only until UXMD screens are implemented.
 */
export function ModulePlaceholder({ moduleId, title, gisState }: ModulePlaceholderProps) {
  return (
    <section aria-labelledby={`${moduleId}-heading`}>
      <h1 id={`${moduleId}-heading`} style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
        {title}
      </h1>
      <p
        role="status"
        style={{
          color: color.textSecondary,
          padding: spacing.md,
          border: `1px dashed ${color.border}`,
          borderRadius: "0.5rem",
        }}
      >
        {GisStateLabels[gisState]} — {moduleId} shell (Build-1 Milestone 1)
      </p>
    </section>
  );
}
