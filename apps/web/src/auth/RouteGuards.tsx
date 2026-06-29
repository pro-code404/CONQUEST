import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.js";
import {
  resolveAppShellAccess,
  resolveGuestAccess,
  resolveOnboardingAccess,
  resolveProtectedRedirect,
  resolveVerifyEmailAccess,
  resolveWorkspaceRouteAccess,
  type RouteAccessResult,
} from "./route-access.js";

function useSessionOnNavigate(): { user: ReturnType<typeof useAuth>["user"]; checking: boolean } {
  const { user, loading, refresh } = useAuth();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
    refresh().finally(() => setChecked(true));
  }, [location.pathname, refresh]);

  return { user, checking: loading || !checked };
}

function GuardOutlet({ access }: { access: RouteAccessResult }) {
  if (access.status === "loading") {
    return (
      <main
        role="status"
        style={{
          minHeight: "100vh",
          padding: "2rem",
          background: "var(--cq-color-surface, #0f1419)",
          color: "var(--cq-color-text-primary, #f4f6f8)",
          fontFamily: "var(--cq-font-family, system-ui, sans-serif)",
        }}
      >
        <p style={{ color: "var(--cq-color-accent, #3b82f6)", fontWeight: 600, margin: "0 0 0.5rem" }}>
          Conquest
        </p>
        <p style={{ margin: 0 }}>Loading session…</p>
      </main>
    );
  }
  if (access.redirectTo) {
    return <Navigate to={access.redirectTo} replace />;
  }
  return <Outlet />;
}

export function RequireAuth() {
  const { user, checking } = useSessionOnNavigate();
  const location = useLocation();
  const access = resolveProtectedRedirect(user, checking, location.pathname, location.search);
  return <GuardOutlet access={access} />;
}

export function RequireGuest() {
  const { user, checking } = useSessionOnNavigate();
  const access = resolveGuestAccess(user, checking);
  return <GuardOutlet access={access} />;
}

export function RequireVerifyEmailRoute() {
  const { user, checking } = useSessionOnNavigate();
  const access = resolveVerifyEmailAccess(user, checking);
  return <GuardOutlet access={access} />;
}

export function RequireOnboardingRoute() {
  const { user, checking } = useSessionOnNavigate();
  const access = resolveOnboardingAccess(user, checking);
  return <GuardOutlet access={access} />;
}

export function RequireAppShell() {
  const { user, checking } = useSessionOnNavigate();
  const access = resolveAppShellAccess(user, checking);
  return <GuardOutlet access={access} />;
}

export function RequireWorkspaceRoute() {
  const { user, checking } = useSessionOnNavigate();
  const location = useLocation();
  const access = resolveWorkspaceRouteAccess(user, checking, location.pathname);
  return <GuardOutlet access={access} />;
}
