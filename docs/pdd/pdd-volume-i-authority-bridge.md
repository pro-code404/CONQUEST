# PDD VOLUME I — AUTHORITY BRIDGE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | PDD Volume I — Authority Bridge |
| **Purpose** | Resolve document hierarchy ambiguity between PDD-I review status and UXMD corpus |
| **Status** | Authority Reconciliation — Active |
| **Version** | 1.0 |
| **Date** | 2026-06-21 |

---

## 1. Problem Statement

PDD Volume I v2.0 received **Rejected** status on architectural review (2026-06-21). UXMD Volumes I–III subsequently operationalize user-facing expression. Without formal reconciliation, dual authority creates risk for SDD Volume I.

---

## 2. Authority Resolution

| Layer | Document | Authority scope | Status |
|-------|----------|-----------------|--------|
| **Intelligence philosophy** | CCIS | Supreme | Approved |
| **Architecture** | AMD I–IV | System structure | Approved (I–IV in repo) |
| **Product behavior (workflows)** | PDD Volume I | How Conquest behaves — workflows, laws | **v2.0 — conditional authority** |
| **Product modules** | PDD Volume II | What each module does | v1.0 draft |
| **User experience philosophy** | UXMD Volume I | How it should feel | v1.0 draft |
| **Global interaction standards** | UXMD Volume III (GIS) | Inherited standards all screens | v1.0 |
| **Screens and routes** | UXMD Volume II | What every screen does | v1.1 |
| **Engineering** | SDD Volumes I–V | Platform engineering | Approved — frozen |

### 2.1 Conditional PDD-I Authority

PDD Volume I v2.0 retains authority for:

- Workflow definitions (B1–G2)
- Product Behavior Laws (BH-1–BH-10)
- Intelligence output catalog (Part I)
- Behavioral interaction matrix (Part H)

PDD Volume I v2.0 **does not block UXMD or SDD** for items resolved in the table below.

PDD Volume I v2.1 revision track remains open for workflow-level gaps not expressible as screens or GIS standards.

---

## 3. PDD-I Review Gap Resolution Matrix

| PDD-I Gap | Resolution | Authority document | Status |
|-----------|------------|-------------------|--------|
| First visit / registration / auth screens | Screen specs PUB-01–07 | UXMD-II | **Resolved** |
| Onboarding workflow | ONB-01–06 + UXMD-I Part B | UXMD-II | **Resolved** |
| First report milestone | RPT-07 | UXMD-II | **Resolved** |
| Report history / compare | RPT-01, RPT-04 | UXMD-II | **Resolved** |
| Automation rollback | AUT-06 + GIS §6.5 | UXMD-II + UXMD-III | **Resolved** |
| Modify recommendation | CC-11 | UXMD-II | **Resolved** |
| Outcome confirmation / measurement | CC-15 | UXMD-II | **Resolved** |
| Prediction detail / lifecycle UX | CC-13 + notifications GIS §5.4 | UXMD-II + UXMD-III | **Resolved** |
| Execution detail | CC-14 | UXMD-II | **Resolved** |
| MFA enrollment | SET-03a | UXMD-II | **Resolved** |
| Per-screen states | GIS Part 1 | UXMD-III | **Resolved** |
| Per-screen permissions | GIS Part 2 | UXMD-III | **Resolved** |
| Per-screen mobile | GIS Part 4 | UXMD-III | **Resolved** |
| Accessibility binding | GIS Part 3 | UXMD-III | **Resolved** |
| Differentiation behavioral matrix | UXMD-I Parts A, D, E | UXMD-I | **Resolved** |
| Memory type behavioral specs (why/stores/when/improves) | — | PDD-I v2.1 | **Open** |
| CCIS intelligence loop as standalone PDD workflows | — | PDD-I v2.1 | **Open** |
| Prediction system PDD workflow (D8) | Partial via CC-13/CC-15 | PDD-I v2.1 | **Partial** |
| Strategic dependency / historical parallel identification | — | PDD-I v2.1 | **Open** |
| Unified analysis engine PDD behavior | Expressed via screens | PDD-I v2.1 | **Partial** |
| Reporting PDD update/regeneration workflow | RPT-02 regenerate | UXMD-II | **Resolved** |

---

## 4. SDD Gate Rule

SDD Volume I may begin when:

1. UXMD Final Review returns **APPROVED FOR SDD** — **met** (2026-06-21)
2. UXMD Volumes I, II, III approved as a corpus — **met**
3. PDD-I open items (§3 Open/Partial) documented as **Build-2 non-blockers** where UXMD/SDD cover user-facing behavior

**SDD program complete.** Open PDD-I items **block Build-2** cognitive/memory implementation (B-12), not SDD authoring.

---

## 5. Amendment to Document Hierarchy

```
CCIS
  ↓
AMD I–IV
  ↓
PDD I (workflows) + PDD II (modules) + Authority Bridge (this document)
  ↓
UXMD I → UXMD III (GIS) → UXMD II (screens)
  ↓
SDD Volumes I–V (frozen)
  ↓
Build Authorization (not issued)
  ↓
Build (not started)
```

---

## 6. Sign-Off Criteria

| Stakeholder action | Requirement |
|-------------------|-------------|
| Architecture | Accept Authority Bridge v1.0 |
| UXMD re-review | Pass all 10 categories |
| PDD-I v2.1 | Schedule for memory + intelligence loop workflows before cognitive services build |

---

*End of PDD Volume I — Authority Bridge v1.0*
