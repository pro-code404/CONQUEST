export type EmailDeliveryType = "verification" | "password_reset" | "team_invite" | "org_invite";

export type EmailDeliveryStatus = "sent" | "failed" | "queued";

export interface EmailDeliveryRecord {
  id: string;
  orgId: string | null;
  userId: string | null;
  emailType: EmailDeliveryType;
  recipient: string;
  status: EmailDeliveryStatus;
  provider: string | null;
  providerMessageId: string | null;
  errorMessage: string | null;
  createdAt: number;
}

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailSendResult {
  providerMessageId?: string;
}

/** Provider abstraction — swap SMTP/Resend/SendGrid without changing services. */
export interface EmailDeliveryProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<EmailSendResult>;
}
