# SDD VOLUME I — SYSTEM ARCHITECTURE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | SDD Volume I — System Architecture |
| **Abbreviation** | SDD-I |
| **Status** | Engineering Architecture Authority — Volume 1 of 5 |
| **Version** | 1.1 |
| **Supreme Authority** | CCIS |
| **Subordinate To** | CCIS, AMD Volumes I–IV |
| **Derived From** | CCIS, AMD I–IV, PDD I–II (+ Authority Bridge), UXMD I–III |
| **Precedes** | SDD Volume II, III, IV, V; all implementation |

### Mission

Define the **complete engineering architecture** of Conquest as a Strategic Intelligence Operating System — the definitive bridge between approved product/architecture authority and future implementation — without writing code, schemas, APIs, UI, or infrastructure configuration.

| Document | Question |
|----------|----------|
| CCIS | What does Conquest believe? |
| AMD | What is Conquest? |
| PDD | How does Conquest behave? What do modules do? |
| UXMD | How does the user experience Conquest? |
| **SDD Volume I** | **How is the platform engineered as a system?** |

### Authority Resolution

Where conflicts exist, higher-order documents prevail:

```
CCIS > AMD > PDD > UXMD > SDD
```

SDD elaborates engineering structure. SDD never contradicts verification-before-execution (CCIS), memory governance (AMD III), or GIS standards (UXMD III).

### Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0 | 2026-06-21 | Initial engineering architecture — ten layers, modules, events, topology |
| 1.1 | 2026-06-21 | P0 review revisions: Execution Layer, Learning Boundary, platform services, complete layer templates, workspace switching, event retry philosophy, deployment resilience, production readiness, conceptual authentication; P1 enhancements |

### Strict Prohibitions

This document does **not** contain: implementation code, database schemas, API endpoint definitions, UI designs, wireframes, cloud configuration files, or technology stack commitments unless noted as conceptual placeholder.

**Build phase has not started.**

---

# SECTION 1 — ENGINEERING PHILOSOPHY

## 1.1 Why This Section Exists

Engineering philosophy establishes permanent priorities that govern every architectural decision in Volumes II–V and all future implementation. Without explicit philosophy, teams optimize locally and violate Conquest's intelligence-first identity.

## 1.2 Engineering Principles

| Principle | Definition | CCIS / AMD source |
|-----------|------------|-------------------|
| **Intelligence-first** | Every subsystem exists to improve decision quality | CCIS §I.2 |
| **Verification before release** | No major conclusion reaches users without verification gate | CCIS §II; BH-5 |
| **Bounded contexts** | Modules, workspaces, organizations have hard boundaries | PDD-II; AMD |
| **Eventual consistency with explicit freshness** | Intelligence may be stale — never silently | BH-7; GIS-S6 |
| **Fail closed on authority** | Auth, permission, verification failures block — never partial leak | GIS §2.5 |
| **Observable by design** | Every intelligence cycle traceable for audit and support | CCIS §XVII |
| **Replaceable components** | Engines and integrations swappable without product redesign | AMD extensibility |
| **Human authority on stakes** | High-stakes execution requires explicit human gate | BH-9; UX-9 |
| **Learning without code mutation** | Learning adjusts models, memory, routing — not deployed code | BH-6 |
| **Progressive disclosure** | Internal complexity hidden; outcomes surfaced | UXMD-I |
| **Execute without reason** | Execution Layer acts — never concludes or verifies | AMD IV L4 |
| **Learn without execute** | Learning Boundary proposes — never executes actions | AMD IV L6 |

## 1.3 System Objectives

| Objective | Engineering expression |
|-----------|------------------------|
| Decision superiority | Measurable outcome improvement per workspace |
| Reliability | Intelligence cycles complete or fail explicitly |
| Scalability | Horizontal scale of stateless compute; scoped stateful boundaries |
| Security | Zero-trust between tenants; least privilege per role |
| Maintainability | Layer dependency rules enforceable by review |
| Extensibility | Marketplace extensions bounded by governance contracts |
| Operability | Health, SLOs, and incident response built into topology |
| Production readiness | Every subsystem definable, observable, and recoverable before build |

## 1.4 Technical Constraints

| Constraint | Requirement |
|------------|-------------|
| Multi-tenant | Organization isolation is non-negotiable |
| Workspace scope | All intelligence, memory, automation scoped to workspace unless org-level policy |
| No intelligence in presentation | Presentation layer never reasons |
| No reasoning in orchestration | Orchestration routes — never concludes |
| No execution in intelligence | Intelligence engines never perform authorized external actions |
| No learning execution | Learning Boundary never executes actions or bypasses verification |
| No bypass of memory governance | All persistence through Memory Layer contracts (SDD-II) |
| UXMD screen routes | Engineering routes align with UXMD-II route patterns |
| GIS inheritance | Client behavior implements GIS standards |
| Regulatory readiness | Audit trail for sensitive actions |

## 1.5 Architectural Priorities (Ordered)

1. **Correctness** — intelligence accuracy and verification
2. **Security** — tenant and role isolation
3. **Reliability** — explicit failure over silent degradation
4. **Observability** — traceability of intelligence lineage
5. **Performance** — latency within SLO; stakes-scaled depth
6. **Cost efficiency** — cycle depth proportional to stakes
7. **Developer velocity** — within constraints above

## 1.6 Scalability Philosophy

| Dimension | Approach |
|-----------|----------|
| **Users** | Stateless application tier; session externalized |
| **Workspaces** | Shard intelligence state by workspace ID |
| **Intelligence cycles** | Queue-backed; parallelize disjoint research; merge at orchestration |
| **Ingestion** | Per-source connectors scale independently |
| **Memory** | Retrieval scoped; never global scan |
| **Reports** | Snapshot generation async |
| **Automations** | Worker pool with per-workspace concurrency limits |
| **Execution** | Per-workspace execution queues; idempotent step workers |
| **Notifications** | Fan-out via dedicated service; rate-limited per org |

Scale horizontally until bounded by data affinity (workspace, organization). Never require single-node intelligence.

## 1.7 Reliability Philosophy

| Tenet | Engineering rule |
|-------|-------------------|
| **Explicit degradation** | Degraded mode is first-class state |
| **Idempotent ingestion** | Source events replayable |
| **At-least-once events** | Consumers idempotent |
| **Verification failure** | Blocks release; triggers reroute upstream |
| **Automation failure** | Pause, log, alert — never silent retry loop |
| **No false success** | GIS-S1 enforced at Experience boundary |
| **Execution traceability** | Every authorized action logged with decision lineage |

## 1.8 Maintainability Philosophy

- **Dependency direction** flows inward: Presentation → Application → Domain → Orchestration → Intelligence → Data
- **Modules** communicate via events and contracts — not shared mutable state
- **One owner** per bounded context
- **Versioned contracts** for extension marketplace
- **Architectural review** required for cross-layer dependency

## 1.9 Extensibility Philosophy

| Extension type | Boundary |
|--------------|----------|
| Marketplace connectors | Integration Layer; declared permissions |
| Domain modules | Orchestration routing profile |
| Report/automation templates | Module templates — no core fork |
| Future agents | SDD-IV hierarchy; orchestration mediation mandatory |
| Execution adapters | Execution Layer capability registry — no direct module IO |

Extensions cannot disable verification, challenge, or evidence classification.

## 1.10 Failure Considerations

Engineering must assume: provider outage, stale data, model disagreement, user correction, partial ingestion, quota exhaustion, malicious input, execution failure, workspace switch mid-cycle, and session invalidation. Every layer and subsystem defines failure mode — see Section 9 and Section 3 layer specifications.

## 1.11 Future Extensibility

Volume I defines stable boundaries. Volumes II–IV detail data, security, and cognition without restructuring layers defined here.

## 1.12 Production Readiness Philosophy

Production readiness is an **engineering gate**, not a deployment checkbox.

| Tenet | Engineering requirement |
|-------|-------------------------|
| **Subsystem completeness** | Every subsystem defines purpose, ownership, IO, failure, recovery, observability |
| **Engineering maturity** | Architecture traceable to CCIS/AMD/PDD/UXMD before implementation |
| **Operational excellence** | SLOs, health checks, and runbooks assigned per tier (conceptual) |
| **Maintainability** | Dependency rules and layer prohibitions enforceable in review |
| **Scalability** | Stateless tiers horizontal; stateful tiers affinity-scoped |
| **Observability** | Correlation ID end-to-end; intelligence lineage auditable |
| **Security** | Fail-closed auth; tenant isolation at gateway |
| **Upgrade philosophy** | Versioned events and projections; backward-compatible expansion |
| **Backward compatibility** | Breaking contract changes require migration plan (EL-14) |
| **Versioning philosophy** | Events, projections, extensions, artifacts versioned immutably |
| **Change safety** | Feature flags gate rollout — never verification bypass |
| **Rollback governance** | Automation rollback (AUT-06); deployment rollback in SDD-V; learning rollback via Memory governance |
| **Quality gates** | Architectural review for cross-layer dependency (EL-26) |
| **Production approval criteria** | All five SDD volumes approved; PDD-I v2.1 for memory/cognitive build |

## 1.13 Performance Engineering Philosophy

Performance is **stakes-scaled**, not uniform.

| Tier | Engineering objective | Owner |
|------|----------------------|-------|
| **Interactive read** | Screen projection load within GIS-acceptable latency | Experience Layer |
| **Command dispatch** | Ask Conquest accepts and returns job reference when async | Application + Orchestration |
| **Intelligence cycle** | Depth proportional to stakes; P0 cycles prioritized | Orchestration |
| **Ingestion** | Lag bounded per source SLA; degraded state on breach | Integration |
| **Execution step** | Bounded by PLN artifact; timeout → pause + alert | Execution Layer |
| **Client render** | Mobile-first; subscription throttling on cellular | Presentation |

Numeric budgets and enforcement mechanisms: **SDD Volume V**. Philosophy here governs **where** performance is optimized and **who** owns each SLO class.

## 1.14 Mobile-First Engineering Principles

| Principle | Engineering rule |
|-----------|------------------|
| **GIS inheritance** | All screens inherit UXMD-III Part 4 unless override declared |
| **Progressive enhancement** | Core journeys complete on mobile; depth views may be desktop-preferred |
| **Subscription economy** | Real-time subscriptions scoped to active workspace; teardown on switch |
| **Offline-first reads** | Cached projections with GIS-S6 freshness banner |
| **Touch targets** | GIS §4 minimums enforced at Presentation |
| **Push channel** | Mobile push via Notification platform service — not module-direct |
| **OAuth mobile** | Integration Layer handles deep-link return per UXMD-II |

