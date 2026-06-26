# ADR-0011: AI Provider Abstraction

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Frozen |

---

## Context

Conquest depends on external AI model providers for reasoning, research synthesis, and human-language calibration. Direct provider SDK usage across Application modules would couple product code to vendors, leak credentials, and prevent provider failover. Enterprise customers require provider flexibility and data handling controls.

---

## Decision

**AI model invocation is abstracted behind the Intelligence Layer** — Application and Presentation never call provider SDKs directly.

| Rule | Requirement |
|------|-------------|
| **Abstraction** | Intelligence engines call a provider interface — not direct SDK in Application |
| **No keys in client** | Ever — credentials in Integration/Security custody only |
| **Logging** | Prompts/responses classified per retention policy (SDD III detail) |
| **Fallback** | Provider failure → structured degradation — no false confidence |
| **Direction** | Outbound integration domain per SDD-I §7.2 |

Orchestration routes intelligence work — engines consume abstraction. Replaceable components principle (SDD-I §1.2) applies to engines and providers without product redesign.

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Client-side model calls** | Key exposure; no governance; violates security |
| **Per-module provider SDK** | Vendor lock-in; inconsistent logging and retry |
| **Single hardcoded provider** | No failover; enterprise inflexibility |
| **Provider in Orchestration** | Orchestration routes — does not conclude; wrong layer |

---

## Rationale

SDD-I §7.4 AI Provider Boundary. AMD replaceable components. SDD-II external research domain isolation. Provider outage listed in SDD-I failure assumptions — structured degradation required.

---

## Consequences

### Positive

- Vendor swap without module changes  
- Centralized prompt/response governance for SDD III security  
- Consistent circuit breaker per provider (Integration Layer)  

### Negative / Trade-offs

- Abstraction layer engineering in SDD IV  
- Latency indirection  

### Neutral

- Specific providers (OpenAI, Anthropic, Gemini, etc.) chosen in implementation — not frozen |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Multi-provider routing policy | SDD IV + new ADR if architectural |
| On-prem model deployment | ADR for boundary extension |
| Netlify AI Gateway or equivalent | Implementation choice — must comply with abstraction rules |

---

## Related Documents

| Document | Section / relevance |
|----------|---------------------|
| SDD-I | §7.4; §1.2 Replaceable components |
| SDD-II | External research path |
| SDD IV | Pending — orchestration detail |
| ADR-0014 | Module boundaries |
| ADR-0010 | Event-driven architecture |
