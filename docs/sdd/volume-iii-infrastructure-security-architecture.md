# SDD VOLUME III — INFRASTRUCTURE & SECURITY ARCHITECTURE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | SDD Volume III — Infrastructure & Security Architecture |
| **Abbreviation** | SDD-III |
| **Status** | Engineering Architecture Authority — Volume 3 of 5 |
| **Version** | 1.0 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD Volumes I–IV, SDD Volume I v1.1, SDD Volume II v1.1 |
| **Derived From** | Frozen corpus + [ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md) + [RTM](../architecture/requirements-traceability-matrix.md) + ADR-0001–0025 |
| **Precedes** | SDD Volume IV, V; all implementation |

### Mission

Define **how Conquest is secured, isolated, observed, recovered, and operated in production** as conceptual engineering architecture — without selecting cloud vendors, writing infrastructure configuration, or altering frozen product behavior.

| Document | Question |
|----------|----------|
| SDD Volume I | How is the platform engineered as a system? |
| SDD Volume II | How does information behave as an engineered system? |
| **SDD Volume III** | **How is production infrastructure and security engineered?** |
| SDD Volume IV | How does AI orchestration work? |
| SDD Volume V | How is build and release governed? |

### Strict Prohibitions

No implementation code, database schemas, API endpoint definitions, Terraform, Docker, Kubernetes manifests, cloud configuration files, deployment scripts, or vendor-specific commitments unless noted as conceptual placeholder.

**Build phase has not started.**

---

# PART 0 — AUTHORITY & COMPLIANCE

## 0.1 Authority Resolution

```
CCIS > AMD > PDD > UXMD > SDD
```

SDD-III elaborates infrastructure and security. It **does not** redefine workflows, UX, navigation, product behavior, intelligence lifecycle, or memory behavior.

## 0.2 Architecture Freeze Compliance

| Freeze element | SDD-III conformance |
|----------------|---------------------|
| CCIS loop & verification | INF-4, Part 8 — enforcement at Gateway and Orchestration |
| 7-item navigation | No nav changes — Presentation routes only |
| Module boundaries | Part 2 trust boundaries per ADR-0014 |
| Memory Manager sole write | Part 3, 7 — storage isolation; no bypass paths |
| Learning Boundary | Part 2 — no execution path from Learning tier |
| GIS RBAC | Part 4 — implements GIS §2 |
| AI provider abstraction | Part 6 — outbound AI zone |

## 0.3 ADR Compliance Matrix

| ADR | SDD-III binding |
|-----|-----------------|
| 0001 | Hierarchy preserved |
| 0003, 0016 | Tenant/workspace isolation Part 3 |
| 0006, 0007 | VRF gate Part 8 — no infrastructure bypass |
| 0008 | Memory storage isolation Part 3, 7 |
| 0009 | Learning tier isolation Part 2 |
| 0010 | Event bus Part 2, 10 |
| 0011 | AI outbound Part 6 |
| 0012 | Auth/RBAC Part 4 implements GIS |
| 0015 | Execution tier isolation Part 2 |
| 0016–0025 | Infrastructure decisions Parts 1–15 |

## 0.4 Cross-Document References

| Document | Relationship |
|----------|--------------|
| [CCIS](../architecture/ccis.md) | Supreme — security and trust laws |
| [AMD III](../architecture/amd/volume-iii-memory-architecture.md) | Memory security §44 |
| [AMD IV](../architecture/amd/volume-iv-intelligence-systems.md) | Intelligence boundaries |
| [PDD Authority Bridge](../pdd/pdd-volume-i-authority-bridge.md) | Conditional PDD-I |
| [UXMD-III GIS](../uxmd/volume-iii-global-interaction-standards.md) | Permission and state binding |
| [SDD-I](volume-i-system-architecture.md) | Layers, events, §7.9 auth placeholder, §8 topology |
| [SDD-II](volume-ii-data-intelligence-architecture.md) | IL laws, retention, permissions Part 23 |
| [RTM](../architecture/requirements-traceability-matrix.md) | Requirement traceability |
| [ARCHITECTURE-FREEZE](../architecture/ARCHITECTURE-FREEZE.md) | Frozen corpus |

## 0.5 Known Constraints

| Constraint | Source |
|------------|--------|
| AMD I–II not in repository | Commit pending P0-2 |
| SDD-II lifecycle errata P0-1 | Verify→Decide order — SDD-III does not alter |
| PDD-I v2.1 open items | Build blocker only |
| No vendor selection | Conceptual architecture only |
| Enterprise SSO deferred detail | Part 4 — Integration adapter boundary |

## 0.6 Open Issues

| ID | Issue | Target |
|----|-------|--------|
| OIII-1 | SDD-II v1.2 lifecycle errata | Parallel track |
| OIII-2 | AMD I–II repo commit | AMD program |
| OIII-3 | SDD-IV agent hierarchy detail | SDD IV |
| OIII-4 | SDD-V CI gate specifics | SDD V |

## 0.7 RTM Compliance

All Part F requirements (RTM-INF-001 through RTM-INF-015) addressed in Parts 1–14 and INF-1–INF-25.

---

# PART 1 — INFRASTRUCTURE PHILOSOPHY

## 1.1 Availability Philosophy

Conquest prioritizes **correct availability** over raw uptime. Read-only access to last verified intelligence during degradation is preferable to serving unverified conclusions. Auth and tenant isolation remain available even when intelligence workers are degraded.

## 1.2 Reliability Philosophy