## 1.15 Accessibility Engineering Architecture

| Concern | Engineering owner | Requirement |
|---------|-------------------|-------------|
| **WCAG 2.2 AA** | Presentation Layer | GIS Part 3 mandatory |
| **Keyboard navigation** | Presentation | Focus order per screen category; no keyboard traps |
| **Screen reader** | Presentation + Experience | Semantic payloads; plain-language activity events |
| **Live regions** | Presentation | Real-time intelligence updates announce material changes |
| **Reduced motion** | Presentation | GIS §3.5; no motion-dependent information |
| **Color independence** | Presentation + Experience | Confidence and priority never color-only |
| **A11y test gate** | SDD Volume V | Build cannot ship without a11y verification per GIS |

Accessibility is **engineered**, not post-hoc — bound to GIS at Presentation boundary.

---

# SECTION 2 — SYSTEM ARCHITECTURE

## 2.1 Why This Section Exists

Defines the whole-platform shape — how major engineering blocks relate before any technology selection.

## 2.2 High-Level Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER (L10)                          │
│  UXMD-II screens + UXMD-III GIS standards                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                        EDGE TIER                                  │
│  TLS termination, rate limiting, geo routing, WAF                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   GATEWAY TIER + AUTH BOUNDARY                    │
│  Session resolution, tenant context, routing, API surface         │
└────────────────────────────┬────────────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
     ▼                       ▼                       ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│ APPLICATION │    │  INTELLIGENCE   │    │ INTEGRATION │
│  SERVICES   │    │    PLATFORM     │    │  SERVICES   │
│   (L8)      │    │ L6,L7 + Learning│    │    (L2)     │
└──────┬──────┘    └────────┬────────┘    └──────┬──────┘
       │                      │                     │
       │              ┌───────▼───────┐             │
       │              │  EXECUTION    │             │
       │              │  LAYER (L5E)  │             │
       │              └───────┬───────┘             │
       └──────────────────────┼─────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│              PLATFORM SERVICES: Auth, Notifications, Billing        │
└─────────────────────────────┬────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                        DATA TIER (L4)                               │
│  Transactional, artifacts, memory, graph, cache, search indices     │
└─────────────────────────────┬────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│              INFRASTRUCTURE & OBSERVABILITY (L3)                    │
└────────────────────────────────────────────────────────────────────┘
```

## 2.3 Modular Architecture

Conquest decomposes into **product modules** (user-facing), **platform services** (shared), **intelligence engines** (cognitive), and **execution capabilities** (authorized action). Logical boundaries first; physical deployment is Volume III.

| Module type | Examples | Owns |
|-------------|----------|------|
| **Product module** | Command Center, Reports, Automation | User workflows, module state projections |
| **Platform service** | Auth, Notifications, Billing | Cross-cutting user/org capabilities |
| **Intelligence engine** | Orchestration, Reasoning, Verification | Cognitive artifacts |
| **Execution capability** | Automation runners, approved action adapters | Authorized external actions |
| **Integration adapter** | Source connectors, payment, email | External system translation |

## 2.4 Layered Architecture — AMD Alignment

Twelve engineering specifications in Section 3 (ten layers + Execution Layer + Learning Boundary) map to AMD six-layer model:

| AMD Layer | SDD Engineering specification | Role |
|-----------|------------------------------|------|
| **L1 — Experience** | L10 Presentation + L9 Experience | Capture intent; deliver outcomes |
| **L2 — Orchestration** | L6 Orchestration | Route cycles; never reason |
| **L3 — Cognitive** | L7 Intelligence | Reason, verify, decide artifacts |
| **L4 — Execution** | **L5E Execution Layer** | Act on authorized intelligence |
| **L5 — Memory** | L4 Data | Persist artifacts and memory |
| **L6 — Learning** | **Learning Boundary** (§3.13) | Governed improvement proposals |

| SDD Layer | Additional role |
|-----------|-----------------|
| L8 Application | Module use cases (PDD-II) |
| L5 Domain | Business entities, entitlements, policy |
| L2 Integration | External IO normalization |
| L3 Infrastructure | Runtime, queues, scheduling |
| L1 Security | Cross-cutting AuthN/AuthZ/audit |

## 2.5 Separation of Concerns

| Concern | Owner |
|---------|-------|
| User intent capture | Experience (L9/L10) |
| Workflow coordination | Application (L8) |
| Cycle routing | Orchestration (L6) |
| Reasoning and verification | Intelligence (L7) |
| Authorized action | **Execution (L5E)** |
| Improvement proposals | **Learning Boundary** |
| Persistence | Data (L4) |
| External IO | Integration (L2) |
| Policy enforcement | Security (L1) |
| Identity and session | Auth platform service + Security |

No layer absorbs another's concern.

## 2.6 Bounded Contexts

| Context | Boundary key | Isolation unit |
|---------|--------------|----------------|
| **Organization** | `org_id` | Billing, SSO, marketplace, org memory |
| **Workspace** | `workspace_id` | Intelligence, automation, reports, goals |
| **User** | `user_id` | Preferences, session, user memory |
| **Intelligence cycle** | `cycle_id` | Artifact chain lineage |
| **Execution run** | `run_id` | Action trace and rollback scope |
| **Extension** | `extension_id` | Marketplace capability scope |

Cross-context access requires explicit contract — never implicit shared tables (conceptual).

## 2.7 Service Boundaries

| Service domain | Communicates via | Must not |
|----------------|------------------|----------|
| Module application services | Commands, queries, events | Call intelligence engines directly |
| Intelligence platform | Orchestration contracts, artifact bus | Render UI; execute external actions |
| **Execution Layer** | Execution commands, run events | Reason; bypass verification gate |
| **Learning Boundary** | Learning proposals, governed writes | Execute actions; bypass verification |
| Integration adapters | Integration events | Store business rules; call engines |
| Notification service | Events from all contexts | Reason about intelligence |
| Auth service | Session tokens, identity events | Alter intelligence content |
| Billing service | Payment events → Domain entitlements | Alter intelligence outputs (PD-12) |

## 2.8 Communication Boundaries

| Pattern | Use |
|---------|-----|
| **Synchronous query** | Read models for screens; auth checks |
| **Asynchronous command** | Intelligence cycles, report generation, automation runs |
| **Event broadcast** | Domain events, intelligence completion, alerts |
| **Request/response** | Integration external calls; execution adapter calls |
| **Execution handoff** | Orchestration → Execution Layer post-authorization |

Intelligence cycles are **async-first**. Synchronous user requests return accepted + job reference when work exceeds threshold latency.

## 2.9 Dependency Rules

```
Presentation → Application → Domain
Application → Orchestration (intelligence requests)
Orchestration → Intelligence engines
Orchestration → Execution Layer (authorized handoff only)
Intelligence → Data (artifacts, memory requests)
Execution → Integration (external action adapters)
Execution → Data (execution logs)
Learning Boundary → Data (governed memory proposals)
Integration → Domain (normalized events) — never Intelligence engines directly
Security → all inbound paths
Platform services → consumed by Application, Gateway — not Intelligence

