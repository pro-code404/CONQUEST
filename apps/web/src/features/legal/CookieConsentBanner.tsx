import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LEGAL_DOCUMENT_VERSIONS } from "@conquest/contracts";
import { color, spacing, typography } from "@conquest/gis";
import { ROUTES } from "../../shared/config/routes.js";

const CONSENT_KEY = "conquest_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  async function accept() {
    localStorage.setItem(CONSENT_KEY, LEGAL_DOCUMENT_VERSIONS.cookies);
    try {
      await fetch("/api/legal/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ documentVersion: LEGAL_DOCUMENT_VERSIONS.cookies }),
      });
    } catch {
      // Guest consent stored locally when API unavailable
    }
    setVisible(false);
  }

  return (
    <aside
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.lg,
        background: color.surface,
        borderTop: `1px solid ${color.border}`,
        zIndex: 1000,
        display: "flex",
        gap: spacing.md,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ margin: 0, color: color.textSecondary, fontSize: typography.fontSizeSm, maxWidth: "48rem" }}>
        Conquest uses essential session cookies for authentication. See our{" "}
        <Link to={ROUTES.legal.cookies}>Cookie Policy</Link> for details.
      </p>
      <button
        type="button"
        onClick={() => void accept()}
        style={{
          padding: `${spacing.sm} ${spacing.lg}`,
          background: color.accent,
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        Accept
      </button>
    </aside>
  );
}
