# Build Authorization Record — TEMPLATE

| Field | Value |
|-------|-------|
| **Document type** | Build Authorization Record |
| **Authority** | [SDD-V Part 11 §11.3](../sdd/volume-v-engineering-standards-build-governance.md) |
| **Status** | **TEMPLATE — NOT ISSUED** |
| **Version** | 1.0-template |

> **This is a prepared template only.** Build is **not authorized** until a completed record is signed and dated by program architecture authority.

---

## 1. Authorization declaration

```
BUILD AUTHORIZATION — CONQUEST

Phase authorized:     [ Build-0 | Build-1 | Build-2 | Build-3 ]
Authorization date:   [ YYYY-MM-DD ]
Record ID:            [ BAR-YYYY-MM-DD-NNN ]
Architecture Freeze:  v1.0 (or current)
FAA reference:        final-architecture-audit-v1.0.md
```

**Scope statement:**

> Implementation is authorized for the phase and RTM rows listed in Section 4 only. All work must conform to frozen CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III, Document X, SDD I–V, Accepted ADRs, and RTM v1.1+.

---

## 2. Authorized phase (select one)

### Build-0 — Governance & CI scaffold

| Field | Value |
|-------|-------|
| **RTM scope** | RTM-INF-010 |
| **Minimum gates** | B-01–B-10, B-19–B-21 (SDD-V §11.2) |
| **Permitted work** | Repository governance scaffolding, CI pipeline, architecture enforcement hooks, documentation alignment per migration plan — **no production feature implementation** |
| **Prohibited** | UXMD screen builds, cognitive/memory subsystem implementation, production deploy |

### Build-1 — Platform foundation

| Field | Value |
|-------|-------|
| **Additional gates** | B-14–B-18, B-29–B-30 |
| **RTM** | Platform rows per RTM Part H |

### Build-2 — Intelligence & memory

| Field | Value |
|-------|-------|
| **Additional gates** | B-12, B-25–B-28 |
| **Prerequisite** | PDD-I v2.1 Authority Bridge §3 closed |

### Build-3 — Full product

| Field | Value |
|-------|-------|
| **Gates** | Full B-01–B-32 |

---

## 3. Gate verification attestation

Complete only when all Build-0 gates are **Complete** per [`build-authorization-checklist-v1.0.md`](build-authorization-checklist-v1.0.md) and [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) §1.

| Gate | Verified | Evidence |
|------|----------|----------|
| B-01 | [ ] | |
| B-02 | [ ] | |
| B-04 | [ ] | |
| B-05 | [ ] | |
| B-06 | [ ] | |
| B-07 | [ ] | |
| B-08 | [ ] | |
| B-09 | [ ] | |
| B-10 | [ ] | This record (when signed) |
| B-19 | [ ] | Repository structure mapping approved |
| B-20 | [ ] | CI workflow path: `.github/workflows/ci.yml` |
| B-21 | [ ] | Law mapping doc path: `docs/governance/ci-law-mapping.md` |

---

## 4. Authorized RTM rows

| RTM ID | Description | Build phase |
|--------|-------------|-------------|
| RTM-INF-010 | Production readiness gate before deploy | Build-0 |

*(Extend for Build-1+ authorizations)*

---

## 5. Open exceptions

| ID | Description | Expiry | Owner |
|----|-------------|--------|-------|
| — | None at issuance | — | — |

Per SDD-V §11.3: open exceptions must have expiry dates.

---

## 6. Prototype code disposition

| Decision | Selection |
|----------|-----------|
| Pre-authorization prototype (`apps/`, `packages/`, `services/`) | [ ] Quarantine and realign (recommended)  [ ] Replace  [ ] Discard |

**Classification reference:** [`prototype-disposition-v1.0.md`](prototype-disposition-v1.0.md)

**Notes:**

---

## 7. Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Program Architecture Authority | | | |
| Engineering Lead | | | |
| Security Review (Build-1+) | | | |

---

## 8. Change control after authorization

| Change class | Process |
|--------------|---------|
| Class A (frozen element) | ADR → amendment → freeze update |
| Implementation detail | SDD-V ENG laws; ADR if architectural |
| Phase expansion | New Build Authorization Record for higher phase |

---

## 9. Related documents

| Document | Path |
|----------|------|
| Build-0 package | [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) |
| Prototype disposition | [`prototype-disposition-v1.0.md`](prototype-disposition-v1.0.md) |
| Build checklist | [`build-authorization-checklist-v1.0.md`](build-authorization-checklist-v1.0.md) |
| Migration plan | [`repository-migration-plan-v1.0.md`](repository-migration-plan-v1.0.md) |
| SDD-V Part 11 | [`../sdd/volume-v-engineering-standards-build-governance.md`](../sdd/volume-v-engineering-standards-build-governance.md) |
| Architecture Freeze | [`../architecture/ARCHITECTURE-FREEZE.md`](../architecture/ARCHITECTURE-FREEZE.md) |

---

*Template prepared 2026-06-26. Issuance of a completed record is the only act that authorizes Build per ENG-20.*
