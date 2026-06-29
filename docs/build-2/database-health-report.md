# Database Health Report — Build-2 M4

**Date:** 2026-06-21 (updated Recovery Phase 2)  
**Schema:** `packages/database/drizzle/0000_initial.sql`  
**ORM:** Drizzle (`packages/database/src/auth-schema.ts`)

---

## Summary

| Check | Status | Notes |
|-------|--------|-------|
| Migration integrity | ✅ | Single migration `0000_initial.sql`; journal synced |
| Foreign keys | ✅ | All auth tables reference `auth_orgs`, `auth_users`, or parent entities |
| Cascade rules | ✅ | Session/device revocation uses explicit updates; no orphan FK violations in contract tests |
| Indexes | ✅ | Email, session, workspace, audit event indexes present |
| Duplicate tables | ✅ | None — 15 `pgTable` exports, no parallel models |
| Repository consistency | ✅ | `AuthRepository` implemented in Drizzle + memory (CI fallback) |
| Live API path | ✅ | `DATABASE_URL` → `DrizzleAuthRepository`; `MEMORY_REPO=true` in CI |
| Query efficiency | ⚠️ | Audit list by org indexed; large workspace lists may need pagination cursors (P2) |

---

## Table inventory (15)

| Table | Purpose |
|-------|---------|
| `auth_orgs` | Tenant organizations |
| `auth_users` | User identity |
| `auth_server_sessions` | Durable session store |
| `auth_workspaces` | Workspace entities |
| `auth_workspace_members` | Workspace membership |
| `auth_scoped_documents` | Scoped document metadata |
| `auth_tokens` | Verification, reset, MFA tokens |
| `auth_team_invites` | Team invitations |
| `auth_org_invites` | Org invitations |
| `auth_workflows` | Automation workflow definitions |
| `auth_executions` | Automation execution records (audit-only until M5) |
| `auth_research_sessions` | Research sessions |
| `auth_domain_audit_events` | Domain audit trail |
| `auth_legal_acceptances` | Legal acceptance versioning |
| `auth_email_deliveries` | Email delivery audit |

> **Note:** Earlier reports referenced 22 tables including `auth_automation_rules`, `auth_intelligence_items`, and `auth_settings`. The current schema consolidates automation into `auth_workflows` / `auth_executions` and stores settings as scoped documents.

---

## Index coverage

| Table | Index | Purpose |
|-------|-------|---------|
| `auth_server_sessions` | `session_id`, `user_id` | Session lookup |
| `auth_domain_audit_events` | `org_id`, `created_at` | Audit trail queries |
| `auth_email_deliveries` | `user_id`, `org_id` | Delivery audit |
| `auth_workspaces` | `org_id` | Tenant workspace list |

---

## Recommendations (post-beta)

1. Add composite index on `(workspace_id, created_at)` for intelligence/research feeds at scale
2. Partition `auth_domain_audit_events` when volume exceeds 10M rows
3. Run `EXPLAIN ANALYZE` on command-center dashboard queries under load
4. Evaluate Postgres RLS policies for defense-in-depth (B2-P1-02)

---

## Verification

- Contract tests: `services/auth/src/auth-repository.contract.test.ts` (memory + Postgres when reachable)
- Ready probe: `GET /api/health/ready` executes lightweight audit query
- Ops status: `GET /api/ops/status` reports `database.reachable`
- Degradation: `GET /api/ops/degradation` includes database probe (M4)
