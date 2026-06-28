import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  integer,
  bigint,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * Auth-domain persistence — B2-M2.
 * Indexes documented inline; see docs/build-2/database-schema-verification.md
 */

/** Core tenant root — all org-scoped data cascades from here. */
export const authOrgs = pgTable(
  "auth_orgs",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [index("auth_orgs_created_idx").on(t.createdAt)],
);

/** Identity — email globally unique for login resolution. */
export const authUsers = pgTable(
  "auth_users",
  {
    id: uuid("id").primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    onboardingStage: text("onboarding_stage").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    passwordChangedAt: bigint("password_changed_at", { mode: "number" }),
    mfaEnrolled: boolean("mfa_enrolled").notNull().default(false),
  },
  (t) => [
    uniqueIndex("auth_users_email_unique").on(t.email),
    index("auth_users_org_idx").on(t.orgId),
  ],
);

/** Cookie sessions — distinct from cognitive pipeline `sessions` table. */
export const authServerSessions = pgTable(
  "auth_server_sessions",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    activeWorkspaceId: uuid("active_workspace_id"),
    authStrength: text("auth_strength").notNull(),
    deviceId: text("device_id").notNull(),
    expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
    revoked: boolean("revoked").notNull().default(false),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [
    index("auth_server_sessions_user_idx").on(t.userId),
    index("auth_server_sessions_org_active_idx").on(t.orgId, t.revoked, t.expiresAt),
    index("auth_server_sessions_device_idx").on(t.userId, t.deviceId),
  ],
);

export const authWorkspaces = pgTable(
  "auth_workspaces",
  {
    id: uuid("id").primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    workspaceType: text("workspace_type").notNull(),
    primaryGoal: text("primary_goal").notNull().default(""),
    archived: boolean("archived").notNull().default(false),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [
    index("auth_workspaces_org_idx").on(t.orgId),
    uniqueIndex("auth_workspaces_org_slug_unique").on(t.orgId, t.slug),
  ],
);

export const authWorkspaceMembers = pgTable(
  "auth_workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => authWorkspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.workspaceId, t.userId] }),
    index("auth_workspace_members_user_idx").on(t.userId),
  ],
);

/** JSONB document store for preferences, feeds, billing, etc. */
export const authScopedDocuments = pgTable(
  "auth_scoped_documents",
  {
    scopeType: text("scope_type").notNull(),
    scopeId: uuid("scope_id").notNull(),
    documentKey: text("document_key").notNull(),
    data: jsonb("data").notNull(),
    version: integer("version").notNull().default(1),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (t) => [
    uniqueIndex("auth_scoped_documents_unique").on(t.scopeType, t.scopeId, t.documentKey),
    index("auth_scoped_documents_scope_idx").on(t.scopeType, t.scopeId),
  ],
);

export const authTokens = pgTable(
  "auth_tokens",
  {
    token: text("token").primaryKey(),
    tokenType: text("token_type").notNull(),
    subjectId: uuid("subject_id"),
    payload: jsonb("payload"),
    expiresAt: bigint("expires_at", { mode: "number" }),
    consumed: boolean("consumed").notNull().default(false),
  },
  (t) => [index("auth_tokens_type_subject_idx").on(t.tokenType, t.subjectId)],
);

export const authTeamInvites = pgTable(
  "auth_team_invites",
  {
    id: uuid("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => authWorkspaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull(),
    inviterUserId: uuid("inviter_user_id").notNull(),
    inviterName: text("inviter_name").notNull(),
    token: text("token").notNull(),
    expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
  },
  (t) => [
    index("auth_team_invites_workspace_idx").on(t.workspaceId),
    uniqueIndex("auth_team_invites_token_unique").on(t.token),
  ],
);

export const authOrgInvites = pgTable(
  "auth_org_invites",
  {
    id: uuid("id").primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull(),
    inviterUserId: uuid("inviter_user_id").notNull(),
    inviterName: text("inviter_name").notNull(),
    token: text("token").notNull(),
    expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
  },
  (t) => [
    index("auth_org_invites_org_idx").on(t.orgId),
    uniqueIndex("auth_org_invites_token_unique").on(t.token),
  ],
);

export const authWorkflows = pgTable(
  "auth_workflows",
  {
    id: uuid("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => authWorkspaces.id, { onDelete: "cascade" }),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull(),
    archived: boolean("archived").notNull().default(false),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (t) => [index("auth_workflows_workspace_idx").on(t.workspaceId, t.archived)],
);

export const authExecutions = pgTable(
  "auth_executions",
  {
    id: uuid("id").primaryKey(),
    workflowId: uuid("workflow_id")
      .notNull()
      .references(() => authWorkflows.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id").notNull(),
    orgId: uuid("org_id").notNull(),
    data: jsonb("data").notNull(),
    startedAt: bigint("started_at", { mode: "number" }).notNull(),
  },
  (t) => [index("auth_executions_workflow_idx").on(t.workflowId, t.startedAt)],
);

export const authResearchSessions = pgTable(
  "auth_research_sessions",
  {
    id: uuid("id").primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => authWorkspaces.id, { onDelete: "cascade" }),
    orgId: uuid("org_id").notNull(),
    data: jsonb("data").notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (t) => [index("auth_research_sessions_workspace_idx").on(t.workspaceId)],
);

/** Domain audit trail — distinct from cognitive security audit_logs. */
export const authDomainAuditEvents = pgTable(
  "auth_domain_audit_events",
  {
    id: uuid("id").primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => authOrgs.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id"),
    data: jsonb("data").notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    category: text("category").notNull(),
  },
  (t) => [
    index("auth_domain_audit_org_ts_idx").on(t.orgId, t.timestamp),
    index("auth_domain_audit_org_category_idx").on(t.orgId, t.category),
    index("auth_domain_audit_workspace_idx").on(t.workspaceId),
  ],
);

/** Legal acceptance records — B2-M2 Slice 2F foundation. */
export const authLegalAcceptances = pgTable(
  "auth_legal_acceptances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    documentType: text("document_type").notNull(),
    documentVersion: text("document_version").notNull(),
    acceptedAt: bigint("accepted_at", { mode: "number" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (t) => [
    uniqueIndex("auth_legal_acceptance_unique").on(t.userId, t.documentType, t.documentVersion),
    index("auth_legal_acceptances_user_idx").on(t.userId),
  ],
);

/** Email delivery audit — B2-M2 Slice 2E foundation. */
export const authEmailDeliveries = pgTable(
  "auth_email_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id").references(() => authOrgs.id, { onDelete: "set null" }),
    userId: uuid("user_id").references(() => authUsers.id, { onDelete: "set null" }),
    emailType: text("email_type").notNull(),
    recipient: text("recipient").notNull(),
    status: text("status").notNull(),
    provider: text("provider"),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [
    index("auth_email_deliveries_user_idx").on(t.userId),
    index("auth_email_deliveries_type_status_idx").on(t.emailType, t.status),
  ],
);
