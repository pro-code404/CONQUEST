import type { CSSProperties } from "react";
import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";

export interface CommandCenterDormantProps {
  onConnectData?: () => void;
}

/** CC-01 Dormant state — honest empty, connect CTA (UXMD-II). */
export function CommandCenterDormant({ onConnectData }: CommandCenterDormantProps) {
  const zoneStyle: CSSProperties = {
    padding: spacing.xl,
    border: `1px dashed ${color.border}`,
    borderRadius: "0.75rem",
    textAlign: "center",
  };

  return (
    <section aria-labelledby="cc-home-heading">
      <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
        Command Center
      </h1>
      <div style={zoneStyle} role="status">
        <p style={{ color: color.textSecondary, marginBottom: spacing.md }}>
          {GisStateLabels[GisState.Empty]} — connect a data source to activate intelligence.
        </p>
        <button
          type="button"
          onClick={onConnectData}
          style={{
            padding: `${spacing.sm} ${spacing.lg}`,
            borderRadius: "0.5rem",
            border: "none",
            background: color.accent,
            color: color.textPrimary,
            cursor: "pointer",
          }}
        >
          Connect data source
        </button>
      </div>
    </section>
  );
}