At-least-once event delivery with idempotent consumers (SDD-I EP-2). Classified retry per §5.8 philosophy — transient vs fatal. No silent data loss on ingestion (BH-7).

## 1.3 Scalability Philosophy

Horizontal scale for stateless tiers (Gateway, Application, Platform). Queue-driven scale for Intelligence and Execution. Workspace affinity for memory retrieval and execution queues — not global shared mutable state.

## 1.4 Isolation Philosophy

**Organization is the hard tenant boundary.** Workspace is the intelligence scope boundary. No cross-org reads, events, or storage paths (EL-8, EP-6). Extension isolation for Marketplace adapters.

## 1.5 Security-First Philosophy

Fail closed on auth, permission, and verification failures (EL-19, GIS §2.5). Security Layer (L1) wraps all inbound paths. Zero trust between internal zones — authenticate and authorize at every boundary crossing.

## 1.6 Cost Philosophy

Scale-to-zero for non-production. Intelligence depth routing reduces unnecessary provider cost (SDD IV). Tiered storage per retention class R0–R5. Cache before duplicate provider calls where freshness allows (BH-7).

## 1.7 Trust Philosophy

Client is **untrusted** — bearer token only. Gateway validates session. Intelligence and Execution operate on delegated workspace scope — never user-supplied scope strings without validation.

## 1.8 Failure Philosophy

Assume provider outage, stale data, model disagreement, partial ingestion, quota exhaustion, malicious input, execution failure, workspace switch mid-cycle, session invalidation (SDD-I §1.4). Every tier defines degraded mode — never false success (GIS-S1).

## 1.9 Production Philosophy

Production readiness is an engineering gate (INF-25), not a deployment checkbox. Feature flags and kill switches protect tenants during incidents. Observability is mandatory before production traffic.

---

# PART 2 — INFRASTRUCTURE ARCHITECTURE

## 2.1 Conceptual Platform Topology

Extends SDD-I §8.2. Physical mapping is implementation — logical topology is frozen.

```
[ Users ]
    │
[ Client ] — UXMD-II screens + GIS; untrusted
    │
[ Edge ] — TLS termination, WAF, rate limit, DDoS
    │
[ Gateway + Auth ] — session, tenant context, routing, release gates
    │
    ├─ [ Application Services ] — module bounded contexts
    ├─ [ Orchestration ] — cycle routing; no conclusion
    ├─ [ Intelligence Workers ] — cognitive engines; provider abstraction
    ├─ [ Execution Workers ] — authorized actions only
    ├─ [ Integration Adapters ] — external normalization
    └─ [ Platform Services ] — Auth, Notifications, Billing
            │
    [ Async Message Bus ] — event envelope SDD-I §5.3
            │
    ├─ [ Primary Operational Store ]
    ├─ [ Memory Store ] — governed categories
    ├─ [ Artifact Store ] — intelligence artifacts UAC
    ├─ [ Object Store ] — uploads, exports
    ├─ [ Vector Index ] — knowledge retrieval
    ├─ [ Search Index ] — help + knowledge distinct (IL-13)
    └─ [ Observability Stack ] — metrics, logs, traces
```

## 2.2 Tier Specifications

| Tier | Responsibility | Trust | Failure mode |
|------|----------------|-------|--------------|
| **Client** | Presentation; GIS states | Untrusted | Offline cache + S-OFFLINE |
| **Edge** | Perimeter protection | Semi-trusted | Rate limit; block |
| **Gateway** | AuthZ, tenant inject, VRF release gate | Trust anchor | Fail closed |
| **Application** | PDD use cases | Authenticated | Degrade features |
| **Orchestration** | Route cycles | System + scope | Queue backlog |
| **Intelligence** | Cognitive work | System + scope | Structured degradation |
| **Execution** | Authorized IO | System + auth record | Pause + rollback |
| **Learning Boundary** | Proposal governance | System | Reject proposals |
| **Memory/Data** | Persistence + Memory Manager | System | Read-only fallback |
| **Integration** | External IO | Scoped credentials | Circuit breaker |
| **Observability** | Telemetry | Admin read RBAC | Buffer locally |

## 2.3 Dependencies

Gateway depends on Auth service. Application depends on Gateway context. Intelligence depends on Orchestration dispatch — not reverse. Execution depends on VRF pass + authorization. All depend on Observability emit.

## 2.4 Trust Boundaries

| Boundary | Enforcement |
|----------|-------------|
| Client → Edge | TLS, cert pinning optional enterprise |
| Edge → Gateway | Token validation, rate limit |
| Gateway → Application | Session context + org_id + workspace_id |
| Application → Intelligence | Orchestration command only |
| Intelligence → Provider | Abstraction interface; no raw user text without sanitization |
| Execution → Integration | Capability registry + auth record |
| Any → Memory | Memory Manager API only |

## 2.5 Failure Boundaries

Blast radius containment (SDD-I §8.5): workspace-scoped execution failure does not block org auth. Intelligence tier failure does not block read-only last-verified projections. Provider failure does not cascade across tenants.

## 2.6 Recovery

Per-tier recovery in Part 11. Gateway horizontal redundancy. Queue redelivery with idempotency. Memory rollback via versioning (AMD III).

---

# PART 3 — TENANT ARCHITECTURE

## 3.1 Organization Isolation

`org_id` is the **hard multi-tenant key**. Every durable record, event, log line, and secret namespace includes `org_id`. Cross-org queries are architecturally prohibited — enforced at Gateway and Data access layer.

