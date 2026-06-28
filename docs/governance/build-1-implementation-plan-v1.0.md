# Build-1 Implementation Plan v1.0

| Field | Value |
|-------|-------|
| **Phase** | Build-1 — Platform foundation (planning) |
| **Prerequisite** | Build-0 stabilization + separate Build-1 BAR |
| **Date** | 2026-06-21 |
| **Status** | **AUTHORIZATION PACKAGE PREPARED — NOT ISSUED** |

> This plan references the frozen architecture. It does not modify CCIS, AMD, PDD, UXMD, Document X, SDD, or ADRs.

---

## Purpose

Prepare the engineering roadmap for visible product construction after Build-0. Build-1 gates B-14–B-18 and B-29–B-30 are **complete** per [`build-1-authorization-package-v1.0.md`](build-1-authorization-package-v1.0.md). Awaiting Build-1 BAR signature.

---

## Build-1 scope (from SDD-V / RTM)

| Workstream | Authority | Deliverables |
|------------|-----------|--------------|
| **Application shell** | UXMD-II SHL-*; Document X Part 2 | Authenticated app shell, utility bar, nav |
| **Authentication** | UXMD-II PUB-02–07; SDD-III; ADR-0017 | Sign up, login, verify, MFA, session |
| **Workspace framework** | PDD-II Workspace; UXMD-I Part G; ADR-0003 | Workspace selector, context scoping |
| **Navigation** | UXMD-I §C.2; ADR-0005 | Seven-item primary nav frozen |
| **Routing** | UXMD-II Part A routes | `/app/w/:workspaceId/...` pattern |
| **Layouts** | UXMD-III Part 4; Document X Part 11 | Desktop, tablet, mobile breakpoints |
| **Design system / GIS** | UXMD-III; ADR-0012; ENG-23 | GIS tokens, states, permissions — not `packages/ui` prototype |
| **Shared UI foundation** | SDD-I L10 Presentation | Component library subordinate to GIS |
| **Application state** | SDD-I L9 Experience; GIS Part 1 | Global state inheritance |

---

## RTM rows (Build-1 target)

| Partition | Examples |
|-----------|----------|
| Part H — Platform | Tenant isolation, auth, session |
| Part D — Experience | Screen implementation traceability |
| RTM-MEM-004 | Workspace-scoped retrieval |

Full row list to be marked `In Build` at Build-1 BAR issuance.

---

## Prototype disposition (Build-1)

| Area | Action |
|------|--------|
| `packages/ui` | **Discard** — rebuild from UXMD-III GIS |
| `apps/gateway` | **Discard** — replace with authorized app shell |
| `packages/core` pipeline types | **Review for reuse** per prototype disposition |
| `services/auth`, `session` | **Rewrite** under ADR-0017 |

---

## Milestone sequence (proposed)

1. Monorepo layout realignment plan (SDD-V §2.1) — ADR if directory restructure
2. Presentation package scaffold (`presentation/` or `apps/web`)
3. GIS design tokens from UXMD-III (not prototype tokens)
4. App shell + routing (SHL-01–06)
5. Auth flows (PUB-02–07, ONB-01–06)
6. Workspace selector + context
7. Command Center shell (CC-01) — layout only, no intelligence
8. CI: ENG-23 a11y gate, ESLint boundaries (B-22–B-24)

---

## Gates required before Build-1 BAR

| Gate | Requirement |
|------|-------------|
| B-10 | Build-1 BAR (separate from Build-0) |
| B-14–B-18 | Threat model, tenant tests, DR, runbooks |
| B-29–B-30 | Observability scaffold |

---

## Progress measurement (Build-1+)

| Metric | Source |
|--------|--------|
| Implemented modules | PDD-II MSD |
| RTM rows Verified | RTM v1.1 |
| UXMD screens complete | UXMD-II (102) |
| Tests passing | CI |
| Integrated services | SDD-I topology |

---

*Build-1 plan v1.0 — planning only. No Build-1 authorization implied.*