FORBIDDEN:
Intelligence → Presentation (direct)
Intelligence → Execution (direct — must pass Orchestration)
Presentation → Intelligence (bypass Application)
Domain → Intelligence (bypass Orchestration)
Learning → Execution (direct)
Learning → bypass Verification for release
Any → bypass Verification for major release
Integration → Intelligence engines (direct — normalized via events/Data)
```

**EL-4 clarification:** Integration adapters emit normalized events consumed by Domain and Orchestration. Intelligence retrieves evidence through Data Layer contracts — not direct adapter invocation.

## 2.10 What Depends on Section 2

Volumes II–V, deployment decisions, service decomposition, and agent architecture all assume this topology.

---

# SECTION 3 — APPLICATION LAYERS

## 3.0 Layer Specification Standard

Every layer and subsystem in this section defines:

| Field | Definition |
|-------|------------|
| **Purpose** | Why the layer exists |
| **Ownership** | Authoritative engineering context |
| **Responsibilities** | What it must do |
| **Inputs** | What it receives |
| **Outputs** | What it produces |
| **Dependencies** | What it requires |
| **Allowed communication** | Permitted interaction patterns |
| **Forbidden communication** | Prohibited interaction patterns |
| **Failure handling** | Failure modes and responses |
| **Recovery** | How service restores |
| **Extension points** | How extensions attach |
| **Verification rules** | Gates that apply |
| **Scalability expectations** | Scale model |
| **Observability expectations** | Metrics, traces, logs |

## 3.1 Layer Overview

| # | Layer / Subsystem | Primary responsibility |
|---|-------------------|------------------------|
| L10 | **Presentation** | Client rendering of UXMD screens |
| L9 | **Experience** | Server-side outcome assembly |
| L8 | **Application** | Module use cases (PDD-II) |
| L7 | **Intelligence** | Cognitive engines (AMD L3) |
| L6 | **Orchestration** | Cycle routing (AMD L2) |
| **L5E** | **Execution** | Authorized action (AMD L4) |
| L5 | **Domain** | Business truth |
| L4 | **Data** | Persistence and memory (AMD L5) |
| L3 | **Infrastructure** | Runtime capabilities |
| L2 | **Integration** | External boundaries |
| L1 | **Security** | Cross-cutting enforcement |
| — | **Learning Boundary** | Governed improvement (AMD L6) |

*Numbering: L1 Security is foundational; L10 Presentation is outermost. L5E Execution sits between Orchestration and external action.*

---

## 3.2 Presentation Layer (L10)

| Field | Specification |
|-------|---------------|
| **Purpose** | Implement UXMD-II screens and UXMD-III GIS in the client |
| **Ownership** | Client application engineering context |
| **Responsibilities** | Route rendering; GIS states; input capture; a11y per GIS §3; real-time subscriptions; token attachment |
| **Inputs** | Experience projections; GIS state payloads; session context from Auth |
| **Outputs** | User commands; client telemetry (non-PII); navigation events |
| **Dependencies** | Experience Layer, Auth session, GIS standards |
| **Allowed communication** | Sync read to Experience; command submit to Application path; Security token attach |
| **Forbidden communication** | Direct Intelligence/Orchestration/Execution; authoritative intelligence storage; engine name exposure |
| **Failure handling** | GIS error/recovery/offline states; auth failure blocks app shell |
| **Recovery** | Re-fetch projections on reconnect; GIS §1.7 recovery flows |
| **Extension points** | Marketplace widgets via registered Presentation slots only |
| **Verification rules** | Never surface unverified recommendations (Experience enforces) |
| **Scalability** | CDN static assets; client-side cache; subscription scope per workspace |
| **Observability** | Client error reporting with correlation ID; no intelligence content in logs |

---

## 3.3 Experience Layer (L9)

| Field | Specification |
|-------|---------------|
| **Purpose** | Translate intelligence artifacts into product outcomes for modules |
| **Ownership** | Server-side projection engineering context |
| **Responsibilities** | Assemble Command Center zones; HUM calibration; confidence visibility; plain-language activity (PD-15); per-screen read models |
| **Inputs** | Artifact projections; cycle status; domain context |
| **Outputs** | Screen-optimized projections; freshness metadata; activity feed payloads |
| **Dependencies** | Application commands, Data read models, Orchestration status |
| **Allowed communication** | Read-only artifact access; Application command forward; Orchestration subscribe |
| **Forbidden communication** | Initiate reasoning; modify memory; skip verification gate; fabricate empty content (BH-8) |
| **Failure handling** | Stale → attach `freshness_at`; verification failed → suppress affected zones |
| **Recovery** | Invalidate and rebuild projections on cycle completion events |
| **Extension points** | Marketplace projection enrichers via registered contracts |
| **Verification rules** | No recommendation without VRF pass on artifact chain |
| **Scalability** | Projection cache per workspace; invalidation on events |
| **Observability** | Projection build latency; suppression counts |

---

## 3.4 Application Layer (L8)

| Field | Specification |
|-------|---------------|
| **Purpose** | Encode PDD-II module use cases |
| **Ownership** | Per-module application bounded contexts (§4) |
| **Responsibilities** | Module workflows; permission validation (GIS §2); domain command emit; workspace scope; FTUE/onboarding coordination |
| **Inputs** | User commands; domain events; platform service callbacks |
| **Outputs** | Domain commands; orchestration requests; experience invalidation signals |
| **Dependencies** | Domain, Orchestration, Experience, Integration, Platform services |
| **Allowed communication** | Domain CRUD; Orchestration cycle request; Notification request events; Billing read entitlements |
| **Forbidden communication** | Direct engine calls; persist artifacts without Data contracts; bypass Execution Layer for actions |
| **Failure handling** | Typed domain errors; permission denied → GIS §2.5 |
| **Recovery** | Retry idempotent commands; surface GIS recovery |
| **Extension points** | Marketplace module hooks via event subscription |
| **Verification rules** | High-stakes commands require permission + human gate per BH-9 |
| **Scalability** | Stateless horizontal scale |
| **Observability** | Per-module command metrics; audit for sensitive actions |

**Module mapping:** Command Center (`command-center`), Strategy (`strategy`), Reports (`reports`), Automation (`automation`), Knowledge (`knowledge`), Marketplace (`marketplace`), Settings (`settings`), Support (`support`), Workspace (`workspace`), FTUE (`onboarding`).

---

## 3.5 Intelligence Layer (L7)

| Field | Specification |
|-------|---------------|
| **Purpose** | Cognitive engines per AMD IV and CCIS loop |
| **Ownership** | Intelligence platform engineering context |
| **Responsibilities** | Understanding through Decision engines; structured artifacts with lineage; stakes-scaled activation; challenge and evidence scoring |
| **Inputs** | Orchestration invocation; memory retrieval via Data; evidence portfolios |
| **Outputs** | Structured artifacts (RSN, VRF, DEC, PRD, etc.); failure artifacts |
| **Dependencies** | Orchestration, Data Layer |
| **Allowed communication** | Orchestration invoke/response; Data read/write via Memory Manager contracts |
| **Forbidden communication** | UI render; direct user communication; external execution; ungoverned memory write; bypass Verification |
| **Failure handling** | Structured failure artifact → Orchestration reroute or abort |
| **Recovery** | Partial cycle with completeness flag; engine-level retry per §5.8 |
| **Extension points** | Marketplace routing profiles — cannot disable VRF/CHL |
| **Verification rules** | Major conclusions require VRF artifact before Orchestration release |
| **Scalability** | Queue-driven workers; parallel disjoint research |
| **Observability** | Per-engine latency; artifact lineage trace |

*Engine detail: SDD Volume IV. Learning engines produce proposals to Learning Boundary — not direct memory writes.*

---

## 3.6 Orchestration Layer (L6)

| Field | Specification |
|-------|---------------|
| **Purpose** | Traffic control of cognition — classifies, routes, coordinates |
| **Ownership** | Orchestration platform engineering context |
| **Responsibilities** | Stakes classification; cycle depth selection; parallel research coordination; verify-before-release routing; background cycle scheduling; **authorized Execution handoff** |
| **Inputs** | Application cycle requests; system schedulers; domain triggers |
| **Outputs** | Engine invocations; cycle status events; execution handoff commands; learning dispatch |
| **Dependencies** | Intelligence engines, Execution Layer, Application, Learning Boundary |
| **Allowed communication** | Invoke Intelligence; handoff to Execution; emit intelligence events; dispatch reflection/learning |
| **Forbidden communication** | Generate hypotheses; store long-term memory; present outcomes to users; execute external actions directly |
| **Failure handling** | Classification ambiguity → clarification via Experience; timeout → partial artifact |
| **Recovery** | Cycle abort with audit; reschedule background cycles |
| **Extension points** | Marketplace routing profiles registered in capability registry |
| **Verification rules** | Enforce VRF gate before `CycleCompleted` release to Experience |
| **Scalability** | Queue-backed; workspace-scoped concurrency limits |
| **Observability** | Queue depth; cycle latency; verification block rate |

### Orchestration → Execution Handoff Contract

| Field | Requirement |
|-------|-------------|
| **Precondition** | Decision recorded; human approval if required; VRF passed for intelligence-backed actions |
| **Payload** | `run_id`, `workspace_id`, `decision_id`, PLN artifact ref, bounds, rollback plan ref |
| **Acknowledgment** | Execution Layer returns `execution.RunAccepted` or `execution.RunRejected` |
| **Completion** | `execution.RunCompleted` \| `execution.RunFailed` \| `execution.RollbackCompleted` |

---

## 3.7 Execution Layer (L5E) — AMD Layer 4

| Field | Specification |
|-------|---------------|
| **Purpose** | Execute **authorized actions** on approved intelligence — does not reason |
| **Ownership** | Execution platform engineering context |
| **Responsibilities** | Run automation steps; execute approved recommendations; enforce PLN bounds; record execution trace; initiate rollback; report outcomes to Orchestration and Learning |
| **Inputs** | Orchestration handoff; PLN artifacts; capability registry entries; Integration adapters |
| **Outputs** | `execution.RunStarted`, `execution.StepCompleted`, `execution.RunCompleted`, `execution.RunFailed`, `execution.RollbackStarted`, `execution.RollbackCompleted` |
| **Dependencies** | Orchestration (commands only), Integration (adapters), Data (logs), Domain (policy bounds) |
| **Allowed communication** | Integration adapter invoke; Data execution log write; event publish |
| **Forbidden communication** | Intelligence engines; Presentation/Experience; reasoning or verification; bypass human approval gate |
| **Failure handling** | Step failure → pause run; alert within EL-21; offer rollback if reversible (AUT-06) |
| **Recovery** | Idempotent step retry per §5.8; compensating rollback per PLN plan |
| **Extension points** | Marketplace execution adapters via capability registry |
| **Verification rules** | No run without Orchestration handoff + authorization record; irreversible steps require approval at plan time |
| **Scalability** | Per-workspace execution queues; idempotent workers |
| **Observability** | Run success rate; step latency; rollback rate; deviation alerts |

### Execution Lifecycle

```
Orchestration.HandoffAuthorized
  → execution.RunAccepted
  → execution.RunStarted
  → [execution.StepCompleted]*
  → execution.RunCompleted | execution.RunFailed
  → [execution.RollbackStarted → execution.RollbackCompleted] (if reversible)
  → intelligence.OutcomeMeasurementScheduled
