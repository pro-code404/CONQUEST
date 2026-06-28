import { z } from "zod";

export interface FeatureFlagView {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

export interface ProviderManagementView {
  id: string;
  name: string;
  status: "available" | "degraded" | "unavailable";
  configured: boolean;
}

export interface SecurityOverviewView {
  mfaEnrolledUsers: number;
  activeSessions: number;
  recentSecurityEvents: number;
}

export interface AdministrationDashboardView {
  orgId: string;
  orgName: string;
  featureFlags: FeatureFlagView[];
  providers: ProviderManagementView[];
  security: SecurityOverviewView;
  memberCount: number;
  workspaceCount: number;
}

export const UpdateFeatureFlagSchema = z.object({
  enabled: z.boolean(),
});

export type UpdateFeatureFlagInput = z.infer<typeof UpdateFeatureFlagSchema>;

export function administrationHomeRoute(): string {
  return "/app/settings/administration";
}
