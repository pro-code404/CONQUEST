# Database Health Report — Build-2 M3

**Date:** 2026-06-21  
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
| Duplicate tables | ✅ | None — 22 auth tables, no parallel models |
| Repository consistency | ✅ | `AuthRepository` (83 methods) implemented in Drizzle + memory |
| Query efficiency | ⚠️ | Audit list by org indexed; large workspace lists may need pagination cursors (P2) |

---

## Table inventory (22)

`auth_orgs`, `auth_users`, `auth_org_members`, `auth_workspaces`, `auth_workspace_members`, `auth_server_sessions`, `auth_devices`, `auth_email_verifications`, `auth_password_resets`, `auth_team_invites`, `auth_org_invites`, `auth_automation_rules`, `auth_automation_runs`, `auth_intelligence_items`, `auth_research_sessions`, `auth_recommendations`, `auth_audit_events`, `auth_settings`, `auth_legal_acceptances`, `auth_email_deliveries`, `auth_onboarding_state`, `auth_admin_actions`

---

## Index coverage

| Table | Index | Purpose |
|-------|-------|---------|
| `auth_server_sessions` | `session_id`, `user_id` | Session lookup |
| `auth_audit_events` | `org_id`, `created_at` | Audit trail queries |
| `auth_email_deliveries` | `user_id`, `org_id` | Delivery audit |
| `auth_workspaces` | `org_id` | Tenant workspace list |

---

## Recommendations (post-beta)

1. Add composite index on `(workspace_id, created_at)` for intelligence/research feeds at scale
2. Partition `auth_audit_events` when volume exceeds 10M rows
3. Run `EXPLAIN ANALYZE` on command-center dashboard queries under load

---

## Verification

- Contract tests: `services/auth/src/auth-repository.contract.test.ts` (memory + Postgres when reachable)
- Ready probe: `GET /api/health/ready` executes lightweight audit query
- Ops status: `GET /api/ops/status` reports `database.reachable`
