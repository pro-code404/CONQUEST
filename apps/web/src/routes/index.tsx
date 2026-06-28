import { Navigate, createBrowserRouter } from "react-router-dom";
import { GisState, PRIMARY_NAV_ITEMS } from "@conquest/gis";
import {
  RequireAppShell,
  RequireAuth,
  RequireGuest,
  RequireOnboardingRoute,
  RequireVerifyEmailRoute,
  RequireWorkspaceRoute,
} from "../auth/RouteGuards.js";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout.js";
import { ForbiddenPage } from "../pages/ForbiddenPage.js";
import { ModulePlaceholder } from "../pages/ModulePlaceholder.js";
import { AuthenticatedRedirect } from "../auth/AuthenticatedRedirect.js";
import { CommandCenterScreen } from "../features/command-center/CommandCenterScreen.js";
import {
  ForgotPasswordScreen,
  InviteAcceptScreen,
  LandingScreen,
  LoginScreen,
  OnboardingCompleteScreen,
  OnboardingConnectScreen,
  OnboardingInitializingScreen,
  OnboardingOrientationScreen,
  OnboardingWelcomeScreen,
  OnboardingWorkspaceScreen,
  ResetPasswordScreen,
  SignUpScreen,
  VerifyEmailScreen,
} from "../features/screens.js";

import { SettingsLayout } from "../layouts/SettingsLayout.js";
import {
  AccountSettingsScreen,
  AppearanceSettingsScreen,
  BillingSettingsScreen,
  IntegrationsSettingsScreen,
  NotificationsSettingsScreen,
  PrivacySettingsScreen,
  SettingsHomeScreen,
  TeamManagementScreen,
  WorkspaceSettingsScreen,
} from "../features/settings/SettingsScreens.js";
import {
  ActivityLogScreen,
  AdvancedSettingsScreen,
  AutomationPoliciesScreen,
  DataSourcesScreen,
  MfaEnrollmentScreen,
  MemoryControlsScreen,
  SecuritySettingsScreen,
  WorkspaceGoalsScreen,
} from "../features/settings/GovernanceScreens.js";
import {
  AiTransparencyScreen,
  CookiePolicyScreen,
  PrivacyPolicyScreen,
  SecurityPageScreen,
  TermsOfServiceScreen,
} from "../features/legal/LegalScreens.js";
import {
  OrganizationMembersScreen,
  OrganizationSettingsScreen,
} from "../features/organization/OrganizationScreens.js";
import { ActiveSessionsScreen, ProfileScreen } from "../features/users/ProfileScreens.js";
import {
  AutomationApprovalsScreen,
  AutomationBuilderScreen,
  AutomationCenterScreen,
  AutomationDetailScreen,
  AutomationExecutionLogScreen,
} from "../features/automation/AutomationScreens.js";
import {
  IntelligenceFeedScreen,
  IntelligenceHomeScreen,
  IntelligenceOpportunitiesScreen,
  IntelligenceRecommendationDetailScreen,
  IntelligenceRecommendationsScreen,
  IntelligenceRisksScreen,
  IntelligenceTimelineScreen,
} from "../features/intelligence/IntelligenceScreens.js";
import { ResearchHomeScreen, ResearchSessionScreen } from "../features/research/ResearchScreens.js";
import { AnalyticsDashboardScreen, AnalyticsSavedViewsScreen } from "../features/analytics/AnalyticsScreens.js";
import { OperationsDashboardScreen } from "../features/operations/OperationsScreens.js";
import { AdministrationDashboardScreen } from "../features/administration/AdministrationScreens.js";

