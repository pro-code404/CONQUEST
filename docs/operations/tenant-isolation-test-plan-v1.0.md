# Tenant Isolation Test Plan v1.0

| Field | Value |
|-------|-------|
| **Gate** | B-15 — Tenant isolation test plan |
| **Law** | INF-1 |
| **RTM** | RTM-INF-001, RTM-MEM-004, RTM-ENG-002 |
| **Date** | 2026-06-26 |
| **Status** | **ACTIVE** |

## Objective

Verify organization (`org_id`) is the hard tenant boundary at every persistence, API, and storage path per ADR-0016.

## Test tiers

| Tier | When | Method |
|------|------|--------|
| **T1 — Unit** | CI on every PR | `packages/core` tenant scope helpers |
| **T2 — Service** | Build-1 Milestone 1+ | Auth/session reject cross-org token |
| **T3 — Integration** | Build-1 Milestone 2+ | API penetration: org A token → org B resource → 403 |
| **T4 — Storage** | Build-1 Milestone 3+ | DB query audit: all paths include `org_id` |
| **T5 — Events** | Build-2 | Cross-org event injection denied (RTM-ENG-002) |

## T1 cases (implemented)

| ID | Case | Expected |
|----|------|----------|
| TI-01 | Same-org access | Pass |
| TI-02 | Cross-org `assertOrgAccess` | `TenantIsolationError` |
| TI-03 | Storage key includes org prefix | `org:{uuid}/...` |
| TI-04 | Invalid org UUID rejected | Zod parse error |

## T2–T5 cases (Build-1 implementation)

| ID | Case | Owner |
|----|------|-------|
| TI-10 | Session org matches resource org | Auth service |
| TI-11 | Workspace scope within org only | Gateway |
| TI-12 | List endpoints never leak cross-org IDs | All services |
| TI-13 | Backup restore org-partitioned | Ops (DR plan) |

## CI mapping

- `packages/core/src/security/tenant-scope.test.ts` — TI-01–TI-04
- Expand per milestone in `build-1-milestone-1-plan-v1.0.md`

## Evidence

| Artifact | Path |
|----------|------|
| ADR | `docs/architecture/adr/0016-tenant-isolation-strategy.md` |
| Implementation | `packages/core/src/security/tenant-scope.ts` |

---

*Test plan for B-15. Execution evidence accumulates during Build-1.*
