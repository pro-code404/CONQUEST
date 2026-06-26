# SDD VOLUME V — ENGINEERING STANDARDS & BUILD GOVERNANCE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | SDD Volume V — Engineering Standards & Build Governance |
| **Abbreviation** | SDD-V |
| **Status** | Engineering Governance Authority — Volume 5 of 5 |
| **Version** | 1.0 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD III–IV, PDD I–II (+ Authority Bridge), UXMD I–III, SDD I–IV, [Architecture Freeze](../architecture/ARCHITECTURE-FREEZE.md), [RTM](../architecture/requirements-traceability-matrix.md), ADR-0001–0035 |
| **Precedes** | Build Authorization (explicit — not automatic) |

### Mission

Define **how Conquest engineering is governed** — repository standards, build and release gates, quality engineering, documentation discipline, configuration and security engineering standards, operational excellence, and the **complete build authorization checklist** — without prescribing implementation technology, code, schemas, APIs, or infrastructure configuration.

| Document | Question |
|----------|----------|
| SDD Volumes I–IV | What is engineered and how does it behave? |
| **SDD Volume V** | **How is engineering executed, verified, and released?** |

### Strict Prohibitions

No application code, database schemas, SQL, APIs, frontend components, backend services, infrastructure configuration, CI configuration files, prompts, or implementation artifacts.

**Build phase has not started.** Completion of SDD-V does **not** authorize Build — explicit Build Authorization required (Part 11).

### Governance Scope Boundary

SDD-V governs **engineering execution only**. It does **not** redefine product behavior, workflows, UX, navigation, GIS, intelligence lifecycle, orchestration topology, or infrastructure architecture.

---

# PART 0 — AUTHORITY & GOVERNANCE

## 0.1 Authority Hierarchy

Where conflicts exist:

```
CCIS > AMD > PDD > UXMD > SDD I–IV > SDD V (governance)
```

Architecture Freeze and Accepted ADRs bind all engineering. SDD-V **enforces** prior volumes — does not override them.

## 0.2 Architecture Freeze Compliance

SDD-V implements freeze change-control (Class A–D) in engineering process:

| Class | SDD-V enforcement |
|-------|-------------------|
| **A — Frozen change** | ADR + amendment + ENG-4 gate |
| **B — Errata** | Tracked fix + RTM note |
| **C — Open volume authoring** | N/A — SDD I–V complete |
| **D — Implementation detail** | ADR if architectural; else SDD-V standards |

## 0.3 ADR Compliance

- New architectural decisions → ADR from [`adr/template.md`](../architecture/adr/template.md) (ENG-3)  
- ADR-0036+ for build-era decisions  
- Accepted ADRs enforced in CI where automatable (ENG-12)  

## 0.4 RTM Compliance

Every enforceable behavior change updates [RTM](../architecture/requirements-traceability-matrix.md) before merge (ENG-5). Implementation marks rows `In Build` → `Verified` with test reference.

## 0.5 Document Precedence (Engineering)

| Priority | Document type |
|----------|---------------|
| 1 | CCIS, frozen AMD/PDD/UXMD/SDD I–IV |
| 2 | Architecture Freeze, Accepted ADRs |
| 3 | RTM |
| 4 | **SDD Volume V** (this document) |
| 5 | Implementation guides, runbooks (subordinate) |
| — | [`docs/archive/design-pre-uxmd/`](../archive/design-pre-uxmd/), [`docs/archive/sdd/system-design-document-v2.0-superseded.md`](../archive/sdd/system-design-document-v2.0-superseded.md) — **non-authoritative** |

## 0.6 Amendment Process

1. Propose change via ADR if architectural  
2. Update authoritative document with version bump  
3. Update RTM, Freeze if scope changes  
4. Update SDD-V only for **process** changes — not product/architecture  
5. Architecture review for cross-layer impact (EL-26, ENG-18)  

---

# PART 1 — ENGINEERING PHILOSOPHY

## 1.1 Engineering Objectives

| Objective | Governance expression |
|-----------|----------------------|
| Decision superiority | Measurable outcomes per workspace |
| Trustworthy intelligence | Verification gates in CI (AI-4, IL-1) |
| Enterprise readiness | Build checklist Part 11 |
| Maintainable codebase | EL + ENG laws in review |
| Safe continuous improvement | Learning gates (AI-10, BH-6) |

## 1.2 Engineering Principles

Align with SDD-I §1.2: intelligence-first, verification before release, bounded contexts, observable by design, replaceable components, human authority on stakes, learning without code mutation.

