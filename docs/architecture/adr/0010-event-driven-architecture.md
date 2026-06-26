# ADR-0010: Event-Driven Architecture

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest runs long intelligence cycles, async ingestion, background measurement, and cross-module reactions. Synchronous coupling between modules would block UX, prevent audit lineage, and prevent horizontal scaling of intelligence workloads.

---

## Decision

**Conquest is event-driven at intelligence scale.**

- Events decouple modules, enable async intelligence cycles, and provide audit lineage (SDD-I §5.1)  
- Event categories: User, Domain, Intelligence, Execution, Learning, Platform, System, Background, Integration  
- Standard envelope: `event_id`, `event_type`, `occurred_at`, `org_id`, `workspace_id`, `actor_id`, `correlation_id`, `causation_id`, `idempotency_key`, `payload`, `version`  
- **EP-3:** Domain events may trigger Orchestration — **never direct engine invocation from modules**  
- **EP-2:** At-least-once delivery; consumers idempotent  
- **EP-6:** Cross-org events forbidden  
- Commands and execution require `idempotency_key`  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Synchronous RPC between all modules** | Blocks UI; tight coupling; poor failure isolation |
| **Shared database as integration** | Hidden coupling; no audit trail |
| **Direct engine calls from Application** | Violates layer boundaries |
| **Event-driven only for ingestion** | Insufficient for intelligence lifecycle observability |

---

## Rationale

SDD-I §5 Event Architecture. Intelligence-first async cycles. SDD-II observability events (`intelligence.*`, `learning.*`). Retry philosophy SDD-I §5.8 — classified retryable vs fatal.

---

## Consequences

### Positive

- Scalable intelligence parallelism  
- Complete correlation chains for support and audit  
- Module replacement without API coupling  

### Negative / Trade-offs

- Eventual consistency — explicit freshness required (BH-7, GIS-S6)  
- Idempotency discipline required across teams  

### Neutral

- SDD III defines transport technology — not prescribed in freeze |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Event schema breaking change | Version field increment + migration ADR |
| Missing correlation in production | SDD V observability gate |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| SDD-I | §5 Event Architecture; §5.8 retry |
| SDD-II | Observability events throughout |
| ADR-0014 | Module boundaries — EP-3 |
| ADR-0011 | Integration events |
