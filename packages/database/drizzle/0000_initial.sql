-- B2-M2 initial schema: cognitive infrastructure + auth domain persistence

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "state" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone
);
CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "sessions" ("user_id");

CREATE TABLE IF NOT EXISTS "memory_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "store" text NOT NULL,
  "key" text NOT NULL,
  "value" jsonb NOT NULL,
  "confidence" real DEFAULT 0.5 NOT NULL,
  "priority" integer DEFAULT 0 NOT NULL,
  "relationships" jsonb DEFAULT '[]'::jsonb,
  "version" integer DEFAULT 1 NOT NULL,
  "user_id" uuid,
  "project_id" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone
);
CREATE INDEX IF NOT EXISTS "memory_store_key_idx" ON "memory_entries" ("store", "key");
CREATE INDEX IF NOT EXISTS "memory_user_idx" ON "memory_entries" ("user_id");

CREATE TABLE IF NOT EXISTS "routing_stats" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "task_type" text NOT NULL,
  "domain" text NOT NULL,
  "engine" text NOT NULL,
  "accuracy" real DEFAULT 0 NOT NULL,
  "latency_p50_ms" real DEFAULT 0 NOT NULL,
  "cost_per_task" real DEFAULT 0 NOT NULL,
  "sample_size" integer DEFAULT 0 NOT NULL,
  "verification_pass_rate" real DEFAULT 0 NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "routing_task_domain_idx" ON "routing_stats" ("task_type", "domain");

CREATE TABLE IF NOT EXISTS "evolution_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "request_id" uuid NOT NULL,
  "correlation_id" uuid NOT NULL,
  "record" jsonb NOT NULL,
  "approved" boolean DEFAULT false NOT NULL,
  "applied_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "action" text NOT NULL,
  "resource" text NOT NULL,
  "details" jsonb,
  "trace_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "audit_trace_idx" ON "audit_logs" ("trace_id");

CREATE TABLE IF NOT EXISTS "pipeline_executions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "request_id" uuid NOT NULL,
  "correlation_id" uuid NOT NULL,
  "trace_id" text NOT NULL,
  "session_id" uuid NOT NULL,
  "status" text NOT NULL,
  "context" jsonb,
  "metrics" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone
);
CREATE INDEX IF NOT EXISTS "pipeline_request_idx" ON "pipeline_executions" ("request_id");

CREATE TABLE IF NOT EXISTS "human_review_queue" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" text NOT NULL,
  "payload" jsonb NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "resolved_at" timestamp with time zone
);

-- Auth domain (B2-M2)

CREATE TABLE IF NOT EXISTS "auth_orgs" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "created_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_orgs_created_idx" ON "auth_orgs" ("created_at");

CREATE TABLE IF NOT EXISTS "auth_users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" text NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
  "onboarding_complete" boolean DEFAULT false NOT NULL,
  "onboarding_stage" text NOT NULL,
  "display_name" text NOT NULL,
  "created_at" bigint NOT NULL,
  "password_changed_at" bigint,
  "mfa_enrolled" boolean DEFAULT false NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "auth_users_email_unique" ON "auth_users" ("email");
CREATE INDEX IF NOT EXISTS "auth_users_org_idx" ON "auth_users" ("org_id");

CREATE TABLE IF NOT EXISTS "auth_server_sessions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "auth_users"("id") ON DELETE CASCADE,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "active_workspace_id" uuid,
  "auth_strength" text NOT NULL,
  "device_id" text NOT NULL,
  "expires_at" bigint NOT NULL,
  "revoked" boolean DEFAULT false NOT NULL,
  "created_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_server_sessions_user_idx" ON "auth_server_sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "auth_server_sessions_org_active_idx" ON "auth_server_sessions" ("org_id", "revoked", "expires_at");
CREATE INDEX IF NOT EXISTS "auth_server_sessions_device_idx" ON "auth_server_sessions" ("user_id", "device_id");