## 1.3 Maintainability

Prefer clarity over cleverness. Bounded contexts match PDD-II modules (ENG-8). Cross-layer changes require review (ENG-18).

## 1.4 Reliability

Idempotent consumers (EL-18). Classified retry (SDD-I §5.8). No silent failure (EL-20, ENG-15).

## 1.5 Scalability

Engineering supports horizontal scale assumptions in SDD-I §8 — no shared mutable module state (EL-6).

## 1.6 Security-First

Secure SDLC Part 8. Secrets never in repo (ENG-10, INF-7). Fail closed (EL-19).

## 1.7 Verification-First

VRF gate before release in CI contract tests (AI-4, ENG-22). No shortcut paths in Application layer.

## 1.8 Least Surprise

GIS inheritance mandatory (ADR-0012). API contracts versioned (EL-13). Breaking changes announced (ENG-19).

## 1.9 Incremental Delivery

Build phases per RTM Part H (Build-0 → Build-3). No big-bang without approved migration plan.

## 1.10 Documentation Before Implementation

No feature implementation without: RTM row or confirmation, layer ownership, ADR if architectural (ENG-1). Design doc in PR for cross-cutting work.

---

# PART 2 — REPOSITORY STANDARDS

## 2.1 Repository Organization

Logical alignment to SDD-I layers and PDD-II modules:

| Area | Owns |
|------|------|
| `presentation/` or client app | UXMD-II screens, GIS |
| `application/` | Module bounded contexts |
| `domain/` | PDD use cases |
| `orchestration/` | Cycle routing — no conclusion |
| `intelligence/` | Engines — provider abstraction |
| `execution/` | L5E adapters |
| `platform/` | Auth, Notifications, Billing |
| `integration/` | External adapters |
| `data/` | Memory Manager, stores |
| `docs/` | Authoritative architecture only |

Exact directory names are implementation choices — **boundaries are not**.

## 2.2 Module Ownership

Each PDD-II module maps to one Application bounded context owner team. Platform services owned by platform team. Intelligence engines owned by cognitive platform team.

## 2.3 Directory Governance

No orphan code outside declared boundaries. New top-level directory requires ADR or ENG-18 review.

## 2.4 Naming Conventions

| Element | Convention |
|---------|------------|
| Events | `namespace.PascalCase` per SDD-I §5.2 |
| Modules | `kebab-case` IDs per SDD-I §4 |
| ADRs | `NNNN-kebab-title.md` |
| RTM IDs | `RTM-{CATEGORY}-{NNN}` |

Language-specific style guides subordinate to ENG-3 consistency principle.

## 2.5 Package Boundaries

Packages align to layers. **Forbidden:** Presentation imports Intelligence; Application imports provider SDKs; Integration imports Reasoning engines.

## 2.6 Dependency Rules

Enforce SDD-I EL-1–EL-5, EL-29–EL-30. Dependency graph checked in CI (ENG-12).

## 2.7 Import Rules

Imports flow inward. Cross-context only via published contracts (EL-13).

## 2.8 Forbidden Dependencies

| Forbidden | Law |
|-----------|-----|
| Intelligence → Presentation | EL-2 |
| Client → AI provider SDK | AI-11, INF-7 |
| Application → direct Memory write | IL-2, AI-9 |
| Learning → Execution | EL-30, AI-10 |
| Orchestration → conclusion logic | AI-1 |

## 2.9 Repository Health

No committed secrets. No generated artifacts in source control unless policy exception. `.netlify` in `.gitignore` per Netlify guidance.

---

# PART 3 — CODING STANDARDS (CONCEPTUAL)

## 3.1 Language Neutrality

SDD-V defines principles — not language-specific style. Team adopts one primary backend and one client stack with documented rationale ADR when selected.

## 3.2 Consistency

One pattern per concern within a bounded context. Match surrounding code (ENG-3).

## 3.3 Readability

Explicit over implicit. Named constants for magic values. Self-documenting structure over comments for obvious code.

## 3.4 Explicitness

Errors explicit. Null/optional handling intentional. No hidden side effects across module boundaries.

## 3.5 Error Handling Philosophy

| Layer | Philosophy |
|-------|------------|
| User-facing | GIS error patterns — fail closed |
| Internal | Classify retryable vs fatal (SDD-I §5.8) |
| Intelligence | Structured failure artifacts — never empty success |

## 3.6 Logging Philosophy