```

### Execution Contracts (Conceptual)

| Contract | Governs |
|----------|---------|
| **Authorization contract** | Decision ID, approver, timestamp, bounds |
| **Plan contract** | PLN artifact reference, steps, rollback plan |
| **Capability contract** | Registered adapter permissions per workspace |
| **Trace contract** | Immutable execution log per `run_id` |
| **Rollback contract** | Compensating actions within window (PDD-II AUT) |

### Rollback Interaction

| Scenario | Execution behavior |
|----------|-------------------|
| Reversible step failure | Attempt compensating action per PLN |
| User-initiated rollback (AUT-06) | Execute rollback plan within window |
| Rollback failure | Pause automation; alert; Support escalation path |
| Irreversible action | No rollback — prevention via approval gate only |

### Monitoring Interaction

Execution publishes metrics and events consumed by Automation module, Notification service, and Observability tier. Deviation from PLN bounds triggers `execution.BoundsViolated` → pause + alert.

### Verification Dependency

Execution **never** runs intelligence-backed actions without: (1) VRF-passed artifact chain, (2) recorded decision, (3) human approval when stakes require.

---

## 3.8 Domain Layer (L5)

| Field | Specification |
|-------|---------------|
| **Purpose** | Business truth — organizations, workspaces, users, goals, policies |
| **Ownership** | Domain engineering context |
| **Responsibilities** | Entity lifecycle; entitlement checks (PD-12); policy rules; invariants (≥1 goal per workspace) |
| **Inputs** | Application commands; Billing entitlement events |
| **Outputs** | Domain events; entity projections |
| **Dependencies** | Data persistence, Security role resolution |
| **Allowed communication** | Data CRUD; Security policy query |
| **Forbidden communication** | Intelligence cycles; evidence artifact storage; intelligence content mutation from billing |
| **Failure handling** | Invariant violation → typed rejection |
| **Recovery** | Event-sourced entity rebuild |
| **Extension points** | Org policy hooks for Marketplace allowlists |
| **Verification rules** | Billing state never alters intelligence (PD-12) |
| **Scalability** | Shard by `org_id`; workspace affinity |
| **Observability** | Entity mutation audit |

---

## 3.9 Data Layer (L4)

| Field | Specification |
|-------|---------------|
| **Purpose** | Authoritative persistence — transactional, artifacts, memory, graph, snapshots |
| **Ownership** | Data platform engineering context |
| **Responsibilities** | Entity CRUD; artifact store with lineage; memory governance (AMD III); snapshots; execution logs; projection maintenance |
| **Inputs** | Repository commands from all layers |
| **Outputs** | Read models; projections; persistence confirmations |
| **Dependencies** | Infrastructure storage abstractions |
| **Allowed communication** | Defined repository contracts only |
| **Forbidden communication** | Reason about content; release unverified artifacts to Experience |
| **Failure handling** | Write failure → reject with retry guidance; read degradation → stale flag |
| **Recovery** | Replication per §8; point-in-time restore — SDD III |
| **Extension points** | None at content level — Marketplace uses contracts |
| **Verification rules** | Memory writes require Memory Manager governance |
| **Scalability** | Workspace affinity; scoped retrieval |
| **Observability** | Storage latency; replication lag |

*Lifecycles: SDD Volume II.*

---

## 3.10 Infrastructure Layer (L3)

| Field | Specification |
|-------|---------------|
| **Purpose** | Runtime — compute, messaging, scheduling — no business logic |
| **Ownership** | Platform operations engineering context |
| **Responsibilities** | Job queues; workers; schedulers; object storage abstraction; cache; health endpoints |
| **Inputs** | Deployment configuration (SDD III) |
| **Outputs** | Runtime capacity; queue delivery |
| **Dependencies** | None (foundation) |
| **Allowed communication** | All layers consume infrastructure services |
| **Forbidden communication** | Domain or intelligence rules in infrastructure code |
| **Failure handling** | Queue backpressure; worker restart |
| **Recovery** | Multi-instance redundancy per §8 |
| **Extension points** | None |
| **Verification rules** | N/A |
| **Scalability** | Horizontal workers |
| **Observability** | Queue depth; worker health |

*Detail: SDD Volume III.*

---

## 3.11 Integration Layer (L2)

| Field | Specification |
|-------|---------------|
| **Purpose** | Boundary translation between Conquest and external systems |
| **Ownership** | Integration engineering context |
| **Responsibilities** | Source connectors; payment; email/push providers; OAuth; marketplace adapter hosting; schema normalization |
| **Inputs** | External payloads; outbound commands from Execution and platform services |
| **Outputs** | `integration.*` events; adapter responses |
| **Dependencies** | Security secret custody |
| **Allowed communication** | Domain event emit; Execution adapter invoke; platform service providers |
| **Forbidden communication** | Raw payloads to Intelligence; business rule storage; direct engine calls |
| **Failure handling** | Circuit breaker per provider; classified retryable vs fatal |
| **Recovery** | Backoff per §5.8; degraded state per BH-7 |
| **Extension points** | Marketplace connectors |
| **Verification rules** | Normalization before any cognitive consumption |
| **Scalability** | Per-connector pools |
| **Observability** | Provider latency; error rate; circuit state |

*Boundaries: Section 7.*

---

## 3.12 Security Layer (L1)

| Field | Specification |
|-------|---------------|
| **Purpose** | Cross-cutting identity, authorization, encryption, audit |
| **Ownership** | Security engineering context (implementation detail SDD III) |
| **Responsibilities** | Session validation; RBAC enforcement; tenant isolation at gateway; audit emit; secret reference |
| **Inputs** | Credentials; tokens; policy definitions |
| **Outputs** | Auth decisions; audit events; encryption boundaries |
| **Dependencies** | Auth platform service |
| **Allowed communication** | All inbound paths |
| **Forbidden communication** | Skipped on any user-facing path |
| **Verification rules** | Fail closed (EL-19) |
| **Failure handling** | Deny access; no partial leak |
| **Recovery** | Session renewal; MFA challenge |
| **Extension points** | Enterprise SSO via Integration |
| **Scalability** | Stateless validation at gateway |
| **Observability** | Auth failure rate; audit completeness |

*Conceptual auth architecture: §7.9. Detail: SDD Volume III.*

---

## 3.13 Learning Boundary — AMD Layer 6

The Learning Boundary is an **explicit engineering subsystem** — not a user-facing module. It governs how Conquest improves without executing actions or bypassing verification.

| Field | Specification |
|-------|---------------|
| **Purpose** | Governed improvement proposals from Reflection, Learning, and Optimization engines |
| **Ownership** | Learning platform engineering context |
| **Responsibilities** | Receive learning proposals; validate sample thresholds; route to Memory Manager; apply governed updates; emit learning events; never execute external actions |
| **Inputs** | Reflection artifacts; outcome measurements; correction signals; prediction outcomes |
| **Outputs** | `learning.ProposalCreated`, `learning.ProposalValidated`, `learning.ProposalApplied`, `learning.ProposalRejected`, `learning.RollbackInitiated` |
| **Dependencies** | Data (Memory Manager), Orchestration (dispatch), Intelligence (proposal source) |
| **Allowed communication** | Governed memory writes via Data; proposal events to Orchestration |
| **Forbidden communication** | Execution Layer; Presentation; bypass Verification; production code mutation; override Correction Memory |
| **Failure handling** | Reject insufficient-sample proposals; holdout validation failure → reject |
| **Recovery** | Memory rollback per AMD III versioning |
| **Extension points** | None — learning governance is core |
| **Verification rules** | Proposals affecting active intelligence require validation gate; human approval for critical domains |
| **Scalability** | Async proposal processing; workspace-scoped |
| **Observability** | Proposal acceptance rate; rollback rate |

### Relationship Matrix

| Subsystem | Relationship |
|-----------|--------------|
| **Intelligence** | Reflection and Learning engines **produce** proposals — Learning Boundary **governs application** |
| **Memory (Data)** | All writes through Memory Manager contracts; versioned; rollback capable |
| **Verification** | Learning cannot release intelligence; cannot weaken VRF outcomes retroactively |
| **Prediction** | Prediction outcome feeds learning; revision triggers `learning.ProposalCreated` — not direct user release |
| **Recommendation** | Outcome measurement (CC-15) feeds learning; confidence adjustment proposals governed here |
| **Orchestration** | Dispatches learning cycles; receives proposal events for routing profile updates |
| **Execution** | **No direct relationship** — Learning never triggers execution |

### Learning Lifecycle

```
Outcome measured | Correction submitted | Reflection complete
  → learning.ProposalCreated
  → [validation: sample threshold, holdout]
  → learning.ProposalValidated | learning.ProposalRejected
  → [human gate if critical]
  → learning.ProposalApplied (via Memory Manager)
  → memory updated — no code deployment
