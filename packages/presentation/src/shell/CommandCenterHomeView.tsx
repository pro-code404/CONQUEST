import type { CSSProperties } from "react";

import { GisState, GisStateLabels, color, spacing, typography } from "@conquest/gis";

import type { CommandCenterBehavioralState, CommandCenterZoneView } from "@conquest/contracts";

export type { CommandCenterBehavioralState };

export interface CommandCenterHomeViewProps {
  state: CommandCenterBehavioralState;
  zones?: CommandCenterZoneView[];
  onConnectData?: () => void;
  onRefresh?: () => void;
  offlineTimestamp?: string;
  warningMessage?: string;
  degradedZones?: string[];
}

/** CC-01 — Command Center Home (UXMD-II). Presentation only. */
export function CommandCenterHomeView({
  state,
  zones = [],
  onConnectData,
  onRefresh,
  offlineTimestamp,
  warningMessage,
  degradedZones = [],
}: CommandCenterHomeViewProps) {
  const zoneStyle: CSSProperties = {
    padding: spacing.lg,
    border: `1px dashed ${color.border}`,
    borderRadius: "0.75rem",
    marginBottom: spacing.md,
    minHeight: "4rem",
  };

  if (state === "initializing") {
    return (
      <section aria-labelledby="cc-home-heading" aria-busy="true">
        <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
          Command Center
        </h1>
        <p role="status">{GisStateLabels[GisState.Load]} intelligence…</p>
        {(zones.length > 0 ? zones.slice(0, 4) : [{ id: "1", label: "Loading", items: [] }]).map((zone) => (
          <div key={zone.id} style={zoneStyle} aria-hidden="true" />
        ))}
      </section>
    );
  }

  if (state === "offline") {
    return (
      <section aria-labelledby="cc-home-heading">
        <p role="status">
          {GisStateLabels[GisState.Offline]} — showing last verified snapshot
          {offlineTimestamp ? ` (${offlineTimestamp})` : ""}.
        </p>
        <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
          Command Center
        </h1>
        <button type="button" onClick={onRefresh} style={{ marginTop: spacing.sm }}>
          {GisStateLabels[GisState.Recover]}
        </button>
      </section>
    );
  }

  if (state === "dormant") {
    return (
      <section aria-labelledby="cc-home-heading">
        <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
          Command Center
        </h1>
        <div style={{ ...zoneStyle, textAlign: "center" }} role="status">
          <p style={{ color: color.textSecondary, marginBottom: spacing.md }}>
            {GisStateLabels[GisState.Empty]} — connect a data source or run research analysis to activate
            intelligence.
          </p>
          <button type="button" onClick={onConnectData}>
            Connect data source
          </button>
        </div>
        {zones.length > 0 ? renderZones(zones, zoneStyle) : null}
      </section>
    );
  }

  if (state === "warning") {
    return (
      <section aria-labelledby="cc-home-heading">
        <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
          Command Center
        </h1>
        <div style={zoneStyle} role="status">
          <strong>Attention needed</strong>
          <p>{warningMessage ?? "Some intelligence items need review."}</p>
        </div>
        {zones.length > 0 ? renderZones(zones, zoneStyle) : renderPlaceholderZones(zoneStyle)}
      </section>
    );
  }

  if (state === "degraded") {
    return (
      <section aria-labelledby="cc-home-heading">
        <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
          Command Center
        </h1>
        {zones.length > 0
          ? zones.map((zone, index) => {
              const degraded = index < degradedZones.length;
              return (
                <div key={zone.id} style={zoneStyle} role={degraded ? "alert" : undefined}>
                  {renderZoneContent(zone, degraded)}
                </div>
              );
            })
          : renderPlaceholderZones(zoneStyle, degradedZones)}
        <button type="button" onClick={onRefresh} style={{ marginTop: spacing.sm }}>
          {GisStateLabels[GisState.Recover]}
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="cc-home-heading">
      <h1 id="cc-home-heading" style={{ fontSize: typography.fontSizeXl, marginTop: 0 }}>
        Command Center
      </h1>
      {zones.length > 0 ? renderZones(zones, zoneStyle) : renderPlaceholderZones(zoneStyle)}
      {onRefresh ? (
        <button type="button" onClick={onRefresh} style={{ marginTop: spacing.sm }}>
          Refresh
        </button>
      ) : null}
    </section>
  );
}

function renderZones(zones: CommandCenterZoneView[], zoneStyle: CSSProperties) {
  return zones.map((zone) => (
    <div key={zone.id} style={zoneStyle}>
      {renderZoneContent(zone, false)}
    </div>
  ));
}

function renderZoneContent(zone: CommandCenterZoneView, degraded: boolean) {
  return (
    <>
      <strong>{zone.label}</strong>
      {degraded ? (
        <p style={{ color: color.textSecondary, marginBottom: 0 }}>
          {GisStateLabels[GisState.Error]} — source unavailable for this zone.
        </p>
      ) : null}
      {zone.items.length === 0 ? (
        <p style={{ color: color.textSecondary, marginBottom: 0 }}>
          {zone.emptyMessage ?? GisStateLabels[GisState.Empty]}
        </p>
      ) : (
        <ul style={{ marginBottom: 0, paddingLeft: spacing.lg }}>
          {zone.items.map((item) => (
            <li key={item.id} style={{ marginBottom: spacing.xs }}>
              {item.href ? (
                <a href={item.href}>
                  <strong>{item.label}</strong>
                </a>
              ) : (
                <strong>{item.label}</strong>
              )}
              <p style={{ margin: `${spacing.xs} 0 0`, color: color.textSecondary }}>{item.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function renderPlaceholderZones(zoneStyle: CSSProperties, degradedZones: string[] = []) {
  const labels = [
    "Alerts",
    "Recommendations",
    "Executive summary",
    "Risks",
    "Opportunities",
    "Goals & KPIs",
    "Execution",
    "Activity",
  ];
  return labels.map((label, index) => (
    <div key={label} style={zoneStyle}>
      <strong>{label}</strong>
      {index < degradedZones.length ? (
        <p style={{ color: color.textSecondary, marginBottom: 0 }}>
          {GisStateLabels[GisState.Error]} — source unavailable for this zone.
        </p>
      ) : null}
    </div>
  ));
}