Structured logs with `correlation_id`, `org_id`, `workspace_id` (INF-12). No secrets, no raw prompts in default info level (SDD-III Part 10).

## 3.7 Configuration Philosophy

Configuration external to code. Environment separation Part 7. Validation at startup — fail fast on invalid config.

**No implementation examples in this volume.**

---

# PART 4 — BUILD GOVERNANCE

## 4.1 Build Authorization

**Explicit Build Authorization** document required before first implementation commit beyond governance scaffolding (Part 11). SDD I–V approval ≠ Build approval.

## 4.2 Feature Gates

Features tied to RTM IDs. Incomplete RTM → feature flag default off in production.

## 4.3 Release Gates

| Gate | Blocks |
|------|--------|
| Architecture | EL-26 review for cross-layer |
| Quality | Part 5 minimums |
| Security | Part 8 checklist |
| Production | INF-25 + AI-25 + Part 11 |

## 4.4 Verification Gates

IL-1, AI-4, AI-5 enforced in integration/contract suite before release candidate.

## 4.5 CI Philosophy

CI is **architecture enforcement automation** — not optional. Pipelines verify: build, test tiers, dependency rules, secret scan, contract tests, a11y on Presentation changes.

**No CI configuration in this document.**

## 4.6 Quality Gates

Merge blocked on: failing required tests, secret scan, dependency policy, cross-layer without review label.

## 4.7 Rollback Philosophy

Application rollback via immutable deploy artifacts. Data rollback via Memory versioning — not destructive migration without plan (ENG-19). Automation rollback per AUT-06.

## 4.8 Promotion Rules

```
Development → Staging → Preview → Production
```

Each promotion increases gate strictness. Production requires Part 11 complete.

## 4.9 Environment Progression

| Environment | Data | Gates |
|-------------|------|-------|
| Development | Mock/synthetic | Unit + lint |
| Staging | Synthetic full | Integration + contract |
| Preview | No production data | E2E subset |
| Production | Live | Full Part 11 |

---

# PART 5 — QUALITY ENGINEERING

## 5.1 Testing Philosophy

Tests prove **RTM requirements** — not implementation details alone. Every `Verified` RTM row links to test evidence.

## 5.2 Unit Testing

Bounded context logic, pure functions, artifact validators, permission checks.

## 5.3 Integration Testing

Layer boundaries, Memory Manager, event bus, Auth session, Orchestration stage transitions.

## 5.4 Contract Testing

Event envelope (SDD-I §5.3), projection schemas, GIS permission matrix per module command, UAC field presence.

## 5.5 System Testing

End-to-end journeys: onboarding, Command Center load, recommendation approve, report seal, automation rollback.

## 5.6 Acceptance Testing

UXMD-II critical paths per screen family. BH laws behaviorally asserted.

## 5.7 Regression Testing

Full suite on release candidate. Intelligence golden cycles for stage-order (AI-2).

## 5.8 Performance Testing

Gateway p95, intelligence cycle p95 per stakes class. Load fairness per org.

## 5.9 Security Testing

Tenant isolation penetration (INF-1). Auth fail-closed. OWASP-oriented app scan.

## 5.10 Accessibility Testing

WCAG 2.2 AA per GIS Part 3 — **release blocker** for Presentation changes (ENG-23).

## 5.11 AI Validation

Stage-order integration tests. VRF bypass attempt tests. Evidence citation chain tests (AI-12). No release on golden cycle failure.

## 5.12 Evidence Validation

EVD artifact schema, citation resolution, decay rules.

## 5.13 Verification Validation

VRF category coverage per AMD IV. Fail-closed release tests.

---

# PART 6 — DOCUMENTATION STANDARDS

## 6.1 Engineering Documentation

In-repo: README per package, architecture decision pointers to `docs/`. No duplicate authority — link to frozen docs.

## 6.2 Architecture Updates

Class A changes: ADR + authoritative doc version bump + Freeze update.

## 6.3 ADR Updates

Immutable once Accepted. Supersede with new ADR number.

## 6.4 RTM Updates

Amend RTM in same PR as behavioral change. Status transitions documented.

## 6.5 Decision Records

Use ADR program — not informal wiki decisions.

## 6.6 Versioning

Semantic versioning for deployable artifacts. Document versions per Freeze §5.1 rules.

## 6.7 Deprecation

Deprecated contracts: notice period, migration guide, telemetry on usage, removal ADR.

## 6.8 Change Logs

User-visible changes from UXMD/PDD perspective. Engineering changes reference RTM/ADR IDs.

---

# PART 7 — CONFIGURATION GOVERNANCE

