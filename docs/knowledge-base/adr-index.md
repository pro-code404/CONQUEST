# ADR Index

Readable index of Architecture Decision Records **0001–0038**. Canonical full text: [`docs/architecture/adr/`](../architecture/adr/). **Do not duplicate ADR bodies here.**

Cross-reference: [architecture-reference](./architecture-reference.md) · [conquest-master-spec](./conquest-master-spec.md)

| ADR | Title | One-line summary |
|-----|-------|------------------|
| [0001](../architecture/adr/0001-document-authority-hierarchy.md) | Document Authority Hierarchy | CCIS > AMD > PDD > UXMD > SDD — higher documents prevail on conflict. |
| [0002](../architecture/adr/0002-command-center-as-home.md) | Command Center as Home | Command Center is the default post-auth landing — the daily operational cockpit. |
| [0003](../architecture/adr/0003-workspace-as-context.md) | Workspace as Context | Workspace scopes intelligence/memory; it is not a primary nav destination. |
| [0004](../architecture/adr/0004-strategy-center-separation.md) | Strategy Center Separation | Strategy Center is nav #5 for long-horizon depth beyond Command Center summaries. |
| [0005](../architecture/adr/0005-seven-item-primary-navigation.md) | Seven-Item Primary Navigation | Primary nav frozen at exactly seven items — no engine catalog in nav. |
| [0006](../architecture/adr/0006-verification-before-release.md) | Verification Before Release | No major intelligence conclusion reaches users without passing the Verification gate. |
| [0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md) | CCIS Cognitive Lifecycle Order | Canonical twelve-stage CCIS lifecycle order is frozen for orchestration and artifacts. |
| [0008](../architecture/adr/0008-memory-governance.md) | Memory Governance | All memory writes go through the Memory Manager — no direct engine writes. |
| [0009](../architecture/adr/0009-learning-boundary.md) | Learning Boundary | Learning is a governed subsystem — no autonomous production code deploy. |
| [0010](../architecture/adr/0010-event-driven-architecture.md) | Event-Driven Architecture | Async work uses events/jobs; synchronous paths stay thin at the API boundary. |
| [0011](../architecture/adr/0011-ai-provider-abstraction.md) | AI Provider Abstraction | All model calls route through AI gateway abstraction — no direct provider coupling. |
| [0012](../architecture/adr/0012-gis-inheritance.md) | GIS Inheritance | All screens inherit UXMD-III Global Interaction Standards unless documented override. |
| [0013](../architecture/adr/0013-authority-bridge.md) | Authority Bridge | PDD Authority Bridge document links product intent to frozen architecture chain. |
| [0014](../architecture/adr/0014-module-boundaries.md) | Module Boundaries | Each module answers one golden question — no duplicated responsibility. |
| [0015](../architecture/adr/0015-execution-layer-separation.md) | Execution Layer Separation | Planning/orchestration separated from execution — automation runs through execution boundary. |
| [0016](../architecture/adr/0016-tenant-isolation-strategy.md) | Tenant Isolation Strategy | Org/workspace isolation enforced at repository and API scope — cross-tenant access forbidden. |
| [0017](../architecture/adr/0017-identity-session-model.md) | Identity & Session Model | Server-side sessions with httpOnly cookies; identity separate from workspace context. |
| [0018](../architecture/adr/0018-encryption-key-custody.md) | Encryption & Key Custody | Encryption keys and custody boundaries defined per data classification. |
| [0019](../architecture/adr/0019-secrets-management-strategy.md) | Secrets Management Strategy | Secrets in env/vault — never in code; rotation and access audit required. |
| [0020](../architecture/adr/0020-infrastructure-trust-boundaries.md) | Infrastructure Trust Boundaries | Trust zones between edge, API, data, and AI providers explicitly defined. |
| [0021](../architecture/adr/0021-disaster-recovery-strategy.md) | Disaster Recovery Strategy | RPO/RTO targets, backup cadence, and recovery runbooks for Postgres and config. |
| [0022](../architecture/adr/0022-high-availability-model.md) | High Availability Model | HA topology and failover expectations for API, DB, Redis, and AI providers. |
| [0023](../architecture/adr/0023-monitoring-observability-strategy.md) | Monitoring & Observability Strategy | Metrics, health probes, degradation reporting, and incident detection standards. |
| [0024](../architecture/adr/0024-security-incident-response.md) | Security Incident Response | Severity classes, runbooks, and escalation for security events. |
| [0025](../architecture/adr/0025-production-readiness-gate.md) | Production Readiness Gate | Checklist gate before production deploy — ties to Build-2 acceptance. |
| [0026](../architecture/adr/0026-cognitive-pipeline-authority.md) | Cognitive Pipeline Authority | Ten-phase pipeline doc is subordinate to CCIS lifecycle per ADR-0007. |
| [0027](../architecture/adr/0027-verification-gate-ownership.md) | Verification Gate Ownership | Verification module owns the gate — failures reroute upstream, never ship unverified. |
| [0028](../architecture/adr/0028-agent-isolation.md) | Agent Isolation | Agents operate in isolated scopes — no cross-agent memory or tool bleed. |
| [0029](../architecture/adr/0029-memory-read-write-authority.md) | Memory Read/Write Authority | Read paths may be distributed; writes centralized in Memory Manager only. |
| [0030](../architecture/adr/0030-multi-agent-coordination.md) | Multi-Agent Coordination | Orchestrator coordinates agents via structured messages — no ad-hoc coupling. |
| [0031](../architecture/adr/0031-evidence-first-reasoning.md) | Evidence-First Reasoning | Reasoning must cite evidence portfolio — no unsupported conclusions. |
| [0032](../architecture/adr/0032-reflection-governance.md) | Reflection Governance | Reflection outputs are internal optimization records — not raw user-facing critique. |
| [0033](../architecture/adr/0033-learning-proposal-governance.md) | Learning Proposal Governance | Learning proposals require review workflow before any production influence. |
| [0034](../architecture/adr/0034-ai-failure-recovery.md) | AI Failure Recovery | Provider failures degrade gracefully with retries, fallbacks, and honest user messaging. |
| [0035](../architecture/adr/0035-ai-safety-boundaries.md) | AI Safety Boundaries | Safety policies bound tool use, content, and autonomous action scope. |
| [0036](../architecture/adr/0036-intelligence-platform-module-foundations.md) | Intelligence Platform Module Foundations | Build-1 Phase 9 — intelligence module boundaries and platform integration. |
| [0037](../architecture/adr/0037-cognitive-intelligence-foundation.md) | Cognitive Intelligence Foundation | Build-1 Phase 10 — cognitive orchestrator, evidence, reasoning, decision engines. |
| [0038](../architecture/adr/0038-cognitive-platform-hardening.md) | Cognitive Platform Hardening | Build-1 Phase 11 — platform composition, metrics, cache, jobs integration. |

## Thematic groupings

| Theme | ADRs |
|-------|------|
| Document & UX authority | 0001, 0012, 0013 |
| Product structure & nav | 0002–0005 |
| Cognitive & intelligence | 0006–0008, 0026–0027, 0031–0032, 0036–0038 |
| Learning & agents | 0009, 0028, 0030, 0033 |
| Platform & events | 0010–0011, 0014–0015 |
| Security & tenancy | 0016–0020, 0024, 0034–0035 |
| Operations & production | 0021–0025, 0023 |
| Memory | 0008, 0029 |

## Status

All 38 ADRs listed are **Accepted** under Architecture Freeze v1.0. New decisions require ADR process — see [`template.md`](../architecture/adr/template.md).
