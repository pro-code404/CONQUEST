import type { EmailDeliveryProvider, EmailMessage, EmailSendResult } from "./types.js";

export interface SmtpEmailProviderOptions {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
  secure?: boolean;
}

/** SMTP fallback provider using nodemailer. */
export class SmtpEmailProvider implements EmailDeliveryProvider {
  readonly name = "smtp";
  private readonly options: Required<Pick<SmtpEmailProviderOptions, "host" | "port" | "from">> &
    SmtpEmailProviderOptions;

  constructor(options: SmtpEmailProviderOptions = {}) {
    const host = options.host ?? process.env.SMTP_HOST ?? "";
    const port = options.port ?? Number(process.env.SMTP_PORT ?? 587);
    const from = options.from ?? process.env.EMAIL_FROM ?? "";
    if (!host || !from) {
      throw new Error("SMTP_HOST and EMAIL_FROM are required when EMAIL_PROVIDER=smtp");
    }
    this.options = { ...options, host, port, from };
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: this.options.host,
      port: this.options.port,
      secure: this.options.secure ?? this.options.port === 465,
      auth:
        this.options.user || process.env.SMTP_USER
          ? {
              user: this.options.user ?? process.env.SMTP_USER ?? "",
              pass: this.options.pass ?? process.env.SMTP_PASS ?? "",
            }
          : undefined,
    });

    const info = await transport.sendMail({
      from: this.options.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
      headers: message.correlationId ? { "X-Correlation-Id": message.correlationId } : undefined,
    });

    return { ...(info.messageId ? { providerMessageId: info.messageId } : {}) };
  }
}
