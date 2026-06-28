# Build-1 Authorization Package v1.0

| Field | Value |
|-------|-------|
| **Phase** | Build-1 — Platform foundation |
| **Prerequisite** | Build-0 COMPLETE — [completion report](build-0-completion-report-v1.0.md) |
| **Date** | 2026-06-26 |
| **Status** | **ISSUED** — [BAR-2026-06-26-001](build-authorization-record-build-1-2026-06-26.md) |
| **Authority** | SDD-V Part 11 §11.2–11.3; Architecture Freeze v1.0 |
| **Purpose** | Complete package for Build-1 BAR review — **does not authorize Build-1** |

---

## Package contents

| # | Artifact | Path |
|---|----------|------|
| 1 | Build-1 gate verification | §1 below |
| 2 | Remaining risk assessment | §2 below |
| 3 | RTM coverage confirmation | §3 below |
| 4 | ADR consistency confirmation | §4 below |
| 5 | CI readiness confirmation | §5 below |
| 6 | Engineering readiness confirmation | §6 below |
| 7 | Recommendation | §7 below |
| 8 | Draft BAR (for signature) | [`build-authorization-record-build-1-DRAFT.md`](build-authorization-record-build-1-DRAFT.md) |
| 9 | Milestone 1 plan (executes on BAR) | [`build-1-milestone-1-plan-v1.0.md`](build-1-milestone-1-plan-v1.0.md) |

---

# §1 — Build-1 gate verification

**Method:** Cross-check SDD-V §11.1 gates against repository evidence. Build-0 gates inherited from [BAR-2026-06-21-001](build-authorization-record-build-0-2026-06-21.md).

## Inherited gates (Build-0 — remain valid)

| Gate | Status | Evidence |
|------|--------|----------|
| B-01–B-10 | **Complete** | Build-0 BAR; frozen corpus |
| B-11 | **Complete** | PDD-II v1.0 draft frozen |
| B-19–B-21 | **Complete** | Structure approval; CI; law mapping |

## Build-1 additional gates (SDD-V §11.2)

| Gate | Requirement | Status | Evidence |
|------|-------------|--------|----------|
| **B-03** | RTM v1.1+ for Build-1 scope | **Complete** | RTM v1.1 — 78 rows; Part H Build-1 partition defined |
| **B-14** | Threat model reviewed | **Complete** | SDD-III Part 8.1 + [`../operations/threat-model-review-v1.0.md`](../operations/threat-model-review-v1.0.md) |
| **B-15** | Tenant isolation test plan | **Complete** | [`../operations/tenant-isolation-test-plan-v1.0.md`](../operations/tenant-isolation-test-plan-v1.0.md); T1 tests in CI |
| **B-16** | Secrets custody design | **Complete** | ADR-0019 Accepted; SDD-III Part 5; ENG-10 CI |
| **B-17** | DR drill plan | **Complete** | ADR-0021 + [`../operations/dr-drill-plan-v1.0.md`](../operations/dr-drill-plan-v1.0.md) |
| **B-18** | Incident runbooks drafted | **Complete** | [`../operations/runbooks/`](../operations/runbooks/) — SEV-1–4 per ADR-0024 |
| **B-29** | Observability scaffold | **Complete** | ADR-0023; `packages/observability` — trace context, telemetry, health |
| **B-30** | Kill switch operational | **Complete** | INF-22; `packages/config/src/kill-switch.ts` + tests + runbook index |

## Build-1 planned (not BAR-blocking)

| Gate | Status | Notes |
|------|--------|-------|
| B-13 | Remaining | BH-1–BH-10 CI mapping — Milestone 1+ |
| B-22–B-24 | Remaining | Contract tests, a11y gate, dependency policy — Milestone 1 §8 |
| B-12 | N/A Build-1 | PDD-I v2.1 — Build-2 |
| B-25–B-28 | N/A Build-1 | Intelligence — Build-2 |
| B-31–B-32 | N/A Build-1 | Production gates — Build-3 |

**Build-1 minimum gates: 8/8 complete (B-14–B-18, B-29–B-30).**

---

# §2 — Remaining risk assessment

| Risk | Severity | Mitigation | Phase |
|------|----------|------------|-------|
| Prototype code misalignment | Medium | Discard `apps/gateway`, `packages/ui` per disposition | Milestone 1 |
| B-22–B-24 not yet in CI | Medium | ESLint boundaries, a11y, audit in Milestone 1 | Build-1 |
| DR drills not executed in prod | Low | Tabletop scheduled; full drill before INF-25 | Build-3 |
| Kill switch ops console UI | Low | Env + registry API sufficient for Build-1 scaffold | Milestone 2+ |
| Nested pnpm `node_modules` duplication | Low | Monitor hoisting; no functional impact | Ongoing |
| PDD-I v2.1 open | Low for Build-1 | Authority Bridge §3 — Build-2 blocker only | Build-2 |

**No P0 risks blocking Build-1 BAR issuance.**

---

# §3 — RTM coverage confirmation

## Build-1 authorized row set (upon BAR issuance)

Per RTM Part H and Build-1 scope. Status transitions to `In Build` at BAR signature (ENG-5).

### Part D — Experience (Build-1)

| RTM ID | Description |
|--------|-------------|
| RTM-UX-001 | Command Center is home |
| RTM-UX-002 | Seven-item primary navigation |
| RTM-UX-003 | Workspace selector in utility bar |
| RTM-UX-004 | GIS global states inherited |
| RTM-UX-005 | RBAC hierarchy |
| RTM-UX-006 | Fail closed on permission denial |
| RTM-UX-007 | MFA enrollment SET-03a |
| RTM-UX-008 | WCAG 2.2 AA binding |
| RTM-UX-010 | Route guards auth/onboarding/workspace |

