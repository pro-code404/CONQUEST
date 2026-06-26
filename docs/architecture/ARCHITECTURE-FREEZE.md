# Conquest — Architecture Freeze

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | Conquest Architecture Freeze |
| **Status** | Active — Program Governance |
| **Version** | 1.0 |
| **Effective Date** | 2026-06-21 |
| **Gate** | Program Architecture Consistency Gate (APPROVED WITH MINOR CORRECTIONS) |
| **Precedes** | SDD Volume III — Infrastructure & Security Architecture |

### Mission

Formally **freeze** the approved architecture corpus so that infrastructure, security, AI orchestration, and engineering governance (SDD Volumes III–V) **conform to** existing decisions — they may **not redefine** product behavior, user experience, intelligence philosophy, or module responsibilities.

### Strict Prohibitions

This document does **not** authorize implementation, code, database schemas, API specifications, infrastructure configuration, or deployment scripts.

**Build phase has not started.**

---

# 1. Freeze Declaration

As of **2026-06-21**, the following architecture program elements are **frozen** at the stated versions. Changes require the change-control process in Section 4.

| Corpus | Document(s) | Frozen version | Freeze status |
|--------|-------------|----------------|---------------|
| **CCIS** | Conquest Core Intelligence Specification | v1.0 | **Frozen** |
| **AMD** | Volume I — Critical Architectural Expansion | v1.0 | **Frozen** |
| **AMD** | Volume II — Architectural Layer Model | v1.0 | **Frozen** |
| **AMD** | Volume III — Memory Architecture | v1.0 | **Frozen** |
| **AMD** | Volume IV — Cognitive & Intelligence Systems | v1.0 | **Frozen** |
| **PDD** | Volume I — Product Behavior Architecture | v2.0 | **Conditionally frozen** — conditional authority per Authority Bridge |
| **PDD** | Authority Bridge | v1.0 | **Frozen** |
| **PDD** | Volume II — Module Specifications (MSD) | v1.0 draft | **Frozen** — module boundaries and nav |
| **UXMD** | Volume I — User Experience Master Document | v1.0 draft | **Frozen** |
| **UXMD** | Volume II — Screen & Interaction Specification | v1.1 | **Frozen** — 102 screens |
| **UXMD** | Volume III — Global Interaction Standards (GIS) | v1.0 | **Frozen** |
| **SDD** | Volume I — System Architecture | v1.1 | **Frozen** |
| **SDD** | Volume II — Data & Intelligence Architecture | v1.2 | **Frozen** |
| **SDD** | Volume III — Infrastructure & Security | v1.0 | **Frozen** |
| **SDD** | Volume IV — AI Orchestration & Agent Architecture | v1.0 | **Frozen** |
| **SDD** | Volume V — Engineering Standards & Build Governance | v1.0 | **Frozen** |

### Supporting documents (subordinate, not frozen independently)

| Document | Role |
|----------|------|
| [`cognitive-pipeline.md`](cognitive-pipeline.md) | Runtime loop expression — subordinate to CCIS |
| [`how-conquest-thinks.md`](how-conquest-thinks.md) | Reasoning elaboration — subordinate to CCIS |
| [`how-conquest-evolves.md`](how-conquest-evolves.md) | Learning elaboration — subordinate to CCIS |
| [`../uxmd/document-x-product-experience-operational-details.md`](../uxmd/document-x-product-experience-operational-details.md) | Operational UX details — subordinate to GIS and UXMD-II |
| [`../archive/sdd/system-design-document-v2.0-superseded.md`](../archive/sdd/system-design-document-v2.0-superseded.md) | Legacy SDD v2.0 — archived |
| [`../archive/pdd/product-design-document-v1.0-superseded.md`](../archive/pdd/product-design-document-v1.0-superseded.md) | Legacy PDD v1.0 — archived |
| [`../archive/design-pre-uxmd/`](../archive/design-pre-uxmd/) | Pre-UXMD design — archived |

---

# 2. What Is Frozen

## 2.1 Intelligence & Cognitive Architecture

