import type { OnboardingStage } from "@conquest/auth";
import { ROUTES } from "../../../shared/config/routes.js";

/** Maps onboarding stage to UXMD route (ONB-01–ONB-06). */
export const STAGE_ROUTE: Record<Exclude<OnboardingStage, "done">, string> = {
  welcome: ROUTES.onboarding.welcome,
  orientation: ROUTES.onboarding.orientation,
  workspace: ROUTES.onboarding.workspace,
  connect: ROUTES.onboarding.connect,
  initializing: ROUTES.onboarding.initializing,
  complete: ROUTES.onboarding.complete,
};

export function routeForOnboardingStage(stage: OnboardingStage): string {
  if (stage === "done") return ROUTES.app.home;
  return STAGE_ROUTE[stage];
}
