import type { ReactNode } from "react";
import { spacing, typography } from "@conquest/gis";

const pageStyle = {
  maxWidth: "48rem",
  margin: "0 auto",
  padding: spacing.lg,
};

export interface LegalPageViewProps {
  title: string;
  children: ReactNode;
}

export function LegalPageView({ title, children }: LegalPageViewProps) {
  return (
    <main style={pageStyle}>
      <h1 style={{ fontSize: typography.fontSizeXl }}>{title}</h1>
      <article>{children}</article>
      <p style={{ marginTop: spacing.lg }}>
        <a href="/">← Back to home</a>
      </p>
    </main>
  );
}
