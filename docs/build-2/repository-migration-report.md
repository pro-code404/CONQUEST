# Repository Migration Report — B2-M2

**Date:** 2026-06-28

---

## Migration Strategy

Incremental replacement behind `AuthRepository` interface — no destructive rewrite.

```
MemoryAuthRepository (sync, internal)
        ↓ wrapped by
AsyncMemoryAuthRepository  ← CI / MEMORY_REPO=true
        ↓ or
DrizzleAuthRepository      ← DATABASE_URL set
```

---

## Interface Extraction

**File:** `services/auth/src/auth-repository.ts`

- 80 async methods covering all domains
- Added methods not previously on memory repo:
  - `findOrg`, `deleteUser`, `updateSession`
  - `revokeSessionsForUserDevice`, `countActiveSessionsForOrg`

**Services updated:** 11 domain services now depend on `AuthRepository` only.

**Direct map access eliminated:**

| File | Before | After |
|------|--------|-------|
| `identity-service.ts` | `repo.orgs.get` | `await repo.findOrg` |
| `settings-service.ts` | `repo.orgs.get`, `repo.users.delete` | `findOrg`, `deleteUser` |
| `administration-service.ts` | map iteration | repository list/count methods |
| `security-service.ts` | `repo.sessions` loop | `revokeSessionsForUserDevice` |

---

## DrizzleAuthRepository Mapping

| Memory store | Postgres target |
|--------------|-----------------|
| `orgs` | `auth_orgs` |
| `users`, `usersByEmail` | `auth_users` (unique email index) |
| `sessions` | `auth_server_sessions` |
| `verificationTokens`, `passwordResetTokens`, `invites` | `auth_tokens` |
| `workspaces` | `auth_workspaces` |
| `workspaceMembers` | `auth_workspace_members` |
| `workspaceStatus` | scoped doc `workspace/status` |
| `preferences`, `mfa`, `trustedDevices`, etc. | scoped doc `user/*` |
| `billing`, `integrations`, `featureFlags`, etc. | scoped doc `org/*` |
| `intelligenceFeed`, `advisories`, `goals`, etc. | scoped doc `workspace/*` |
| `workflows` | `auth_workflows` (JSONB data) |
| `executions` | `auth_executions` |
| `researchSessions` | `auth_research_sessions` |
| `auditEvents` | `auth_domain_audit_events` |
| `teamInvites`, `orgInvites` | dedicated tables |

---

## Bootstrap Wiring

**API:** `apps/api/src/app.ts`
```typescript
export async function createApiApp(deps?: { repo?: AuthRepository }) {
  const repo = deps?.repo ?? (await createAuthRepository()).repo;
```

**Server:** `apps/api/src/server.ts` — top-level await, runs migrations on startup.

**Factory:** `services/auth/src/create-repository.ts`
- `MEMORY_REPO=true` → memory
- No `DATABASE_URL` → memory (CI default)
- `DATABASE_URL` set → Postgres + auto-migrate

---

## Rollback

Set `MEMORY_REPO=true` or unset `DATABASE_URL` — API reverts to in-memory with zero code changes.

---

## Test Coverage

| Suite | Count | Backend |
|-------|-------|---------|
| `auth-repository.contract.test.ts` | 4 | memory + optional postgres |
| Auth service unit tests | 37 | AsyncMemoryAuthRepository |
| `apps/api/src/app.test.ts` | 34 | AsyncMemoryAuthRepository |

---

## Not Yet Migrated

| Component | Notes |
|-----------|-------|
| `@conquest/platform` cognitive memory | Uses in-memory stores; `memory_entries` table exists |
| `services/session` SessionManager | Cognitive sessions separate from auth sessions |
| Email / legal tables | Schema only; no repository methods yet |

---

*Authoritative schema: [database-schema-verification.md](./database-schema-verification.md)*
