import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ConsoleEmailProvider } from "./console-email-provider.js";
import { RetryingEmailProvider } from "./retrying-email-provider.js";
import { ResendEmailProvider } from "./resend-email-provider.js";
import { createEmailProvider } from "./create-email-provider.js";

describe("ConsoleEmailProvider", () => {
  it("returns synthetic message id", async () => {
    const provider = new ConsoleEmailProvider();
    const result = await provider.send({
      to: "user@example.com",
      subject: "Test",
      text: "Hello",
    });
    expect(result.providerMessageId).toContain("console-");
  });
});

describe("RetryingEmailProvider", () => {
  it("retries before succeeding", async () => {
    let attempts = 0;
    const inner = {
      name: "mock",
      send: vi.fn(async () => {
        attempts += 1;
        if (attempts < 2) throw new Error("transient");
        return { providerMessageId: "ok" };
      }),
    };
    const provider = new RetryingEmailProvider(inner, { maxAttempts: 3, baseDelayMs: 1 });
    const result = await provider.send({ to: "a@b.com", subject: "s", text: "t" });
    expect(result.providerMessageId).toBe("ok");
    expect(attempts).toBe(2);
  });
});

describe("ResendEmailProvider", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "Conquest <test@example.com>");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("sends via Resend API", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "email_123" }),
    }) as typeof fetch;

    const provider = new ResendEmailProvider();
    const result = await provider.send({
      to: "user@example.com",
      subject: "Verify",
      text: "Click here",
      correlationId: "corr-1",
    });
    expect(result.providerMessageId).toBe("email_123");
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });
});

describe("createEmailProvider", () => {
  it("defaults to console in development", () => {
    vi.stubEnv("EMAIL_PROVIDER", "console");
    const provider = createEmailProvider();
    expect(provider.name).toBe("console");
    vi.unstubAllEnvs();
  });

  it("wraps resend with retry layer", () => {
    vi.stubEnv("EMAIL_PROVIDER", "resend");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "Conquest <test@example.com>");
    const provider = createEmailProvider();
    expect(provider.name).toBe("retrying:resend");
    vi.unstubAllEnvs();
  });
});