```

---

# SECTION 4 — MODULE ARCHITECTURE

## 4.1 Why This Section Exists

Maps **PDD-II product modules**, **platform services**, and **UXMD-II screens** to engineering bounded contexts with explicit IO contracts.

## 4.2 Module Engineering Summary

| Module / Service | Context | Owner | Primary inputs | Primary outputs | Extension points |
|------------------|---------|-------|----------------|-----------------|------------------|
| **Command Center** | `command-center` | Application / CC | Projections, commands | Decisions, zone updates | Widget slots |
| **Strategy Center** | `strategy` | Application / STR | STR artifacts | Initiative projections | Export templates |
| **Reports** | `reports` | Application / RPT | Report commands | Snapshots | Report templates |
| **Automation** | `automation` | Application / AUT | Triggers, approvals | Execution records | Automation templates |
| **Knowledge** | `knowledge` | Application / KNW | Uploads, queries | Search results | Annotation hooks |
| **Marketplace** | `marketplace` | Application / MKT | Manifests | Capability registry | Extension packages |
| **Settings** | `settings` | Application / SET | Config commands | Policy updates | None |
| **Support** | `support` | Application / SUP | Tickets | Resolutions | None |
| **Workspace** | `workspace` | Application / WKS | CRUD, sources | Scope bindings | Workspace types |
| **FTUE** | `onboarding` | Application / ONB | Registration flow | Workspace seed | None |
| **Auth** | `platform/auth` | Platform | Credentials, SSO | Sessions, identity events | SSO providers |
| **Notifications** | `platform/notifications` | Platform | Notification requests | Dispatched notices | Channel adapters |
| **Billing** | `platform/billing` | Platform | Payment events | Entitlement updates | Payment providers |

## 4.3 Command Center

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `command-center` |
| **Responsibilities** | CC-01–CC-15; recommendation decisions; Ask Conquest dispatch |
| **Inputs** | `intelligence.CycleCompleted`, `system.AlertRaised`, `integration.SourceHealthChanged`, user commands |
| **Outputs** | `user.RecommendationDecisioned`, `user.AskConquestRequested`, `user.CorrectionSubmitted`, zone projections |
| **Events emitted** | `user.RecommendationApproved`, `user.RecommendationRejected`, `user.RecommendationDeferred`, `user.CorrectionSubmitted`, `user.AskConquestRequested` |
| **Events consumed** | `intelligence.CycleCompleted`, `intelligence.ProjectionUpdated`, `execution.RunCompleted`, `system.SourceDegraded` |
| **Dependencies** | Orchestration, Experience, Domain, GIS |
| **Intelligence interactions** | Cycle requests via Orchestration only |
| **Extension points** | Marketplace widget registration |
| **Failure** | Degraded zones per source; offline cached projection; verification failure suppresses zone |

## 4.4 Strategy Center

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `strategy` |
| **Responsibilities** | STR-01–STR-08; initiative tracking; depth assembly |
| **Inputs** | Strategic artifacts, initiative commands |
| **Outputs** | Initiative projections; `user.InitiativeUpdated` |
| **Events emitted** | `user.InitiativeCreated`, `user.InitiativeUpdated`, `user.StrategicExportRequested` |
| **Events consumed** | `intelligence.CycleCompleted` (STR-type), `user.RecommendationDecisioned` |
| **Dependencies** | Command Center projections, Domain goals, Orchestration |
| **Intelligence interactions** | Deep research via Orchestration (D5) |
| **Extension points** | Custom initiative fields via Marketplace |
| **Failure** | Empty depth → GIS empty state; stale artifact → freshness banner |

## 4.5 Reports

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `reports` |
| **Responsibilities** | RPT-01–RPT-07; snapshot immutability; compare |
| **Inputs** | Generation commands, schedules, artifact chains |
| **Outputs** | `domain.ReportGenerated`, `user.ReportShared`, snapshots |
| **Events emitted** | `user.ReportGenerationRequested`, `domain.ReportGenerated`, `user.ReportExported` |
| **Events consumed** | `intelligence.CycleCompleted`, `background.ReportDue` |
| **Dependencies** | Orchestration (VRF), Data snapshot store |
| **Intelligence interactions** | Refresh cycle if stale before generation |
| **Extension points** | Report templates via Marketplace |
| **Failure** | VRF failure → generation blocked with notice; partial data → completeness flag |

## 4.6 Automation

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `automation` |
| **Responsibilities** | AUT-01–AUT-06; approval queue; rollback |
| **Inputs** | Definitions, triggers, `user.RecommendationApproved` |
| **Outputs** | `execution.RunQueued`, `domain.AutomationExecuted`, `execution.RollbackCompleted` |
| **Events emitted** | `user.AutomationCreated`, `user.AutomationApproved`, `execution.RollbackRequested` |
| **Events consumed** | `execution.RunCompleted`, `execution.RunFailed`, `execution.RollbackCompleted` |
| **Dependencies** | Execution Layer, Domain policy, Orchestration |
| **Intelligence interactions** | PLN bounds; outcomes feed Learning Boundary |
| **Extension points** | Custom triggers via Marketplace (governed) |
| **Failure** | Pause on failure; alert within 5 min (EL-21); rollback path per AUT-06 |

## 4.7 Knowledge

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `knowledge` |
| **Responsibilities** | KNW-01–KNW-05; upload pipeline; search |
| **Inputs** | Documents, annotations, search queries |
| **Outputs** | Knowledge Memory writes (via Data), search results |
| **Events emitted** | `user.DocumentUploaded`, `user.KnowledgeAnnotated`, `user.KnowledgeSearchExecuted` |
| **Events consumed** | `integration.DataIngested` (document type), `domain.KnowledgeIndexed` |
| **Dependencies** | Ingestion normalization, Data, search index |
| **Intelligence interactions** | C4 pipeline; retrieval in cycles via Data |
| **Extension points** | Custom extractors via Marketplace |
| **Failure** | Upload failure → GIS error; index lag → freshness notice |

## 4.8 Marketplace

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `marketplace` |
| **Responsibilities** | MKT-01–MKT-04; install governance |
| **Inputs** | Extension manifests, install commands |
| **Outputs** | `domain.ExtensionInstalled`, capability registry |
| **Events emitted** | `domain.ExtensionInstalled`, `domain.ExtensionRevoked` |
| **Events consumed** | `domain.PolicyUpdated` |
| **Dependencies** | Domain policy, Integration adapters |
| **Intelligence interactions** | May register routing profiles and connectors |
| **Extension points** | Self — extension hosting |
| **Failure** | Policy violation → install blocked; manifest invalid → reject |

## 4.9 Settings

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `settings` |
| **Responsibilities** | SET-01–SET-18; GIS prohibited settings |
| **Inputs** | Configuration commands |
| **Outputs** | Policy updates, preference projections |
| **Events emitted** | `domain.PolicyUpdated`, `user.PreferenceUpdated`, `user.MFAEnrolled` |
| **Events consumed** | `domain.EntitlementUpdated`, `platform.IdentityVerified` |
| **Dependencies** | Domain, Security, Billing platform service |
| **Intelligence interactions** | None — settings never alter intelligence (PD-12) |
| **Extension points** | None |
| **Failure** | Prohibited setting → reject with GIS message; MFA failure → SET-03a recovery |

## 4.10 Support

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `support` |
| **Responsibilities** | SUP-01–SUP-10; context capture |
| **Inputs** | Tickets, inaccuracy reports with artifact IDs |
| **Outputs** | Ticket state, escalation events |
| **Events emitted** | `user.SupportTicketCreated`, `user.InaccuracyReported`, `user.EscalationRequested` |
| **Events consumed** | `execution.RunFailed`, `intelligence.VerificationFailed` |
| **Dependencies** | Audit logs, artifact lineage (read-only) |
| **Intelligence interactions** | Read-only artifact access for context |
| **Extension points** | None |
| **Failure** | Escalation path per UXMD-II Part F; SLA breach → notify |

## 4.11 Workspace Context

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `workspace` |
| **Responsibilities** | WKS-01–03; SET-09–13; scope binding |
| **Inputs** | Workspace CRUD, source connections, team changes |
| **Outputs** | `domain.WorkspaceCreated`, `integration.SourceConnected`, scope bindings |
| **Events emitted** | `domain.WorkspaceCreated`, `domain.WorkspaceArchived`, `integration.SourceConnected` |
| **Events consumed** | `integration.SourceHealthChanged`, `domain.MemberInvited` |
| **Dependencies** | Domain, Integration connectors |
| **Intelligence interactions** | Triggers C3 on first source |
| **Extension points** | Workspace type profiles |
| **Failure** | Plan limit → SYS-02; source connect failure → GIS error |

## 4.12 FTUE / Onboarding

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Application context `onboarding` |
| **Responsibilities** | ONB-01–06; first workspace; first source; first value path |
| **Inputs** | Registration completion, onboarding commands |
| **Outputs** | Workspace seed; navigation to CC-01 or ONB-04 |
| **Events emitted** | `user.OnboardingStepCompleted`, `domain.WorkspaceCreated` |
| **Events consumed** | `platform.IdentityCreated`, `intelligence.CycleCompleted` (C3) |
| **Dependencies** | Workspace, Auth, Command Center projections |
| **Intelligence interactions** | C3 initialization trigger |
| **Extension points** | None |
| **Failure** | Step failure → GIS recovery; skip only where UXMD permits |

## 4.13 Platform Service — Authentication

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Platform context `platform/auth` |
| **Responsibilities** | Identity lifecycle; session issuance; MFA; SSO federation; invitation tokens; guest boundary |
| **Inputs** | Credentials, SSO assertions, MFA challenges, invitation tokens |
| **Outputs** | Session context; `platform.IdentityCreated`, `platform.SessionCreated`, `platform.SessionInvalidated`, `platform.MFACompleted` |
| **Events consumed** | `domain.MemberInvited`, `user.PasswordResetRequested` |
| **Dependencies** | Security Layer, Integration (SSO IdP), Domain (membership) |
| **Consumers** | Gateway (session resolution), Application (all modules), Security |
| **Lifecycle** | Register → verify → session → renew → invalidate |
| **Failure** | Fail closed; no partial auth state (GIS §2.5) |
| **Extension rules** | SSO providers via Integration only |
| **Service boundary** | Auth owns identity — not authorization roles (Domain + Security) |

*Conceptual detail: §7.9.*

## 4.14 Platform Service — Notifications

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Platform context `platform/notifications` |
| **Responsibilities** | Fan-out; template rendering (GIS §5); channel routing; delivery tracking; preference respect |
| **Inputs** | `platform.NotificationRequested` from any context |
| **Outputs** | `platform.NotificationDispatched`, `platform.NotificationFailed` |
| **Events consumed** | `intelligence.CycleCompleted`, `system.AlertRaised`, `execution.RunFailed`, `user.OutcomeConfirmationDue` |
| **Dependencies** | Integration (email, push), Domain (preferences), user preference store |
| **Consumers** | All modules via event — never direct email SDK |
| **Lifecycle** | Request → template → channel → delivered/failed |
| **Failure** | Retry per §5.8; dead-letter; never block intelligence cycle |
| **Extension rules** | Channel adapters via Integration |
| **Service boundary** | Notifications deliver — never reason about content |

## 4.15 Platform Service — Billing

| Dimension | Specification |
|-----------|---------------|
| **Ownership** | Platform context `platform/billing` |
| **Responsibilities** | Subscription lifecycle; payment processing; entitlement projection to Domain |
| **Inputs** | Payment provider webhooks; upgrade/downgrade commands |
| **Outputs** | `integration.PaymentSucceeded`, `domain.EntitlementUpdated`, `system.QuotaThresholdReached` |
| **Events consumed** | `user.PlanChangeRequested`, `domain.OrganizationCreated` |
| **Dependencies** | Integration (payment provider), Domain (entitlements) |
| **Consumers** | Settings, Domain, Gateway (plan limits) |
| **Lifecycle** | Subscribe → active → renew → cancel → entitlements sync |
| **Failure** | Grace period per policy; never alter intelligence (PD-12) |
| **Extension rules** | Payment providers via Integration |
| **Service boundary** | Billing owns payment — entitlements affect limits only, not intelligence content |

## 4.16 Module Isolation Rules

| Rule | Requirement |
|------|-------------|
| **MOD-1** | Modules do not read another module's internal state — only projections and events |
| **MOD-2** | Shared intelligence via artifact bus — not shared tables in Application |
| **MOD-3** | Workspace ID required on every module operation |
| **MOD-4** | Marketplace extensions register — never patch core module code |
| **MOD-5** | Platform services consumed via events/contracts — not embedded in module code |

---

# SECTION 5 — EVENT ARCHITECTURE

## 5.1 Why This Section Exists

Conquest is **event-driven** at intelligence scale. Events decouple modules, enable async cycles, and provide audit lineage.

## 5.2 Event Categories

| Category | Scope | Examples |
|----------|-------|----------|
| **User events** | User-initiated | `user.RecommendationApproved`, `user.CorrectionSubmitted` |
| **Domain events** | Business state change | `domain.WorkspaceCreated`, `domain.EntitlementUpdated` |
| **Intelligence events** | Cycle lifecycle | `intelligence.CycleStarted`, `intelligence.CycleCompleted`, `intelligence.VerificationFailed` |
| **Execution events** | Authorized action | `execution.RunStarted`, `execution.RollbackCompleted` |
| **Learning events** | Improvement | `learning.ProposalApplied`, `learning.ProposalRejected` |
| **Platform events** | Shared services | `platform.SessionInvalidated`, `platform.NotificationDispatched` |
| **System events** | Platform health | `system.SourceDegraded`, `system.QuotaThresholdReached` |
| **Background events** | Schedulers | `background.RefreshScheduled`, `background.ReportDue` |
| **Integration events** | External | `integration.DataIngested`, `integration.PaymentSucceeded` |

## 5.3 Event Envelope (Conceptual)

Every event carries:

| Field | Purpose |
|-------|---------|
| `event_id` | Unique identifier |
| `event_type` | Canonical name (`namespace.Name`) |
| `occurred_at` | Timestamp |
| `org_id` | Tenant |
| `workspace_id` | Scope (if applicable) |
| `actor_id` | User or system |
| `correlation_id` | Trace chain |
| `causation_id` | Parent event |
| `idempotency_key` | Deduplication (required for commands and execution) |
| `payload` | Typed body |
| `version` | Schema version |

## 5.4 Propagation Rules

| Rule | Behavior |
|------|----------|
| **EP-1** | Events are immutable once published |
| **EP-2** | At-least-once delivery; consumers idempotent |
| **EP-3** | Domain events may trigger Orchestration — never direct engine |
| **EP-4** | Intelligence completion events update Experience projections async |
| **EP-5** | P0 alerts propagate to Notification service within SLA |
| **EP-6** | Cross-org events forbidden |
| **EP-7** | Sensitive payloads redacted in user-visible activity feed |
| **EP-8** | Execution events never emitted without `run_id` and authorization ref |
| **EP-9** | Learning proposal events never trigger Execution |

## 5.5 Event Ownership

| Prefix | Owner |
|--------|-------|
| `user.*` | Application module originating action |
| `domain.*` | Domain layer |
| `intelligence.*` | Orchestration |
| `execution.*` | Execution Layer |
| `learning.*` | Learning Boundary |
| `platform.*` | Platform service (auth, notifications, billing) |
| `integration.*` | Integration adapter |
| `system.*` | Infrastructure monitoring |
| `background.*` | Infrastructure scheduler |

## 5.6 Critical Event Flows

### Intelligence refresh

```
background.RefreshScheduled
  → intelligence.CycleStarted
  → intelligence.* (internal)
  → intelligence.CycleCompleted
  → experience.ProjectionUpdated
  → platform.NotificationDispatched (if material)
