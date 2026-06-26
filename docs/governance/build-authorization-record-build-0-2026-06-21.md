# Build Authorization Record — Build-0

| Field | Value |
|-------|-------|
| **Document type** | Build Authorization Record |
| **Authority** | [SDD-V Part 11 §11.3](../sdd/volume-v-engineering-standards-build-governance.md) |
| **Status** | **ISSUED** |
| **Record ID** | BAR-2026-06-21-001 |
| **Authorization date** | 2026-06-21 |
| **Phase authorized** | **Build-0 only** |

---

## 1. Authorization declaration

```
BUILD AUTHORIZATION — CONQUEST

Phase authorized:     Build-0
Authorization date:   2026-06-21
Record ID:            BAR-2026-06-21-001
Architecture Freeze:  v1.0
FAA reference:        final-architecture-audit-v1.0.md
Repository baseline:  Phase C PASS — repository-alignment-phase-b-validation-v1.0.md
```

**Scope statement:**

> Implementation is authorized for **Build-0** and RTM row RTM-INF-010 only. All work must conform to frozen CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III, Document X v1.0, SDD I–V, Accepted ADRs (0001–0035), and RTM v1.1+.

**Prohibited under this authorization:** UXMD screen implementation, cognitive/memory subsystems, production deploy, Build-1+ feature work without subsequent BAR.

---

## 2. Authorized phase — Build-0

| Field | Value |
|-------|-------|
| **RTM scope** | RTM-INF-010 |
| **Minimum gates** | B-01–B-10, B-19–B-21 (SDD-V §11.2) |
| **Permitted work** | Repository governance enforcement, CI pipeline activation, engineering law enforcement hooks, repository protections, implementation scaffolding, development workflow validation |
| **Prohibited** | Application features, UXMD screen builds, cognitive/memory implementation, production deploy |

---

## 3. Gate verification attestation

Verified per [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) and Phase C final verification.

| Gate | Verified | Evidence |
|------|----------|----------|
| B-01 | ✅ | ARCHITECTURE-FREEZE v1.0; AMD I–IV; Document X |
| B-02 | ✅ | SDD I–V review checklists APPROVED |
| B-04 | ✅ | ADR 0001–0035 Accepted |
| B-05 | ✅ | AMD I–II in repository |
| B-06 | ✅ | SDD-II v1.2 |
| B-07 | ✅ | PDD Authority Bridge v1.0 |
| B-08 | ✅ | UXMD I–III + Document X v1.0 |
| B-09 | ✅ | GIS binding plan (ENG-23) |
| B-10 | ✅ | This record |
| B-19 | ✅ | repository-structure-approval-v1.0.md |
| B-20 | ✅ | `.github/workflows/ci.yml` |
| B-21 | ✅ | ci-law-mapping.md |

---

## 4. Authorized RTM rows

| RTM ID | Description | Build phase |
|--------|-------------|-------------|
| RTM-INF-010 | Production readiness gate before deploy | Build-0 |

---

## 5. Open exceptions

| ID | Description | Expiry | Owner |
|----|-------------|--------|-------|
| — | None at issuance | — | — |

---

## 6. Prototype code disposition

| Decision | Selection |
|----------|-----------|
| Pre-authorization prototype (`apps/`, `packages/`, `services/`) | ✅ **Quarantine and realign** |

**Classification reference:** [`prototype-disposition-v1.0.md`](prototype-disposition-v1.0.md)

**Notes:** Prototype remains non-authoritative. Reuse requires per-area classification review. `apps/gateway` classified discard-before-implementation. No prototype repair required for Build-0.

---

## 7. Governing document versions at authorization

| Document | Version |
|----------|---------|
| CCIS | v1.0 |
| AMD I–IV | v1.0 |
| PDD I | v2.0 (conditional) |
| PDD Authority Bridge | v1.0 |
| PDD II (MSD) | v1.0 draft |
| UXMD I | v1.0 draft |
| UXMD II | v1.1 |
| UXMD III (GIS) | v1.0 |
| Document X | v1.0 |
| SDD I | v1.1 |
| SDD II | v1.2 |
| SDD III–V | v1.0 |
| ADR program | 0001–0035 Accepted |
| RTM | v1.1 |
| Architecture Freeze | v1.0 |
| FAA | v1.0 |

---

## 8. Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Program Architecture Authority | Engineering Transition Directive | 2026-06-21 | Issued |
| Engineering Lead | Engineering Transition Directive | 2026-06-21 | Issued |

*Issued per Engineering Transition Directive following Phase C PASS. Architecture Transition Program complete.*

---

## 9. Change control after authorization

| Change class | Process |
|--------------|---------|
| Class A (frozen element) | ADR → amendment → freeze update |
| Implementation detail | SDD-V ENG laws; ADR if architectural |
| Phase expansion | New Build Authorization Record for Build-1+ |

---

## 10. Related documents

| Document | Path |
|----------|------|
| Build-0 package | [`build-0-authorization-package-v1.0.md`](build-0-authorization-package-v1.0.md) |
| Build-0 status | [`build-0-status-v1.0.md`](build-0-status-v1.0.md) |
| Build-1 plan | [`build-1-implementation-plan-v1.0.md`](build-1-implementation-plan-v1.0.md) |
| Prototype disposition | [`prototype-disposition-v1.0.md`](prototype-disposition-v1.0.md) |

---

*BAR Build-0 — BAR-2026-06-21-001 — Official transition from Architecture to Engineering.*
