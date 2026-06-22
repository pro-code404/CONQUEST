import { eq, desc } from "drizzle-orm";
import type { ConquestDatabase } from "@conquest/database";
import { memoryEntries, evolutionRecords, MEMORY_STORES, type MemoryStore } from "@conquest/database";
import type { MemoryDelta, EvolutionRecord } from "@conquest/core";
import type { MemoryRetriever } from "@conquest/engines";

/** Memory Service — selective retrieval, compression, lifecycle management */
export class MemoryService implements MemoryRetriever {
  constructor(private readonly db: ConquestDatabase | null = null) {
    this.inMemory = new Map();
  }

  private readonly inMemory: Map<string, { store: string; key: string; value: unknown; confidence: number; summary: string }>;

  async retrieve(params: { query: string; userId?: string; projectId?: string; limit?: number }) {
    const limit = params.limit ?? 10;
    const queryLower = params.query.toLowerCase();

    if (this.db) {
      const rows = await this.db.select().from(memoryEntries)
        .where(params.userId ? eq(memoryEntries.userId, params.userId) : undefined)
        .orderBy(desc(memoryEntries.confidence))
        .limit(limit);
      return rows
        .filter((r) => JSON.stringify(r.value).toLowerCase().includes(queryLower.slice(0, 20)) || queryLower.length < 5)
        .map((r) => ({ id: r.id, store: r.store, summary: String((r.value as { summary?: string }).summary ?? r.key) }));
    }

    return [...this.inMemory.values()]
      .filter((e) => e.summary.toLowerCase().includes(queryLower.slice(0, 20)) || queryLower.length < 5)
      .slice(0, limit)
      .map((e, i) => ({ id: `mem-${i}`, store: e.store, summary: e.summary }));
  }

  async store(store: MemoryStore, key: string, value: unknown, confidence: number, userId?: string) {
    const summary = typeof value === "object" && value && "summary" in value
      ? String((value as { summary: string }).summary)
      : key;

    this.inMemory.set(`${store}:${key}`, { store, key, value, confidence, summary });

    if (this.db) {
      await this.db.insert(memoryEntries).values({ store, key, value, confidence, userId: userId ?? null });
    }
  }

  async applyDelta(delta: MemoryDelta, userId?: string) {
    for (const update of delta.stores) {
      if (update.operation === "upsert" && update.value != null) {
        await this.store(update.store as MemoryStore, update.key, update.value, update.confidence, userId);
      }
    }
  }

  async saveEvolutionRecord(record: EvolutionRecord) {
    if (this.db) {
      await this.db.insert(evolutionRecords).values({
        requestId: record.requestId,
        correlationId: record.correlationId,
        record,
        approved: record.approved,
        appliedAt: record.appliedAt ? new Date(record.appliedAt) : null,
      });
    }
  }

  getStores(): readonly string[] {
    return MEMORY_STORES;
  }
}
