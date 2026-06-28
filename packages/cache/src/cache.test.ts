import { describe, it, expect, beforeEach } from "vitest";
import { parseTenantScope } from "@conquest/core";
import { CacheService, InMemoryCacheProvider, RedisCacheProvider } from "./index.js";

describe("Cache layer (Phase 8A)", () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService({ provider: new InMemoryCacheProvider() });
  });

  it("stores and retrieves tenant-scoped values", async () => {
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await cache.setTenant(scope, "profile", { name: "Acme" });
    const value = await cache.getTenant<{ name: string }>(scope, "profile");
    expect(value?.name).toBe("Acme");
  });

  it("isolates workspace keys", async () => {
    const orgId = "550e8400-e29b-41d4-a716-446655440000";
    const wsA = parseTenantScope({ orgId, workspaceId: "660e8400-e29b-41d4-a716-446655440001" });
    const wsB = parseTenantScope({ orgId, workspaceId: "770e8400-e29b-41d4-a716-446655440002" });
    await cache.setWorkspace(wsA, "status", "active");
    await cache.setWorkspace(wsB, "status", "dormant");
    expect(await cache.getWorkspace<string>(wsA, "status")).toBe("active");
    expect(await cache.getWorkspace<string>(wsB, "status")).toBe("dormant");
  });

  it("expires entries by TTL", async () => {
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await cache.setTenant(scope, "temp", "value", { ttlMs: 1 });
    await new Promise((r) => setTimeout(r, 5));
    expect(await cache.getTenant(scope, "temp")).toBeNull();
  });

  it("invalidates by tag", async () => {
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await cache.setTenant(scope, "a", 1, { tags: ["org-data"] });
    await cache.setTenant(scope, "b", 2, { tags: ["org-data"] });
    const provider = cache.provider as InMemoryCacheProvider;
    const removed = await provider.invalidateTags(["org-data"]);
    expect(removed).toBe(2);
  });

  it("reports metrics", async () => {
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await cache.getTenant(scope, "missing");
    await cache.setTenant(scope, "hit", true);
    await cache.getTenant(scope, "hit");
    const metrics = cache.getMetrics();
    expect(metrics.misses).toBe(1);
    expect(metrics.hits).toBe(1);
    expect(metrics.sets).toBe(1);
  });

  it("uses Redis adapter when injected", async () => {
    const store = new Map<string, string>();
    const client = {
      get: async (key: string) => store.get(key) ?? null,
      set: async (key: string, value: string) => {
        store.set(key, value);
      },
      del: async (...keys: string[]) => {
        let n = 0;
        for (const key of keys) {
          if (store.delete(key)) n += 1;
        }
        return n;
      },
      ping: async () => "PONG",
    };
    const redisCache = new CacheService({ provider: new RedisCacheProvider({ client }) });
    const scope = parseTenantScope({ orgId: "550e8400-e29b-41d4-a716-446655440000" });
    await redisCache.setTenant(scope, "redis-test", { ok: true });
    const value = await redisCache.getTenant<{ ok: boolean }>(scope, "redis-test");
    expect(value?.ok).toBe(true);
  });
});
