# ADR-0018: Encryption & Key Custody

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

Enterprise customers require encryption in transit and at rest. Multi-tenant storage requires key isolation. AMD III §44 addresses memory security at architecture level — SDD-III defines operational encryption model.

---

## Decision

**Envelope encryption** with platform root KEK and org-scoped DEKs.

- TLS 1.2+ mandatory for all external transit; mTLS for internal service auth where implemented  
- All durable stores encrypted at rest — not optional  
- KEK in KMS/HSM equivalent — Security custody  
- DEK per org or storage partition — lazy re-encryption on rotation  
- Backup encryption with keys distinct from operational DEK  
- Session signing keys separate hierarchy from data keys  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Single platform DEK** | Cross-tenant key compromise blast radius |
| **Application-managed keys** | Leak risk; inconsistent |
| **Encrypt only PII fields** | Incomplete — intelligence artifacts need protection |
| **Client-side encryption** | Breaks Memory Manager governance |

---

## Rationale

Defense in depth with tenant isolation (ADR-0016). INF-8, INF-9. Enterprise compliance baseline.

---

## Consequences

### Positive

- Breach containment per org  
- Standard enterprise security questionnaire answers  

### Negative / Trade-offs

- Key rotation operational overhead  
- KMS dependency for production |

### Neutral

- Specific KMS vendor — implementation choice |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Customer-managed keys (CMK) | Enterprise ADR extension |
| Field-level encryption for special categories | AMD III + SDD amendment |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 9 | Full specification |
| AMD III §44 | Memory security |
| INF-8, INF-9, INF-11 | Laws |
| RTM-INF-004, 005, 007, 015 | Traceability |
| ADR-0016 | Tenant isolation |
