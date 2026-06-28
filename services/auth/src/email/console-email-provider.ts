import type { EmailDeliveryProvider, EmailMessage, EmailSendResult } from "./types.js";

/** Development provider — logs delivery without external SMTP. */
export class ConsoleEmailProvider implements EmailDeliveryProvider {
  readonly name = "console";

  async send(message: EmailMessage): Promise<EmailSendResult> {
    console.info(
      JSON.stringify({
        event: "email_delivery",
        provider: this.name,
        to: message.to,
        subject: message.subject,
        preview: message.text.slice(0, 120),
      }),
    );
    return { providerMessageId: `console-${Date.now()}` };
  }
}
