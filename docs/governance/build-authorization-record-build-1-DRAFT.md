# Build Authorization Record — Build-1 (DRAFT)

| Field | Value |
|-------|-------|
| **Document type** | Build Authorization Record |
| **Authority** | [SDD-V Part 11 §11.3](../sdd/volume-v-engineering-standards-build-governance.md) |
| **Status** | **SUPERSEDED** — see [build-authorization-record-build-1-2026-06-26.md](build-authorization-record-build-1-2026-06-26.md) |
| **Record ID** | BAR-2026-06-26-001 (proposed) |
| **Authorization date** | _Pending signature_ |
| **Phase authorized** | **Build-1 — Platform foundation** |

> **This record is prepared for review only.** Build-1 is **not authorized** until Section 8 is signed by program architecture authority.

---

## 1. Authorization declaration

```
BUILD AUTHORIZATION — CONQUEST

Phase authorized:     Build-1 — Platform foundation
Authorization date:   [ PENDING ]
Record ID:            BAR-2026-06-26-001 (proposed)
Architecture Freeze:  v1.0
FAA reference:        final-architecture-audit-v1.0.md
Build-0 baseline:     build-0-completion-report-v1.0.md
```

**Scope statement:**

> Implementation is authorized for **Build-1** and the RTM rows listed in Section 4 only. All work must conform to frozen CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III, Document X v1.0, SDD I–V, Accepted ADRs (0001–0035), and RTM v1.1+.

**Permitted:** Application shell, routing, auth framework, GIS integration, shared UI library, navigation, workspace framework, dashboard shell, initial UXMD screens, profile/settings foundation per [build-1-milestone-1-plan-v1.0.md](build-1-milestone-1-plan-v1.0.md).

**Prohibited:** Cognitive pipeline implementation (Build-2), memory subsystem (Build-2), production deploy (Build-3), architecture corpus changes without ADR.

---

## 2. Authorized phase — Build-1

| Field | Value |
|-------|-------|
| **Prerequisite** | Build-0 COMPLETE — BAR-2026-06-21-001 |
| **Additional gates** | B-14–B-18, B-29–B-30 |
| **RTM scope** | 32 rows — see Section 4 |
| **Prototype** | Discard `apps/gateway`, `packages/ui`; rewrite auth/session per ADR-0017 |

---

## 3. Gate verification attestation

Verified per [`build-1-authorization-package-v1.0.md`](build-1-authorization-package-v1.0.md) §1.

| Gate | Verified | Evidence |
|------|----------|----------|
| B-01–B-11 | ✅ | Inherited from Build-0 |
| B-14 | ✅ | threat-model-review-v1.0.md |
| B-15 | ✅ | tenant-isolation-test-plan-v1.0.md |
| B-16 | ✅ | ADR-0019 |
| B-17 | ✅ | dr-drill-plan-v1.0.md |
| B-18 | ✅ | docs/operations/runbooks/ |
| B-19–B-21 | ✅ | Inherited from Build-0 |
| B-29 | ✅ | packages/observability scaffold |
| B-30 | ✅ | packages/config kill-switch + tests |
| B-10 | ⏳ | This record (when signed) |

---

## 4. Authorized RTM rows

_Status becomes `In Build` upon issuance per ENG-5._

| Partition | RTM IDs |
|-----------|---------|
| UX | RTM-UX-001–008, RTM-UX-010 |
| PDD | RTM-PDD-001–003, RTM-PDD-007 |
| MEM | RTM-MEM-004, RTM-MEM-008 |
| ENG | RTM-ENG-001, 002, 005, 007, 008, 009, 010 |
| INF | RTM-INF-001–008, 012–015 |

Full descriptions: RTM v1.1 Parts B–F.

---

## 5. Open exceptions

| ID | Description | Expiry | Owner |
|----|-------------|--------|-------|
| EX-B1-01 | B-22–B-24 CI gates not yet automated | 2026-09-30 | Engineering — Milestone 1 |
| EX-B1-02 | DR tabletop not yet executed | Before production | Operations |
| EX-B1-03 | Kill switch ops console UI deferred | Build-1 Milestone 3 | Platform |

Per SDD-V §11.3: exceptions have expiry dates.

---

## 6. Prototype code disposition

| Area | Action |
|------|--------|
| `apps/gateway` | **Discard** — replace with authorized app shell |
| `packages/ui` | **Discard** — rebuild from UXMD-III GIS |
| `packages/core` pipeline types | **Review for reuse** |
| `services/auth`, `session` | **Rewrite** under ADR-0017 |
| `services/orchestrator` | **Quarantine** until Build-2 |

Reference: [`prototype-disposition-v1.0.md`](prototype-disposition-v1.0.md)

---

## 7. Governing document versions

Same as Build-0 BAR §7. No corpus version changes at Build-1 authorization.

---

## 8. Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Program Architecture Authority | | | _Pending_ |
| Engineering Lead | | | _Pending_ |
| Security Review | | | _Pending_ |

---

## 9. Change control after authorization

| Change class | Process |
|--------------|---------|
| Class A (frozen element) | ADR → amendment → freeze update |
| Implementation detail | SDD-V ENG laws; ADR if architectural |
| Phase expansion | Build-2 BAR after B-12, B-25–B-28 |

---

## 10. Related documents

| Document | Path |
|----------|------|
| Build-1 package | [build-1-authorization-package-v1.0.md](build-1-authorization-package-v1.0.md) |
| Milestone 1 plan | [build-1-milestone-1-plan-v1.0.md](build-1-milestone-1-plan-v1.0.md) |
| Build-0 BAR | [build-authorization-record-build-0-2026-06-21.md](build-authorization-record-build-0-2026-06-21.md) |
| Implementation plan | [build-1-implementation-plan-v1.0.md](build-1-implementation-plan-v1.0.md) |

---

*DRAFT prepared 2026-06-26. Issuance is the only act that authorizes Build-1 per ENG-20.*
