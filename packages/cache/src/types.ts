/** Cache provider contract — Phase 8A. Swappable backends (memory, Redis). */

export interface CacheSetOptions {
  ttlMs?: number;
  tags?: string[];
}

export interface CacheProvider {
  readonly name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<boolean>;
  invalidateTags(tags: string[]): Promise<number>;
  clear(): Promise<void>;
  healthCheck(): Promise<{ healthy: boolean; details?: string }>;
}

export interface CacheMetricsSnapshot {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  invalidations: number;
}

export interface CacheMetricsCollector {
  recordHit(): void;
  recordMiss(): void;
  recordSet(): void;
  recordDelete(): void;
  recordInvalidation(count: number): void;
  snapshot(): CacheMetricsSnapshot;
}
