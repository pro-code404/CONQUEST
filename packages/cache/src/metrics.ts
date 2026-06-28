import type { CacheMetricsCollector, CacheMetricsSnapshot } from "./types.js";

export function createCacheMetricsCollector(): CacheMetricsCollector {
  const state: CacheMetricsSnapshot = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    invalidations: 0,
  };

  return {
    recordHit() {
      state.hits += 1;
    },
    recordMiss() {
      state.misses += 1;
    },
    recordSet() {
      state.sets += 1;
    },
    recordDelete() {
      state.deletes += 1;
    },
    recordInvalidation(count: number) {
      state.invalidations += count;
    },
    snapshot() {
      return { ...state };
    },
  };
}