## 3.2 Workspace Isolation

`workspace_id` scopes intelligence, memory retrieval, automation, reports, and goals within an org. Users may belong to multiple workspaces. Workspace switch invalidates projection caches (SDD-II Part 19).

## 3.3 User Isolation

Users have identity global to org (or federated SSO). Permissions resolved per workspace membership. Self-scoped settings (GIS account) isolated from org settings.

## 3.4 Permission Boundaries

GIS §2 matrix enforced at Application command boundary. Gateway validates session; Application validates permission per action. Domain resolves role. Fail closed — no partial field leak.

## 3.5 Storage Isolation

Logical partition per org minimum. Workspace-scoped indices where applicable. Backup sets org-scoped. Restore never cross-org.

## 3.6 Memory Isolation

Memory Manager enforces scope on every read/write. Admin-only memories excluded from Member retrieval (IL PERM-2). Deleted workspace triggers governed retirement (IL-15).

## 3.7 Event Isolation

EP-6: cross-org events forbidden. Event envelope requires org_id. Consumers reject missing or mismatched scope.

## 3.8 Logging Isolation

Logs include org_id, workspace_id, correlation_id. Support access requires elevated audited session (Part 4). No PII in debug logs without classification.

## 3.9 Secrets Isolation

Secrets namespaced per org (and per integration where applicable). Platform secrets separate from tenant secrets. No secret material in logs or traces.

## 3.10 Extension Isolation

Marketplace adapters run in isolated execution context. Manifest verification before install. Permissions granted explicitly — minimum necessary. No adapter direct Memory Manager write.

---

# PART 4 — IDENTITY ARCHITECTURE

## 4.1 Authentication

Identity proof via Auth platform service (`platform/auth`). Supports email/password, SSO federation (Integration IdP adapter), and MFA. Guest access limited to PUB-* routes (SDD-I §7.9).

**Flows:** registration → email verification → onboarding → session. Invitation: `domain.MemberInvited` → accept → bind membership.

## 4.2 Authorization

RBAC per GIS §2: Owner > Admin > Manager > Member > Viewer. Higher inherits lower unless restricted. Application enforces per-command — not UI-only.

## 4.3 RBAC Engineering

Role resolution at Domain layer. Cached with short TTL — invalidated on `domain.MembershipChanged`. Permission denied → GIS SYS-01 pattern.

## 4.4 Sessions

Server-side session store with sliding TTL. Session binds: user_id, org_id, active_workspace_id, auth_strength (MFA satisfied boolean), device_id. `platform.SessionCreated`, `platform.SessionInvalidated` events.

## 4.5 Session Rotation

Refresh token rotation on renewal. Compromised session detection triggers invalidation of session family. Concurrent session policy configurable per org (Settings).

## 4.6 Session Revocation

Logout, password change, MFA reset, admin revoke, security incident — all emit `platform.SessionInvalidated`. Gateway rejects revoked session immediately — no grace cache.

## 4.7 Device Trust

Optional device fingerprint for enterprise. New device → email alert + optional MFA challenge. Untrusted device may restrict execution approval (org policy).

## 4.8 Email Verification

Unverified users redirect to `/verify-email` (GIS §2.5). No workspace intelligence until verified — except invitation accept path.

## 4.9 Password Reset

Time-limited single-use token. Reset invalidates all sessions. Audit event emitted.

## 4.10 MFA

TOTP/WebAuthn via SET-03a. MFA enrollment stores factor reference — not secret in Application. Gateway intercepts MFA-required policies. Step-up for high-stakes execution approval.

## 4.11 Emergency Lock

Owner/Admin may org-wide lock: blocks execution, automation runs, marketplace install. Read-only intelligence access may remain. `platform.EmergencyLockActivated` event.

## 4.12 Workspace Membership

Invite → pending → accept/expire. Role assigned at invite. Removal revokes workspace-scoped sessions if active workspace matches.

## 4.13 Support Access

Break-glass support access: time-boxed, audited, Owner-approved where policy requires. Support actor tagged in audit — never anonymous. Read-only default; write requires second approval.

## 4.14 Administrative Access

Admin actions (member remove, SSO config, integration credentials) require Admin+ and audit. Owner-only: billing, workspace delete, ownership transfer.

## 4.15 Temporary Elevation

Just-in-time elevation for irreversible actions — optional enterprise feature. Elevation expires automatically. Full audit trail.

---

# PART 5 — SECRETS ARCHITECTURE

## 5.1 API Keys

Integration API keys stored in Security custody — referenced by ID only in Application. Keys scoped per workspace or org per integration policy. Rotation without downtime via dual-key window.

## 5.2 Encryption Keys

Data encryption keys (DEK) per org or per storage partition. Master keys (KEK) in HSM or cloud KMS equivalent — conceptual. Envelope encryption Part 9.

## 5.3 Provider Credentials

AI provider, payment, email, push credentials — Integration Layer custody only. Intelligence engines receive ephemeral scoped tokens from Security service — not raw keys.

## 5.4 Webhook Secrets

Inbound webhook signature verification at Integration ingress. Outbound webhook signing keys in secrets store. Replay protection via timestamp + nonce (Part 8).

## 5.5 Key Custody

Security Layer owns secret reference resolution. Forbidden: secrets in client, environment variables in Application pods without injection abstraction, secrets in logs/traces, secrets in intelligence artifacts.

## 5.6 Key Rotation

