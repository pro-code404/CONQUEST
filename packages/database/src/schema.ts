import { pgTable, uuid, text, timestamp, jsonb, real, integer, boolean, index } from "drizzle-orm/pg-core";

/** Session state — SDD-II / ADR-0017 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  state: jsonb("state").notNull().default({}),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (t) => [index("sessions_user_idx").on(t.userId)]);

/** Unified memory stores — AMD III / SDD-II Part 8 */
export const memoryEntries = pgTable("memory_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  store: text("store").notNull(),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  confidence: real("confidence").notNull().default(0.5),
  priority: integer("priority").notNull().default(0),
  relationships: jsonb("relationships").default([]),
  version: integer("version").notNull().default(1),
  userId: uuid("user_id"),
  projectId: uuid("project_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
}, (t) => [
  index("memory_store_key_idx").on(t.store, t.key),
  index("memory_user_idx").on(t.userId),
]);

/** Self-correcting router statistics */
export const routingStats = pgTable("routing_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskType: text("task_type").notNull(),
  domain: text("domain").notNull(),
  engine: text("engine").notNull(),
  accuracy: real("accuracy").notNull().default(0),
  latencyP50Ms: real("latency_p50_ms").notNull().default(0),
  costPerTask: real("cost_per_task").notNull().default(0),
  sampleSize: integer("sample_size").notNull().default(0),
  verificationPassRate: real("verification_pass_rate").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("routing_task_domain_idx").on(t.taskType, t.domain)]);

/** Evolution records — how-conquest-evolves.md */
export const evolutionRecords = pgTable("evolution_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull(),
  correlationId: uuid("correlation_id").notNull(),
  record: jsonb("record").notNull(),
  approved: boolean("approved").notNull().default(false),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Audit log — security model */
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  details: jsonb("details"),
  traceId: text("trace_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("audit_trace_idx").on(t.traceId)]);

/** Pipeline execution telemetry */
export const pipelineExecutions = pgTable("pipeline_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull(),
  correlationId: uuid("correlation_id").notNull(),
  traceId: text("trace_id").notNull(),
  sessionId: uuid("session_id").notNull(),
  status: text("status").notNull(),
  context: jsonb("context"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (t) => [index("pipeline_request_idx").on(t.requestId)]);

/** Human review queue for evolution changes requiring approval */
export const humanReviewQueue = pgTable("human_review_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const MEMORY_STORES = [
  "working", "conversation", "user", "project", "knowledge",
  "workflow", "correction", "tool", "pattern", "performance",
  "reflection", "optimization",
] as const;

export type MemoryStore = (typeof MEMORY_STORES)[number];
