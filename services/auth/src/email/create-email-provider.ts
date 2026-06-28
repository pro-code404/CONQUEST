import type { EmailDeliveryProvider } from "./types.js";
import { ConsoleEmailProvider } from "./console-email-provider.js";

/** Select email provider — console for dev/CI; replace with SMTP adapter in production. */
export function createEmailProvider(): EmailDeliveryProvider {
  const configured = process.env.EMAIL_PROVIDER?.toLowerCase();
  if (configured === "console" || !configured) {
    return new ConsoleEmailProvider();
  }
  return new ConsoleEmailProvider();
}
