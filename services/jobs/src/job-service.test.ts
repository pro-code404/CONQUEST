import { describe, it, expect } from "vitest";
import { JOB_CONSTANTS } from "@conquest/config";
import { parseTenantScope } from "@conquest/core";
import { JobService } from "./index.js";

describe("Job framework (Phase 8B)", () => {
  it("enqueues and processes a job with progress", async () => {
    const jobs = new JobService();
    jobs.registerHandler({
      type: "email",
      async handle(_job, reportProgress) {
        reportProgress(50);
        reportProgress(100);
      },
    });

    const enqueued = await jobs.enqueue({
      type: "email",
      payload: { to: "user@example.com" },
      correlationId: "corr-1",
    });
    expect(enqueued.status).toBe("queued");

    const result = await jobs.processNext();
    expect(result?.status).toBe("completed");
    expect(result?.progress).toBe(100);
    expect(result?.correlationId).toBe("corr-1");
  });

  it("retries and moves to dead letter after max attempts", async () => {
    const jobs = new JobService();
    let calls = 0;
    jobs.registerHandler({
      type: "import",
      async handle() {
        calls += 1;
        throw new Error("transient failure");
      },
    });

    const job = await jobs.enqueue({
      type: "import",
      payload: {},
      correlationId: "corr-2",
      maxAttempts: 2,
    });

    await jobs.processNext();
    await jobs.processNext(Date.now() + JOB_CONSTANTS.DEFAULT_RETRY_DELAY_MS * 4);
    const final = await jobs.getJob(job.id);
    expect(calls).toBe(2);
    expect(final?.status).toBe("dead_letter");
    expect((await jobs.listDeadLetter()).length).toBe(1);
  });

  it("supports delayed jobs", async () => {
    const jobs = new JobService();
    jobs.registerHandler({ type: "export", async handle() {} });
    await jobs.enqueue({
      type: "export",
      payload: {},
      correlationId: "corr-3",
      delayMs: 10_000,
    });
    const immediate = await jobs.processNext();
    expect(immediate).toBeNull();
  });

  it("cancels queued jobs", async () => {
    const jobs = new JobService();
    const job = await jobs.enqueue({
      type: "indexing",
      payload: {},
      correlationId: "corr-4",
      tenant: parseTenantScope({
        orgId: "550e8400-e29b-41d4-a716-446655440000",
        workspaceId: "660e8400-e29b-41d4-a716-446655440001",
      }),
    });
    const cancelled = await jobs.cancel(job.id);
    expect(cancelled.status).toBe("cancelled");
  });

  it("reports queue metrics", async () => {
    const jobs = new JobService();
    await jobs.enqueue({ type: "ai_request", payload: {}, correlationId: "c1" });
    const metrics = await jobs.getMetrics();
    expect(metrics.queued).toBeGreaterThan(0);
  });

  it("times out long-running jobs", async () => {
    const jobs = new JobService();
    jobs.registerHandler({
      type: "document_processing",
      async handle() {
        await new Promise((resolve) => setTimeout(resolve, 50));
      },
    });
    const job = await jobs.enqueue({
      type: "document_processing",
      payload: { timeoutMs: 5 },
      correlationId: "timeout-1",
      maxAttempts: 1,
    });
    const result = await jobs.processNext();
    expect(result?.id).toBe(job.id);
    expect(result?.error).toContain("timeout");
  });
});