Scheduled rotation for DEK and integration keys. Emergency rotation on compromise. Rotation events audited. Zero-downtime via overlapping validity window.

## 5.7 Key Revocation

Immediate revocation on compromise, member offboarding for personal tokens, integration uninstall. Revocation propagates to Gateway within SLA (< 60s conceptual).

## 5.8 Ownership

| Secret type | Owner |
|-------------|-------|
| Org integration keys | Org Admin |
| Platform operations keys | Platform ops — not tenant accessible |
| Encryption KEK | Security custody |
| Session signing keys | Auth service |

## 5.9 Audit

All secret access logged: actor, secret_id (not value), operation, timestamp, correlation_id. Anomaly detection on access patterns.

## 5.10 Access Rules

Least privilege. Break-glass requires ticket reference. No human plaintext export in production. Development uses isolated secret namespace — never production keys.

---

# PART 6 — NETWORK ARCHITECTURE

## 6.1 Trust Zones

| Zone | Components |
|------|------------|
| **Public** | Client, Edge |
| **DMZ** | Gateway |
| **Application** | App services, Orchestration |
| **Cognitive** | Intelligence, Learning Boundary |
| **Execution** | Execution workers |
| **Data** | Stores, Memory Manager |
| **Integration** | Adapters, outbound proxies |
| **Management** | Observability admin, break-glass |

## 6.2 Internal Communication

Service-to-service authenticated (mTLS or signed service identity — implementation choice). No trust by network location alone. Every call carries correlation_id.

## 6.3 External Communication

All egress through Integration proxy where policy requires. Allowlist per adapter. TLS required.

## 6.4 Gateway

Single north-south API surface for client. Validates session, injects tenant context, applies rate limits, blocks unauthenticated intelligence paths.

## 6.5 Outbound AI

Intelligence workers → AI abstraction → Integration AI proxy → provider. Prompt sanitization at ingress to Intelligence. Response classification before logging. No direct internet from Application tier.

## 6.6 Third-Party Integrations

Per-connector circuit breaker. Schema normalization before `integration.DataIngested`. OAuth token refresh in Integration custody.

## 6.7 Private Services

Memory Manager, Auth, internal bus — no public routes. Management interfaces VPN or zero-trust admin only.

## 6.8 Administrative Paths

Separate admin API or role-gated routes. MFA required. IP allowlist optional enterprise. All admin actions audited.

## 6.9 Boundary Enforcement

Network policies conceptual: Cognitive cannot call Integration directly. Client cannot reach Data. Execution cannot call Intelligence for conclusions. Learning cannot reach Execution.

---

# PART 7 — STORAGE ARCHITECTURE

## 7.1 Operational Information

Transactional store for domain state, memberships, entitlements, automation definitions. Org-partitioned. Encrypted at rest.

## 7.2 Memory

Governed memory categories per AMD III. Memory Manager sole API. Versioned records. Workspace + org scope on all queries.

## 7.3 Knowledge

Document metadata + vector index. Distinct from help index (IL-13). Upload virus scan at Integration ingress — conceptual.

## 7.4 Evidence

Evidence Memory with provenance chain. Immutable after validation promotion. Links to source ingestion records.

## 7.5 Reports

Immutable snapshots post-seal. Object store for export files. Share links permission-scoped.

## 7.6 Artifacts

Intelligence artifacts OBS–OPT per SDD-II taxonomy. UAC fields mandatory. Artifact store with lineage index.

## 7.7 Logs

Structured logs — retention per class. PII minimization. Org-scoped access.

## 7.8 Audit

Append-only audit store. Security events, permission changes, execution approvals, admin actions, support break-glass. Longer retention than operational logs.

## 7.9 Vectors

Vector index for knowledge retrieval. Scoped per org/workspace. Reindex on knowledge update events.

## 7.10 Backups

Org-scoped backup sets. Encrypted. Tested restore (Part 11). Separate from operational replicas.

## 7.11 Snapshots

Report and configuration snapshots immutable. Point-in-time recovery for operational store per tier.

## 7.12 Retention

| Class | Examples | Policy |
|-------|----------|--------|
| R0 | Ephemeral session | Session end |
| R1 | Operational | 90d default |
| R2 | Intelligence artifacts | 1–7y per org policy |
| R3 | Audit | 7y minimum enterprise |
| R4 | Legal hold | Indefinite until release |
| R5 | Deleted | Cryptographic erase schedule |

## 7.13 Recovery

Restore procedures per Part 11. Memory versioning enables logical rollback without full restore.

## 7.14 Ownership

| Store | Engineering owner |
|-------|-------------------|
| Operational | Data platform |
| Memory | Memory Manager |
| Artifacts | Data + Intelligence |
| Audit | Security platform |
| Object | Infrastructure platform |

---

# PART 8 — SECURITY ARCHITECTURE

## 8.1 Threat Model (Conceptual)

| Threat | Mitigation |
|--------|------------|
| Cross-tenant data access | org_id enforcement INF-1 |
| Session hijack | Rotation, revocation, MFA INF-6 |
| Privilege escalation | RBAC + fail closed INF-3 |
| Prompt injection | Ingress sanitization INF-13 |
| Model abuse / cost attack | Rate limit, quota INF-16 |
| Data poisoning via ingestion | Validation before Observation INF-14 |
| Replay attacks | Nonce + timestamp on webhooks INF-15 |
| Secret exfiltration | Custody INF-7 |
| Supply chain compromise | Dependency verification INF-23 |
| Insider threat | Audit, break-glass controls INF-24 |

