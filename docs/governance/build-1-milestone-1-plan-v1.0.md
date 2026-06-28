# Build-1 Milestone 1 Plan v1.0

| Field | Value |
|-------|-------|
| **Phase** | Build-1 — Milestone 1 (first visible product) |
| **Prerequisite** | **Build-1 BAR issued** — [DRAFT BAR](build-authorization-record-build-1-DRAFT.md) |
| **Date** | 2026-06-26 |
| **Status** | **IN PROGRESS** — BAR-2026-06-26-001 issued |

> Progress measured by working software, RTM verification, passing tests, and UXMD/SDD compliance — not documentation volume.

---

## Objective

Establish the visible Conquest application foundation: authenticated shell, routing, GIS-backed UI, workspace context, and initial UXMD screens.

---

## Workstreams

| # | Workstream | Authority | Deliverable | RTM |
|---|------------|-----------|-------------|-----|
| M1.1 | **Monorepo realignment** | SDD-V §2.1 | `apps/web` (or `presentation/`) scaffold; remove quarantined gateway from build path | RTM-ENG-005 |
| M1.2 | **GIS design tokens** | UXMD-III; ADR-0012; ENG-23 | Token package from GIS — not `packages/ui` | RTM-UX-004, RTM-UX-008 |
| M1.3 | **Shared UI library** | SDD-I L10; GIS | Components subordinate to GIS states/permissions | RTM-UX-004, RTM-UX-005 |
| M1.4 | **Application shell** | UXMD-II SHL-*; Document X Part 2 | Utility bar, layout regions, responsive breakpoints | RTM-UX-001 |
| M1.5 | **Global routing** | UXMD-II Part A | `/app/w/:workspaceId/...` pattern; route guards | RTM-UX-010 |
| M1.6 | **Primary navigation** | UXMD-I §C.2; ADR-0005 | Seven-item nav — intelligence systems excluded | RTM-UX-002, RTM-PDD-001 |
| M1.7 | **Authentication framework** | UXMD-II PUB-02–07; ADR-0017 | Sign up, login, verify, session — rewrite `services/auth` | RTM-INF-006, RTM-UX-007 |
| M1.8 | **Workspace framework** | PDD-II; ADR-0003 | Selector, context provider, scope in API calls | RTM-UX-003, RTM-MEM-004 |
| M1.9 | **Dashboard shell** | UXMD CC-01 | Command Center layout — **no intelligence** | RTM-UX-001 |
| M1.10 | **Profile & Settings foundation** | UXMD SET-*; Document X | SET-01 shell, SET-03a MFA entry, profile routes | RTM-UX-005, RTM-UX-007 |
| M1.11 | **Initial UXMD screens** | UXMD-II priority set | PUB-02–07, ONB-01–06, SHL-01–06, CC-01 layout, SET-01 | Part G index |
| M1.12 | **CI expansion** | B-22–B-24 | ESLint layer boundaries; a11y gate on UI PRs; `pnpm audit` policy | RTM-UX-008 |

---

## Sequence

```
M1.1 Monorepo scaffold
  → M1.2 GIS tokens
    → M1.3 UI library
      → M1.4 Shell + M1.5 Routing (parallel)
        → M1.6 Nav + M1.7 Auth (parallel)
          → M1.8 Workspace
            → M1.9 Dashboard shell
              → M1.10 Settings + M1.11 Screens
                → M1.12 CI gates
```

---

## Prototype actions (first sprint)

| Path | Action |
|------|--------|
| `apps/gateway` | Remove from workspace or archive after `apps/web` scaffold |
| `packages/ui` | Stop building; replace with GIS package |
| `packages/core` | Retain pipeline types; add platform exports as needed |
| `services/auth`, `session` | Rewrite — do not extend prototype |

---

## Definition of done (Milestone 1)

| Criterion | Verification |
|-----------|--------------|
| User can sign up, log in, select workspace | E2E test |
| Seven-item nav renders; intelligence not in nav | Snapshot + RTM-PDD-001 |
| Command Center shell loads at home route | Route test RTM-UX-001 |
| GIS tokens drive all UI states | Visual regression / token audit |
| Tenant scope on API layer | TI-10+ from test plan |
| CI: build, typecheck, test, a11y scaffold | Green pipeline |
| RTM rows move toward `Verified` with test IDs | ENG-5 |

---

## Out of scope (Milestone 1)

- Cognitive pipeline / orchestrator wiring (Build-2)
- Memory manager implementation (Build-2)
- Ask Conquest intelligence UX (RTM-UX-009 — Build-2)
- Production deploy (Build-3)

---

## Architecture protection

Any deficiency discovered during implementation → ADR + governance process. No bypass of frozen CCIS, AMD, PDD, UXMD, SDD, or RTM.

---

*Executes immediately upon Build-1 BAR issuance. Not authorized until BAR §8 signed.*
