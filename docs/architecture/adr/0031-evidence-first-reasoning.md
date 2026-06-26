# ADR-0031: Evidence-First Reasoning

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (reasoning) |

---

## Context

LLM-style systems often produce fluent conclusions without evidence. CCIS requires evidence hierarchy and citation. Reasoning must be evidence-first, not narrative-first.

---

## Decision

**No claim in RSN, DEC, or released I10 without traceable evidence reference.**

- Research must precede Reason when evidence gaps exist  
- VRF source validation blocks uncited major claims  
- Contradictions explicit — never averaged silently  
- Historical comparison uses governed memory — not fabricated parallels  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Post-hoc citation generation | Unreliable provenance |
| Model confidence as sole gate | Rhetorical confidence |
| Skip Research on "simple" queries | Hidden evidence gaps |

---

## Rationale

CCIS §III. IL-17. BH-3 confidence threshold. AI-12.

---

## Consequences

### Positive

- Enterprise auditability  
- User trust |

### Negative / Trade-offs

- Higher latency for evidence acquisition |

### Neutral

- Help/knowledge distinct from live evidence (IL-13) |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New evidence class | AMD III + VRF rules update |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 6, 8 | Reasoning + knowledge |
| CCIS §III | Philosophy |
| AI-12 | Law |
