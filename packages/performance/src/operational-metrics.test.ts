import { describe, it, expect } from "vitest";
import { OperationalMetricsCollector } from "./operational-metrics.js";

describe("OperationalMetricsCollector", () => {
  it("records rate limit and security counters", () => {
    const collector = new OperationalMetricsCollector();
    collector.recordRateLimitAllowed();
    collector.recordRateLimitBlocked();
    collector.recordAuthFailure();
    collector.recordEmailSent();
    const snap = collector.snapshot({ windowMs: 60_000, maxRequests: 120 });
    expect(snap.rateLimit.allowed).toBe(1);
    expect(snap.rateLimit.blocked).toBe(1);
    expect(snap.security.authFailures).toBe(1);
    expect(snap.email.sent).toBe(1);
  });
});
