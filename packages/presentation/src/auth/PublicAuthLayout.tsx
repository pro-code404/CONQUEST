import type { ReactNode } from "react";
import {
  authCardStyle,
  authLabelStyle,
  authPageStyle,
} from "./auth-styles.js";
import { color, spacing, typography } from "@conquest/gis";

export interface PublicAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** UXMD public auth layout — presentation only (PUB-02, PUB-03). */
export function PublicAuthLayout({ title, subtitle, children, footer }: PublicAuthLayoutProps) {
  return (
    <main style={authPageStyle}>
      <div style={authCardStyle}>
        <header style={{ marginBottom: spacing.lg }}>
          <h1 style={{ margin: 0, fontSize: typography.fontSizeXl }}>{title}</h1>
          {subtitle ? (
            <p style={{ margin: `${spacing.sm} 0 0`, color: color.textSecondary }}>{subtitle}</p>
          ) : null}
        </header>
        <div>{children}</div>
        {footer ? (
          <footer style={{ marginTop: spacing.lg, color: color.textSecondary, fontSize: typography.fontSizeSm }}>
            {footer}
          </footer>
        ) : null}
      </div>
    </main>
  );
}

export { authLabelStyle };