CREATE TABLE IF NOT EXISTS "auth_workspaces" (
  "id" uuid PRIMARY KEY NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "workspace_type" text NOT NULL,
  "primary_goal" text DEFAULT '' NOT NULL,
  "archived" boolean DEFAULT false NOT NULL,
  "created_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_workspaces_org_idx" ON "auth_workspaces" ("org_id");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_workspaces_org_slug_unique" ON "auth_workspaces" ("org_id", "slug");

CREATE TABLE IF NOT EXISTS "auth_workspace_members" (
  "workspace_id" uuid NOT NULL REFERENCES "auth_workspaces"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "auth_users"("id") ON DELETE CASCADE,
  PRIMARY KEY ("workspace_id", "user_id")
);
CREATE INDEX IF NOT EXISTS "auth_workspace_members_user_idx" ON "auth_workspace_members" ("user_id");

CREATE TABLE IF NOT EXISTS "auth_scoped_documents" (
  "scope_type" text NOT NULL,
  "scope_id" uuid NOT NULL,
  "document_key" text NOT NULL,
  "data" jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "updated_at" bigint NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "auth_scoped_documents_unique" ON "auth_scoped_documents" ("scope_type", "scope_id", "document_key");
CREATE INDEX IF NOT EXISTS "auth_scoped_documents_scope_idx" ON "auth_scoped_documents" ("scope_type", "scope_id");

CREATE TABLE IF NOT EXISTS "auth_tokens" (
  "token" text PRIMARY KEY NOT NULL,
  "token_type" text NOT NULL,
  "subject_id" uuid,
  "payload" jsonb,
  "expires_at" bigint,
  "consumed" boolean DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_tokens_type_subject_idx" ON "auth_tokens" ("token_type", "subject_id");

CREATE TABLE IF NOT EXISTS "auth_team_invites" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "auth_workspaces"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "role" text NOT NULL,
  "inviter_user_id" uuid NOT NULL,
  "inviter_name" text NOT NULL,
  "token" text NOT NULL,
  "expires_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_team_invites_workspace_idx" ON "auth_team_invites" ("workspace_id");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_team_invites_token_unique" ON "auth_team_invites" ("token");

CREATE TABLE IF NOT EXISTS "auth_org_invites" (
  "id" uuid PRIMARY KEY NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "role" text NOT NULL,
  "inviter_user_id" uuid NOT NULL,
  "inviter_name" text NOT NULL,
  "token" text NOT NULL,
  "expires_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_org_invites_org_idx" ON "auth_org_invites" ("org_id");
CREATE UNIQUE INDEX IF NOT EXISTS "auth_org_invites_token_unique" ON "auth_org_invites" ("token");

CREATE TABLE IF NOT EXISTS "auth_workflows" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "auth_workspaces"("id") ON DELETE CASCADE,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "data" jsonb NOT NULL,
  "archived" boolean DEFAULT false NOT NULL,
  "updated_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_workflows_workspace_idx" ON "auth_workflows" ("workspace_id", "archived");

CREATE TABLE IF NOT EXISTS "auth_executions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workflow_id" uuid NOT NULL REFERENCES "auth_workflows"("id") ON DELETE CASCADE,
  "workspace_id" uuid NOT NULL,
  "org_id" uuid NOT NULL,
  "data" jsonb NOT NULL,
  "started_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_executions_workflow_idx" ON "auth_executions" ("workflow_id", "started_at");

CREATE TABLE IF NOT EXISTS "auth_research_sessions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "auth_workspaces"("id") ON DELETE CASCADE,
  "org_id" uuid NOT NULL,
  "data" jsonb NOT NULL,
  "updated_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_research_sessions_workspace_idx" ON "auth_research_sessions" ("workspace_id");

CREATE TABLE IF NOT EXISTS "auth_domain_audit_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "org_id" uuid NOT NULL REFERENCES "auth_orgs"("id") ON DELETE CASCADE,
  "workspace_id" uuid,
  "data" jsonb NOT NULL,
  "timestamp" bigint NOT NULL,
  "category" text NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_domain_audit_org_ts_idx" ON "auth_domain_audit_events" ("org_id", "timestamp");
CREATE INDEX IF NOT EXISTS "auth_domain_audit_org_category_idx" ON "auth_domain_audit_events" ("org_id", "category");
CREATE INDEX IF NOT EXISTS "auth_domain_audit_workspace_idx" ON "auth_domain_audit_events" ("workspace_id");

CREATE TABLE IF NOT EXISTS "auth_legal_acceptances" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "auth_users"("id") ON DELETE CASCADE,
  "document_type" text NOT NULL,
  "document_version" text NOT NULL,
  "accepted_at" bigint NOT NULL,
  "ip_address" text,
  "user_agent" text
);
CREATE UNIQUE INDEX IF NOT EXISTS "auth_legal_acceptance_unique" ON "auth_legal_acceptances" ("user_id", "document_type", "document_version");
CREATE INDEX IF NOT EXISTS "auth_legal_acceptances_user_idx" ON "auth_legal_acceptances" ("user_id");

CREATE TABLE IF NOT EXISTS "auth_email_deliveries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "org_id" uuid REFERENCES "auth_orgs"("id") ON DELETE SET NULL,
  "user_id" uuid REFERENCES "auth_users"("id") ON DELETE SET NULL,
  "email_type" text NOT NULL,
  "recipient" text NOT NULL,
  "status" text NOT NULL,
  "provider" text,
  "provider_message_id" text,
  "error_message" text,
  "created_at" bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS "auth_email_deliveries_user_idx" ON "auth_email_deliveries" ("user_id");
CREATE INDEX IF NOT EXISTS "auth_email_deliveries_type_status_idx" ON "auth_email_deliveries" ("email_type", "status");