## 8.2 Zero Trust

No implicit trust by network zone. Authenticate service identity. Authorize every cross-boundary operation. Continuous validation.

## 8.3 Least Privilege

Minimal role default (Viewer where applicable). Integration credentials scoped. Service accounts per tier — not shared superuser.

## 8.4 Verification-Before-Execution Enforcement

Gateway and Orchestration block Experience release without VRF pass (IL-1). Execution workers reject jobs without authorization record + VRF reference for major class. Infrastructure cannot bypass — INF-4.

## 8.5 Prompt Injection Defense

Input classification at Intelligence ingress. System/user boundary separation in prompts. Tool invocation allowlist. Output validation before persistence.

## 8.6 Model Abuse Prevention

Per-org rate limits. Token budgets. Anomaly detection on request volume. Circuit breaker on provider errors.

## 8.7 Data Poisoning Protection

Ingestion validation before enrichment. Source trust scoring. Anomaly flag on sudden distribution shift. Quarantine path for suspect batches.

## 8.8 Replay Protection

Webhook signatures with timestamp window. Idempotency keys on commands (SDD-I §5.3). Event deduplication at consumers.

## 8.9 Rate Limiting

Edge: DDoS and IP rate. Gateway: per-user and per-org API limits. Intelligence: per-workspace cycle limits. Graceful 429 with GIS error pattern.

## 8.10 Abuse Detection

Signals: failed auth bursts, cross-workspace probe patterns, export volume anomalies, automation creation spikes. Alert → optional auto-lock.

## 8.11 Secrets Protection

See Part 5. INF-7. Client bundle scanning in SDD V.

## 8.12 Supply-Chain Protection

Signed marketplace manifests. Dependency pinning in SDD V. SBOM generation gate.

## 8.13 Dependency Verification

Third-party adapter code review gate. Marketplace extension sandbox. No arbitrary code execution in Application tier.

## 8.14 Security Monitoring

SIEM integration conceptual. Alerts on auth anomalies, VRF bypass attempts, cross-tenant access denials, break-glass usage.

## 8.15 Incident Response

See Part 13 and INF-24. Severity levels. Communication templates. Post-incident review mandatory.

---

# PART 9 — ENCRYPTION

## 9.1 Data in Transit

TLS 1.2+ minimum for all external. mTLS optional internal. HSTS at Edge. Certificate rotation automated.

## 9.2 Data at Rest

All durable stores encrypted. Org-scoped DEK where multi-tenant shared infrastructure. Encryption mandatory — not optional feature.

## 9.3 Envelope Encryption

KEK encrypts DEK. DEK encrypts data. KEK in KMS/HSM. DEK rotation without re-encrypting all data immediately — lazy re-encryption acceptable.

## 9.4 Key Hierarchy

```
Root KEK (platform)
  └── Org KEK or DEK
        └── Data encryption
Session signing keys (separate hierarchy)
Integration secret encryption keys
```

## 9.5 Key Custody

Security service — not Application. Key access audited. Separation of duties for root KEK operations.

## 9.6 Rotation

Scheduled + emergency. Overlap window. Automated where possible. Manual root rotation with dual control.

## 9.7 Recovery

Key recovery requires break-glass procedure. Backup keys escrowed per enterprise policy. Documented in DR Part 11.

## 9.8 Backup Encryption

Backups encrypted with distinct keys from operational DEK. Restore validates integrity before attach.

---

# PART 10 — OBSERVABILITY

## 10.1 Metrics

RED/USE per tier. SLO dashboards: Gateway latency, intelligence cycle duration, execution success rate, auth availability. Org-level quota metrics — not cross-org comparative in tenant UI.

## 10.2 Tracing

Distributed tracing with correlation_id = trace root. Span per orchestration stage. Intelligence spans include engine name — not prompt content in production default.

## 10.3 Logging

Structured JSON. Mandatory fields: timestamp, level, org_id, workspace_id, correlation_id, service, event_type. Classification tags for PII and prompt data.

## 10.4 Correlation IDs

Propagate from Gateway through all tiers. User-visible support references correlation_id (GIS support attachment). AI traces link to intelligence cycle ID.

## 10.5 AI Traces

Cycle ID, engine, model class (not vendor secret), token usage, latency, VRF outcome. Prompt/response stored per retention class — default redacted in ops views.

## 10.6 Memory Traces

Memory Manager operations: read/write/promote/rollback with memory_id, category, actor. No memory content in info-level logs.

## 10.7 Prediction Traces

Prediction registry events, horizon, calibration outcome. Links to measurement artifacts.

## 10.8 Recommendation Traces

Surface, decision, supersede events. User decision attribution.

## 10.9 Execution Traces

Run ID, steps, bounds violations, rollback events. Authorization record reference.

## 10.10 Health Monitoring

Liveness and readiness per service. Dependency health aggregated. Synthetic probes for auth and Gateway.

## 10.11 Alerting

Pager rules on SLO breach, auth failure rate, VRF bypass attempt, cross-tenant denial spike, queue depth, provider circuit open.

## 10.12 Incident Timelines

Automated timeline from correlated events. Post-incident export for review. Retained per R3.

---

# PART 11 — DISASTER RECOVERY

## 11.1 Backup Philosophy

Backups are org-scoped, encrypted, tested. Backup without tested restore is not a backup.

## 11.2 Recovery Philosophy

Recover to consistent point. Intelligence artifacts may replay from event log where store recovery insufficient. Memory versioning aids logical recovery.

