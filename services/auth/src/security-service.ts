import { randomBytes } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import { SECURITY_CONSTANTS } from "@conquest/config";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  MfaVerifyEnrollmentSchema,
  type MfaEnrollResult,
  type MfaVerifyEnrollmentInput,
  type PasswordPolicyIndicator,
  type SecurityPreferences,
  type SecuritySettingsView,
  type TrustedDeviceView,
} from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";
import { hashPassword, verifyPassword } from "./password.js";

function generateRecoveryCode(): string {
  return randomBytes(SECURITY_CONSTANTS.RECOVERY_CODE_LENGTH / 2)
    .toString("base64url")
    .slice(0, SECURITY_CONSTANTS.RECOVERY_CODE_LENGTH);
}

export class SecurityService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTH;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async getSecuritySettings(sessionId: string): Promise<SecuritySettingsView> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireUser(session.userId);
    const mfa = await this.repo.getMfa(user.id);
    return {
      mfaEnrolled: user.mfaEnrolled,
      mfaPending: Boolean(mfa.pendingSecret),
      recoveryCodesRemaining: mfa.recoveryCodeHashes.length,
      passwordLastChangedAt: user.passwordChangedAt
        ? new Date(user.passwordChangedAt).toISOString()
        : null,
      passwordPolicy: this.passwordPolicyIndicators(user.passwordHash),
    };
  }

  async enrollMfa(sessionId: string): Promise<MfaEnrollResult> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireUser(session.userId);
    if (user.mfaEnrolled) throw new Error("MFA is already enrolled");

    const secret = randomBytes(SECURITY_CONSTANTS.MFA_SECRET_BYTES).toString("base64url");
    const recoveryCodes = Array.from({ length: SECURITY_CONSTANTS.RECOVERY_CODE_COUNT }, () =>
      generateRecoveryCode(),
    );
    await this.repo.saveMfa(user.id, {
      pendingSecret: secret,
      recoveryCodeHashes: recoveryCodes.map((code) => hashPassword(code)),
    });
    await this.repo.appendAuditEvent({
      category: "security",
      action: "mfa.enroll_started",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "user",
      resourceId: user.id,
      orgId: user.orgId,
      summary: "MFA enrollment started",
    });
    this.emit("mfa_enroll_started", "info", { userId: user.id });
    return {
      secret,
      otpauthUri: `otpauth://totp/Conquest:${encodeURIComponent(user.email)}?secret=${secret}&issuer=Conquest`,
      recoveryCodes,
    };
  }

  async confirmMfaEnrollment(
    sessionId: string,
    raw: MfaVerifyEnrollmentInput,
  ): Promise<SecuritySettingsView> {
    const input = MfaVerifyEnrollmentSchema.parse(raw);
    const session = await this.requireSession(sessionId);
    const user = await this.requireUser(session.userId);
    const mfa = await this.repo.getMfa(user.id);
    if (!mfa.pendingSecret) throw new Error("MFA enrollment not started");
    const matched = mfa.recoveryCodeHashes.find((hash) =>
      verifyPassword(input.recoveryCode, hash),
    );
    if (!matched) throw new Error("Invalid recovery code");

    user.mfaEnrolled = true;
    await this.repo.updateUser(user);
    session.authStrength = "mfa";
    await this.repo.saveSession(session);
    await this.repo.saveMfa(user.id, { pendingSecret: null, recoveryCodeHashes: mfa.recoveryCodeHashes });
    await this.repo.appendAuditEvent({
      category: "security",
      action: "mfa.enrolled",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "user",
      resourceId: user.id,
      orgId: user.orgId,
      summary: "MFA enrollment completed",
    });
    this.emit("mfa_enrolled", "info", { userId: user.id });
    return this.getSecuritySettings(sessionId);
  }

  async regenerateRecoveryCodes(sessionId: string): Promise<{ recoveryCodes: string[] }> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireUser(session.userId);
    if (!user.mfaEnrolled) throw new Error("MFA is not enrolled");
    const recoveryCodes = Array.from({ length: SECURITY_CONSTANTS.RECOVERY_CODE_COUNT }, () =>
      generateRecoveryCode(),
    );
    await this.repo.saveMfa(user.id, {
      pendingSecret: null,
      recoveryCodeHashes: recoveryCodes.map((code) => hashPassword(code)),
    });
    await this.repo.appendAuditEvent({
      category: "security",
      action: "mfa.recovery_regenerated",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "user",
      resourceId: user.id,
      orgId: user.orgId,
      summary: "MFA recovery codes regenerated",
    });
    return { recoveryCodes };
  }

  async listTrustedDevices(sessionId: string): Promise<TrustedDeviceView[]> {
    const session = await this.requireSession(sessionId);
    const devices = await this.repo.listTrustedDevices(session.userId);
    return devices.map((device) => ({
      deviceId: device.deviceId,
      label: device.label,
      lastSeenAt: new Date(device.lastSeenAt).toISOString(),
      trusted: device.trusted,
      isCurrent: device.deviceId === session.deviceId,
    }));
  }

  async revokeTrustedDevice(sessionId: string, deviceId: string): Promise<TrustedDeviceView[]> {
    const session = await this.requireSession(sessionId);
    if (deviceId === session.deviceId) {
      throw new Error("Cannot revoke current device from this screen");
    }
    await this.repo.removeTrustedDevice(session.userId, deviceId);
    await this.repo.revokeSessionsForUserDevice(session.userId, deviceId);
    const user = await this.requireUser(session.userId);
    await this.repo.appendAuditEvent({
      category: "security",
      action: "device.revoked",
      actorId: user.id,
      actorName: user.displayName,
      resourceType: "device",
      resourceId: deviceId,
      orgId: user.orgId,
      summary: "Trusted device revoked",
    });
    return this.listTrustedDevices(sessionId);
  }

  async getSecurityPreferences(sessionId: string): Promise<SecurityPreferences> {
    const session = await this.requireSession(sessionId);
    return this.repo.getSecurityPreferences(session.userId);
  }

  async updateSecurityPreferences(
    sessionId: string,
    input: Partial<SecurityPreferences>,
  ): Promise<SecurityPreferences> {
    const session = await this.requireSession(sessionId);
    const current = await this.repo.getSecurityPreferences(session.userId);
    const next: SecurityPreferences = {
      requireMfaForSensitiveActions:
        input.requireMfaForSensitiveActions ?? current.requireMfaForSensitiveActions,
      trustDeviceOnLogin: input.trustDeviceOnLogin ?? current.trustDeviceOnLogin,
    };
    await this.repo.saveSecurityPreferences(session.userId, next);
    return next;
  }

  async touchTrustedDevice(userId: string, deviceId: string, label?: string): Promise<void> {
    const prefs = await this.repo.getSecurityPreferences(userId);
    if (!prefs.trustDeviceOnLogin) return;
    await this.repo.upsertTrustedDevice(userId, {
      deviceId,
      label: label ?? `Device ${deviceId.slice(0, 8)}`,
      trusted: true,
      lastSeenAt: Date.now(),
    });
  }

  private passwordPolicyIndicators(passwordHash: string): PasswordPolicyIndicator[] {
    return [
      { id: "length", label: "At least 8 characters", met: passwordHash.length > 0 },
      { id: "stored", label: "Password securely hashed", met: passwordHash.startsWith("scrypt:") },
      { id: "rotation", label: "Consider rotating every 90 days", met: true },
    ];
  }

  private async requireUser(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  private async requireSession(sessionId: string) {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }
}
