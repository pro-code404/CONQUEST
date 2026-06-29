import { describe, it, expect } from "vitest";

import { createPromptBuilder } from "@conquest/prompt-security";

import { createPlatformServices, getPlatformHealthReport, getCognitiveMetricsSnapshot } from "./index.js";



const scope = {

  orgId: "550e8400-e29b-41d4-a716-446655440000",

  workspaceId: "550e8400-e29b-41d4-a716-446655440001",

};



describe("Platform composition (Phase 8–11)", () => {

  it("wires cache, jobs, gateway, audit, memory, and cognitive stack", async () => {

    const platform = createPlatformServices();

    expect(platform.cache).toBeTruthy();

    expect((await platform.jobs.getMetrics()).queued).toBe(0);

    expect(platform.cognitive).toBeTruthy();

    expect(platform.cognitiveMetrics).toBeTruthy();

    expect(platform.cacheLabel).toBe("in-memory");



    const prompt = createPromptBuilder().system("Assistant").user("ping").build();

    const response = await platform.aiGateway.complete({

      prompt,

      correlationId: "platform-test-1",

    });

    expect(response.providerId).toBeTruthy();

    expect(platform.aiAudit.list({ correlationId: "platform-test-1" }).length).toBe(1);

    expect(platform.metrics.snapshot().ai?.count).toBe(1);



    const cognitive = await platform.cognitive.run(scope, {

      workspaceId: scope.workspaceId,

      objective: "Evaluate platform cognitive wiring",

    });

    expect(cognitive.lifecycle).toBe("completed");

    expect(cognitive.confidence).toBeGreaterThan(0);

    expect(cognitive.telemetry?.auditId).toBeTruthy();



    const metrics = getCognitiveMetricsSnapshot(platform);

    expect(metrics.requestCount).toBe(1);

    expect(metrics.avgConfidence).toBeGreaterThan(0);

  });



  it("aggregates platform health for dependencies", async () => {

    const platform = createPlatformServices();

    const health = await getPlatformHealthReport(platform);

    expect(health.status).toBe("healthy");

    expect(health.checks.some((c) => c.name === "cognitive")).toBe(true);

    expect(health.checks.some((c) => c.name === "cache")).toBe(true);

  });



  it("processes async cognitive jobs through registered handler", async () => {

    const platform = createPlatformServices();

    const queued = await platform.cognitive.run(scope, {

      workspaceId: scope.workspaceId,

      objective: "Platform async job",

      async: true,

    });

    expect(queued.lifecycle).toBe("queued");



    const jobs = await platform.jobs.processAll(1);

    expect(jobs[0]?.status).toBe("completed");



    const lifecycle = platform.cognitive.getLifecycle(queued.requestId);

    expect(lifecycle.status).toBe("completed");

  });



  it("serves cognitive cache hits on repeated runs", async () => {

    const platform = createPlatformServices();

    const input = { workspaceId: scope.workspaceId, objective: "Platform cache hit test" };

    const cold = await platform.cognitive.run(scope, input);

    const warm = await platform.cognitive.run(scope, input);

    expect(cold.telemetry?.cacheHit).toBe(false);

    expect(warm.telemetry?.cacheHit).toBe(true);

  });



  it("uses redis provider when client is injected", async () => {

    const platform = createPlatformServices({

      redisClient: {

        store: new Map<string, string>(),

        async get(key: string) {

          return this.store.get(key) ?? null;

        },

        async set(key: string, value: string) {

          this.store.set(key, value);

        },

        async del(...keys: string[]) {

          let n = 0;

          for (const key of keys) {

            if (this.store.delete(key)) n += 1;

          }

          return n;

        },

        async ping() {

          return "PONG";

        },

      },

    });

    expect(platform.cacheLabel).toBe("redis");

    const health = await platform.cache.provider.healthCheck();

    expect(health.healthy).toBe(true);

  });

});


