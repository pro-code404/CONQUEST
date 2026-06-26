# Repository Transition Summary v1.0

| Field | Value |
|-------|-------|
| **Date** | 2026-06-26 |
| **Authority** | Approved repository transition per alignment report |
| **Build status** | **NOT AUTHORIZED** |

---

## 1. Transition summary

The repository has been aligned from historical prototype state to **architecture-governed** state:

- Frozen documentation corpus is the sole authoritative architecture reference
- Legacy and superseded material archived under `docs/archive/`
- Entry points (README, AGENTS, indexes, Cursor rules) reference one authority chain
- Prototype code quarantined via `PROTOTYPE.md` — not removed
- Build-0 governance scaffold added (CI, law mapping, structure approval doc)

**No new architecture documents were introduced.**

---

## 2. Files archived

| From | To |
|------|-----|
| `docs/pdd/product-design-document.md` | `docs/archive/pdd/product-design-document-v1.0-superseded.md` |
| `docs/sdd/system-design-document.md` | `docs/archive/sdd/system-design-document-v2.0-superseded.md` |
| `docs/sdd/sdd-volume-i-review-checklist.md` | `docs/archive/sdd/reviews/sdd-volume-i-review-checklist-v1.0-superseded.md` |
| `docs/sdd/sdd-volume-ii-review-checklist.md` | `docs/archive/sdd/reviews/sdd-volume-ii-review-checklist-v1.0-superseded.md` |
| `docs/IMPLEMENTATION.md` (original) | `docs/archive/prototype/IMPLEMENTATION-pre-build-wsdd-era.md` |
| `docs/design/` (entire folder) | `docs/archive/design-pre-uxmd/` |
| `docs/governance/repository-audit-v1.0.md` | `docs/archive/governance/repository-audit-v1.0-superseded.md` |

Index: [`docs/archive/README.md`](../archive/README.md)

---

## 3. Files updated

| File | Change |
|------|--------|
| `README.md` | Frozen corpus first; prototype quarantined |
| `AGENTS.md` | ADR-0001 authority chain; UXMD reference |
| `PROTOTYPE.md` | **Created** — quarantine declaration |
| `docs/IMPLEMENTATION.md` | **Replaced** with build-not-authorized stub |
| `docs/pdd/README.md` | Archive links; removed interim PDD |
| `docs/sdd/README.md` | SDD-II v1.2; archive links |
| `docs/architecture/README.md` | SDD-II v1.2; archive section |
| `docs/architecture/cognitive-pipeline.md` | CCIS/ADR-0007 subordination; SDD mapping |
| `docs/architecture/ARCHITECTURE-FREEZE.md` | Archive paths in supporting docs |
| `docs/pdd/volume-i-product-behavior-architecture.md` | Authority header fixed |
| `.cursor/rules/conquest-cios.mdc` | Frozen architecture + quarantine |
| `.cursor/rules/conquest-design.mdc` | UXMD/GIS authority |
| `packages/database/src/schema.ts` | Comment references |
| `packages/core/src/services/contract.ts` | Comment references |
| `services/session/src/index.ts` | Comment references |
| `docs/governance/build-authorization-checklist-v1.0.md` | B-19–B-21 status |

---

## 4. Files created (governance)

| File | Purpose |
|------|---------|
| `docs/archive/README.md` | Archive index |
| `docs/governance/repository-structure-approval-v1.0.md` | B-19 approval recommendation |
| `docs/governance/ci-law-mapping.md` | B-21 law → CI mapping |
| `.github/workflows/ci.yml` | B-20 CI scaffold |

---

## 5. Repository structure approval (B-19)

**Recommendation: Approve** documentation layout and prototype interim mapping per [`repository-structure-approval-v1.0.md`](repository-structure-approval-v1.0.md).

Formal approval occurs by signature on the Build Authorization Record — not by this transition alone.

---

## 6. Remaining Build-0 blockers

| Gate | Status |
|------|--------|
| B-01–B-09 | Complete |
| B-19 | Prepared — sign on BAR |
| B-20 | Complete (Build-0 scaffold) |
| B-21 | Complete (Build-0 scaffold) |
| **B-10** | **Blocking** — Build Authorization Record not issued |

---

## 7. Build Authorization recommendation

### Should Build Authorization be issued now?

**Not automatically.** Repository alignment is complete. One governance act remains:

**Issue the Build Authorization Record** for **Build-0** scope only, with:

- B-19 repository structure approval signed in §7
- Prototype disposition: **Quarantine and realign** (recommended)
- Scope: governance scaffolding, CI, documentation — **not** UXMD implementation or cognitive/memory build

Until B-10 is signed, **no implementation work** may proceed beyond this transition.

---

*Repository Transition Summary v1.0 — 2026-06-26*
