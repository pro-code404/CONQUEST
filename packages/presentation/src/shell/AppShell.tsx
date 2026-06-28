import type { CSSProperties, ReactNode } from "react";
import { color, sizing, spacing, typography, PRIMARY_NAV_ITEMS } from "@conquest/gis";

export interface AppShellProps {
  workspaceLabel: string;
  activeNavId: string;
  userLabel?: string;
  onNavigate: (pathSegment: string) => void;
  onLogout?: () => void;
  children: ReactNode;
}

const shellStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: `${sizing.primaryNavWidth} 1fr`,
  gridTemplateRows: `${sizing.shellHeaderHeight} 1fr`,
  minHeight: "100vh",
  background: color.surface,
  color: color.textPrimary,
  fontFamily: typography.fontFamily,
};

const headerStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `0 ${spacing.lg}`,
  borderBottom: `1px solid ${color.border}`,
  background: color.surfaceElevated,
};

const navStyle: CSSProperties = {
  padding: spacing.md,
  borderRight: `1px solid ${color.border}`,
};

const mainStyle: CSSProperties = {
  padding: spacing.lg,
  maxWidth: sizing.maxContentWidth,
};

const navButtonStyle = (active: boolean): CSSProperties => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: `${spacing.sm} ${spacing.md}`,
  marginBottom: spacing.xs,
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  background: active ? color.surfaceElevated : "transparent",
  color: active ? color.textPrimary : color.textSecondary,
  fontSize: typography.fontSizeMd,
});

/**
 * Authenticated application shell — presentation only (UXMD-II SHL-*).
 */
export function AppShell({
  workspaceLabel,
  activeNavId,
  userLabel,
  onNavigate,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <div style={shellStyle} data-testid="app-shell">
      <header style={headerStyle}>
        <strong>Conquest</strong>
        <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          <span aria-label="Workspace">{workspaceLabel}</span>
          {userLabel ? <span aria-label="Signed in user">{userLabel}</span> : null}
          {onLogout ? (
            <button type="button" onClick={onLogout} aria-label="Sign out">
              Sign out
            </button>
          ) : null}
        </div>
      </header>
      <nav style={navStyle} aria-label="Primary navigation">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            style={navButtonStyle(item.id === activeNavId)}
            aria-current={item.id === activeNavId ? "page" : undefined}
            onClick={() => onNavigate(item.pathSegment)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
