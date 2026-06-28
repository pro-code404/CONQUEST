import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@conquest/presentation";
import { PRIMARY_NAV_ITEMS } from "@conquest/gis";
import * as authClient from "../auth/client.js";
import { useAuth } from "../auth/AuthContext.js";

function resolveActiveNavId(pathname: string): string {
  const segment = pathname.split("/").pop() ?? "command-center";
  return PRIMARY_NAV_ITEMS.find((item) => item.pathSegment === segment)?.id ?? "command-center";
}

/** Workspace-scoped authenticated layout (SHL-01 / RTM-UX-003). */
export function WorkspaceLayout() {
  const { workspaceId = "" } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeNavId = resolveActiveNavId(pathname);
  const segment = pathname.split("/").pop() ?? "command-center";

  useEffect(() => {
    if (!user || !workspaceId) return;
    authClient
      .validateWorkspaceAccess(workspaceId, segment)
      .catch((error: Error) => {
        if (error.message.startsWith("401:")) {
          navigate("/login", { replace: true });
          return;
        }
        if (error.message.startsWith("403:")) {
          navigate("/forbidden", { replace: true });
          return;
        }
        navigate("/app", { replace: true });
      });
  }, [user, workspaceId, segment, navigate]);

  return (
    <AppShell
      workspaceLabel={workspaceId}
      activeNavId={activeNavId}
      {...(user?.displayName ? { userLabel: user.displayName } : {})}
      onNavigate={(navSegment) => {
        if (navSegment === "settings") {
          navigate("/app/settings");
          return;
        }
        navigate(`/app/w/${workspaceId}/${navSegment}`);
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
