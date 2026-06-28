import { z } from "zod";

export interface PasswordPolicyIndicator {
  id: string;
  label: string;
  met: boolean;
}

export interface SecuritySettingsView {
  mfaEnrolled: boolean;
  mfaPending: boolean;
  recoveryCodesRemaining: number;
  passwordLastChangedAt: string | null;
  passwordPolicy: PasswordPolicyIndicator[];
}

export interface MfaEnrollResult {
  secret: string;
  otpauthUri: string;
  recoveryCodes: string[];
}

export interface TrustedDeviceView {
  deviceId: string;
  label: string;
  lastSeenAt: string;
  trusted: boolean;
  isCurrent: boolean;
}

export const MfaVerifyEnrollmentSchema = z.object({
  recoveryCode: z.string().min(8).max(32),
});

export type MfaVerifyEnrollmentInput = z.infer<typeof MfaVerifyEnrollmentSchema>;

export const MfaVerifySchema = z.object({
  code: z.string().min(6).max(8),
});

export type MfaVerifyInput = z.infer<typeof MfaVerifySchema>;

export interface SecurityPreferences {
  requireMfaForSensitiveActions: boolean;
  trustDeviceOnLogin: boolean;
}

export const DEFAULT_SECURITY_PREFERENCES: SecurityPreferences = {
  requireMfaForSensitiveActions: false,
  trustDeviceOnLogin: true,
};

export function settingsMfaRoute(): string {
  return "/app/settings/security/mfa";
}