## 7.1 Configuration Ownership

| Config type | Owner |
|-------------|-------|
| App defaults | Module team |
| Platform | Platform team |
| Secrets | Security — ADR-0019 |
| Feature flags | Product + engineering |
| Routing profiles | Cognitive platform |

## 7.2 Environment Separation

No production credentials in non-prod. No production data in dev (ENG-11).

## 7.3 Secrets Governance

Secrets via custody service only (SDD-III Part 5). ENG-10: pre-commit and CI secret scan.

## 7.4 Feature Flags

Flags cannot disable VRF, auth, or tenant isolation (SDD-III §13.2). Flag changes audited.

## 7.5 Runtime Configuration

Hot reload only for non-security config. Security config change → session review policy.

## 7.6 Configuration Validation

Schema-validated at deploy. Invalid config blocks start (ENG-15).

---

# PART 8 — SECURITY ENGINEERING STANDARDS

## 8.1 Secure Development Lifecycle

Threat modeling for new surfaces. Security review in ENG-18 for cross-cutting changes.

## 8.2 Threat Review

STRIDE-oriented review per feature. Link to SDD-III Part 8 threat model.

## 8.3 Dependency Governance

Pinned versions. SBOM generation. Vulnerability scan in CI — block critical CVEs without exception ADR.

## 8.4 Supply Chain

Signed commits recommended. Marketplace manifest verification (INF-23). Third-party adapter review.

## 8.5 Secrets Handling

Never in code, logs, traces, tickets. Rotation per INF-11.

## 8.6 Key Rotation Philosophy

Scheduled + emergency drills. Documented in ops runbooks.

## 8.7 Identity Governance

GIS §2 RBAC tests in CI. Session security tests per ADR-0017.

## 8.8 Least Privilege

Service accounts per tier. Minimal IAM — conceptual per SDD-III.

## 8.9 Audit Readiness

Audit events for admin, auth, execution approve, break-glass (INF-10). Retention R3.

---

# PART 9 — RELEASE GOVERNANCE

## 9.1 Release Planning

Release ties to RTM build phase. Notes include ADR and migration references.

## 9.2 Release Approval

| Stage | Approver |
|-------|----------|
| Preview | Engineering lead |
| Production | Engineering + security sign-off on Part 11 |

## 9.3 Rollback

One-click previous artifact. Database migrations reversible or forward-fix plan required.

## 9.4 Incident Response Linkage

SEV-1/2 triggers halt per ADR-0024. Post-incident ADR if architectural gap.

## 9.5 Version Compatibility

Event schema versioning (EL-13). Projection version in envelope.

## 9.6 Backward Compatibility

EL-14 migration plan for breaking changes. Deprecation window minimum 90 days production APIs — when APIs exist.

## 9.7 Migration Philosophy

Expand → migrate → contract. No big-bang data migration without DR plan.

---

# PART 10 — OPERATIONAL EXCELLENCE

## 10.1 Observability Expectations

SDD-III Part 10 mandatory before production. Dashboards per tier. SLO defined per ENG-25.

## 10.2 Health Standards

Liveness + readiness per service. Dependency health aggregated.

## 10.3 Monitoring Philosophy

SLO-driven alerts — not log noise. User-impacting alerts page on-call.

## 10.4 Alert Philosophy

P0: auth, tenant leak suspect, execution runaway. P1: SLO breach. Runbooks linked in alert.

## 10.5 Runbooks

Required per INF-24, ADR-0024. Kill switch drill quarterly.

## 10.6 Postmortems

Blameless. Action items → ADR or RTM. Learning proposals — not hotfixes to governance.

## 10.7 Continuous Improvement

Retro on release. ENG laws reviewed annually.

---

# PART 11 — BUILD READINESS GATES

## 11.1 Build Authorization Checklist

**All items required** for explicit Build Authorization unless marked phase-specific.

### Architecture & Documentation

| # | Gate | Evidence |
|---|------|----------|
| B-01 | CCIS + frozen corpus current | Architecture Freeze v1.x |
| B-02 | SDD Volumes I–V **approved** | Review checklists |
| B-03 | RTM v1.1+ complete for Build-1 scope | RTM status |
| B-04 | ADR-0001–0035 Accepted | adr/README.md |
| B-05 | AMD I–II in repository | P0-2 resolved |
| B-06 | SDD-II v1.2 lifecycle errata (recommended) | P0-1 resolved |
| B-07 | PDD Authority Bridge active | Authority Bridge v1.0 |
| B-08 | UXMD I–III approved | UXMD final review |
| B-09 | GIS binding plan for Presentation | ENG-23 |
| B-10 | Explicit **Build Authorization** issued | Signed record |

