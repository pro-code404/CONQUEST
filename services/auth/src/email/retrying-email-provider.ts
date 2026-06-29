import { EMAIL_CONSTANTS } from "@conquest/config";
import type { EmailDeliveryProvider, EmailMessage, EmailSendResult } from "./types.js";

export interface RetryingEmailProviderOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  backoffMultiplier?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wraps any provider with exponential-backoff retries. */
export class RetryingEmailProvider implements EmailDeliveryProvider {
  readonly name: string;

  constructor(
    private readonly inner: EmailDeliveryProvider,
    private readonly options: RetryingEmailProviderOptions = {},
  ) {
    this.name = `retrying:${inner.name}`;
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const maxAttempts = this.options.maxAttempts ?? EMAIL_CONSTANTS.MAX_ATTEMPTS;
    const baseDelayMs = this.options.baseDelayMs ?? EMAIL_CONSTANTS.RETRY_DELAY_MS;
    const multiplier = this.options.backoffMultiplier ?? EMAIL_CONSTANTS.RETRY_BACKOFF_MULTIPLIER;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await this.inner.send(message);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Email delivery failed");
        if (attempt < maxAttempts) {
          await sleep(baseDelayMs * multiplier ** (attempt - 1));
        }
      }
    }

    throw lastError ?? new Error("Email delivery failed after retries");
  }
}
