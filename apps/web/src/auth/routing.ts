import type { SessionUser } from "./types.js";
import { ROUTES } from "../shared/config/routes.js";
import { routeForOnboardingStage } from "../features/onboarding/domain/onboarding-path.js";

/** Post-auth routing per UXMD-II (RTM-UX-010). */
export function resolveAuthenticatedPath(user: SessionUser): string {
  if (!user.emailVerified) return ROUTES.verifyEmail;
  if (!user.onboardingComplete) {
    return routeForOnboardingStage(user.onboardingStage);
  }
  const workspaceId = user.activeWorkspaceId;
  if (!workspaceId) return ROUTES.onboarding.workspace;
  return ROUTES.app.commandCenter(workspaceId);
}

export function buildLoginRedirect(returnTo: string | null): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return ROUTES.login;
  }
  return `${ROUTES.login}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function readReturnTo(search: string): string | null {
  const params = new URLSearchParams(search);
  const value = params.get("returnTo");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}
