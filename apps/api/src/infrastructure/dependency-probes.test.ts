import { describe, it, expect } from "vitest";
import { AsyncMemoryAuthRepository } from "@conquest/auth";
import { validateApiEnvironment } from "@conquest/config";
import { createPlatformServices } from "@conquest/platform";
import { JobService } from "@conquest/jobs";
import { probeDependencies } from "./dependency-probes.js";

describe("probeDependencies", () => {
  it("reports healthy memory-mode stack", async () => {
    const repo = new AsyncMemoryAuthRepository();
    const platform = createPlatformServices();
    const jobs = new JobService();
    const report = await probeDependencies({
      apiEnv: validateApiEnvironment({ NODE_ENV: "development", MEMORY_REPO: "true" }),
      repo,
      persistenceMode: "memory",
      platform,
      redisClient: null,
      jobService: jobs,
      jobQueueLabel: "in-memory",
      emailProviderName: "console",
    });
    expect(report.probes.find((p) => p.name === "database")?.available).toBe(true);
    expect(report.probes.find((p) => p.name === "queue")?.available).toBe(true);
    expect(report.overall).toMatch(/healthy|degraded/);
  });

  it("marks redis degraded when configured but unavailable", async () => {
    const repo = new AsyncMemoryAuthRepository();
    const platform = createPlatformServices();
    const jobs = new JobService();
    const report = await probeDependencies({
      apiEnv: validateApiEnvironment({
        NODE_ENV: "development",
        MEMORY_REPO: "true",
        REDIS_URL: "redis://localhost:6379",
      }),
      repo,
      persistenceMode: "memory",
      platform,
      redisClient: null,
      jobService: jobs,
      jobQueueLabel: "in-memory",
      emailProviderName: "console",
    });
    expect(report.probes.find((p) => p.name === "redis")?.degraded).toBe(true);
    expect(report.overall).toBe("degraded");
  });
});
