import type { EmailDeliveryProvider, EmailMessage, EmailSendResult } from "./types.js";

export interface ResendEmailProviderOptions {
  apiKey?: string;
  from?: string;
}

/** Production email via [Resend](https://resend.com) HTTP API. */
export class ResendEmailProvider implements EmailDeliveryProvider {
  readonly name = "resend";
  private readonly apiKey: string;
  private readonly from: string;

  constructor(options: ResendEmailProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.RESEND_API_KEY ?? "";
    this.from = options.from ?? process.env.EMAIL_FROM ?? "Conquest <onboarding@resend.dev>";
    if (!this.apiKey) {
      throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
    }
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...(message.correlationId ? { "X-Correlation-Id": message.correlationId } : {}),
      },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend delivery failed (${response.status}): ${body.slice(0, 200)}`);
    }

    const data = (await response.json()) as { id?: string };
    return { ...(data.id ? { providerMessageId: data.id } : {}) };
  }
}
