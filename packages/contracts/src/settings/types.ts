import type { UserRole } from "../auth/schemas.js";

export const SETTINGS_CATEGORIES = [
  { id: "account", label: "Account", route: "/app/settings/account", minRole: "viewer" as UserRole },
  { id: "security", label: "Security", route: "/app/settings/security", minRole: "viewer" as UserRole },
  { id: "notifications", label: "Notifications", route: "/app/settings/notifications", minRole: "viewer" as UserRole },
  { id: "privacy", label: "Privacy", route: "/app/settings/privacy", minRole: "viewer" as UserRole },
  { id: "appearance", label: "Appearance", route: "/app/settings/appearance", minRole: "viewer" as UserRole },
  { id: "billing", label: "Billing", route: "/app/settings/billing", minRole: "owner" as UserRole },
  { id: "integrations", label: "Integrations", route: "/app/settings/integrations", minRole: "admin" as UserRole },
  { id: "workspace", label: "Workspace", route: "/app/settings/workspace", minRole: "manager" as UserRole, workspaceScoped: true },
  { id: "sources", label: "Data sources", route: "/app/settings/workspace/sources", minRole: "manager" as UserRole, workspaceScoped: true },
  { id: "goals", label: "Goals & projects", route: "/app/settings/workspace/goals", minRole: "manager" as UserRole, workspaceScoped: true },
  { id: "team", label: "Team", route: "/app/settings/workspace/team", minRole: "manager" as UserRole, workspaceScoped: true },
  { id: "advanced", label: "Advanced / AI", route: "/app/settings/advanced", minRole: "viewer" as UserRole },
  { id: "memory", label: "Memory controls", route: "/app/settings/memory", minRole: "admin" as UserRole },
  { id: "automation-policies", label: "Automation policies", route: "/app/settings/automation-policies", minRole: "admin" as UserRole },
  { id: "organization", label: "Organization", route: "/app/settings/organization", minRole: "admin" as UserRole },
  { id: "administration", label: "Administration", route: "/app/settings/administration", minRole: "admin" as UserRole },
  { id: "activity", label: "Activity log", route: "/app/settings/activity", minRole: "manager" as UserRole },
] as const;

export type SettingsCategoryId = (typeof SETTINGS_CATEGORIES)[number]["id"];

export type ThemePreference = "light" | "dark" | "system";

export interface UserPreferences {
  theme: ThemePreference;
  emailDigest: boolean;
  quietHoursEnabled: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: "system",
  emailDigest: true,
  quietHoursEnabled: false,
};

export interface AccountProfileView {
  displayName: string;
  email: string;
  orgName: string;
}

export interface UpdateProfileInput {
  displayName: string;
}

export const UpdateProfileSchema = {
  parse(input: unknown): UpdateProfileInput {
    if (typeof input !== "object" || input === null || !("displayName" in input)) {
      throw new Error("displayName is required");
    }
    const displayName = String((input as { displayName: unknown }).displayName).trim();
    if (displayName.length < 1 || displayName.length > 120) {
      throw new Error("displayName must be 1–120 characters");
    }
    return { displayName };
  },
};

export interface UpdatePreferencesInput {
  theme?: ThemePreference;
  emailDigest?: boolean;
  quietHoursEnabled?: boolean;
}

export interface OrganizationSettingsView {
  id: string;
  name: string;
  workspaceCount: number;
  memberCount: number;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  orgId: string;
  workspaceType: string;
}

export interface OrganizationMemberView {
  userId: string;
  displayName: string;
  email: string;
  role: UserRole;
}