```

### Recommendation decision and execution

```
user.RecommendationApproved
  → domain.DecisionRecorded
  → execution.RunQueued
  → execution.RunStarted
  → execution.RunCompleted | execution.RunFailed
  → intelligence.OutcomeMeasurementScheduled
  → user.OutcomeConfirmationDue
```

## 5.7 Failure Considerations

Dead-letter queue for failed consumers. Intelligence events never lost without audit alert. Execution failures always emit `execution.RunFailed` before dead-letter.

## 5.8 Event Retry Philosophy

### Retry Ownership

| Event class | Retry owner |
|-------------|-------------|
| Integration outbound | Integration adapter |
| Execution steps | Execution Layer |
| Notification delivery | Notification platform service |
| Intelligence engine internal | Orchestration |
| Projection rebuild | Experience Layer |
| Consumer processing | Consumer's tier |

### Retry Eligibility

| Eligible | Not eligible |
|----------|--------------|
| Transient provider timeout | Verification failure |
| Network blip on idempotent step | Authorization denial |
| Projection rebuild failure | Invalid payload / schema |
| Notification delivery failure | Poison event (malformed) |

### Retry Limits and Backoff

| Class | Max attempts | Backoff |
|-------|--------------|---------|
| Integration call | 5 | Exponential with jitter; cap at 15 min |
| Execution step (idempotent) | 3 | Linear 30s base |
| Notification delivery | 4 | Exponential |
| Consumer processing | 5 | Exponential |
| Intelligence engine | 2 | Orchestration decides abort vs reroute |

### Duplicate Protection

- All commands and execution handoffs carry `idempotency_key`
- Consumers deduplicate on `(event_type, idempotency_key)` within 24h window
- Execution steps keyed by `(run_id, step_index, idempotency_key)`

### Replay Governance

| Replay type | Authorization | Scope |
|-------------|---------------|-------|
| **Automatic replay** | System — eligible transient failures only | Same idempotency key |
| **Manual replay** | Operator role; audit logged | Dead-letter queue items |
| **Intelligence replay** | Orchestration only; new `cycle_id` | Never reuse released artifact IDs |

### Dead-Letter and Poison Handling

| Condition | Action |
|-----------|--------|
| Max retries exceeded | Dead-letter + operator alert |
| Poison event (schema invalid) | Quarantine; no retry; alert |
| Execution poison | Pause automation; Support path |
| Intelligence abort | `intelligence.CycleAborted` — no silent drop |

### Intelligence Abort Rules

| Condition | Behavior |
|-----------|----------|
| VRF failure | Abort release; reroute upstream — no retry of release |
| Engine timeout | Partial artifact with completeness flag |
| Workspace switch mid-cycle | Abort client projection; server cycle may complete scoped to prior workspace |
| User cancellation | Abort if permitted; audit |

### Ordering Philosophy

- **Per workspace:** causal ordering preserved for domain and execution events
- **Cross workspace:** no ordering guarantee
- **Intelligence internal:** Orchestration coordinates merge points
- **At-least-once:** consumers must tolerate reordering within idempotency window

### Recovery Contracts

| Consumer | Recovery |
|----------|----------|
| Experience | Rebuild projection from artifact store |
| Automation | Reconcile run state from execution log |
| Notification | Retry from dead-letter |
| Learning | Reprocess from outcome measurement events |

### Event Idempotency Summary

| Producer | Requirement |
|----------|-------------|
| Application commands | `idempotency_key` on mutating commands |
| Execution Layer | Per-step keys |
| Integration | Source event dedup on external ID |
| Platform services | Payment webhook dedup on provider event ID |

---

# SECTION 6 — STATE ARCHITECTURE

## 6.1 Why This Section Exists

Defines **who owns what state** and how client, server, and intelligence states synchronize.

## 6.2 State Domains

| Domain | Owner | Scope | Persistence | Sync model |
|--------|-------|-------|-------------|------------|
| **Global application state** | Presentation + Gateway | Session | Ephemeral client; server session store | Server authoritative |
| **Client UI state** | Presentation | Session | Ephemeral | GIS states |
| **Session state** | Auth platform service | User | Durable session record | Server authoritative |
| **User preferences** | Domain / Settings | User | Durable | Read projection |
| **Workspace state** | Domain | Workspace | Event-sourced + snapshot | Server authoritative |
| **Active workspace pointer** | Global app state | User session | Session-bound | Server authoritative |
| **Org context pointer** | Global app state | User session | Session-bound | Server authoritative |
| **Intelligence projection** | Experience | Workspace | Cache + artifact ref | Async update |
| **Cycle state** | Orchestration | `cycle_id` | Transient until persist | Internal |
| **Execution run state** | Execution Layer | `run_id` | Durable log | Event-sourced |
| **Automation run state** | Automation module | Per run | Durable log | Projection of execution |
| **Report snapshot** | Reports / Data | Immutable | Write-once | Permanent |

## 6.3 Global Application State

| Field | Owner | Description |
|-------|-------|-------------|
| `active_org_id` | Auth + Domain | Current organization context |
| `active_workspace_id` | Workspace module | Current workspace scope |
| `nav_context` | Presentation | Active module, breadcrumbs |
| `session_id` | Auth | Authenticated session reference |
| `entitlement_snapshot` | Billing → Domain | Plan limits cache (read-only) |

Global state is **never** authoritative for intelligence content — only for routing and scope.

## 6.4 Workspace Behavioral States (Engineering)

Maps PDD-I A.2 to server state machine:

| State | Code | Triggers |
|-------|------|----------|
| Dormant | `WS_DORMANT` | Created; no sources |
| Initializing | `WS_INIT` | First source connected |
| Ready | `WS_READY` | C3 complete |
| Processing | `WS_PROC` | Cycle active |
| Awaiting Decision | `WS_AWAIT` | Pending recommendations |
| Executing | `WS_EXEC` | Automation/action active |
| Degraded | `WS_DEG` | Source failure |
| Learning | `WS_LRN` | Background learning (invisible) |
| Paused | `WS_PAUSE` | User/admin pause |

## 6.5 State Persistence Philosophy

| Class | Persistence rule |
|-------|------------------|
| **Authoritative** | Domain entities, execution logs, artifacts, snapshots — durable |
| **Projections** | Rebuildable from events/artifacts — cache with invalidation |
| **Session** | Durable with TTL; invalidation on security event |
| **Client cache** | Offline read only; reconciled on reconnect |
| **Transient** | Cycle in-flight engine state — lost on abort without user impact if not released |

## 6.6 Client-Server Synchronization

| Pattern | Use |
|---------|-----|
| **Query on load** | Screen open fetches projection |
| **Subscription** | Command Center real-time zones — scoped to `active_workspace_id` |
| **Optimistic UI** | Defer/snooze only — not approve execution |
| **Conflict resolution** | Server wins; client refreshes |
| **Offline** | Client cache; GIS-S6 banner; reconcile on reconnect |

## 6.7 Recovery Architecture

| Scenario | Recovery |
|----------|----------|
| Client crash | Re-fetch global state + projections on resume |
| Gateway timeout | Idempotent command retry; correlation ID dedup |
| Projection stale | Experience rebuild from artifact store |
| Session expired | Auth re-login; GIS session recovery |
| Workspace switch | Full context teardown per §6.8 |
| Execution interrupted | Execution Layer reconciles from durable log |
| Split-brain | Single writer per workspace cycle (EL enforced) |

## 6.8 Workspace and Organization Switching

### Workspace Selection

| Step | Engineering behavior |
|------|------------------------|
| User selects workspace | Application validates membership |
| Server updates `active_workspace_id` in session | Auth platform service persists |
| Client receives new scope token context | Gateway enforces on subsequent requests |

### Organization Switching

| Step | Engineering behavior |
|------|------------------------|
| User selects org (multi-org) | Update `active_org_id`; reset workspace to default or picker |
| Entitlement snapshot refresh | Billing → Domain → session cache |
| Workspace list reload | Domain query scoped to org |

### Session Transition

- New scope bindings before any projection fetch
- Prior session subscriptions invalidated server-side
- Correlation ID continues; `workspace_id` in trace span updates

### Subscription Teardown

| Subscription | On switch |
|--------------|-----------|
| Command Center real-time | Unsubscribe prior `workspace_id` |
| Execution status | Unsubscribe prior runs not visible in new scope |
| Intelligence cycle status | Client discards; server cycle continues scoped to origin workspace |

### Cache Invalidation

| Cache | Action |
|-------|--------|
| Client projection cache | Clear workspace-scoped entries |
| Experience server cache | Invalidate prior workspace projections for session |
| Global nav state | Update to new workspace default landing (CC-01) |

### Projection Refresh

- Mandatory full projection fetch for landing screen after switch
- `freshness_at` reset on new workspace load
- No carry-over of recommendations, alerts, or KPIs

### Active Intelligence Interruption

| Condition | Behavior |
|-----------|----------|
| Cycle in progress (prior workspace) | Server cycle continues; client stops displaying |
| User command in flight | Cancel if workspace-scoped mismatch; else complete |
| Ask Conquest pending | Abort client wait; server may complete in origin workspace |

### Running Automation Handling

- Automations bound to `workspace_id` — continue in origin workspace
- Client shows execution only for active workspace
- Switch does not pause automations

### Pending Recommendation Handling

- Recommendations remain in origin workspace Domain state
- Not visible after switch until user returns
- No cross-workspace decision leakage

### Navigation Refresh

- Presentation routes to CC-01 (or module default) for new workspace
- Breadcrumbs reset per UXMD-II

### Memory Context Update

- Intelligence retrieval scoped to new `workspace_id` on next cycle
- No memory carry-over across workspaces

### Workspace Recovery

| Failure | Recovery |
|---------|----------|
| Switch fails (permission) | Retain prior scope; GIS error |
| Partial teardown | Force full session scope reload |
| Stale pointer | Server wins; client refresh |

## 6.9 Intelligence State

Not user-navigable. Orchestration tracks per-cycle engine activation, artifact completion, verification status. Exposed only via projections and plain-language activity events.

## 6.10 GIS Alignment

Client states implement UXMD-III GIS Part 1. Server maps internal states to GIS-compatible payloads for Experience Layer.

---

# SECTION 7 — INTEGRATION ARCHITECTURE

## 7.1 Why This Section Exists

Defines **external boundaries** without selecting vendors or writing adapter code.

## 7.2 Integration Domains

| Domain | Direction | Boundary responsibility |
|--------|-----------|-------------------------|
| **Data sources** | Inbound | Normalize to domain events; OAuth custody |
| **AI providers** | Outbound | Model invocation behind Intelligence Layer |
| **Search** | Internal | Knowledge index + help index (distinct) |
| **Notifications** | Outbound | Email, push — via Notification service |
| **Payments** | Outbound | Billing events; never intelligence content |
| **Storage** | Outbound | Object storage for uploads, exports |
| **Marketplace** | Bidirectional | Extension manifest verification |
| **SSO / IdP** | Inbound | Enterprise auth federation |
| **Identity** | Inbound/Outbound | Auth platform service boundary |

## 7.3 Data Source Integration

| Concern | Rule |
|---------|------|
| **Scope** | Credentials per workspace or org policy |
| **Normalization** | Adapter emits `integration.DataIngested` — raw never to Reasoning |
| **Health** | Adapter reports `integration.SourceHealthChanged` |
| **Rate limits** | Adapter enforces provider limits; backoff per §5.8 |
| **Secrets** | Integration Layer only — Security custody |

## 7.4 AI Provider Boundary

| Rule | Requirement |
|------|-------------|
| **Abstraction** | Intelligence engines call provider interface — not direct SDK in Application |
| **No keys in client** | Ever |
| **Logging** | Prompts/responses classified per retention policy — SDD III |
| **Fallback** | Provider failure → structured degradation |

## 7.5 Notification Integration

Notifications flow: **Module/Application → `platform.NotificationRequested` → Notification service → Integration adapters**. Modules never call email/push SDKs directly.

## 7.6 Payment Integration

Billing events update Domain entitlements only. PD-12: payment state never alters intelligence outputs.

**Entitlement flow:** `integration.PaymentSucceeded` → Billing service → `domain.EntitlementUpdated` → Domain → Settings/Gateway limits.

## 7.7 Marketplace Extension Contract

Extensions declare: permissions, data access, events emitted/consumed, routing profile changes, execution capabilities. Install blocked if violates BH laws or EL-9.

## 7.8 Search Architecture

| Index | Owner | Content | Consumers |
|-------|-------|---------|-----------|
| **Knowledge search** | Data + Knowledge module | Workspace documents, annotations, Knowledge Memory refs | Knowledge UI, Intelligence retrieval via Data |
| **Help search** | Data + Support | Help articles, FAQ, docs | Support screens (SUP-*) |

Indices are isolated — help search never returns workspace intelligence content.

## 7.9 Conceptual Authentication Architecture

*Implementation detail: SDD Volume III. This section defines engineering boundaries only.*

### Authentication vs Authorization Boundary

| Concern | Owner |
|---------|-------|
| **Authentication (AuthN)** | Auth platform service + Integration (SSO) |
| **Authorization (AuthZ)** | Security Layer + Domain roles |
| **RBAC** | Domain defines roles; Security enforces at Gateway and Application |

### Session Lifecycle

```
Register/Login/SSO
  → platform.IdentityVerified
  → platform.SessionCreated
  → Gateway attaches session context
  → [activity]
  → Session renewal (sliding TTL)
  → platform.SessionInvalidated (logout, expiry, security event)