| Element | Authority | ADR |
|---------|-----------|-----|
| CCIS as supreme intelligence authority | CCIS | [ADR-0001](adr/0001-document-authority-hierarchy.md) |
| Twelve-stage CCIS loop (Observe → … → Improve) | CCIS §II | [ADR-0007](adr/0007-ccis-cognitive-lifecycle-order.md) |
| Verify → Decide → Recommend stage order | CCIS §II; AMD IV §67 | [ADR-0006](adr/0006-verification-before-release.md), [ADR-0007](adr/0007-ccis-cognitive-lifecycle-order.md) |
| Challenge before Verify; verification before release | CCIS; BH-5 | [ADR-0006](adr/0006-verification-before-release.md) |
| Intelligence systems invisible as navigation | AMD IV §71; UXMD-I | [ADR-0005](adr/0005-seven-item-primary-navigation.md) |
| Learning without production code mutation | CCIS; BH-6 | [ADR-0009](adr/0009-learning-boundary.md) |
| Memory Manager sole write authority | AMD III; SDD-II IL-2 | [ADR-0008](adr/0008-memory-governance.md) |

## 2.2 Product & Experience Architecture

| Element | Authority | ADR |
|---------|-----------|-----|
| Command Center as home — not a dashboard | UXMD-I UX-12; PDD-II | [ADR-0002](adr/0002-command-center-as-home.md) |
| Workspace as scoped context — not primary nav | PDD-II; UXMD-I | [ADR-0003](adr/0003-workspace-as-context.md) |
| Strategy Center as strategic depth module | PDD-II Part D; UXMD-I | [ADR-0004](adr/0004-strategy-center-separation.md) |
| Seven-item primary navigation (frozen at 7) | PDD-II; UXMD-I; MSD-13 | [ADR-0005](adr/0005-seven-item-primary-navigation.md) |
| Ask Conquest ≠ chat | UXMD-I §D.5 | [ADR-0002](adr/0002-command-center-as-home.md) |
| GIS inheritance for all screens | UXMD-III | [ADR-0012](adr/0012-gis-inheritance.md) |
| Role hierarchy: Owner > Admin > Manager > Member > Viewer | UXMD-III §2 | [ADR-0012](adr/0012-gis-inheritance.md) |
| Authority Bridge reconciliation | PDD Authority Bridge | [ADR-0013](adr/0013-authority-bridge.md) |

## 2.3 Engineering Architecture

| Element | Authority | ADR |
|---------|-----------|-----|
| Document hierarchy: CCIS > AMD > PDD > UXMD > SDD | SDD-I §Authority Resolution | [ADR-0001](adr/0001-document-authority-hierarchy.md) |
| Ten engineering layers + L5E Execution + Learning Boundary | SDD-I §3 | [ADR-0015](adr/0015-execution-layer-separation.md), [ADR-0009](adr/0009-learning-boundary.md) |
| Module bounded contexts (10 product modules) | SDD-I §4; PDD-II | [ADR-0014](adr/0014-module-boundaries.md) |
| Event-driven architecture at intelligence scale | SDD-I §5 | [ADR-0010](adr/0010-event-driven-architecture.md) |
| AI provider abstraction behind Intelligence Layer | SDD-I §7.4 | [ADR-0011](adr/0011-ai-provider-abstraction.md) |
| Universal Artifact Contract (UAC) | SDD-II | [ADR-0008](adr/0008-memory-governance.md) |
| SDD-IV orchestration pipeline | SDD-IV Part 2; ADR-0026 | [ADR-0026](adr/0026-cognitive-pipeline-authority.md) |
| System Coordinator mediation | SDD-IV Part 3; ADR-0030 | [ADR-0030](adr/0030-multi-agent-coordination.md) |
| VRF sole release gate | SDD-IV Part 9; ADR-0027 | [ADR-0027](adr/0027-verification-gate-ownership.md) |
| AI Engineering Laws AI-1–25 | SDD-IV Part 15 | ADR-0026–0035 |

## 2.4 Explicitly Frozen Lists

**Primary navigation (immutable without UXMD amendment + ADR):**

1. Command Center  
2. Reports  
3. Automation  
4. Knowledge  
5. Strategy Center  
6. Marketplace  
7. Settings  

