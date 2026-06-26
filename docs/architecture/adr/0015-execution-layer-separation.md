# ADR-0015: Execution Layer Separation

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest must act on authorized intelligence (automations, integrations, approved recommendations). Collapsing execution into intelligence engines would allow unconcluded actions, bypass human gates, and mix reasoning with side effects. AMD Layer 4 (Execution) requires explicit separation from Cognitive Layer.

---

## Decision

**Execution is engineered as Layer L5E (Execution Layer)** — distinct from Intelligence Layer and Learning Boundary.

- Execution **acts** on authorized intelligence — **never concludes, verifies, or reasons** (SDD-I EL principles)  
- Execution requires: approved decision, VRF pass (major), authorization record, planning artifact when applicable  
- Execution publishes `execution.*` events — consumed by Automation, Notification, Observability  
- Deviation from plan bounds → `execution.BoundsViolated` → pause + alert  
- Rollback path required for reversible automations (UXMD AUT-06, GIS)  
- Integration adapters invoked only through Execution Layer capability registry  

**Pipeline position:** After User Decision (when required) — per ADR-0007.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Intelligence engines execute directly** | Violates CCIS authorization principle |
| **Application modules call integrations directly** | No centralized authorization audit |
| **Execute before Verify** | AMD II §18.0 — invalid per CCIS |
| **Merge Execution into Automation module** | Automation is product surface — Execution is platform capability |

---

## Rationale

SDD-I §3.7 Execution Layer (L5E). AMD IV Layer 4. CCIS §II.9 Execute (When Authorized). PDD-II D7 user decision triggers execution path. BH-9 human authority on stakes.

---

## Consequences

### Positive

- Clear authorization audit trail  
- Safe automation with rollback semantics  
- Integration circuit breakers at Execution/Integration boundary  

### Negative / Trade-offs

- Additional handoff latency Orchestration → Execution  
- Idempotency required per step (SDD-I §5.8)  

### Neutral

- SDD III defines adapter hosting — not product behavior |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Autonomous execution without human gate | New ADR — stakes policy; BH-9 review |
| New execution capability type | Execution Layer registry extension |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| CCIS | §II.9 Execute |
| AMD IV | Layer 4; Execution mapping |
| SDD-I | §3.7 L5E |
| SDD-II | §5.9 Execution lifecycle |
| PDD-II | D7; Automation Part F |
| ADR-0006, 0007, 0009 | Verify, lifecycle, learning |