```

### MFA Interaction

- MFA enrollment: SET-03a engineering hook → Auth service
- MFA challenge: Gateway intercept → Auth service → GIS error on failure
- MFA required policies: Domain org policy → Auth enforcement

### Trust Boundary

| Zone | Trust level |
|------|-------------|
| Client | Untrusted — token only |
| Gateway | Session validation required |
| Application+ | Authenticated context required |
| Intelligence/Execution | System + delegated workspace scope |

### Permission Enforcement

- Gateway: tenant isolation, session validity
- Application: GIS §2 per-command permission check
- Domain: role resolution
- Fail closed (EL-19, GIS §2.5)

### Enterprise Authentication

- SSO via Integration IdP adapter
- Org policy mandates SSO → local password disabled
- Session federation per org — no cross-org session

### Guest Behaviour

- Unauthenticated: PUB-* screens only (UXMD-II)
- No workspace scope without authentication
- No intelligence API access for guests

### Invitation Flow Boundary

```
domain.MemberInvited
  → platform.InvitationIssued
  → Guest accepts → platform.IdentityCreated
  → Domain membership bind
  → platform.SessionCreated
```

## 7.10 Failure Considerations

Circuit breakers per provider. User-visible degraded state per BH-7. No silent drop of ingestion.

---

# SECTION 8 — DEPLOYMENT TOPOLOGY

## 8.1 Why This Section Exists

Conceptual production topology for Volume III detail — no cloud vendor lock-in.

## 8.2 Topology Diagram

```
                    [ Users ]
                        │
                   [ Client ]
                        │
                   [ Edge ]
                        │
                  [ Gateway + Auth ]
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
[ App Services ]  [ Intelligence ]   [ Integration ]
     │                  │                  │
     │           [ Execution ]            │
     └──────────────────┼──────────────────┘
                        │
              [ Platform Services ]
              Auth | Notifications | Billing
                        │
              [ Async Message Bus ]
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
[ Primary Store ] [ Artifact Store ] [ Object Store ]
                        │
              [ Search / Cache ]
                        │
            [ Monitoring / Logging / Tracing ]