**Not primary navigation:** Workspace, Support, Billing, Profile, Intelligence machinery labels.

**Product modules (SDD-I §4 mapping):** `command-center`, `strategy`, `reports`, `automation`, `knowledge`, `marketplace`, `settings`, `support`, `workspace`, `onboarding`.

---

# 3. What Remains Open

## 3.1 SDD Volumes (authorized to proceed)

| Volume | Scope | Constraint |
|--------|-------|------------|
| **SDD III** | Infrastructure & Security | Part 1–14, INF-1–25 | **Frozen** — conceptual only |
| **SDD IV** | AI Orchestration & Agent Architecture | Must conform to CCIS loop and AMD IV |
| **SDD V** | Engineering Standards & Build Governance | Defines build gates; cannot override freeze |

## 3.2 AMD Volumes (deferred)

| Volume | Status |
|--------|--------|
| AMD I–II | **Committed** 2026-06-26 — `amd/volume-i-*`, `amd/volume-ii-*` |
| AMD V–X | Platform, infrastructure, security, UX/UI — deferred; must align with freeze |

## 3.3 PDD-I v2.1 Track (Build blocker, not SDD III blocker)

Per Authority Bridge §3 — open before **Build**:

- Memory type behavioral specifications  
- CCIS intelligence loop as standalone PDD workflows  
- Strategic dependency / historical parallel identification  
- Unified analysis engine PDD behavior (partial)  
- Prediction system PDD workflow D8 (partial)  

## 3.4 Known Errata (frozen corpus, targeted amendment)

| ID | Item | Target |
|----|------|--------|
| P0-1 | SDD-II §5.6–5.8 stage order | **Resolved** — SDD-II v1.2 |
| P0-2 | AMD I–II commit to repository | **Resolved** — 2026-06-26 |
| P0-4 | README hierarchy metadata | Meta docs — open |

## 3.5 Implementation (not authorized)

Database design, API design, code, infrastructure configuration, deployment scripts, and runtime configuration remain **out of scope** until SDD V approves build governance and explicit build authorization is issued.

---

# 4. Change-Control Process

## 4.1 Change Classes

| Class | Definition | Process |
|-------|------------|---------|
| **Class A — Frozen element change** | Alters any item in Section 2 | ADR required → document amendment → review → version bump → freeze update |
| **Class B — Errata** | Corrects inconsistency without changing intent | Targeted amendment → cross-reference update → freeze errata log |
| **Class C — Open volume authoring** | New content in open SDD/AMD volumes | Must cite frozen ADRs; no contradiction |
| **Class D — Implementation detail** | Technology choice within frozen boundaries | ADR if architectural; else SDD V / engineering standards |

## 4.2 Class A Workflow

```
1. Author drafts ADR (status: Proposed) using adr/template.md
2. Identify affected frozen documents
3. Program review against CCIS supremacy and freeze Section 2
4. If approved:
   a. Merge ADR (status: Accepted)
   b. Amend authoritative document(s) with version increment
   c. Update ARCHITECTURE-FREEZE.md if freeze scope changes
   d. Record in adr/README.md index
5. If rejected: ADR status → Rejected (retained for history)
```

## 4.3 Emergency Exception

No frozen element may be bypassed for implementation convenience. If production incident requires temporary deviation, document as **ADR (status: Superseded by emergency)** with explicit sunset date and remediation ADR.

## 4.4 Infrastructure Conformance Rule

**SDD Volume III and all subsequent engineering volumes must:**

- Implement frozen boundaries — not reinterpret them  
- Reference ADRs when making infrastructure choices that touch frozen elements  
- **Not** add navigation items, rename modules, alter CCIS lifecycle order, bypass Memory Manager, expose intelligence systems in UI, or collapse Strategy Center into Command Center  
- **Not** place AI provider SDKs in client or Application modules  
- Treat GIS standards as mandatory Presentation-layer requirements  

Infrastructure **may** choose vendors, regions, encryption algorithms, and deployment topologies **only where** frozen documents do not prescribe technology and choices do not violate ADRs.

---

# 5. Versioning Rules

## 5.1 Document Versioning