### PDD / Product Authority

| # | Gate | Evidence |
|---|------|----------|
| B-11 | PDD-II module specs current | PDD-II v1.0 |
| B-12 | PDD-I v2.1 for **cognitive/memory build** | Authority Bridge §3 closed |
| B-13 | BH-1–BH-10 test plan mapped | RTM Part C |

### Security & Infrastructure

| # | Gate | Evidence |
|---|------|----------|
| B-14 | Threat model reviewed | SDD-III Part 8 |
| B-15 | Tenant isolation test plan | INF-1 |
| B-16 | Secrets custody design | ADR-0019 |
| B-17 | DR drill plan | ADR-0021 |
| B-18 | Incident runbooks drafted | INF-24 |

### Engineering & Quality

| # | Gate | Evidence |
|---|------|----------|
| B-19 | Repository structure approved | Part 2 |
| B-20 | CI pipeline enforces ENG-12 | Pipeline doc |
| B-21 | EL, IL, INF, AI law CI mapping | Trace matrix §13 |
| B-22 | Contract test suite scaffold | Part 5.4 |
| B-23 | A11y test gate configured | GIS Part 3 |
| B-24 | Dependency policy active | Part 8.3 |

### AI & Intelligence

| # | Gate | Evidence |
|---|------|----------|
| B-25 | Stage-order golden tests planned | AI-2 |
| B-26 | VRF bypass tests planned | AI-4, AI-20 |
| B-27 | Provider abstraction boundary | ADR-0011 |
| B-28 | Learning Boundary isolation tests | AI-10 |

### Operational

| # | Gate | Evidence |
|---|------|----------|
| B-29 | Observability scaffold | ADR-0023 |
| B-30 | Kill switch operational | INF-22 |
| B-31 | Production readiness gate INF-25 | ADR-0025 |
| B-32 | AI production gate AI-25 | ADR-0035 |

## 11.2 Build Phase Authorization

| Phase | RTM | Minimum gates |
|-------|-----|---------------|
| **Build-0** | RTM-INF-010 | B-01–B-10, B-19–B-21 |
| **Build-1** | Platform rows | + B-14–B-18, B-29–B-30 |
| **Build-2** | INT, MEM rows | + B-12, B-25–B-28 |
| **Build-3** | Marketplace, etc. | Full B-01–B-32 |

## 11.3 Build Authorization Issuance

Issued by program architecture authority when checklist satisfied for declared phase. Record: date, phase, scope, open exceptions with expiry.

---

# PART 12 — ENGINEERING LAWS

| Law | Title |
|-----|-------|
| ENG-1 | Documentation Before Implementation |
| ENG-2 | Architecture Before Code |
| ENG-3 | Consistency Within Context |
| ENG-4 | ADR for Architectural Change |
| ENG-5 | RTM Synchronization |
| ENG-6 | Freeze Respect |
| ENG-7 | Layer Boundary Enforcement |
| ENG-8 | Module Ownership |
| ENG-9 | Event Contract Versioning |
| ENG-10 | No Secrets in Repository |
| ENG-11 | Environment Data Separation |
| ENG-12 | CI Architecture Enforcement |
| ENG-13 | Idempotent Consumer Tests |
| ENG-14 | Workspace Scope in Tests |
| ENG-15 | No Silent Failure Tests |
| ENG-16 | Projection Read-Only |
| ENG-17 | Marketplace Extension Registry |
| ENG-18 | Cross-Layer Review Required |
| ENG-19 | Breaking Change Migration |
| ENG-20 | Build Authorization Required |
| ENG-21 | Phased Delivery Only |
| ENG-22 | Verification Gate Tests |
| ENG-23 | Accessibility Release Gate |
| ENG-24 | Security Scan Gate |
| ENG-25 | SLO Before Production |
| ENG-26 | Runbook Before On-Call |
| ENG-27 | Postmortem to Traceability |
| ENG-28 | Deprecation Notice Period |
| ENG-29 | No Authority in Implementation Docs |
| ENG-30 | SDD Program Completeness |

### ENG-1 — Documentation Before Implementation

| | |
|-|-|
| **Purpose** | Prevent orphan implementation |
| **Rationale** | RTM traceability |
| **Enforcement** | PR template — RTM ID required |
| **Verification** | Review checklist |
| **Failure** | PR rejected |
| **ADRs** | 0001 |
| **SDD** | Part 1 §1.10, Part 6 |

