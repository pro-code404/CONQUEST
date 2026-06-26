# ADR-0007: CCIS Cognitive Lifecycle Order

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Multiple documents express Conquest's cognitive loop: CCIS twelve stages, Cognitive Pipeline ten phases, AMD IV intelligence mapping, SDD-II Part 5 engineering lifecycle. Without a single canonical order, orchestration, artifact chains, and verification gates conflict.

Program Consistency Gate identified SDD-II v1.1 §5.6–5.8 listing Decide before Verify — an errata against CCIS.

---

## Decision

**The canonical CCIS cognitive lifecycle order is frozen:**

```
Observe → Understand → Research → Reason → Challenge
  → Verify → Decide → Recommend
  → Execute (when authorized) → Measure → Learn → Improve
```

**Engineering refinements (subordinate, not replacements):**

- SDD-II adds **Reflection** and **Optimization** as engineering sub-stages mapped to **Learn** and **Improve**  
- **Planning** is optional between Decide and Verify for complex execution paths  
- **User Decision** sits between Recommend and Execute  
- **Reporting** branches from Verify+Release — not a CCIS stage  
- Cognitive Pipeline ten phases map to this loop per AMD IV §69 — pipeline is subordinate expression  

**Critical ordering rule:** `Challenge → Verify → Decide → Recommend` — never Decide before Verify.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Decide → Verify → Recommend** (SDD-II v1.1 §5.7–5.8) | Contradicts CCIS §II — errata P0-1 |
| **Cognitive Pipeline as supreme** | Ten phases omit Research, Challenge, Decide, Recommend as named stages |
| **Skip Verify on low stakes** | Compression allowed — silent skip forbidden |
| **Merge Learn and Improve** | CCIS keeps both; SDD-II decomposes Improve |

---

## Rationale

CCIS is supreme authority. AMD IV §69 and §67 explicitly reconcile pipeline and AMD II conflicts. SDD-II §5.15 master graph must be amended to match. PDD-I intelligence catalog (REF, LRN, OPT) aligns with post-execution stages.

---

## Consequences

### Positive

- Single orchestration reference for SDD IV  
- Artifact chain auditability  
- AMD IV intelligence system pipeline positions fixed  

### Negative / Trade-offs

- SDD-II v1.2 errata required  
- `cognitive-pipeline.md` header should note subordination to CCIS  

### Neutral

- Stakes-compressed cycles documented in SDD IV — order preserved, duration reduced |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| CCIS v2.0 loop change | Superseding ADR + full program review |
| New intelligence system | AMD IV amendment — assign pipeline position |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | §II Core Intelligence Loop |
| AMD IV | §69 Pipeline Reconciliation |
| cognitive-pipeline.md | Ten phases — subordinate |
| SDD-II | Part 5 — pending v1.2 errata |
| ADR-0006 | Verification gate |
