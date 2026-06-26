# ADR-0017: Identity & Session Model

## Status

`Accepted`

| Field | Value |
|-------|-------|
| **Date** | 2026-06-21 |
| **Deciders** | Conquest Architecture Program |
| **Architecture Freeze** | v1.0 — Amends freeze (infrastructure) |

---

## Context

GIS defines RBAC, route guards, and fail-closed permission behavior. SDD-I §7.9 provides conceptual auth placeholder. SDD-III must specify server-side session model without altering UX flows or role definitions.

---

## Decision

**Server-side sessions** with Auth platform service (`platform/auth`) as sole identity authority.

- Session binds: `user_id`, `org_id`, `active_workspace_id`, `auth_strength`, `device_id`  
- Sliding TTL with refresh token rotation  
- Immediate revocation on security events — Gateway rejects revoked sessions  
- RBAC: GIS §2 hierarchy — enforced at Application command boundary  
- MFA step-up for high-stakes execution per org policy  
- SSO via Integration IdP — org-mandated SSO disables local password  
- Guests: PUB-* only — no intelligence API  

---

## Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| **Pure JWT stateless** | Revocation latency; harder session family kill |
| **Client-side session state** | Untrusted client |
| **Per-module auth** | Inconsistent — GIS requires unified guards |
| **Long-lived tokens without rotation** | Compromise blast radius |

---

## Rationale

GIS route guards (§2.5). SDD-I §7.9 trust zones. Fail closed (EL-19). SET-03a MFA hook.

---

## Consequences

### Positive

- Immediate revocation capability  
- Unified support for GIS SYS-01/02  
- Clear audit on auth events  

### Negative / Trade-offs

- Session store availability critical path  
- Stateful auth vs horizontal scale — solved via shared session store |

### Neutral

- Token format implementation detail deferred to SDD V |

---

## Future Review Criteria

| Trigger | Action |
|---------|--------|
| Passkey-only enterprise | GIS + auth amendment |
| Session duration policy per org | Settings — no ADR unless model change |

---

## Related Documents

| Document | Relevance |
|----------|-----------|
| SDD-III Part 4 | Full specification |
| UXMD-III GIS §2 | RBAC source |
| SDD-I §7.9 | Conceptual auth |
| INF-3, INF-6 | Laws |
| RTM-UX-005–007, RTM-INF-006 | Traceability |
| ADR-0012 | GIS inheritance |
