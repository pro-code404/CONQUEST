# Database Schema Verification — B2-M2

**Date:** 2026-06-28  
**Migration:** `packages/database/drizzle/0000_initial.sql`

---

## Table Inventory

### Cognitive infrastructure (7 tables)

| Table | Purpose | Key indexes |
|-------|---------|-------------|
| `sessions` | Cognitive pipeline session state | `sessions_user_idx` |
| `memory_entries` | Unified memory stores | `memory_store_key_idx`, `memory_user_idx` |
| `routing_stats` | Router statistics | `routing_task_domain_idx` |
| `evolution_records` | Evolution learning | — |
| `audit_logs` | Security audit (cognitive) | `audit_trace_idx` |
| `pipeline_executions` | Pipeline telemetry | `pipeline_request_idx` |
| `human_review_queue` | Human review queue | — |

### Auth domain (15 tables)

| Table | Purpose | FK / constraints |
|-------|---------|------------------|
| `auth_orgs` | Tenant root | — |
| `auth_users` | Identity | → `auth_orgs` CASCADE; UNIQUE `email` |
| `auth_server_sessions` | Cookie sessions | → `auth_users`, `auth_orgs` CASCADE |
| `auth_workspaces` | Workspaces | → `auth_orgs` CASCADE; UNIQUE `(org_id, slug)` |
| `auth_workspace_members` | Membership | PK `(workspace_id, user_id)` |
| `auth_scoped_documents` | Settings/feeds JSONB | UNIQUE `(scope_type, scope_id, document_key)` |
| `auth_tokens` | Verification/reset/invite | — |
| `auth_team_invites` | Workspace invites | → `auth_workspaces` CASCADE |
| `auth_org_invites` | Org invites | → `auth_orgs` CASCADE |
| `auth_workflows` | Automation definitions | → `auth_workspaces` CASCADE |
| `auth_executions` | Execution history | → `auth_workflows` CASCADE |
| `auth_research_sessions` | Research sessions | → `auth_workspaces` CASCADE |
| `auth_domain_audit_events` | Domain audit trail | → `auth_orgs` CASCADE |
| `auth_legal_acceptances` | GDPR/CCPA acceptance | → `auth_users` CASCADE |
| `auth_email_deliveries` | Email delivery audit | → org/user SET NULL |

---

## Index Rationale

| Index | Why |
|-------|-----|
| `auth_users_email_unique` | Login lookup by email — O(1) |
| `auth_users_org_idx` | `listUsersForOrg` — tenant scoped |
| `auth_server_sessions_user_idx` | `listSessionsForUser` |
| `auth_server_sessions_org_active_idx` | `countActiveSessionsForOrg` composite |
| `auth_server_sessions_device_idx` | Device revocation |
| `auth_workspaces_org_idx` | `listWorkspacesForOrg` |
| `auth_workspaces_org_slug_unique` | Slug uniqueness per org |
| `auth_scoped_documents_unique` | Upsert settings without duplicate rows |
| `auth_scoped_documents_scope_idx` | List all docs for scope |
| `auth_executions_workflow_idx` | Execution history sorted by `started_at` |
| `auth_domain_audit_org_ts_idx` | Activity log pagination |
| `auth_domain_audit_org_category_idx` | Category filter |

---

## Query Patterns Verified

| Operation | Approach | N+1 risk |
|-----------|----------|----------|
| List workspace members | JOIN `auth_users` | None |
| List workflows | Single query + archived filter | None |
| List executions | Indexed workflow_id + ORDER BY | None |
| Settings/preferences | Single scoped document read | None |
| Audit search with text | DB filter + in-memory search (limit 3×) | Acceptable at current scale |

---

## Tenant Isolation

- All workspace-scoped tables include `org_id` or FK to workspace → org chain
- `cognitiveScope()` verifies `session.orgId === workspace.orgId`
- Cascade deletes prevent orphan rows on org deletion

---

## Optimistic Concurrency

`auth_scoped_documents.version` increments on `onConflictDoUpdate` — foundation for conflict detection on concurrent settings updates.

---

## Performance Notes

- Scoped JSONB documents avoid 20+ narrow tables while preserving indexed hot paths
- Workflow/research JSONB stores full records — acceptable for current volume; normalize if query patterns emerge
- Connection pool: `max: 10` in `createDb()`

---

*Run migrations: `DATABASE_URL=... node -e "import('@conquest/database').then(m => m.runMigrations(process.env.DATABASE_URL))"`*
