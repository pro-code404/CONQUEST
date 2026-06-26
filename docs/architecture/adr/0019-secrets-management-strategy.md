# ADR-0019: Secrets Management Strategy

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

Conquest integrates AI providers, payments, email, data sources, and webhooks. Credentials must not appear in client, logs, intelligence artifacts, or Application configuration plaintext. SDD-I §7.4 prohibits client keys.

---

## Decision

**Security Layer + Integration Layer custody** for all secrets.

- Secrets referenced by ID in Application — resolved at runtime by Security service  
- AI provider credentials: Integration custody; Intelligence receives ephemeral scoped tokens  
- Webhook secrets: signature verify at Integration ingress; signing keys in store  
- Rotation via dual-key overlap window — zero downtime  
- Revocation propagates < 60s conceptual SLA  
- All access audited — secret value never logged  
- Development namespaces isolated — never production keys  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Environment variables in app containers** | Leak via logs, dumps, repos |
| **Secrets in database plaintext** | Exfiltration risk |
| **Per-developer shared prod keys** | Audit failure |
| **Client-held integration keys** | INF-7 violation |

---

## Rationale

ADR-0011 AI abstraction requires provider credential boundary. INF-7. RTM-INF-003.

---

## Consequences

### Positive

- Centralized rotation and audit  
- Marketplace adapter credential isolation  

### Negative / Trade-offs

- Security service availability critical  
- Local dev complexity |

### Neutral

- Vault product selection — implementation |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Hardware security module requirement | Custody ADR amendment |
| Tenant-provided BYOK secrets | Enterprise extension |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 5 | Full specification |
| SDD-I §7.4 | AI boundary |
| INF-7, INF-11 | Laws |
| RTM-INF-003, 007 | Traceability |
| ADR-0011, 0018 | Related |
