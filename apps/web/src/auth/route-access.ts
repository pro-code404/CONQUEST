import {
  canAccessModuleRead,
  isWorkspaceModule,
  parseWorkspaceModulePath,
} from "@conquest/gis";
import type { SessionUser } from "./types.js";
import { routeForOnboardingStage } from "../features/onboarding/domain/onboarding-path.js";
import { buildLoginRedirect, resolveAuthenticatedPath } from "./routing.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type RouteAccessReason =
  | "loading"
  | "allow"
  | "unauthenticated"
  | "unverified"
  | "onboarding_incomplete"
  | "no_workspace"
  | "invalid_workspace"
  | "workspace_mismatch"
  | "forbidden_role"
  | "guest_redirect";

export interface RouteAccessResult {
  status: RouteAccessReason;
  redirectTo?: string;
}

export function isValidWorkspaceId(workspaceId: string): boolean {
  return UUID_RE.test(workspaceId);
}

/** @deprecated Use parseWorkspaceModulePath — retained for tests migrating to module parser. */
export function parseWorkspaceRoute(pathname: string): { workspaceId: string; segment: string } | null {
  const parsed = parseWorkspaceModulePath(pathname);
  if (!parsed) return null;
  return { workspaceId: parsed.workspaceId, segment: parsed.moduleSegment };
}

export function resolveGuestAccess(user: SessionUser | null, loading: boolean): RouteAccessResult {
  if (loading) return { status: "loading" };
  if (user) return { status: "guest_redirect", redirectTo: resolveAuthenticatedPath(user) };
  return { status: "allow" };
}

export function resolveVerifyEmailAccess(user: SessionUser | null, loading: boolean): RouteAccessResult {
  if (loading) return { status: "loading" };
  if (!user) return { status: "unauthenticated", redirectTo: "/login" };
  if (user.emailVerified) {
    return { status: "guest_redirect", redirectTo: resolveAuthenticatedPath(user) };
  }
  return { status: "allow" };
}

export function resolveOnboardingAccess(user: SessionUser | null, loading: boolean): RouteAccessResult {
  if (loading) return { status: "loading" };
  if (!user) return { status: "unauthenticated", redirectTo: "/login" };
  if (!user.emailVerified) return { status: "unverified", redirectTo: "/verify-email" };
  if (user.onboardingComplete) {
    return { status: "guest_redirect", redirectTo: resolveAuthenticatedPath(user) };
  }
  return { status: "allow" };
}

export function resolveAppShellAccess(user: SessionUser | null, loading: boolean): RouteAccessResult {
  if (loading) return { status: "loading" };
  if (!user) return { status: "unauthenticated", redirectTo: "/login" };
  if (!user.emailVerified) return { status: "unverified", redirectTo: "/verify-email" };
  if (!user.onboardingComplete) {
    return { status: "onboarding_incomplete", redirectTo: routeForOnboardingStage(user.onboardingStage) };
  }
  if (!user.activeWorkspaceId) {
    return { status: "no_workspace", redirectTo: "/onboarding/workspace" };
  }
  return { status: "allow" };
}

export function resolveWorkspaceRouteAccess(
  user: SessionUser | null,
  loading: boolean,
  pathname: string,
): RouteAccessResult {
  const shell = resolveAppShellAccess(user, loading);
  if (shell.status !== "allow") return shell;

  const parsed = parseWorkspaceModulePath(pathname);
  if (!parsed) return { status: "allow" };

  const { workspaceId, moduleSegment } = parsed;
  if (!isValidWorkspaceId(workspaceId)) {
    return {
      status: "invalid_workspace",
      redirectTo: resolveAuthenticatedPath(user!),
    };
  }

  if (!isWorkspaceModule(moduleSegment)) {
    return {
      status: "invalid_workspace",
      redirectTo: `/app/w/${user!.activeWorkspaceId}/command-center`,
    };
  }

  if (user!.activeWorkspaceId !== workspaceId) {
    return {
      status: "workspace_mismatch",
      redirectTo: `/app/w/${user!.activeWorkspaceId}/command-center`,
    };
  }

  if (!canAccessModuleRead(user!.role, moduleSegment)) {
    return { status: "forbidden_role", redirectTo: "/forbidden" };
  }

  return { status: "allow" };
}

export function resolveProtectedRedirect(
  user: SessionUser | null,
  loading: boolean,
  pathname: string,
  search: string,
): RouteAccessResult {
  if (loading) return { status: "loading" };
  if (!user) {
    return {
      status: "unauthenticated",
      redirectTo: buildLoginRedirect(pathname + search),
    };
  }
  return { status: "allow" };
}
