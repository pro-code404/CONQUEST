# ADR-0009: Learning Boundary

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest improves over time (CCIS First Law). Unchecked learning could mutate production code, bypass verification, execute unauthorized actions, or corrupt memory. Learning must be governed as an explicit engineering subsystem — not an emergent side effect of intelligence engines.

---

## Decision

**The Learning Boundary is an explicit engineering subsystem** that governs improvement proposals — separate from user-facing modules and from Execution Layer.

- Learning engines **produce proposals** — Learning Boundary **governs application**  
- Learning Boundary **never executes external actions**  
- Learning Boundary **never bypasses verification**  
- Learning **never modifies production code** (BH-6) — adjusts models, memory, routing parameters only  
- Validated proposals route to Memory Manager for governed writes  
- Optimization proposals (OPT) adjust routing/efficiency — never deployed code  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Engines write learning directly to memory** | No validation gate; violates IL-10 |
| **Learning triggers auto-execution** | Violates human authority on stakes |
| **Self-modifying code in production** | BH-6 prohibition; enterprise unacceptable |
| **No Learning Boundary — implicit in Orchestration** | No audit trail; unclear ownership |

---

## Rationale

SDD-I §3.13 Learning Boundary maps to AMD Layer 6. CCIS Improve stage and engineering laws I1–I2. PDD-I REF/LRN/OPT intelligence catalog. SDD-II §5.12–5.13 engineering lifecycle.

---

## Consequences

### Positive

- Clear audit for what changed and why  
- Safe continuous improvement narrative  
- Separation from Execution Layer (ADR-0015)  

### Negative / Trade-offs

- Additional orchestration step for proposal validation  
- Sample thresholds required before apply  

### Neutral

- User corrections feed learning proposals — not immediate memory overwrite |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Auto-apply learning without human review | New ADR — high bar; stakes-dependent |
| Learning Boundary performance | Scale in SDD III — do not remove boundary |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | §II.11–12 Learn, Improve; §XIV |
| AMD IV | Learning, Optimization Intelligence |
| PDD-I | BH-6; REF/LRN/OPT catalog |
| SDD-I | §3.13 Learning Boundary |
| SDD-II | §5.12–5.13, IL-10 |
| ADR-0008 | Memory governance |