### ENG-2 — Architecture Before Code

| | |
|-|-|
| **Purpose** | Implementation follows SDD |
| **Rationale** | EL-27 |
| **Enforcement** | Design note for cross-cutting PRs |
| **Verification** | ENG-18 review |
| **Failure** | PR rejected |
| **ADRs** | 0001 |
| **SDD** | Part 0 |

### ENG-3 — Consistency Within Context

| | |
|-|-|
| **Purpose** | Maintainable codebase |
| **Rationale** | EL-10 |
| **Enforcement** | Code review |
| **Verification** | Lint where applicable |
| **Failure** | Review block |
| **ADRs** | — |
| **SDD** | Part 3 |

### ENG-4 — ADR for Architectural Change

| | |
|-|-|
| **Purpose** | Governed decisions |
| **Rationale** | Freeze Class A |
| **Enforcement** | Architecture review |
| **Verification** | ADR index updated |
| **Failure** | Merge block |
| **ADRs** | 0001 |
| **SDD** | Part 0 §0.6 |

### ENG-5 — RTM Synchronization

| | |
|-|-|
| **Purpose** | Living traceability |
| **Rationale** | Master verification artifact |
| **Enforcement** | Same PR as behavior change |
| **Verification** | RTM diff in review |
| **Failure** | PR rejected |
| **ADRs** | — |
| **SDD** | Part 0 §0.4, Part 13 |

### ENG-6 — Freeze Respect

| | |
|-|-|
| **Purpose** | No drift from frozen architecture |
| **Rationale** | Architecture Freeze |
| **Enforcement** | Review + CI contracts |
| **Verification** | Freeze compliance check |
| **Failure** | Escalation to architecture |
| **ADRs** | 0001–0035 |
| **SDD** | Part 0 §0.2 |

### ENG-7 — Layer Boundary Enforcement

| | |
|-|-|
| **Purpose** | SDD-I layer model |
| **Rationale** | EL-1–EL-5 |
| **Enforcement** | Dependency lint |
| **Verification** | CI dependency graph |
| **Failure** | Build fail |
| **ADRs** | 0020 |
| **SDD** | Part 2 §2.8 |

### ENG-8 — Module Ownership

| | |
|-|-|
| **Purpose** | Clear accountability |
| **Rationale** | ADR-0014 |
| **Enforcement** | CODEOWNERS concept |
| **Verification** | Review routing |
| **Failure** | Wrong owner review |
| **ADRs** | 0014 |
| **SDD** | Part 2 §2.2 |

### ENG-9 — Event Contract Versioning

| | |
|-|-|
| **Purpose** | Safe evolution |
| **Rationale** | EL-13, EL-17 |
| **Enforcement** | Contract tests |
| **Verification** | Schema version in envelope |
| **Failure** | Contract test fail |
| **ADRs** | 0010 |
| **SDD** | Part 5.4 |

### ENG-10 — No Secrets in Repository

| | |
|-|-|
| **Purpose** | Prevent credential leak |
| **Rationale** | INF-7, ADR-0019 |
| **Enforcement** | Secret scan CI |
| **Verification** | Scan pass |
| **Failure** | Build fail; rotate secret |
| **ADRs** | 0019 |
| **SDD** | Part 7 §7.3 |

### ENG-11 — Environment Data Separation

| | |
|-|-|
| **Purpose** | Data protection |
| **Rationale** | INF-1, GDPR-class readiness |
| **Enforcement** | Env config review |
| **Verification** | No prod data in dev |
| **Failure** | Incident |
| **ADRs** | 0016 |
| **SDD** | Part 7 §7.2 |

### ENG-12 — CI Architecture Enforcement

| | |
|-|-|
| **Purpose** | Automate laws |
| **Rationale** | ADR-0025 item 9 |
| **Enforcement** | Required CI checks |
| **Verification** | Check list on main |
| **Failure** | Merge block |
| **ADRs** | 0025 |
| **SDD** | Part 4 §4.5 |

### ENG-13 — Idempotent Consumer Tests

| | |
|-|-|
| **Purpose** | At-least-once safety |
| **Rationale** | EL-18 |
| **Enforcement** | Integration tests |
| **Verification** | Duplicate delivery test |
| **Failure** | Release block |
| **ADRs** | 0010 |
| **SDD** | Part 5.3 |

### ENG-14 — Workspace Scope in Tests