## 11.3 High Availability

Gateway and Auth: N+2 minimum production. Stateless tiers auto-scale. Data: replicated primaries.

## 11.4 Fault Isolation

Cell-based optional future — org shards. Minimum: workspace execution isolation.

## 11.5 Regional Failure

Active-passive or active-active conceptual — SDD V selects. DNS failover. RPO/RTO per tier class.

## 11.6 Provider Failure

Circuit breaker; queue backlog; user messaging per BH-7. No false intelligence during outage.

## 11.7 Database Failure

Failover to replica. Read-only mode if split-brain risk. Stale reads flagged.

## 11.8 Queue Failure

Durable queue required. Dead letter with alert. Replay with idempotency.

## 11.9 AI Provider Failure

Fallback provider or degraded mode — structured uncertainty. No silent model swap without audit.

## 11.10 Restore Philosophy

Validate integrity → restore org partition → replay events if needed → verify VRF chain intact for released artifacts.

## 11.11 RTO Philosophy

| Tier class | RTO target (conceptual) |
|------------|-------------------------|
| Auth + Gateway | < 15 min |
| Application read | < 30 min |
| Intelligence async | < 4 hr backlog clear |
| Full data restore | < 24 hr |

## 11.12 RPO Philosophy

| Tier class | RPO target (conceptual) |
|------------|-------------------------|
| Operational transactional | < 5 min |
| Memory writes | < 15 min |
| Audit log | 0 (sync replicate) |
| Object store | < 1 hr |

---

# PART 12 — PERFORMANCE ARCHITECTURE

## 12.1 Latency Philosophy

Interactive read: GIS-acceptable screen load (SDD-I). Intelligence async — never block UI on full cycle. Progress via GIS S-LOAD.

## 12.2 Caching

Projection cache per SDD-II Part 19. Invalidate on intelligence events, workspace switch, permission change. CDN for static assets. No cache of unverified intelligence as released.

## 12.3 Scaling

Horizontal stateless. Queue depth triggers worker scale. Per-org fairness scheduling prevents noisy neighbor.

## 12.4 Connection Management

Pool per service. Timeout classification. Graceful drain on deploy.

## 12.5 Compression

Payload compression on bus and API for large artifacts. Not on encrypted fields without care.

## 12.6 Queue Management

Priority queues: P0 alerts > user-initiated > background. Dead letter after max retries per §5.8.

## 12.7 Resource Isolation

Per-org CPU/memory budget on shared workers optional. Execution queues per workspace.

## 12.8 Performance Observability

p50/p95/p99 per route and cycle stage. Regression gates in SDD V.

---

# PART 13 — OPERATIONAL ARCHITECTURE

## 13.1 Production Readiness

INF-25 gate: security review, DR drill, observability dashboards, kill switch tested, RBAC matrix verified, RTM rows Specified minimum.

## 13.2 Feature Flags

Org-scoped or global. Never bypass VRF or auth via flag. Audit flag changes.

## 13.3 Kill Switches

| Switch | Effect |
|--------|--------|
| Intelligence release | Block new VRF-passed surfacing |
| Execution | Pause all runs |
| Marketplace install | Block new extensions |
| External AI | Degraded mode only |

## 13.4 Maintenance

Announced window. Read-only mode optional. Session grace for in-flight approvals.

## 13.5 Rollbacks

Application rollback via SDD V. Automation rollback per AUT-06. Learning rollback via Memory versioning. Intelligence artifacts not retroactively altered — supersede only.

## 13.6 Runbooks

Per incident type in INF-24. On-call rotation. Escalation path.

## 13.7 Incident Levels

| Level | Example |
|-------|---------|
| SEV-1 | Cross-tenant exposure suspected |
| SEV-2 | Auth outage, execution runaway |
| SEV-3 | Provider degradation, single-tenant |
| SEV-4 | Non-critical bug |

## 13.8 Emergency Procedures

Emergency lock, kill switches, session mass revocation, key rotation. Owner notification.

## 13.9 Deployment Governance

SDD V defines pipeline. Blue-green or canary conceptual. No deploy Friday without on-call. INF-25 required pass.

---

# PART 14 — INFRASTRUCTURE ENGINEERING LAWS

| Law | Title |
|-----|-------|
| INF-1 | Organization Isolation |
| INF-2 | Zero Trust Zones |
| INF-3 | Fail Closed Authorization |
| INF-4 | Verification Gate Infrastructure |
| INF-5 | Workspace Scope Enforcement |
| INF-6 | Session Security |
| INF-7 | Secrets Never in Client |
| INF-8 | Encryption in Transit |
| INF-9 | Encryption at Rest |
| INF-10 | Audit Completeness |
| INF-11 | Key Rotation |
| INF-12 | Correlation ID Propagation |
| INF-13 | Prompt Boundary Defense |
| INF-14 | Ingestion Quarantine |
| INF-15 | Retention Enforcement |
| INF-16 | Rate Limit Mandatory |
| INF-17 | Circuit Breaker per Provider |
| INF-18 | Cross-Org Event Prohibition |
| INF-19 | Memory Manager API Only |
| INF-20 | Backup Tested Restore |
| INF-21 | RTO/RPO Tier Compliance |
| INF-22 | Kill Switch Availability |
| INF-23 | Marketplace Manifest Verification |
| INF-24 | Incident Response Runbook |
| INF-25 | Production Readiness Gate |

## INF-1 — Organization Isolation