```

## 8.3 Tier Responsibilities

| Tier | Responsibility | Scaling |
|------|----------------|---------|
| **Client** | UXMD screens; GIS | CDN static assets |
| **Edge** | TLS, WAF, rate limit | Geographic |
| **Gateway** | Auth, routing, tenant context | Horizontal; redundant instances |
| **App Services** | Module use cases | Horizontal; stateless |
| **Intelligence** | Cognitive workers | Queue-driven scale |
| **Execution** | Action workers | Per-workspace queues |
| **Integration** | Adapters | Per-connector pools |
| **Platform services** | Auth, Notifications, Billing | Horizontal; stateless |
| **Storage** | Durable data | Replicated; workspace affinity |
| **Monitoring** | SLO, alert, trace | Centralized |

## 8.4 Environment Strategy (Conceptual)

| Environment | Purpose |
|-------------|---------|
| **Development** | Engineer local; mocked integrations |
| **Staging** | Full topology; synthetic data |
| **Production** | Live tenants |
| **Preview** | Per-branch deploy for review — no production data |

## 8.5 Fault Isolation and Blast Radius

| Failure domain | Blast radius containment |
|----------------|--------------------------|
| **Single client** | User session only |
| **Gateway instance** | Edge retry to healthy instance |
| **App service instance** | Load balancer removes; stateless recovery |
| **Intelligence worker** | Workspace cycle delayed — not platform-wide |
| **Execution worker** | Run paused — not other workspaces |
| **Integration connector** | Source degraded — workspace scoped (BH-7) |
| **Storage replica lag** | Read stale flag — not cross-tenant |
| **Tenant** | EP-6 — no cross-org propagation |

## 8.6 Redundancy and Availability Philosophy

| Tier | Philosophy |
|------|------------|
| **Gateway** | N+1 minimum; no single point of session resolution |
| **App/Platform** | Horizontal replicas behind load balancer |
| **Intelligence/Execution** | Queue-backed workers; multiple consumers |
| **Message bus** | Durable delivery; replication |
| **Storage** | Replicated primary; workspace affinity preserved |
| **Edge** | Geographic distribution |

High availability means **graceful degradation** — not hiding failure. Degraded mode is explicit per BH-7.

## 8.7 Disaster Recovery Philosophy

| Concern | Volume I assignment | Detail owner |
|---------|---------------------|--------------|
| **RTO/RPO targets** | Defined per tier class in SDD III | SDD III |
| **Backup** | Storage tier responsibility | SDD III |
| **Region failure** | Failover to secondary region — conceptual | SDD III |
| **Data sovereignty** | Org policy may constrain region | Domain + SDD III |

Volume I establishes that **DR is mandatory** for production — not optional. Artifact store and execution logs are in highest durability class.

## 8.8 Degraded Operation

| Degraded condition | Engineering response |
|--------------------|---------------------|
| Source unavailable | `WS_DEG`; scoped intelligence suppression |
| AI provider outage | Structured degradation; no false confidence |
| Notification failure | In-app fallback; dead-letter |
| Partial cycle | Completeness flag on artifacts |
| Storage lag | `freshness_at` on projections |

## 8.9 Dependency Isolation

External provider failure must not cascade: circuit breakers (§7.10), queue backpressure, tenant-scoped degradation. Intelligence tier failure does not block auth or read-only projections of last verified state.

## 8.10 Engineering Ownership (Operational)

| Tier | Operational owner (conceptual) |
|------|-------------------------------|
| Gateway + Auth | Platform team |
| Application modules | Product engineering |
| Intelligence + Orchestration | Cognitive platform team |
| Execution | Automation platform team |
| Data | Data platform team |
| Integration | Integrations team |
| Infrastructure + Observability | Platform operations |

## 8.11 Failure Considerations

Gateway failure → edge retry. Intelligence worker failure → job retry per §5.8. Region failure → DR per §8.7.

---

# SECTION 9 — CROSS-CUTTING CONCERNS

## 9.1 Logging

| Log class | Content | Retention |
|-----------|---------|-----------|
| **Audit** | Sensitive user actions | Long; compliance-driven |
| **Intelligence trace** | Cycle lineage, artifact IDs | Medium; support-driven |
| **Execution trace** | Run ID, steps, rollback | Medium |
| **Application** | Module operations | Standard |
| **Integration** | External call metadata | Standard; no raw secrets |
| **Security** | Auth events | Long |

Never log secrets, raw tokens, or full PII in application logs.

## 9.2 Error Handling

| Layer | Pattern |
|-------|---------|
| Presentation | GIS error/recovery states |
| Application | Domain errors → typed responses |
| Orchestration | Failure artifacts; reroute |
| Execution | Pause; rollback offer; alert |
| Integration | Classified retryable vs fatal |

Global correlation ID on every request.

## 9.3 Validation

| Boundary | Validation |
|----------|------------|
| Client | GIS form rules (UXMD-III §6.1) |
| Gateway | Auth, rate limit, schema |
| Application | Business invariants, permissions |
| Domain | Entity rules |
| Integration | External schema normalization |
| Execution | Authorization + bounds vs PLN |

## 9.4 Configuration

| Config type | Owner |
|-------------|-------|
| Feature flags | Infrastructure; audited changes |
| Org policy | Domain |
| Workspace profile | Domain |
| Engine parameters | Intelligence platform; stakes profiles |

No intelligence content in configuration.

## 9.5 Observability

| Pillar | Application |
|--------|-------------|
| **Metrics** | SLO: cycle latency, ingestion lag, automation success, execution success |
| **Traces** | End-to-end `correlation_id` through gateway → orchestration → engines → execution |
| **Logs** | Structured JSON |
| **Dashboards** | Operator-facing — not user-facing |

## 9.6 Feature Flags

Flags gate **rollout** — never verification or challenge bypass.

## 9.7 Health Monitoring

| Check | Tier |
|-------|------|
| Liveness | Each service |
| Readiness | Dependencies connected |
| Intelligence queue depth | Orchestration |
| Execution queue depth | Execution Layer |
| Source freshness | Integration |

## 9.8 Versioning

| Artifact | Version strategy |
|----------|------------------|
| Events | Schema version in envelope |
| Projections | Consumer versioned |
| Marketplace extensions | Semver manifest |
| Intelligence artifacts | Lineage chain — immutable versions |

---

# SECTION 10 — ENGINEERING LAWS

## 10.1 Why This Section Exists

Permanent laws governing all Conquest engineering. Violation requires architectural exception with expiry.

## 10.2 Dependency Laws

| # | Law |
|---|-----|
| **EL-1** | Dependencies flow inward — Presentation toward Data |
| **EL-2** | Intelligence never depends on Presentation |
| **EL-3** | Orchestration never depends on Experience |
| **EL-4** | Integration never depends on Intelligence engines — normalized events and Data retrieval only |
| **EL-5** | Domain never invokes engines directly |
| **EL-29** | Execution never invokes Intelligence engines |
| **EL-30** | Learning never invokes Execution Layer |

## 10.3 Module Isolation Laws

| # | Law |
|---|-----|
| **EL-6** | Modules communicate via events and projections — not shared mutable application state |
| **EL-7** | Workspace scope on every operation |
| **EL-8** | Organization isolation — no cross-tenant reads |
| **EL-9** | Marketplace extensions cannot modify core module behavior — only register |

## 10.4 Coupling and Cohesion Laws

| # | Law |
|---|-----|
| **EL-10** | High cohesion within bounded context |
| **EL-11** | Loose coupling between contexts via contracts |
| **EL-12** | No circular dependencies between contexts |

## 10.5 Interface Contract Laws

| # | Law |
|---|-----|
| **EL-13** | Every cross-context call uses versioned contract |
| **EL-14** | Breaking changes require migration plan |
| **EL-15** | Projections are read-only views — not write APIs |

## 10.6 Event Ownership Laws

| # | Law |
|---|-----|
| **EL-16** | One canonical owner per event type |
| **EL-17** | Events immutable after publish |
| **EL-18** | Consumers idempotent |

## 10.7 Reliability Laws

| # | Law |
|---|-----|
| **EL-19** | Fail closed on auth and verification |
| **EL-20** | No silent stale intelligence |
| **EL-21** | Automation failures surface within 5 minutes |
| **EL-22** | Idempotent ingestion and execution |

## 10.8 Fault Tolerance Laws

| # | Law |
|---|-----|
| **EL-23** | External provider failure degrades gracefully |
| **EL-24** | Partial cycle failure produces explicit completeness notice |
| **EL-25** | Dead-letter with operator alert — never infinite retry |

## 10.9 Maintainability Laws

| # | Law |
|---|-----|
| **EL-26** | Architectural review for cross-layer dependency |
| **EL-27** | Traceability to CCIS/AMD/PDD/UXMD in design docs |
| **EL-28** | No engine logic in Application module |

## 10.10 Execution and Learning Laws

| # | Law |
|---|-----|
| **EL-31** | No execution without Orchestration handoff and authorization record |
| **EL-32** | No learning proposal applied without validation gate |
| **EL-33** | Learning never modifies production code |

## 10.11 Alignment with CCIS Engineering Laws

SDD EL laws implement CCIS §XVI. Volume V expands into code review and CI enforcement.

---

# APPENDIX A — DOCUMENT TRACEABILITY

| SDD-I Section | Primary authority |
|---------------|-------------------|
| Engineering Philosophy §1.12–1.15 | UXMD review; production readiness research |
| System Architecture §2.4 | AMD IV §51; AMD II §14 |
| Execution Layer §3.7 | AMD IV Layer 4; CCIS Execute |
| Learning Boundary §3.13 | AMD IV §LRN; AMD Layer 6; CCIS Learn |
| Application Layers §3 | AMD IV; PDD-I A.3 |
| Module Architecture §4 | PDD-II; UXMD-II screens |
| Platform Services §4.13–4.15 | PDD-II Settings; UXMD GIS §5 |
| Event Architecture §5.8 | PDD-I workflows; EL-18, EL-25 |
| State Architecture §6.8 | PDD-I A.2; UXMD-II workspace switch |
| Integration §7.8–7.9 | UXMD-II PUB/SET; GIS §2 |
| Deployment §8.5–8.9 | Enterprise scaling research |
| Cross-Cutting | UXMD-III GIS; CCIS §XVII |
| Engineering Laws | CCIS §XVI; BH, UX, GIS laws |

---

# APPENDIX B — COGNITIVE PIPELINE → SDD MAPPING

| Cognitive Pipeline Phase | SDD Layer / Subsystem |
|--------------------------|----------------------|
| 1. Perception | Integration + Application (input capture) |
| 2. Human Understanding | Intelligence (Understanding) via Orchestration |
| 3. Context Reconstruction | Intelligence (Context) + Data (memory retrieval) |
| 4. Goal Reasoning | Intelligence (Reasoning, Strategic) |
| 5. Strategy Planning | Intelligence (Planning) |
| 6. Intelligence Orchestration | L6 Orchestration |
| 7. Verification | Intelligence (Verification) — gate before release |
| 8. Execution | **L5E Execution Layer** |
| 9. Reflection | Intelligence (Reflection) → Learning Boundary |
| 10. Memory Evolution | Learning Boundary → Data (Memory Manager) |

Verification failure reroutes upstream at Orchestration. Execution never bypasses Verification.

---

# APPENDIX C — CROSS-REFERENCE MATRIX

| Concept | SDD-I | PDD | UXMD | AMD |
|---------|-------|-----|------|-----|
| Verification gate | §3.6, EL-19 | BH-5 | GIS | IV VRF |
| Execution | §3.7 | AUT, F2 | AUT-04, CC-14 | L4 |
| Learning | §3.13 | E1/E2 | CC-15 | L6 |
| Workspace switch | §6.8 | WKS | UXMD-II CC-01 | — |
| MFA | §7.9 | — | SET-03a | — |
| Billing isolation | §4.15, §7.6 | PD-12 | GIS | — |
| Rollback | §3.7 | AUT-06 | AUT-06 | PLN |

---

# APPENDIX D — ENGINEERING LAW VERIFICATION

| Law | Verification method |
|-----|---------------------|
| EL-1–EL-5, EL-29–EL-30 | Dependency analysis in architectural review |
| EL-6–EL-9 | Module boundary review; no shared mutable state |
| EL-16 | Event catalog uniqueness audit |
| EL-18, EL-22 | Idempotency key presence on commands/execution |
| EL-19 | Auth/permission test gate — fail closed |
| EL-21 | Automation failure alert within 5 min — monitored |
| EL-25 | Dead-letter queue inspection; no infinite retry |
| EL-28 | Static review — no engine imports in Application |
| EL-31 | Execution audit — handoff record required |
| EL-32–EL-33 | Learning proposal audit trail |

*Full CI enforcement: SDD Volume V.*

---

# APPENDIX E — VOLUME ROADMAP

| Volume | Title | Builds on SDD-I |
|--------|-------|-----------------|
| **II** | Data & Intelligence Architecture | L4, L7, Learning Boundary; memory, evidence, lifecycles |
| **III** | Infrastructure & Security | L1, L2, L3; auth implementation; DR detail |
| **IV** | AI Orchestration & Agent Architecture | L6, L7; engines and agents |
| **V** | Engineering Standards & Build Governance | EL enforcement; performance budgets; build approval |

**Do not begin Volume II until Volume I v1.1 passes re-review.**

---

# APPENDIX F — APPROVAL CRITERIA FOR SDD VOLUME I v1.1

Volume I v1.1 is complete when:

- [x] Engineering philosophy including production readiness (§1.12)
- [x] Performance, mobile-first, accessibility engineering philosophy (§1.13–1.15)
- [x] System architecture with AMD Execution and Learning alignment (§2.4)
- [x] All layers use complete specification template (§3.0)
- [x] Execution Layer fully defined (§3.7)
- [x] Learning Boundary fully defined (§3.13)
- [x] Platform services architected (§4.13–4.15)
- [x] All PDD-II modules with ownership, events, failure, extensions (§4.3–4.12)
- [x] Event retry philosophy (§5.8)
- [x] Workspace switching engineered (§6.8)
- [x] Conceptual authentication architecture (§7.9)
- [x] Search architecture distinction (§7.8)
- [x] Deployment fault isolation, redundancy, DR philosophy (§8.5–8.9)
- [x] Engineering laws updated (EL-29–33)
- [x] Cognitive Pipeline mapping (Appendix B)
- [x] Law verification appendix (Appendix D)
- [x] No code, schemas, APIs, UI, or config files
- [x] Traceability to CCIS, AMD, PDD, UXMD
- [ ] **Re-review passed** — required before Volume II

---

*End of SDD Volume I — System Architecture v1.1*
