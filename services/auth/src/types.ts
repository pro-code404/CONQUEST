import type { OnboardingStage, SessionPublicView, UserRole } from "@conquest/contracts";

export {
  USER_ROLES,
  SignUpInputSchema,
  LoginInputSchema,
  ONBOARDING_STAGES,
  CompleteOnboardingSchema,
  type SignUpInput,
  type LoginInput,
  type OnboardingStage,
  type CompleteOnboardingInput,
  type SessionPublicView,
  type InvitePreview,
} from "@conquest/contracts";

export { ROLE_RANK } from "@conquest/gis";

export type { UserRole };

export interface UserRecord {
  id: string;
  orgId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  onboardingComplete: boolean;
  onboardingStage: OnboardingStage;
  displayName: string;
  createdAt: number;
  passwordChangedAt: number | null;
  mfaEnrolled: boolean;
}

export type CreateUserInput = Omit<UserRecord, "passwordChangedAt" | "mfaEnrolled"> &
  Partial<Pick<UserRecord, "passwordChangedAt" | "mfaEnrolled">>;

export interface OrganizationRecord {
  id: string;
  name: string;
  createdAt: number;
}

export interface WorkspaceRecord {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  workspaceType: string;
  primaryGoal: string;
  archived: boolean;
  createdAt: number;
}

export interface WorkspaceIntelligenceStatus {
  dataSourceConnected: boolean;
  initializationInProgress: boolean;
  warningCount: number;
  degradedZoneCount: number;
  offline: boolean;
  offlineTimestamp?: string;
}

/** Server-side session — ADR-0017 */
export interface ServerSession {
  id: string;
  userId: string;
  orgId: string;
  activeWorkspaceId: string | null;
  authStrength: "password" | "mfa";
  deviceId: string;
  expiresAt: number;
  revoked: boolean;
  createdAt: number;
}

export interface LegalAcceptanceRecord {
  id: string;
  userId: string;
  documentType: string;
  documentVersion: string;
  acceptedAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthResult {
  session: ServerSession;
  view: SessionPublicView;
  verificationToken?: string;
}
