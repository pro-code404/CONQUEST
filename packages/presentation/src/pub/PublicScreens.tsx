import type { ReactNode } from "react";
import { color, spacing, typography } from "@conquest/gis";
import {
  authButtonStyle,
  authFieldStyle,
  authLabelStyle,
  authLinkStyle,
} from "../auth/auth-styles.js";

export interface LandingPageViewProps {
  signUpHref: string;
  loginHref: string;
  supportHref?: string;
  privacyHref?: string;
  termsHref?: string;
  cookiesHref?: string;
  aiTransparencyHref?: string;
}

/** PUB-01 — presentation only. */
export function LandingPageView({
  signUpHref,
  loginHref,
  supportHref = "#support",
  privacyHref = "/legal/privacy",
  termsHref = "/legal/terms",
  cookiesHref = "/legal/cookies",
  aiTransparencyHref = "/legal/ai-transparency",
}: LandingPageViewProps) {
  const sectionStyle = { marginBottom: spacing.xl, maxWidth: "48rem" };

  return (
    <main style={{ minHeight: "100vh", padding: spacing.xl, color: color.textPrimary }}>
      <header style={{ marginBottom: spacing.xl }}>
        <p style={{ color: color.accent, fontWeight: 600, margin: 0 }}>Conquest</p>
        <h1 style={{ fontSize: typography.fontSizeXl, margin: `${spacing.sm} 0` }}>
          Your Intelligence Command Center
        </h1>
        <p style={{ color: color.textSecondary, lineHeight: typography.lineHeightNormal }}>
          Conquest is not a chatbot or another dashboard. It is an operating system for intelligence — observe,
          recommend, and decide with evidence.
        </p>
      </header>

      <section style={sectionStyle} aria-labelledby="value-heading">
        <h2 id="value-heading" style={{ fontSize: typography.fontSizeLg }}>
          Why Conquest
        </h2>
        <ul style={{ color: color.textSecondary, lineHeight: typography.lineHeightNormal }}>
          <li>Command Center is your daily cockpit — not a conversation thread.</li>
          <li>Workspace-scoped intelligence with honest empty states.</li>
          <li>You approve recommendations — Conquest never acts alone on major decisions.</li>
        </ul>
      </section>

      <nav aria-label="Primary actions" style={{ display: "flex", gap: spacing.md, flexWrap: "wrap" }}>
        <a href={signUpHref} style={{ ...authButtonStyle, textAlign: "center", textDecoration: "none" }}>
          Start free trial
        </a>
        <a
          href={loginHref}
          style={{
            ...authButtonStyle,
            background: color.surface,
            border: `1px solid ${color.border}`,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Log in
        </a>
      </nav>

      <footer style={{ marginTop: spacing.xl, color: color.textSecondary, fontSize: typography.fontSizeSm }}>
        <nav aria-label="Legal" style={{ display: "flex", gap: spacing.md, flexWrap: "wrap", marginBottom: spacing.sm }}>
          <a href={privacyHref} style={authLinkStyle}>
            Privacy
          </a>
          <a href={termsHref} style={authLinkStyle}>
            Terms
          </a>
          <a href={cookiesHref} style={authLinkStyle}>
            Cookies
          </a>
          <a href={aiTransparencyHref} style={authLinkStyle}>
            AI transparency
          </a>
        </nav>
        <a href={supportHref} style={authLinkStyle}>
          Help & support
        </a>
      </footer>
    </main>
  );
}

export interface AuthFormViewProps {
  fields: Array<{
    id: string;
    name: string;
    label: string;
    type?: string;
    autoComplete?: string;
    required?: boolean;
    minLength?: number;
  }>;
  submitLabel: string;
  loadingLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
}

/** Shared auth form presentation (PUB-02, PUB-03, PUB-05, etc.). */
export function AuthFormView({
  fields,
  submitLabel,
  loadingLabel,
  loading,
  error,
  onSubmit,
  footer,
}: AuthFormViewProps) {
  return (
    <form onSubmit={onSubmit} aria-busy={loading}>
      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} style={authLabelStyle}>
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            required={field.required}
            minLength={field.minLength}
            style={authFieldStyle}
          />
        </div>
      ))}
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={loading} style={authButtonStyle}>
        {loading ? loadingLabel : submitLabel}
      </button>
      {footer}
    </form>
  );
}