| | |
|-|-|
| **Purpose** | Prevent cross-tenant data access |
| **Rationale** | EL-8; enterprise trust |
| **Enforcement** | Gateway org_id inject; Data layer query guard |
| **Verification** | Penetration test; integration test |
| **Failure consequence** | SEV-1 incident; immediate halt |
| **Cross-reference** | ADR-0016; RTM-INF-001 |

## INF-2 — Zero Trust Zones

| | |
|-|-|
| **Purpose** | No implicit network trust |
| **Rationale** | Defense in depth |
| **Enforcement** | Service auth on internal calls |
| **Verification** | Zone boundary audit |
| **Failure consequence** | Architecture non-compliance |
| **Cross-reference** | ADR-0020; RTM-INF-002 |

## INF-3 — Fail Closed Authorization

| | |
|-|-|
| **Purpose** | Deny on auth failure — no partial leak |
| **Rationale** | EL-19; GIS §2.5 |
| **Enforcement** | Gateway + Application |
| **Verification** | Permission denial test suite |
| **Failure consequence** | Release blocker |
| **Cross-reference** | ADR-0017; RTM-UX-006 |

## INF-4 — Verification Gate Infrastructure

| | |
|-|-|
| **Purpose** | Infrastructure cannot bypass VRF |
| **Rationale** | IL-1; BH-5 |
| **Enforcement** | Orchestration release block |
| **Verification** | Attempt bypass test |
| **Failure consequence** | SEV-1 |
| **Cross-reference** | ADR-0006; RTM-INT-003 |

## INF-5 — Workspace Scope Enforcement

| | |
|-|-|
| **Purpose** | All intelligence scoped to workspace_id |
| **Rationale** | ADR-0003 |
| **Enforcement** | Context validation on every command |
| **Verification** | Cross-workspace probe test |
| **Failure consequence** | SEV-2 |
| **Cross-reference** | RTM-MEM-004 |

## INF-6 — Session Security

| | |
|-|-|
| **Purpose** | Rotation, revocation, MFA binding |
| **Rationale** | Account takeover prevention |
| **Enforcement** | Auth service |
| **Verification** | Session lifecycle E2E |
| **Failure consequence** | Release blocker |
| **Cross-reference** | ADR-0017; RTM-INF-006 |

## INF-7 — Secrets Never in Client

| | |
|-|-|
| **Purpose** | Prevent credential exfiltration |
| **Rationale** | SDD-I §7.4 |
| **Enforcement** | Build scan; repo hooks |
| **Verification** | Client bundle audit |
| **Failure consequence** | Release blocker |
| **Cross-reference** | ADR-0019; RTM-INF-003 |

## INF-8 — Encryption in Transit

| | |
|-|-|
| **Purpose** | Protect data on wire |
| **Rationale** | Enterprise compliance |
| **Enforcement** | Edge TLS termination |
| **Verification** | TLS scan |
| **Failure consequence** | Production block |
| **Cross-reference** | ADR-0018; RTM-INF-005 |

## INF-9 — Encryption at Rest

| | |
|-|-|
| **Purpose** | Protect durable data |
| **Rationale** | Breach containment |
| **Enforcement** | Storage tier mandatory |
| **Verification** | Storage audit |
| **Failure consequence** | Production block |
| **Cross-reference** | ADR-0018; RTM-INF-004 |

## INF-10 — Audit Completeness

| | |
|-|-|
| **Purpose** | Security-relevant actions logged |
| **Rationale** | Forensics; compliance |
| **Enforcement** | Audit emit on admin, auth, execution approve |
| **Verification** | Audit coverage matrix |
| **Failure consequence** | Enterprise sales blocker |
| **Cross-reference** | Part 7.8 |

## INF-11 — Key Rotation

| | |
|-|-|
| **Purpose** | Limit compromise blast radius |
| **Rationale** | Security hygiene |
| **Enforcement** | Scheduled rotation jobs |
| **Verification** | Rotation drill |
| **Failure consequence** | Compliance finding |
| **Cross-reference** | ADR-0018, 0019; RTM-INF-007 |

## INF-12 — Correlation ID Propagation

| | |
|-|-|
| **Purpose** | End-to-end traceability |
| **Rationale** | SDD-I §5.3; support |
| **Enforcement** | Middleware on all services |
| **Verification** | Trace completeness test |
| **Failure consequence** | Ops readiness fail |
| **Cross-reference** | ADR-0023; RTM-ENG-008 |

## INF-13 — Prompt Boundary Defense

| | |
|-|-|
| **Purpose** | Mitigate prompt injection |
| **Rationale** | AI threat model |
| **Enforcement** | Intelligence ingress sanitization |
| **Verification** | Red team suite |
| **Failure consequence** | Risk acceptance required |
| **Cross-reference** | RTM-INF-011 |

## INF-14 — Ingestion Quarantine

| | |
|-|-|
| **Purpose** | Block poisoned data entering Observation |
| **Rationale** | Data integrity |
| **Enforcement** | Integration validation gate |
| **Verification** | Poison batch test |
| **Failure consequence** | Intelligence integrity risk |
| **Cross-reference** | SDD-II ingestion |

## INF-15 — Retention Enforcement

| | |
|-|-|
| **Purpose** | Data minimization and compliance |
| **Rationale** | R0–R5 classes |
| **Enforcement** | Scheduled retirement jobs |
| **Verification** | Retention audit |
| **Failure consequence** | Compliance violation |
| **Cross-reference** | RTM-MEM-008 |

## INF-16 — Rate Limit Mandatory

