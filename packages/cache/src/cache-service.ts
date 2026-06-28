import type { TenantScope } from "@conquest/core";
import { buildPlatformCacheKey, buildTenantCacheKey, buildWorkspaceCacheKey } from "./keys.js";
import type { CacheMetricsCollector, CacheProvider, CacheSetOptions } from "./types.js";
import { createCacheMetricsCollector } from "./metrics.js";

export interface CacheServiceOptions {
  provider: CacheProvider;
  metrics?: CacheMetricsCollector;
}

/**
 * Tenant-aware cache facade — all callers use scoped keys, never raw Redis keys.
 */
export class CacheService {
  private readonly metrics: CacheMetricsCollector;

  constructor(private readonly options: CacheServiceOptions) {
    this.metrics = options.metrics ?? createCacheMetricsCollector();
  }

  get provider(): CacheProvider {
    return this.options.provider;
  }

  getMetrics(): ReturnType<CacheMetricsCollector["snapshot"]> {
    return this.metrics.snapshot();
  }

  async getTenant<T>(scope: TenantScope, segment: string): Promise<T | null> {
    const key = buildTenantCacheKey(scope, segment);
    const value = await this.options.provider.get<T>(key);
    if (value === null) this.metrics.recordMiss();
    else this.metrics.recordHit();
    return value;
  }

  async setTenant<T>(scope: TenantScope, segment: string, value: T, options?: CacheSetOptions): Promise<void> {
    const key = buildTenantCacheKey(scope, segment);
    await this.options.provider.set(key, value, options);
    this.metrics.recordSet();
  }

  async getWorkspace<T>(scope: TenantScope, segment: string): Promise<T | null> {
    const key = buildWorkspaceCacheKey(scope, segment);
    const value = await this.options.provider.get<T>(key);
    if (value === null) this.metrics.recordMiss();
    else this.metrics.recordHit();
    return value;
  }

  async setWorkspace<T>(scope: TenantScope, segment: string, value: T, options?: CacheSetOptions): Promise<void> {
    const key = buildWorkspaceCacheKey(scope, segment);
    await this.options.provider.set(key, value, options);
    this.metrics.recordSet();
  }

  async getPlatform<T>(segment: string): Promise<T | null> {
    const key = buildPlatformCacheKey(segment);
    const value = await this.options.provider.get<T>(key);
    if (value === null) this.metrics.recordMiss();
    else this.metrics.recordHit();
    return value;
  }

  async setPlatform<T>(segment: string, value: T, options?: CacheSetOptions): Promise<void> {
    const key = buildPlatformCacheKey(segment);
    await this.options.provider.set(key, value, options);
    this.metrics.recordSet();
  }

  async invalidateTenant(scope: TenantScope, tag: string): Promise<number> {
    const scopedTag = buildTenantCacheKey(scope, `tag:${tag}`);
    const count = await this.options.provider.invalidateTags([scopedTag]);
    this.metrics.recordInvalidation(count);
    return count;
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    return this.options.provider.healthCheck();
  }
}