| | |
|-|-|
| **Purpose** | Tenant safety |
| **Rationale** | EL-7, INF-5 |
| **Enforcement** | Test fixtures |
| **Verification** | Cross-workspace negative tests |
| **Failure** | Release block |
| **ADRs** | 0016, 0003 |
| **SDD** | Part 5 |

### ENG-15 — No Silent Failure Tests

| | |
|-|-|
| **Purpose** | BH-7 compliance |
| **Rationale** | EL-20 |
| **Enforcement** | E2E degraded state tests |
| **Verification** | Stale banner assertions |
| **Failure** | Release block |
| **ADRs** | — |
| **SDD** | Part 5.6 |

### ENG-16 — Projection Read-Only

| | |
|-|-|
| **Purpose** | Experience boundary |
| **Rationale** | EL-15 |
| **Enforcement** | API design review |
| **Verification** | No write via projection |
| **Failure** | Architecture reject |
| **ADRs** | — |
| **SDD** | Part 2 |

### ENG-17 — Marketplace Extension Registry

| | |
|-|-|
| **Purpose** | Safe extensions |
| **Rationale** | EL-9, INF-23 |
| **Enforcement** | Manifest verify |
| **Verification** | Install gate test |
| **Failure** | Extension rejected |
| **ADRs** | 0014 |
| **SDD** | Part 8.4 |

### ENG-18 — Cross-Layer Review Required

| | |
|-|-|
| **Purpose** | Blast radius control |
| **Rationale** | EL-26 |
| **Enforcement** | PR label `cross-layer` |
| **Verification** | Architecture approver |
| **Failure** | Merge block |
| **ADRs** | — |
| **SDD** | Part 0 §0.6 |

### ENG-19 — Breaking Change Migration

| | |
|-|-|
| **Purpose** | Safe evolution |
| **Rationale** | EL-14 |
| **Enforcement** | Migration doc in PR |
| **Verification** | Review approval |
| **Failure** | Merge block |
| **ADRs** | — |
| **SDD** | Part 9 §9.7 |

### ENG-20 — Build Authorization Required

| | |
|-|-|
| **Purpose** | No premature implementation |
| **Rationale** | Freeze §6.4 |
| **Enforcement** | Program gate |
| **Verification** | B-10 record |
| **Failure** | Implementation halt |
| **ADRs** | 0025 |
| **SDD** | Part 11 |

### ENG-21 — Phased Delivery Only

| | |
|-|-|
| **Purpose** | Risk management |
| **Rationale** | RTM Part H |
| **Enforcement** | Release scope check |
| **Verification** | Phase matches gates |
| **Failure** | Scope reduction required |
| **ADRs** | — |
| **SDD** | Part 11 §11.2 |

### ENG-22 — Verification Gate Tests

| | |
|-|-|
| **Purpose** | Trustworthy intelligence |
| **Rationale** | AI-4, IL-1 |
| **Enforcement** | CI integration suite |
| **Verification** | Bypass attempt fails |
| **Failure** | Release block |
| **ADRs** | 0027, 0006 |
| **SDD** | Part 5.11–5.13 |

### ENG-23 — Accessibility Release Gate

| | |
|-|-|
| **Purpose** | GIS compliance |
| **Rationale** | ADR-0012, SDD-I §1.15 |
| **Enforcement** | A11y CI on UI PRs |
| **Verification** | WCAG scan pass |
| **Failure** | Release block |
| **ADRs** | 0012 |
| **SDD** | Part 5.10 |

### ENG-24 — Security Scan Gate

| | |
|-|-|
| **Purpose** | Vulnerability control |
| **Rationale** | Part 8.3 |
| **Enforcement** | CI dependency scan |
| **Verification** | No unmitigated critical |
| **Failure** | Merge block |
| **ADRs** | 0035 |
| **SDD** | Part 8 |

### ENG-25 — SLO Before Production

| | |
|-|-|
| **Purpose** | Operability |
| **Rationale** | ADR-0023, INF-25 |
| **Enforcement** | Dashboards exist |
| **Verification** | On-call runbook |
| **Failure** | Production block |
| **ADRs** | 0023, 0025 |
| **SDD** | Part 10 |

### ENG-26 — Runbook Before On-Call

| | |
|-|-|
| **Purpose** | Incident readiness |
| **Rationale** | INF-24 |
| **Enforcement** | Ops checklist |
| **Verification** | Runbook link in alerts |
| **Failure** | On-call not scheduled |
| **ADRs** | 0024 |
| **SDD** | Part 10 §10.5 |

