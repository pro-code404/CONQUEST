import { randomUUID } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import { getTraceContext } from "@conquest/observability";
import { ApplicationServiceBase } from "@conquest/service-shared";
import type { AuthRepository } from "./auth-repository.js";
import type { EmailDeliveryProvider, EmailDeliveryType } from "./email/types.js";

export interface NotificationServiceOptions {
  appBaseUrl?: string;
}

export class NotificationService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTH;

  constructor(
    private readonly repo: AuthRepository,
    private readonly provider: EmailDeliveryProvider,
    private readonly options: NotificationServiceOptions = {},
  ) {
    super();
  }

  private baseUrl(): string {
    return (this.options.appBaseUrl ?? process.env.APP_BASE_URL ?? "http://localhost:5173").replace(/\/$/, "");
  }

  async sendVerificationEmail(input: {
    userId: string;
    orgId: string;
    recipient: string;
    token: string;
  }): Promise<void> {
    const link = `${this.baseUrl()}/verify-email?token=${encodeURIComponent(input.token)}`;
    await this.deliver({
      orgId: input.orgId,
      userId: input.userId,
      emailType: "verification",
      recipient: input.recipient,
      subject: "Verify your Conquest email",
      text: `Verify your email: ${link}`,
    });
  }

  async sendPasswordResetEmail(input: {
    userId: string;
    orgId: string;
    recipient: string;
    token: string;
  }): Promise<void> {
    const link = `${this.baseUrl()}/reset-password?token=${encodeURIComponent(input.token)}`;
    await this.deliver({
      orgId: input.orgId,
      userId: input.userId,
      emailType: "password_reset",
      recipient: input.recipient,
      subject: "Reset your Conquest password",
      text: `Reset your password: ${link}`,
    });
  }

  async sendTeamInviteEmail(input: {
    orgId: string;
    inviterUserId: string;
    recipient: string;
    workspaceName: string;
    token: string;
  }): Promise<void> {
    const link = `${this.baseUrl()}/invite/${encodeURIComponent(input.token)}`;
    await this.deliver({
      orgId: input.orgId,
      userId: input.inviterUserId,
      emailType: "team_invite",
      recipient: input.recipient,
      subject: `Join ${input.workspaceName} on Conquest`,
      text: `You have been invited to ${input.workspaceName}: ${link}`,
    });
  }

  async sendOrgInviteEmail(input: {
    orgId: string;
    inviterUserId: string;
    recipient: string;
    orgName: string;
    token: string;
  }): Promise<void> {
    const link = `${this.baseUrl()}/signup?invite=${encodeURIComponent(input.token)}`;
    await this.deliver({
      orgId: input.orgId,
      userId: input.inviterUserId,
      emailType: "org_invite",
      recipient: input.recipient,
      subject: `Join ${input.orgName} on Conquest`,
      text: `You have been invited to ${input.orgName}: ${link}`,
    });
  }

  private async deliver(input: {
    orgId: string | null;
    userId: string | null;
    emailType: EmailDeliveryType;
    recipient: string;
    subject: string;
    text: string;
  }): Promise<void> {
    const correlationId = getTraceContext()?.correlationId;
    try {
      const result = await this.provider.send({
        to: input.recipient,
        subject: input.subject,
        text: input.text,
        ...(correlationId ? { correlationId } : {}),
      });
      await this.repo.recordEmailDelivery({
        id: randomUUID(),
        orgId: input.orgId,
        userId: input.userId,
        emailType: input.emailType,
        recipient: input.recipient,
        status: "sent",
        provider: this.provider.name,
        providerMessageId: result.providerMessageId ?? null,
        errorMessage: null,
        createdAt: Date.now(),
      });
      this.emit("email_sent", "info", {
        emailType: input.emailType,
        recipient: input.recipient,
        ...(correlationId ? { correlationId } : {}),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delivery failed";
      await this.repo.recordEmailDelivery({
        id: randomUUID(),
        orgId: input.orgId,
        userId: input.userId,
        emailType: input.emailType,
        recipient: input.recipient,
        status: "failed",
        provider: this.provider.name,
        providerMessageId: null,
        errorMessage: message,
        createdAt: Date.now(),
      });
      this.emit("email_failed", "error", {
        emailType: input.emailType,
        recipient: input.recipient,
        message,
        ...(correlationId ? { correlationId } : {}),
      });
      throw error;
    }
  }
}
