# ADR-0035: AI Safety Boundaries

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends (safety) |

---

## Context

AI orchestration introduces hallucination, prompt injection, unsafe recommendations, and runaway execution risks. Safety must be architectural — not prompt-only.

---

## Decision

**Layered AI safety boundaries:**

1. Ingress sanitization (prompt injection) — Intelligence boundary  
2. Evidence-first reasoning (ADR-0031)  
3. Challenge + Verify before Decide/Release (ADR-0007, 0027)  
4. Human gate on high stakes (BH-9)  
5. Emergency stop + kill switches (SDD-III INF-22)  
6. Rate limits and abuse detection  
7. AI-25 production gate — complements INF-25  

Safety rules enforced in Orchestration, Verification, Execution — not delegated to model behavior alone.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Prompt-only safety | Bypassable; not auditable |
| Post-hoc moderation only | Too late for execution |
| Disable Challenge on speed | Violates CCIS |

---

## Rationale

SDD-IV Part 12. SDD-III Part 8. CCIS H1–H4 human intelligence laws.

---

## Consequences

### Positive

- Enterprise safety narrative  
- Defense in depth |

### Negative / Trade-offs

- Latency from Challenge + Verify |

### Neutral

- Red-team program in SDD V |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| New attack class | Part 12 + runbook update |
| Regulatory AI requirements | Compliance ADR extension |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-IV Part 12 | Safety architecture |
| SDD-III Part 8 | Threat model |
| AI-4, AI-13, AI-22, AI-25 | Laws |
| ADR-0027 | Verification gate |
