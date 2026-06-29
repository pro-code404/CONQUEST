import type { EmailDeliveryProvider } from "./types.js";
import { ConsoleEmailProvider } from "./console-email-provider.js";
import { ResendEmailProvider } from "./resend-email-provider.js";
import { RetryingEmailProvider } from "./retrying-email-provider.js";
import { SmtpEmailProvider } from "./smtp-email-provider.js";

function selectInnerProvider(): EmailDeliveryProvider {
  const configured = (process.env.EMAIL_PROVIDER ?? "console").toLowerCase();

  if (configured === "resend") {
    try {
      return new ResendEmailProvider();
    } catch (error) {
      const fallback = process.env.EMAIL_FALLBACK_PROVIDER?.toLowerCase();
      if (fallback === "smtp") {
        console.warn(
          JSON.stringify({
            event: "email_provider_fallback",
            from: "resend",
            to: "smtp",
            message: error instanceof Error ? error.message : "resend unavailable",
          }),
        );
        return new SmtpEmailProvider();
      }
      throw error;
    }
  }

  if (configured === "smtp") {
    return new SmtpEmailProvider();
  }

  return new ConsoleEmailProvider();
}

/** Select email provider — console (dev), resend (prod preferred), or smtp fallback. */
export function createEmailProvider(): EmailDeliveryProvider {
  const inner = selectInnerProvider();
  if (inner.name === "console") {
    return inner;
  }
  return new RetryingEmailProvider(inner);
}
