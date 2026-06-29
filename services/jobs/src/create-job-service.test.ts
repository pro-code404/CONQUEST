import { describe, it, expect } from "vitest";
import { createJobService } from "./create-job-service.js";

describe("createJobService", () => {
  it("falls back to in-memory when redis URL is absent", async () => {
    const { service, label } = await createJobService({ redisUrl: null, forceMemory: true });
    expect(label).toBe("in-memory");
    expect(service.queueLabel).toBe("in-memory");
    const job = await service.enqueue({ type: "email", payload: {}, correlationId: "c1" });
    expect(job.status).toBe("queued");
  });

  it("uses in-memory in test environment", async () => {
    const { label } = await createJobService({ redisUrl: "redis://localhost:6379" });
    expect(label).toBe("in-memory");
  });
});