### ENG-27 — Postmortem to Traceability

| | |
|-|-|
| **Purpose** | Systemic fix |
| **Rationale** | CCIS First Law |
| **Enforcement** | Postmortem template |
| **Verification** | RTM/ADR action items |
| **Failure** | Repeat incident |
| **ADRs** | — |
| **SDD** | Part 10 §10.6 |

### ENG-28 — Deprecation Notice Period

| | |
|-|-|
| **Purpose** | User/org readiness |
| **Rationale** | EL-14 |
| **Enforcement** | Deprecation metadata |
| **Verification** | 90-day minimum |
| **Failure** | Policy exception ADR |
| **ADRs** | — |
| **SDD** | Part 6 §6.7, Part 9 |

### ENG-29 — No Authority in Implementation Docs

| | |
|-|-|
| **Purpose** | Single authority chain |
| **Rationale** | ADR-0001 |
| **Enforcement** | Review |
| **Verification** | README links to docs/ |
| **Failure** | Doc relocated |
| **ADRs** | 0001 |
| **SDD** | Part 6 §6.1 |

### ENG-30 — SDD Program Completeness

| | |
|-|-|
| **Purpose** | Corpus complete before build |
| **Rationale** | Freeze §6.4 |
| **Enforcement** | B-02 gate |
| **Verification** | All SDD reviews approved |
| **Failure** | Build unauthorized |
| **ADRs** | 0025 |
| **SDD** | Part 11, Part 14 |

---

# PART 13 — TRACEABILITY

## 13.1 Governance → Architecture → Implementation → Verification

```
CCIS requirement (RTM Part A)
  → AMD principle (RTM Part B)
  → PDD workflow / UXMD screen (RTM Part C/D)
  → SDD I–IV component (RTM Part E/F/K)
  → ADR decision
  → Implementation (Build phase)
  → Test evidence (RTM Verified)
  → ENG / EL / IL / INF / AI law CI gate
```

## 13.2 Law Hierarchy (Enforcement)

| Tier | Laws | Enforced by |
|------|------|-------------|
| CCIS | Engineering laws §XVI | Architecture review |
| SDD-I | EL-1–EL-33 | Dependency CI + review |
| SDD-II | IL-1–IL-21 | Contract + integration tests |
| SDD-III | INF-1–INF-25 | Security + ops gates |
| SDD-IV | AI-1–AI-25 | Intelligence golden tests |
| **SDD-V** | **ENG-1–ENG-30** | **Process CI + release gates** |

## 13.3 Cross-Reference Index

| Corpus | SDD-V binding |
|--------|---------------|
| CCIS | Part 1, ENG-6, ENG-22 |
| AMD III–IV | Part 2 boundaries, Part 5 AI tests |
| PDD I–II | Part 11 B-11–B-13, module ownership |
| UXMD I–III | ENG-23, Part 5.6, B-08 |
| SDD I | EL enforcement Part 2, Part 12 ENG-7 |
| SDD II | IL tests Part 5.12–5.13 |
| SDD III | Part 8, 10, Part 11 B-14–B-18 |
| SDD IV | Part 5.11, B-25–B-28 |
| RTM | ENG-5, Part 13 |
| ADR | ENG-4, Part 0 |

---

# PART 14 — APPROVAL CRITERIA

## 14.1 Completion Requirements

- [x] Parts 0–14 complete
- [x] ENG-1 through ENG-30 — full law template
- [x] Build authorization checklist B-01–B-32
- [x] No implementation artifacts
- [x] No product/UX/orchestration/infra redefinition
- [x] SDD program five-volume structure complete

## 14.2 Review Requirements

Execute `sdd-volume-v-review-checklist.md` with strict methodology. Verdict required before **SDD Program Complete** declaration and Build Authorization consideration.

## 14.3 Future Amendment Rules

SDD-V amendments are **process-only**. v1.1 for clarifications; v2.0 for governance model change — requires ADR and Freeze update.

## 14.4 Versioning

| Version | Meaning |
|---------|---------|
| 1.0 | Initial engineering governance authority |
| 1.x | Process clarifications, checklist additions |
| 2.0 | Major governance change — program review |

## 14.5 SDD Program Status

Upon v1.0 approval: **SDD Volumes I–V corpus complete.** Build remains **unauthorized** until Part 11 explicit Build Authorization.

---

*SDD Volume V v1.0 — Engineering Standards & Build Governance. Final volume of the SDD program. Documentation only — no build authorization implied.*
