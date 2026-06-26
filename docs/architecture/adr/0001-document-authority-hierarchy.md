# ADR-0001: Document Authority Hierarchy

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest is documented across multiple volumes (CCIS, AMD, PDD, UXMD, SDD). Without a single authority chain, teams and agents produce conflicting implementations — especially where product behavior, user experience, and engineering overlap.

Early README files listed SDD before PDD. SDD Volume I v1.1 and the Program Architecture Consistency Gate established the canonical order.

---

## Decision

We adopt a **strict document authority hierarchy**. Where documents conflict, higher-order documents prevail:

```
CCIS > AMD > PDD > UXMD > SDD
```

SDD elaborates engineering structure. SDD never contradicts CCIS intelligence laws, AMD memory/intelligence architecture, PDD behavioral laws, or UXMD GIS standards.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **SDD > PDD > UXMD** (engineering-first) | Allows infrastructure to redefine product behavior — violates intelligence-first identity |
| **UXMD > PDD** (design-first) | UX cannot override behavioral laws or CCIS verification requirements |
| **Flat peer documents** | No conflict resolution — duplicate authority risk |
| **CCIS only — no elaboration** | Insufficient for modules, screens, and engineering decomposition |

---

## Rationale

CCIS defines what Conquest believes. AMD defines what Conquest is. PDD defines how it behaves. UXMD defines how users experience it. SDD defines how it is engineered. Each layer elaborates without contradicting higher layers — matching the program's documentation-only progression before Build.

---

## Consequences

### Positive

- Clear escalation path for conflict resolution  
- SDD III–V bounded to engineering conformance  
- Agents have deterministic authority lookup  

### Negative / Trade-offs

- PDD-I rejected status required Authority Bridge (ADR-0013) rather than hierarchy change  
- README metadata must stay synchronized with SDD-I  

### Neutral

- Legacy `system-design-document.md` v2.0 remains subordinate to SDD I–V  

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New document family (e.g., API Design Authority) | New ADR defining position in hierarchy |
| CCIS v2.0 | Revalidate entire chain |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | Supremacy clause |
| SDD-I | §Authority Resolution |
| Authority Bridge | §2 Authority Resolution |
| Architecture Freeze | §2.3, §4.4 |
