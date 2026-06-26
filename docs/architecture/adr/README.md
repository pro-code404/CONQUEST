# Architecture Decision Records (ADR) — Conquest

## Purpose

The ADR program captures **significant architectural decisions** with context, rationale, and consequences so that future volumes (SDD III–V) and implementation teams **conform to** approved intent rather than re-deciding fundamentals.

ADRs supplement — they do not replace — authoritative documents (CCIS, AMD, PDD, UXMD, SDD).

## Relationship to Architecture Freeze

All **Accepted** ADRs listed below are incorporated into [`ARCHITECTURE-FREEZE.md`](../ARCHITECTURE-FREEZE.md) Section 2. Changing an Accepted ADR requires Class A change control.

## Authority

| Rule | Source |
|------|--------|
| ADRs cannot override CCIS | CCIS supremacy clause |
| ADRs cannot override higher documents in CCIS > AMD > PDD > UXMD > SDD | SDD-I §Authority Resolution |
| Infrastructure choices must comply with Accepted ADRs | Architecture Freeze §4.4 |

## When to Write an ADR

Write an ADR when a decision:

- Affects multiple modules, layers, or documents  
- Is difficult or expensive to reverse  
- Chooses between meaningful alternatives  
- Will be questioned by future engineers or agents  
- Touches a frozen element (Class A change)  

Do **not** write ADRs for routine implementation choices covered by SDD V engineering standards.

## ADR Lifecycle

```
Proposed → (review) → Accepted | Rejected
Accepted → (deprecation) → Deprecated | Superseded
```

1. Copy [`template.md`](template.md) to `NNNN-short-title.md`  
2. Fill all sections — incomplete ADRs cannot be Accepted  
3. Program review against freeze and CCIS  
4. Update this index  
5. Amend authoritative documents if the decision changes frozen text  

## Naming Convention

`NNNN-kebab-case-title.md` — four-digit zero-padded sequence, globally unique, never reused.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-document-authority-hierarchy.md) | Document Authority Hierarchy | Accepted | 2026-06-21 |
| [0002](0002-command-center-as-home.md) | Command Center as Home | Accepted | 2026-06-21 |
| [0003](0003-workspace-as-context.md) | Workspace as Context | Accepted | 2026-06-21 |
| [0004](0004-strategy-center-separation.md) | Strategy Center Separation | Accepted | 2026-06-21 |
| [0005](0005-seven-item-primary-navigation.md) | Seven-Item Primary Navigation | Accepted | 2026-06-21 |
| [0006](0006-verification-before-release.md) | Verification Before Release | Accepted | 2026-06-21 |
| [0007](0007-ccis-cognitive-lifecycle-order.md) | CCIS Cognitive Lifecycle Order | Accepted | 2026-06-21 |
| [0008](0008-memory-governance.md) | Memory Governance | Accepted | 2026-06-21 |
| [0009](0009-learning-boundary.md) | Learning Boundary | Accepted | 2026-06-21 |
| [0010](0010-event-driven-architecture.md) | Event-Driven Architecture | Accepted | 2026-06-21 |
| [0011](0011-ai-provider-abstraction.md) | AI Provider Abstraction | Accepted | 2026-06-21 |
| [0012](0012-gis-inheritance.md) | GIS Inheritance | Accepted | 2026-06-21 |
| [0013](0013-authority-bridge.md) | Authority Bridge | Accepted | 2026-06-21 |
| [0014](0014-module-boundaries.md) | Module Boundaries | Accepted | 2026-06-21 |
| [0015](0015-execution-layer-separation.md) | Execution Layer Separation | Accepted | 2026-06-21 |
| [0016](0016-tenant-isolation-strategy.md) | Tenant Isolation Strategy | Accepted | 2026-06-21 |
| [0017](0017-identity-session-model.md) | Identity & Session Model | Accepted | 2026-06-21 |
| [0018](0018-encryption-key-custody.md) | Encryption & Key Custody | Accepted | 2026-06-21 |
| [0019](0019-secrets-management-strategy.md) | Secrets Management Strategy | Accepted | 2026-06-21 |
| [0020](0020-infrastructure-trust-boundaries.md) | Infrastructure Trust Boundaries | Accepted | 2026-06-21 |
| [0021](0021-disaster-recovery-strategy.md) | Disaster Recovery Strategy | Accepted | 2026-06-21 |
| [0022](0022-high-availability-model.md) | High Availability Model | Accepted | 2026-06-21 |
| [0023](0023-monitoring-observability-strategy.md) | Monitoring & Observability Strategy | Accepted | 2026-06-21 |
| [0024](0024-security-incident-response.md) | Security Incident Response | Accepted | 2026-06-21 |
| [0025](0025-production-readiness-gate.md) | Production Readiness Gate | Accepted | 2026-06-21 |
| [0026](0026-cognitive-pipeline-authority.md) | Cognitive Pipeline Authority | Accepted | 2026-06-21 |
| [0027](0027-verification-gate-ownership.md) | Verification Gate Ownership | Accepted | 2026-06-21 |
| [0028](0028-agent-isolation.md) | Agent Isolation | Accepted | 2026-06-21 |
| [0029](0029-memory-read-write-authority.md) | Memory Read/Write Authority | Accepted | 2026-06-21 |
| [0030](0030-multi-agent-coordination.md) | Multi-Agent Coordination | Accepted | 2026-06-21 |
| [0031](0031-evidence-first-reasoning.md) | Evidence-First Reasoning | Accepted | 2026-06-21 |
| [0032](0032-reflection-governance.md) | Reflection Governance | Accepted | 2026-06-21 |
| [0033](0033-learning-proposal-governance.md) | Learning Proposal Governance | Accepted | 2026-06-21 |
| [0034](0034-ai-failure-recovery.md) | AI Failure Recovery | Accepted | 2026-06-21 |
| [0035](0035-ai-safety-boundaries.md) | AI Safety Boundaries | Accepted | 2026-06-21 |

## SDD Volume V Guidance

New build-governance decisions start at **ADR-0036**.

---

*ADR Program v1.2 — Updated 2026-06-21 (ADR-0026–0035)*