| | |
|-|-|
| **Purpose** | Abuse and cost protection |
| **Rationale** | Model abuse threat |
| **Enforcement** | Edge + Gateway |
| **Verification** | Load test |
| **Failure consequence** | Production risk |
| **Cross-reference** | RTM-INF-012 |

## INF-17 — Circuit Breaker per Provider

| | |
|-|-|
| **Purpose** | Prevent cascade failure |
| **Rationale** | SDD-I §7.10 |
| **Enforcement** | Integration Layer |
| **Verification** | Outage simulation |
| **Failure consequence** | Extended outages |
| **Cross-reference** | ADR-0022; RTM-ENG-009 |

## INF-18 — Cross-Org Event Prohibition

| | |
|-|-|
| **Purpose** | Tenant event isolation |
| **Rationale** | EP-6 |
| **Enforcement** | Bus publish guard |
| **Verification** | Cross-org publish test |
| **Failure consequence** | SEV-1 |
| **Cross-reference** | RTM-ENG-002 |

## INF-19 — Memory Manager API Only

| | |
|-|-|
| **Purpose** | Governed memory writes |
| **Rationale** | IL-2 |
| **Enforcement** | Data layer API surface |
| **Verification** | Write path audit |
| **Failure consequence** | Architecture violation |
| **Cross-reference** | ADR-0008 |

## INF-20 — Backup Tested Restore

| | |
|-|-|
| **Purpose** | DR confidence |
| **Rationale** | Part 11.1 |
| **Enforcement** | Quarterly restore drill |
| **Verification** | Drill report |
| **Failure consequence** | INF-25 fail |
| **Cross-reference** | ADR-0021; RTM-INF-015 |

## INF-21 — RTO/RPO Tier Compliance

| | |
|-|-|
| **Purpose** | Meet recovery targets |
| **Rationale** | Enterprise SLA |
| **Enforcement** | Architecture + ops |
| **Verification** | DR exercise |
| **Failure consequence** | SLA breach |
| **Cross-reference** | ADR-0021, 0022; RTM-INF-008 |

## INF-22 — Kill Switch Availability

| | |
|-|-|
| **Purpose** | Incident containment |
| **Rationale** | Part 13.3 |
| **Enforcement** | Ops console |
| **Verification** | Quarterly drill |
| **Failure consequence** | Ops readiness fail |
| **Cross-reference** | RTM-INF-014 |

## INF-23 — Marketplace Manifest Verification

| | |
|-|-|
| **Purpose** | Supply chain safety |
| **Rationale** | Extension threat |
| **Enforcement** | Install gate |
| **Verification** | Unsigned manifest reject test |
| **Failure consequence** | Security risk |
| **Cross-reference** | RTM-PDD-008 |

## INF-24 — Incident Response Runbook

| | |
|-|-|
| **Purpose** | Structured incident handling |
| **Rationale** | Enterprise ops |
| **Enforcement** | On-call requirement |
| **Verification** | Tabletop exercise |
| **Failure consequence** | INF-25 fail |
| **Cross-reference** | ADR-0024; RTM-INF-013 |

## INF-25 — Production Readiness Gate

| | |
|-|-|
| **Purpose** | No production without readiness |
| **Rationale** | SDD-I §1.16 |
| **Enforcement** | Release pipeline |
| **Verification** | Checklist pass |
| **Failure consequence** | Deploy blocked |
| **Cross-reference** | ADR-0025; RTM-INF-010 |

---

# PART 15 — APPROVAL CRITERIA

## 15.1 Completion Checklist

- [x] Part 0 — Authority and compliance
- [x] Part 1 — Infrastructure philosophy (9 philosophies)
- [x] Part 2 — Platform topology and boundaries
- [x] Part 3 — Tenant architecture (10 isolation domains)
- [x] Part 4 — Identity architecture (15 topics)
- [x] Part 5 — Secrets architecture (10 topics)
- [x] Part 6 — Network architecture (9 topics)
- [x] Part 7 — Storage architecture (14 topics)
- [x] Part 8 — Security architecture (15 topics)
- [x] Part 9 — Encryption (8 topics)
- [x] Part 10 — Observability (12 topics)
- [x] Part 11 — Disaster recovery (12 topics)
- [x] Part 12 — Performance architecture (8 topics)
- [x] Part 13 — Operational architecture (9 topics)
- [x] Part 14 — INF-1 through INF-25
- [x] Part 15 — Approval criteria
- [x] ADR-0016 through ADR-0025
- [x] RTM Part F requirements addressed
- [x] No implementation artifacts
- [x] No product behavior redefinition

## 15.2 Review Criteria

Volume review per `sdd-volume-iii-review-checklist.md`. Categories: philosophy, topology, tenant, identity, secrets, network, storage, security, encryption, observability, DR, performance, operations, laws, compliance.

## 15.3 Architecture Compliance

Must not contradict CCIS, AMD III–IV, frozen PDD/UXMD, SDD I–II, Architecture Freeze, or ADR-0001–0025.

## 15.4 ADR Compliance

All infrastructure decisions captured in ADR-0016–0025.

## 15.5 RTM Compliance

RTM-INF-001–015 mapped to Parts 1–14 and INF laws.

## 15.6 Authority Verification

SDD-III subordinate to hierarchy. Implements GIS §2 and §2.5 — does not replace UXMD.

---

*SDD Volume III v1.0 — Infrastructure & Security Architecture. Conceptual engineering only. Build not authorized.*
