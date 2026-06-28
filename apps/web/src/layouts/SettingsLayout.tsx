import { Outlet, useNavigate } from "react-router-dom";
import { AppShell } from "@conquest/presentation";
import { PRIMARY_NAV_ITEMS } from "@conquest/gis";
import { useAuth } from "../auth/AuthContext.js";

/** App-level settings layout (SET-* at /app/settings). */
export function SettingsLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      workspaceLabel={user?.activeWorkspaceId ?? "Settings"}
      activeNavId="settings"
      {...(user?.displayName ? { userLabel: user.displayName } : {})}
      onNavigate={(segment) => {
        if (segment === "settings") {
          navigate("/app/settings");
          return;
        }
        if (user?.activeWorkspaceId) {
          navigate(`/app/w/${user.activeWorkspaceId}/${segment}`);
        }
      }}
      onLogout={async () => {
        await logout();
        navigate("/login", { replace: true });
      }}
    >
      <Outlet />
    </AppShell>
  );
}

export { PRIMARY_NAV_ITEMS };
