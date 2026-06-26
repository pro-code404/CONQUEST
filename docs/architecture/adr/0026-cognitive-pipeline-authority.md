# ADR-0026: Cognitive Pipeline Authority

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (orchestration authority) |

---

## Context

SDD-II, cognitive-pipeline.md, and AMD IV express the cognitive loop with minor ordering and naming differences. SDD-IV must be the **orchestration authority** for runtime stage routing.

---

## Decision

**SDD-IV Part 2 is the authoritative orchestration specification** for the CCIS cognitive pipeline.

- Canonical order: `Challenge → Verify → Decide → Recommend` (ADR-0007)  
- Reason stage = product language "Analyze" — RSN artifact  
- Reflection and Optimization are engineering sub-stages of Learn/Improve  
- Reporting branches from Verify+Release — not a CCIS core stage  
- Stakes compression shortens duration — never removes stages from audit chain  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| SDD-II §5.6–5.8 order (Decide before Verify) | Contradicts CCIS — errata |
| Cognitive Pipeline as supreme | Subordinate per AMD IV §69 |
| Ad-hoc per-feature pipelines | No audit consistency |

---

## Rationale

ADR-0007. Program consistency gate P0-1. Single coordinator routing table required.

---

## Consequences

### Positive

- Deterministic orchestration implementation  
- Clear integration tests for stage order  

### Negative / Trade-offs

- SDD-II v1.2 errata required  

### Neutral

- Planning remains optional sub-path |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| CCIS v2.0 loop change | Superseding ADR |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 2 | Specification |
| ADR-0007 | Stage order |
| SDD-II Part 5 | Artifacts — order reconciled |
| AI-2, AI-3, AI-13 | Laws |
