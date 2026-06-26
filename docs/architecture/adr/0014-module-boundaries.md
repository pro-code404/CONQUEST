# ADR-0014: Module Boundaries

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest decomposes into user-facing modules, platform services, intelligence engines, and execution capabilities. Blurred boundaries cause direct engine calls from UI, payment data in intelligence paths, and modules that bypass orchestration — violating layered architecture.

---

## Decision

**Product modules are bounded contexts** with defined responsibilities — they do not own cognitive engines or infrastructure.

**Product modules (SDD-I §4):**

| Module | ID | Primary nav |
|--------|-----|-------------|
| Command Center | `command-center` | Yes (#1) |
| Reports | `reports` | Yes (#2) |
| Automation | `automation` | Yes (#3) |
| Knowledge | `knowledge` | Yes (#4) |
| Strategy Center | `strategy` | Yes (#5) |
| Marketplace | `marketplace` | Yes (#6) |
| Settings | `settings` | Yes (#7) |
| Support | `support` | No — utility |
| Workspace | `workspace` | No — context |
| FTUE / Onboarding | `onboarding` | No — flow |

**Boundary rules:**

- Modules communicate via **domain commands and events** — not direct intelligence engine calls (EP-3)  
- Application Layer encodes PDD-II use cases per module  
- Experience Layer assembles projections — does not reason  
- Intelligence Layer produces artifacts — does not present UI  
- Execution Layer acts on authorization — does not conclude  
- Billing (Settings subsection) never alters intelligence (PD-12)  
- Marketplace extensions subscribe to events — no nav expansion  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Monolith application module** | No bounded context; untestable |
| **Per-engine product modules** | Exposes machinery — AMD IV §71 rejects |
| **Microservice per screen** | Over-decomposition at product layer |
| **Shared intelligence service called from UI** | Violates layer model |

---

## Rationale

PDD-II MSD defines nine modules + interaction matrix (Part K). SDD-I §4 module mapping. UXMD-II screen families map to modules. SDD-II module ownership columns in Part 5 lifecycle.

---

## Consequences

### Positive

- Clear ownership for SDD III service boundaries  
- Testable module contracts  
- Marketplace extension model without core fork  

### Negative / Trade-offs

- Cross-module workflows require orchestration (by design)  
- Part K interaction matrix must stay current  

### Neutral

- Physical deployment may colocate modules — logical boundaries frozen |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Tenth product module proposal | ADR-0005 nav amendment required |
| Module merge/split | Class A change |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| PDD-II | Parts A–J; Part K matrix |
| SDD-I | §4 Modules; §3 Layers |
| UXMD-II | Screen families |
| SDD-II | Part 5 ownership columns |
| ADR-0005, 0010, 0015 | Nav, events, execution |
