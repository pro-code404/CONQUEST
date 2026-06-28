import { describe, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import {
  runWithTraceContext,
  getTraceContext,
  requireTraceContext,
} from "./trace-context.js";
import { runHealthChecks } from "./health.js";

describe("Trace context (INF-12)", () => {
  it("propagates correlation context within async scope", () => {
    const ctx = {
      traceId: randomUUID(),
      correlationId: randomUUID(),
      requestId: randomUUID(),
    };
    runWithTraceContext(ctx, () => {
      expect(getTraceContext()).toEqual(ctx);
      expect(requireTraceContext().correlationId).toBe(ctx.correlationId);
    });
    expect(getTraceContext()).toBeUndefined();
  });

  it("requires context outside scope", () => {
    expect(() => requireTraceContext()).toThrow(/INF-12/);
  });
});

describe("Health checks (ADR-0023 scaffold)", () => {
  it("aggregates check results", async () => {
    const report = await runHealthChecks("test-service", [
      { name: "ok", check: () => ({ name: "ok", status: "healthy" as const }) },
    ]);
    expect(report.status).toBe("healthy");
    expect(report.checks).toHaveLength(1);
  });
});