| Pattern | Meaning |
|---------|---------|
| **v1.0** | Initial sealed authority |
| **v1.1, v1.2…** | Minor revision — clarifications, errata, non-breaking additions |
| **v2.0** | Major revision — requires program review and freeze amendment |

## 5.2 ADR Versioning

ADRs are **immutable once Accepted**. Supersession creates a new ADR that references the prior number. Status values: `Proposed`, `Accepted`, `Deprecated`, `Superseded`, `Rejected`.

## 5.3 Freeze Versioning

`ARCHITECTURE-FREEZE.md` increments when:

- A frozen document reaches a new major version  
- A Class A change adds or removes frozen elements  
- Open → frozen promotion occurs (e.g., SDD III seal)  

---

# 6. Approval Criteria

## 6.1 Promoting a Document to Frozen

A document may be added to Section 1 freeze table when:

1. Dedicated volume review checklist executed  
2. Verdict ≥ **APPROVED** or **APPROVED WITH MINOR CORRECTIONS**  
3. All P0 items resolved or logged as errata with target version  
4. Cross-document consistency gate pass for affected corpus  
5. ADRs created or updated for new architectural decisions  
6. `ARCHITECTURE-FREEZE.md` amended  

## 6.2 SDD Volume III Start Criteria (met)

- [x] Program Architecture Consistency Gate: APPROVED WITH MINOR CORRECTIONS  
- [x] Architecture Freeze document published  
- [x] ADR program established with initial critical decisions  
- [x] SDD I v1.1 approved  
- [x] SDD II v1.1 approved  

## 6.3 SDD Volume III Seal Criteria (future)

- Volume III review checklist executed  
- No contradiction with freeze Section 2  
- Infrastructure ADRs added where technology boundaries are set  
- GIS security/permission bindings preserved  

## 6.4 Build Authorization Criteria

- SDD Volumes I–V approved — **met**
- PDD-I v2.1 open items closed — **open** (Build-2 scope per SDD-V §11.2)
- AMD I–II in repository — **met** (2026-06-26)
- Architecture Freeze v1.x current — **met**
- SDD-II v1.2 errata — **met** (2026-06-26)
- Explicit build authorization issued — **not met**
- Build-0 engineering gates B-19–B-21 — **not met** (see transition checklist)

---

# 7. Errata Log

| Date | ID | Description | Resolution target |
|------|-----|-------------|-------------------|
| 2026-06-21 | P0-1 | SDD-II Part 5 lists Decide before Verify in §5.6–5.8 | **Resolved** — SDD-II v1.2 (2026-06-26) |
| 2026-06-21 | P0-2 | AMD I–II not in repository | **Resolved** — committed 2026-06-26 |
| 2026-06-26 | — | AMD I–II committed; SDD-II v1.2 errata applied | Transition Phase 1 |
| 2026-06-21 | P0-4 | README hierarchy metadata | Meta doc update |
| 2026-06-21 | — | SDD-V v1.0 sealed — SDD program complete | Review 95% |

---

# 8. Related Documents

| Document | Path |
|----------|------|
| ADR Program | [`adr/README.md`](adr/README.md) |
| ADR Template | [`adr/template.md`](adr/template.md) |
| CCIS | [`ccis.md`](ccis.md) |
| RTM | [`requirements-traceability-matrix.md`](requirements-traceability-matrix.md) |
| SDD V | [`../sdd/volume-v-engineering-standards-build-governance.md`](../sdd/volume-v-engineering-standards-build-governance.md) | v1.0 — frozen |
| PDD Authority Bridge | [`../pdd/pdd-volume-i-authority-bridge.md`](../pdd/pdd-volume-i-authority-bridge.md) |
| UXMD Final Review | [`../uxmd/uxmd-final-review-checklist.md`](../uxmd/uxmd-final-review-checklist.md) |
| Final Architecture Audit | [`final-architecture-audit-v1.0.md`](final-architecture-audit-v1.0.md) — **APPROVED WITH P0 BLOCKERS** |

---

*Architecture Freeze v1.0 — Effective 2026-06-21. SDD Volume III authorized upon publication of this document and the ADR program. FAA v1.0 complete — Build Authorization blocked pending FAA-P0-01 and FAA-P0-02.*
