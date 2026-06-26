# ADR-0023: Monitoring & Observability Strategy

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

CCIS §XVII requires observable intelligence cycles. SDD-I defines event envelope with correlation_id. SDD-II defines intelligence observability events. Support and incident response require end-to-end traces without leaking prompt content in default ops views.

---

## Decision

**Unified observability stack** — metrics, structured logs, distributed traces.

- `correlation_id` propagated from Gateway through all tiers (INF-12)  
- Intelligence cycle trace: stage spans, VRF outcome, engine class — not raw prompts in default ops UI  
- AI traces: cycle ID, token usage, latency, model class — prompt/response per retention class R2  
- Memory traces: operation metadata only at info level  
- SLO dashboards: Gateway, auth, intelligence p95, execution success  
- Alerts: SLO breach, VRF bypass attempt, cross-tenant denial spike, circuit open  
- Support tickets auto-attach correlation_id per GIS  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Logs only** | No latency breakdown for intelligence |
| **Full prompt logging in ops** | Privacy and secret leakage |
| **Per-module disconnected telemetry** | Cannot reconstruct cycles |
| **Client-side only analytics** | Incomplete server truth |

---

## Rationale

CCIS observable by design. SDD-I §5.3 envelope. SDD-II event catalog. RTM-ENG-008.

---

## Consequences

### Positive

- Incident timeline reconstruction  
- Intelligence performance tuning data for SDD IV  

### Negative / Trade-offs

- Storage cost for traces  
- PII classification discipline |

### Neutral

- Vendor (Datadog, etc.) — implementation |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Regulated prompt retention | Classification ADR |
| SLO revision | Dashboard update — not architecture change |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 10 | Full specification |
| SDD-I §5 | Events |
| SDD-II | Observability events |
| INF-12 | Law |
| RTM-ENG-008, RTM-INF-009 | Traceability |
