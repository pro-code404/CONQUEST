import { z } from "zod";

/** GIS §2.1 role hierarchy */
export const USER_ROLES = ["owner", "admin", "manager", "member", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SignUpInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(120),
  orgName: z.string().min(1).max(120).optional(),
});

export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
  deviceId: z.string().uuid().optional(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const ONBOARDING_STAGES = [
  "welcome",
  "orientation",
  "workspace",
  "connect",
  "initializing",
  "complete",
  "done",
] as const;

export type OnboardingStage = (typeof ONBOARDING_STAGES)[number];

export const CompleteOnboardingSchema = z.object({
  workspaceName: z.string().min(1).max(120),
  workspaceType: z.string().min(1).max(80),
  primaryGoal: z.string().min(1).max(240),
});

export type CompleteOnboardingInput = z.infer<typeof CompleteOnboardingSchema>;

export const SetOnboardingStageSchema = z.object({
  stage: z.enum(ONBOARDING_STAGES),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const PasswordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const PasswordResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export const AcceptInviteSchema = z.object({
  token: z.string().min(1),
});

/** Public session view returned to clients — ADR-0017 */
export interface SessionPublicView {
  sessionId: string;
  userId: string;
  orgId: string;
  activeWorkspaceId: string | null;
  email: string;
  displayName: string;
  role: UserRole;
  emailVerified: boolean;
  onboardingComplete: boolean;
  onboardingStage: OnboardingStage;
  authStrength: "password" | "mfa";
}

/** Client session alias — Phase 6B contracts consolidation */
export type SessionUser = SessionPublicView;

export interface AuthResponse {
  user: SessionUser;
  verificationToken?: string;
}

export interface InvitePreview {
  workspaceName: string;
  role: UserRole;
  inviterName: string;
}

export interface ApiErrorBody {
  error: string;
  reason?: string;
}

export interface ApiOkBody {
  ok: true;
  message?: string;
}
