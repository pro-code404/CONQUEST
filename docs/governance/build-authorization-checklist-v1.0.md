# Conquest — Build Authorization Checklist v1.0

| Field | Value |
|-------|-------|
| **Authority** | [SDD-V Part 11 §11.1–11.2](../sdd/volume-v-engineering-standards-build-governance.md) |
| **Date** | 2026-06-21 |
| **Build status** | **Build-0 AUTHORIZED** — [BAR-2026-06-21-001](build-authorization-record-build-0-2026-06-21.md) |
| **Phase assessed** | Build-0 minimum gates |
| **Last package** | [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) |

> Evidence cited below. Re-verified 2026-06-21 for Engineering Transition Phase 0.

---

## Build-0 minimum gates (SDD-V §11.2)

**Required:** B-01–B-10, B-19–B-21 | **RTM scope:** RTM-INF-010

---

## Architecture & Documentation

| Gate | Requirement (SDD-V §11.1) | Status | Evidence / gap |
|------|---------------------------|--------|----------------|
| **B-01** | CCIS + frozen corpus current | **Complete** | Freeze v1.0; AMD I–IV; SDD-II v1.2; Document X v1.0 |
| **B-02** | SDD Volumes I–V approved | **Complete** | Review checklists — all APPROVED (92–95%) |
| **B-03** | RTM v1.1+ for Build-1 scope | **N/A Build-0** | RTM v1.1 exists (78 rows); not a Build-0 minimum gate |
| **B-04** | ADR-0001–0035 Accepted | **Complete** | `docs/architecture/adr/README.md` — 35 Accepted |
| **B-05** | AMD I–II in repository | **Complete** | `amd/volume-i-*`, `amd/volume-ii-*` committed 2026-06-26 |
| **B-06** | SDD-II v1.2 lifecycle errata | **Complete** | `volume-ii-data-intelligence-architecture.md` v1.2 — ADR-0007 aligned |
| **B-07** | PDD Authority Bridge active | **Complete** | `pdd-volume-i-authority-bridge.md` v1.0 |
| **B-08** | UXMD I–III + Document X approved | **Complete** | UXMD Final Review APPROVED FOR SDD; Document X v1.0 approved |
| **B-09** | GIS binding plan for Presentation | **Complete** (plan) | SDD-V ENG-23; ADR-0012; UXMD-III GIS — **CI enforcement not built** |
| **B-10** | Explicit Build Authorization issued | **Complete** | [`build-authorization-record-build-0-2026-06-21.md`](build-authorization-record-build-0-2026-06-21.md) |

---

## Engineering & Quality (Build-0)

| Gate | Requirement (SDD-V §11.1) | Status | Evidence / gap |
|------|---------------------------|--------|----------------|
| **B-19** | Repository structure approved | **Complete** — signature pending | [`repository-structure-approval-v1.0.md`](repository-structure-approval-v1.0.md); sign on BAR §7 |
| **B-20** | CI pipeline enforces ENG-12 | **Complete** (Build-0 scaffold) | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) |
| **B-21** | EL, IL, INF, AI law CI mapping | **Complete** (Build-0 scaffold) | [`ci-law-mapping.md`](ci-law-mapping.md) |

---

## Build-0 RTM row

| ID | Requirement | Status |
|----|-------------|--------|
| **RTM-INF-010** | Production readiness gate before deploy | **Specified** — INF-25 / ADR-0025 defined in SDD-III; gate checklist not operational |

---

## Phase-specific gates (not Build-0)

| Gate | Phase | Status |
|------|-------|--------|
| B-11 | Build-1+ | **Complete** — PDD-II v1.0 draft frozen |
| B-12 | Build-2 | **Remaining** — PDD-I v2.1 open (Authority Bridge §3) |
| B-13 | Build-1+ | **Remaining** — BH-1–BH-10 test plan not mapped to CI |
| B-14–B-18 | Build-1 | **Remaining** — threat model, tenant tests, DR, runbooks not operational |
| B-22–B-24 | Build-1+ | **Remaining** — contract tests, a11y gate, dependency policy |
| B-25–B-28 | Build-2 | **Remaining** — stage-order golden tests, VRF bypass tests, etc. |
| B-29–B-32 | Build-1 / Build-3 | **Remaining** — observability scaffold, kill switch, production gates |

---

## Summary

| Category | Count |
|----------|-------|
| **Build-0 Complete** | 13 (B-01–B-10, B-19–B-21) |
| **Build-0 Remaining — Blocking** | 0 |
| **Build-0 N/A** | 1 (B-03) |

### FAA P0 status

| ID | Status |
|----|--------|
| FAA-P0-01 (AMD I–II) | **Closed** 2026-06-26 |
| FAA-P0-02 (SDD-II errata) | **Closed** 2026-06-26 |

---

**Build-0 authorized 2026-06-21.** Build-1+ requires separate BAR.

---

*Checklist v1.0 — Re-verify after each closure. Source of truth: SDD-V Part 11.*
