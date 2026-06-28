import { describe, it, expect } from "vitest";
import { PlatformMetricsCollector, withRequestTiming } from "./index.js";

describe("Performance foundations (Phase 8G)", () => {
  it("collects request and AI latency metrics", () => {
    const collector = new PlatformMetricsCollector();
    collector.recordRequest(600, "corr-1");
    collector.recordAiLatency(120);
    collector.recordAiLatency(80);
    const snapshot = collector.snapshot();
    expect(snapshot.requestCount).toBe(1);
    expect(snapshot.slowQueryCount).toBe(1);
    expect(snapshot.ai?.count).toBe(2);
  });

  it("times async operations", async () => {
    const slow: Array<{ label: string; durationMs: number }> = [];
    const { durationMs } = await withRequestTiming(
      "test-op",
      async () => {
        await new Promise((r) => setTimeout(r, 2));
        return "ok";
      },
      { onSlow: (r) => slow.push(r) },
    );
    expect(durationMs).toBeGreaterThanOrEqual(0);
  });
});