const secondaryModules = PRIMARY_NAV_ITEMS.filter(
  (item) =>
    item.id !== "command-center" &&
    item.id !== "settings" &&
    item.id !== "automation" &&
    item.id !== "reports",
).map(
  (item) => ({
    path: item.pathSegment,
    element: (
      <ModulePlaceholder moduleId={item.id} title={item.label} gisState={GisState.Load} />
    ),
  }),
);

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  { path: "/invite/:token", element: <InviteAcceptScreen /> },
  { path: "/legal/privacy", element: <PrivacyPolicyScreen /> },
  { path: "/legal/terms", element: <TermsOfServiceScreen /> },
  { path: "/legal/cookies", element: <CookiePolicyScreen /> },
  { path: "/legal/ai-transparency", element: <AiTransparencyScreen /> },
  { path: "/legal/security", element: <SecurityPageScreen /> },
  {
    element: <RequireGuest />,
    children: [
      { path: "/", element: <LandingScreen /> },
      { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignUpScreen /> },
      { path: "/forgot-password", element: <ForgotPasswordScreen /> },
      { path: "/reset-password", element: <ResetPasswordScreen /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireVerifyEmailRoute />,
        children: [{ path: "/verify-email", element: <VerifyEmailScreen /> }],
      },
      {
        element: <RequireOnboardingRoute />,
        children: [
          { path: "/onboarding", element: <OnboardingWelcomeScreen /> },
          { path: "/onboarding/orientation", element: <OnboardingOrientationScreen /> },
          { path: "/onboarding/workspace", element: <OnboardingWorkspaceScreen /> },
          { path: "/onboarding/connect", element: <OnboardingConnectScreen /> },
          { path: "/onboarding/initializing", element: <OnboardingInitializingScreen /> },
          { path: "/onboarding/complete", element: <OnboardingCompleteScreen /> },
        ],
      },
      {
        element: <RequireAppShell />,
        children: [
          { path: "/app", element: <AuthenticatedRedirect /> },
          { path: "/forbidden", element: <ForbiddenPage /> },
          {
            element: <SettingsLayout />,
            children: [
              { path: "/app/settings", element: <SettingsHomeScreen /> },
              { path: "/app/settings/account", element: <AccountSettingsScreen /> },
              { path: "/app/settings/security", element: <SecuritySettingsScreen /> },
              { path: "/app/settings/security/mfa", element: <MfaEnrollmentScreen /> },
              { path: "/app/settings/activity", element: <ActivityLogScreen /> },
              { path: "/app/settings/automation-policies", element: <AutomationPoliciesScreen /> },
              { path: "/app/settings/advanced", element: <AdvancedSettingsScreen /> },
              { path: "/app/settings/memory", element: <MemoryControlsScreen /> },
              { path: "/app/settings/workspace/:workspaceId/sources", element: <DataSourcesScreen /> },
              { path: "/app/settings/workspace/:workspaceId/goals", element: <WorkspaceGoalsScreen /> },
              { path: "/app/settings/notifications", element: <NotificationsSettingsScreen /> },
              { path: "/app/settings/privacy", element: <PrivacySettingsScreen /> },
              { path: "/app/settings/appearance", element: <AppearanceSettingsScreen /> },
              { path: "/app/settings/billing", element: <BillingSettingsScreen /> },
              { path: "/app/settings/integrations", element: <IntegrationsSettingsScreen /> },
              { path: "/app/settings/organization", element: <OrganizationSettingsScreen /> },
              { path: "/app/settings/organization/members", element: <OrganizationMembersScreen /> },
              { path: "/app/settings/workspace/:workspaceId", element: <WorkspaceSettingsScreen /> },
              { path: "/app/settings/workspace/:workspaceId/team", element: <TeamManagementScreen /> },
              { path: "/app/settings/administration", element: <AdministrationDashboardScreen /> },
            ],
          },
          { path: "/app/profile", element: <ProfileScreen /> },
          { path: "/app/profile/sessions", element: <ActiveSessionsScreen /> },
          {
            path: "/app/w/:workspaceId",
            element: <RequireWorkspaceRoute />,
            children: [
              {
                element: <WorkspaceLayout />,
                children: [
                  { index: true, element: <Navigate to="command-center" replace /> },
                  { path: "command-center", element: <CommandCenterScreen /> },
                  { path: "automation", element: <AutomationCenterScreen /> },
                  { path: "automation/new", element: <AutomationBuilderScreen /> },
                  { path: "automation/approvals", element: <AutomationApprovalsScreen /> },
                  { path: "automation/:workflowId/log", element: <AutomationExecutionLogScreen /> },
                  { path: "automation/:workflowId", element: <AutomationDetailScreen /> },
                  { path: "intelligence", element: <IntelligenceHomeScreen /> },
                  { path: "intelligence/feed", element: <IntelligenceFeedScreen /> },
                  { path: "intelligence/recommendations", element: <IntelligenceRecommendationsScreen /> },
                  { path: "intelligence/recommendations/:recommendationId", element: <IntelligenceRecommendationDetailScreen /> },
                  { path: "intelligence/opportunities", element: <IntelligenceOpportunitiesScreen /> },
                  { path: "intelligence/risks", element: <IntelligenceRisksScreen /> },
                  { path: "intelligence/timeline", element: <IntelligenceTimelineScreen /> },
                  { path: "research", element: <ResearchHomeScreen /> },
                  { path: "research/:researchSessionId", element: <ResearchSessionScreen /> },
                  { path: "reports", element: <AnalyticsDashboardScreen /> },
                  { path: "reports/saved", element: <AnalyticsSavedViewsScreen /> },
                  { path: "operations", element: <OperationsDashboardScreen /> },
                  ...secondaryModules,
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