### Part C — Product (Build-1 subset)

| RTM ID | Description |
|--------|-------------|
| RTM-PDD-001 | Intelligence invisible in nav |
| RTM-PDD-002 | Degraded state explicit |
| RTM-PDD-003 | Empty workspace honestly empty |
| RTM-PDD-007 | Billing never alters intelligence |

### Part B — Memory (Build-1 subset)

| RTM ID | Description |
|--------|-------------|
| RTM-MEM-004 | Workspace-scoped retrieval |
| RTM-MEM-008 | Retention classes R0–R5 |

### Part E — Engineering (Build-1 subset)

| RTM ID | Description |
|--------|-------------|
| RTM-ENG-001 | Event-driven decoupling |
| RTM-ENG-002 | Cross-org events forbidden |
| RTM-ENG-005 | Module bounded contexts |
| RTM-ENG-007 | IL laws (scaffold enforcement) |
| RTM-ENG-008 | Correlation ID on events |
| RTM-ENG-009 | Circuit breaker per provider |
| RTM-ENG-010 | Platform services Auth/Notifications/Billing |

### Part F — Infrastructure (Build-1)

| RTM ID | Description |
|--------|-------------|
| RTM-INF-001 | Organization tenant isolation |
| RTM-INF-002 | Zero trust between zones |
| RTM-INF-003 | Secrets never in client |
| RTM-INF-004 | Encryption at rest |
| RTM-INF-005 | Encryption in transit |
| RTM-INF-006 | Session rotation and revocation |
| RTM-INF-007 | Key rotation |
| RTM-INF-008 | RTO/RPO tier classes |
| RTM-INF-012 | Rate limiting |
| RTM-INF-013 | Incident response runbooks |
| RTM-INF-014 | Kill switches |
| RTM-INF-015 | Backup encryption and restore |

**Coverage:** 32 RTM rows in Build-1 scope. All `Specified` in RTM v1.1 — ready for `In Build` transition.

**Out of scope (Build-1 BAR):** RTM-INT-* (Build-2), RTM-UX-009 (Build-2), RTM-PDD-004–006 (Build-2).

---

# §4 — ADR consistency confirmation

| ADR | Build-1 relevance | Consistency |
|-----|---------------------|-------------|
| ADR-0003 | Workspace scoping | ✅ No conflict |
| ADR-0005 | Seven-item nav | ✅ UXMD-I aligned |
| ADR-0012 | GIS binding | ✅ UXMD-III authoritative |
| ADR-0014 | Module boundaries | ✅ Milestone 1 enforces |
| ADR-0016 | Tenant isolation | ✅ Test plan + code |
| ADR-0017 | Auth architecture | ✅ Rewrite in Milestone 1 |
| ADR-0019 | Secrets custody | ✅ B-16 evidence |
| ADR-0021 | DR strategy | ✅ Drill plan |
| ADR-0023 | Observability | ✅ Scaffold implemented |
| ADR-0024 | Incident response | ✅ Runbooks |
| ADR-0025 | Production gate | ✅ Not Build-1 scope |

**No ADR amendments required for Build-1 authorization.**

---

# §5 — CI readiness confirmation

| Check | Status | Evidence |
|-------|--------|----------|
| `pnpm install --frozen-lockfile` | ✅ | Build-0 verification |
| `pnpm build` | ✅ | 11 packages/services |
| `pnpm typecheck` | ✅ | All workspace packages |
| `pnpm test` | ✅ | Root Vitest — includes B-15, B-29, B-30 unit evidence |
| Governance job | ✅ | Frozen corpus + BAR checks |
| Build-0 BAR present | ✅ | BAR-2026-06-21-001 |

**CI ready for Build-1.** Milestone 1 adds ESLint boundaries (B-22) and a11y gate (B-23) without blocking BAR.

---

# §6 — Engineering readiness confirmation

| Area | Status | Evidence |
|------|--------|----------|
| Monorepo / pnpm workspace | ✅ | 13 projects; `pnpm verify:build-0` |
| Observability scaffold | ✅ | `packages/observability` — INF-12 trace context |
| Kill switches | ✅ | `packages/config` — INF-22 registry |
| Tenant isolation primitives | ✅ | `packages/core/src/security/tenant-scope.ts` |
| Ops documentation | ✅ | `docs/operations/` |
| Prototype disposition | ✅ | Quarantine; discard plan in Milestone 1 |

**Engineering foundation ready for visible application construction.**

---

# §7 — Recommendation

## Verdict: **RECOMMEND BUILD-1 AUTHORIZATION**

All SDD-V §11.2 Build-1 minimum gates (B-14–B-18, B-29–B-30) are satisfied with documented evidence and minimal engineering scaffolds. Build-0 remains complete. Frozen architecture is consistent.

## Required human action

1. Review this package and [`build-authorization-record-build-1-DRAFT.md`](build-authorization-record-build-1-DRAFT.md).
2. Sign BAR §7 to **issue** Build-1 authorization.
3. Upon issuance, execute [`build-1-milestone-1-plan-v1.0.md`](build-1-milestone-1-plan-v1.0.md) — no feature work before BAR signature.

## Prohibited until BAR issued

- UXMD screen implementation
- Discarding prototype without Milestone 1 plan
- RTM status changes (ENG-5 — at BAR signature only)

---

*Build-1 Authorization Package v1.0 — prepared 2026-06-26. Not an authorization act.*
