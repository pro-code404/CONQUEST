# 09 — Future Vision Encyclopedia

**Institutional memory · Long-horizon evolution, gated futures, and immutable principles**

This document captures **where Conquest is going**, **what is explicitly gated**, **dependencies and risks**, and **what will never change** — so a 2030 engineer can orient without historical chat.

**Cross-reference:** [Future Roadmap Ch 14](../project-brain/14-future-roadmap.md) · [Vision Ch 02](../project-brain/02-vision-and-platform-evolution.md) · [08 Failure Encyclopedia](./08-failure-encyclopedia.md)

---

## Table of contents

1. [North star — 5-year vision arc](#1-north-star--5-year-vision-arc)
2. [Build-2 M5 execution boundary](#2-build-2-m5-execution-boundary)
3. [Post-beta modules](#3-post-beta-modules)
4. [Real AI providers](#4-real-ai-providers)
5. [RLS, multi-region, HA](#5-rls-multi-region-ha)
6. [Learning and reflection production path](#6-learning-and-reflection-production-path)
7. [Intelligence platform evolution](#7-intelligence-platform-evolution)
8. [Marketplace ecosystem](#8-marketplace-ecosystem)
9. [Documentation evolution rules](#9-documentation-evolution-rules)
10. [What will NEVER change](#10-what-will-never-change)
11. [Scenario planning — 2030 engineer](#11-scenario-planning--2030-engineer)
12. [BAR and B-25–B-28 detail](#12-bar-and-b-25b-28-detail)
13. [Master dependency and risk register](#13-master-dependency-and-risk-register)

---

## 1. North star — 5-year vision arc

### The arc (2026 → 2031)

Conquest evolves from **closed-beta CIOS** (integrated shell + governed cognitive stack + honest UX) to **production intelligence operating system** at organizational scale.

| Year | Phase | Capability milestone |
|------|-------|---------------------|
| **2026 H1** | Build-0/1 | Architecture freeze; platform foundation; UXMD shell |
| **2026 H2** | Build-2 M1–M4 | Integration-first production readiness; Postgres; e2e; preview operational |
| **2026–2027** | Build-2 M5 | Execution boundary (gated) — approve → execute with audit |
| **2027** | Build-3 | Production hardening — RLS, tracing, HA foundations |
| **2027–2028** | Post-beta product | Strategy/Knowledge/Marketplace depth; real providers; visualization |
| **2028–2029** | Platform scale | Multi-region HA; worker pools; cost-governed AI routing |
| **2029–2031** | Ecosystem | Marketplace extensions; governed learning loop; outcome measurement |

### North star statement

**Decision superiority at organizational scale.**

The finished platform enables an organization to:

1. **Perceive** signals across research, operations, integrations
2. **Understand** context within workspace-scoped intelligence
3. **Reason** with evidence-backed traceability
4. **Challenge** assumptions before release
5. **Verify** before users see major conclusions
6. **Recommend** with explicit confidence and approval workflow
7. **Execute** only when authorized and audited
8. **Measure** outcomes against predictions
9. **Learn** under governance — routing, models, playbooks
10. **Evolve** the OS without breaking tenant safety

This is CCIS identity operationalized over years — not a roadmap slide.

### Dependencies

- Governance discipline (BAR, ADR) maintained under growth pressure
- Legal/compliance foundation (counsel review, privacy jobs)
- Tenant safety architecture before scale (RLS, isolation tests)

### Risks

| Risk | Impact |
|------|--------|
| Category drift to AI wrapper | Destroys differentiation |
| Execution before governance | Safety incident, trust loss |
| Scale before RLS | Tenant data breach |

---

## 2. Build-2 M5 execution boundary

### Status

**Gated — not started.** M4 complete; Recovery Phase 4 documentation complete. **M5 is not blocked by documentation** — blocked by program gates.

### Slices (from Future Roadmap Ch 14)

| Slice | Deliverable | Depends on |
|-------|-------------|------------|
| **5A** | Execution engine service | Build-2 BAR issued |
| **5B** | Approve → execute workflow | B-25–B-28 closed |
| **5C** | `executionReady` flag governance | ADR-0015 |
| **5D** | RTM verification tests | Contract test suite |

### Acceptance criteria

Manual run performs **real action** with:

- Audit trail
- Rollback path designed (PDD AUT, RTM-PDD-006)
- User approval captured before side effects
- `executionReady` lifted only under governance — not by engineer discretion

### Current code reality (M4)

| Component | Behavior |
|-----------|----------|
| `DecisionEngine` | `executionReady: false` always |
| `AutomationService.manualRun` | Audit record + deferred message |
| Cognitive orchestrator | No autonomous side effects |
| UI automation module | CRUD + honest deferred run messaging |

### Why gated

| Reason | Detail |
|--------|--------|
| ADR-0015 | Execution layer separation incomplete |
| Safety | No surprise autonomous side effects |
| BAR | Build-2 BAR not issued for M5 scope |
| B-25–B-28 | Intelligence contract tests open |
| Legal | Counsel review for execution-adjacent liability (B2-P0-05) |

### Dependencies

1. Recovery Phase 4 merged ✅
2. Preview operational ✅
3. Issue Build-2 BAR ❌
4. Close B-25–B-28 ❌
5. Stakeholder sign-off on execution scope ❌

### Risks if M5 starts without gates

- Constitution violation (engineering constitution rules 21–22, 36)
- Unverified execution paths bypass VRF
- Learning layer could reach execution (B-28 failure)
- False "production complete" RTM claims

---

## 3. Post-beta modules

### Strategy Center

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Depth module for strategic planning beyond CC summaries |
| **Milestone** | P2 post-beta |
| **Dependency** | PDD modules approved; intelligence feed mature |
| **Today** | Placeholder — honest scoped messaging |
| **Future UX** | Opportunities, competitors, predictions, initiatives (PDD Vol II) |
| **Risk** | Building as chatbot for "strategy advice" — category error |

### Knowledge

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Curated organizational knowledge — verified, not raw chat |
| **Milestone** | P2 |
| **Dependency** | Memory evolution governed promotion path |
| **Today** | Placeholder; nav per role matrix |
| **Future UX** | Curation workflows; promotion from verified cognitive outputs |
| **Risk** | Conflating with CognitiveMemoryManager storage |

### Marketplace

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Extension ecosystem — connectors, templates, governed third-party |
| **Milestone** | P2–Build-3 |
| **Dependency** | Extension review model; execution boundary for extensions |
| **Today** | Placeholder; manager+ role gate |
| **Future UX** | Installable extensions with verification and tenant isolation |
| **Risk** | Unreviewed extensions executing autonomously |

### Reports / Analytics visualization

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Visualization layer for KPIs and trends |
| **Milestone** | P1 post-beta |
| **Dependency** | `visualization-config`; real metrics vs formula placeholders |
| **Today** | Formula KPIs deferred — not product home |
| **Risk** | Chart-first Command Center anti-pattern |

### Other post-beta items (Roadmap Ch 14)

| Item | Priority | Dependency |
|------|----------|------------|
| Legal counsel review | P0 | External |
| Privacy export/delete jobs | P2 | Job workers |
| Billing OAuth | P2 | Integrations |
| Distributed tracing | P2 | Observability sink (ADR-0023) |
| Onboarding real connectors | P2 | Integration OAuth |

---

## 4. Real AI providers

### Today (M4)

- `@conquest/ai-gateway` with **stub providers** in dev/CI
- `createStubProviders()` — deterministic text, no external keys
- Gateway boundary enforced; SDK wiring deferred

### Target

- Multi-provider AI gateway with circuit breakers ([ADR-0034](../architecture/adr/0034-ai-gateway-circuit-breakers.md))
- Production SDK adapters (OpenAI, Anthropic, Gemini) **server-side only**
- Cost caps, routing policies, audit redaction (`AI_AUDIT_CONSTANTS`)
- Netlify AI Gateway or self-hosted gateway per deploy architecture

### Dependencies

| Dependency | Status |
|------------|--------|
| B-27 provider boundary tests | Open |
| ADR-0011 abstraction | Specified |
| Secrets management ADR-0019 | Env-only keys |
| Gateway deployment | P1 |

### Risks

| Risk | Mitigation |
|------|------------|
| Provider key leakage to client | B-27 static analysis; constitution |
| Cost runaway | Caps, routing, audit |
| Provider swap breaks prompts | Prompt registry versioning |

### Migration path

1. Close B-27
2. Wire SDK adapters in `services/ai-gateway` only
3. Feature-flag provider selection per tenant/admin
4. Stubs remain for CI — never call live providers in unit tests by default

---

## 5. RLS, multi-region, HA

### Postgres Row-Level Security (RLS)

| Attribute | Detail |
|-----------|--------|
| **ADR** | [ADR-0016](../architecture/adr/0016-postgres-row-level-security.md) |
| **Priority** | P1 post-beta |
| **Dependency** | DBA review; tenant isolation test suite |
| **Today** | Application-layer `session.orgId === workspace.orgId` |
| **Target** | Defense-in-depth RLS policies on tenant tables |

**Risk:** Application-only isolation fails on SQL injection or ORM bug — RLS is backup boundary.

### Multi-region HA

| Attribute | Detail |
|-----------|--------|
| **ADR** | [ADR-0022](../architecture/adr/0022-high-availability-deployment.md) |
| **Priority** | P3 |
| **Dependency** | Stateless API scale; managed Postgres; Redis cluster |
| **Today** | Single instance API; optional single Redis |
| **Target** | Horizontal replicas + LB; multi-region failover |

### Scaling philosophy (Beta → Target)

| Dimension | Beta (M4) | Target |
|-----------|-----------|--------|
| API | Single instance | Horizontal replicas + LB |
| Postgres | Single node | Managed + read replicas |
| Redis | Optional single | Cluster for cache + jobs |
| Cognitive | Sync + async jobs | Worker pool scales independently |
| Rate limit | In-process 120/min | Redis distributed |

**Principle:** Scale **stateless** API and **workers**; never duplicate tenant data without shared stores.

### Dependencies

- ADR-0022 deployment architecture decision
- Observability ([ADR-0023](../architecture/adr/0023-distributed-tracing.md)) for cross-region debug
- Backup/DR drills validated

### Risks

| Risk | Mitigation |
|------|------------|
| Split-brain tenant data | Shared Postgres primary; replication lag monitoring |
| Cognitive job duplication | Idempotent job keys; queue governance |
| Regional compliance | Data residency ADR (future) |

---

## 6. Learning and reflection production path

### Today

- Reflection produces internal optimization records — not exposed raw to users
- Learning boundary: **proposals only** ([ADR-0009](../architecture/adr/0009-learning-boundary.md))
- B-28 isolation tests **open**
- No autonomous code deploy from learning path

### Target

| Capability | Governance |
|------------|------------|
| Reflection records | Internal; feed Memory Evolution |
| Learning proposals | Human approval + governance review |
| Routing optimization | Autonomous within safe bounds |
| Prompt/workflow tuning | Versioned via prompt registry |
| Code changes from learning | **Forbidden** without explicit human approval + testing |

### Governed production path

```
Execute → Measure → Detect Weakness → Learning Proposal
  → Governance Review → Approved Change → Verified Deploy
```

**Never:**

```
Learning → Auto-patch orchestrator → Production
```

### Dependencies

- B-28 closure
- Memory evolution pipeline mature
- Outcome measurement linked to recommendations (RTM-PDD-005)

### Risks

| Risk | Mitigation |
|------|------------|
| Silent self-modification | ADR-0009; audit |
| Learning → execution shortcut | B-28 tests |
| Overfitting to single tenant | Cross-tenant learning policy ADR |

---

## 7. Intelligence platform evolution

### Cognitive stack maturity path

| Stage | Capability |
|-------|------------|
| **M4** | Orchestrator wired; evidence → reasoning → decision → verify; stubs |
| **M5** | Execution separated; outcome hooks |
| **Build-3** | Full B-25–B-28 contract tests; RTM Verified rows |
| **Scale** | Async worker pool; job queue Redis cluster |
| **Advanced** | Multi-agent coordination ([ADR-0030](../architecture/adr/0030-multi-agent-coordination.md)) |

### Structured "Ask Conquest"

- RTM-UX-009 — **not chatbot**
- Structured intelligence requests with typed responses
- Command Center entry panel (future)
- UI partial today; cognitive web UI P2 blocker B2-P2-05

### Memory evolution

| Today | Target |
|-------|--------|
| CognitiveMemoryManager sole write | Promotion rules session → long-term |
| Compression not raw chat archive | Pattern/goal/workflow retention |
| Governed deltas | Memory evolution phase artifacts |

### Real-time intelligence

| Today | Target |
|-------|--------|
| Analyze on demand | Scheduled refresh (PDD D1) |
| Manual refresh | Live operational pulse in CC |
| Freshness indicators partial | Per-source freshness everywhere |

### Dependencies

- Real providers (Section 4)
- Job workers for async cognitive
- Verification engine hardening (B-26)

### Risks

| Risk | Mitigation |
|------|------------|
| Stage order regression | B-25 golden tests |
| VRF bypass | B-26 |
| Intelligence machinery exposed in UX | UXMD NAV-3 |

---

## 8. Marketplace ecosystem

### Vision

Governed extension marketplace where organizations install **reviewed capabilities** — connectors, workflow templates, industry playbooks — without compromising tenant safety or verification gate.

### Architecture principles

| Principle | Requirement |
|-----------|-------------|
| Verification | Extensions cannot bypass VRF |
| Execution | Extension actions subject to M5 execution boundary |
| Tenant isolation | Extensions scoped to workspace/org |
| Review | Human/governance review before publish |
| No nav pollution | Extensions integrate into modules — not eighth nav item |

### Evolution stages

1. **Placeholder** (today) — honest messaging, role gate
2. **Internal templates** — Conquest-authored connectors
3. **Partner extensions** — reviewed third-party
4. **Ecosystem** — marketplace with revenue share, SLA tiers

### Dependencies

- Execution engine (M5)
- Extension ADR program (future)
- Billing OAuth (P2)
- Legal terms for third-party code

### Risks

| Risk | Mitigation |
|------|------------|
| Malicious extension | Review + sandbox + RLS |
| Extension key leakage | Gateway-only AI calls |
| UX fragmentation | GIS compliance required for extension UI |

---

## 9. Documentation evolution rules

### Why documentation evolves

**First Law:** Every correction becomes permanent knowledge. The repository is the engineering brain — chat is ephemeral.

### Recovery phases (origin and purpose)

| Phase | Purpose |
|-------|---------|
| Recovery 1 | Audit found doc drift |
| Recovery 2 | Sync docs with M4 code reality |
| Recovery 3 | Validation — can agent answer from repo alone? |
| Recovery 4 | Institutional memory — cognitive preservation |

**Misconception correction:** Recovery Phase 2 did **not** change routing code — preview bug was pre-existing (see Failure Encyclopedia §3, §11).

### Evolution rules

| Rule | Requirement |
|------|-------------|
| Code behavior change | Update Project Brain + KB + institutional memory in same wave |
| Architecture change | ADR first |
| Build wave | BAR issuance |
| Milestone close | Completion report in `docs/build-2/` |
| Conflict resolution | CCIS > AMD > PDD > UXMD > SDD > KB summaries |
| Supreme engineering memory | Project Brain 00–18 |
| Institutional depth | This corpus (01–10) |

### What triggers documentation update

- Milestone completion (M1–M5)
- P0/P1 RCA
- ADR acceptance
- New failure class discovered
- Gate closure (B-25–B-28)

### Risks

| Risk | Mitigation |
|------|------------|
| Doc drift returns | Recovery phase process; continuity test |
| KB supersedes CCIS | Authority hierarchy explicit (Misconception 13) |
| Chat as source of truth | Institutional memory mandate |

---

## 10. What will NEVER change

These principles are **constitutional** — amend only via explicit governance revolution, not convenience:

### The First Law

> Conquest is never finished. Every interaction improves the operating system.

### Core identity

| Principle | Meaning |
|-----------|---------|
| **CIOS not chatbot** | Cognitive operating system, not prompt-response app |
| **Pipeline integrity** | No generation before planning; verification mandatory |
| **Evidence first** | Reasoning cites evidence portfolio |
| **Memory sole write** | CognitiveMemoryManager only |
| **Learning boundary** | No autonomous production code deploy |
| **Execution governance** | Side effects require authorization |
| **Tenant safety** | Workspace isolation inviolable |

### UX frozen laws

| Law | ADR/UXMD |
|-----|----------|
| Command Center is home | ADR-0002 |
| Seven primary nav items | ADR-0005 |
| Workspace is context | ADR-0003 |
| GIS inheritance | ADR-0012, UXMD-III |
| Honest empty states | GIS-S2 |
| No machinery in nav | NAV-3 |

### Governance frozen process

```
CCIS → AMD → PDD → UXMD → SDD → ADR → Governance → BAR → Build
```

**No BAR → no new build wave scope.**

### What may evolve (under governance)

- Provider implementations
- Module depth (Strategy, Knowledge, Marketplace)
- Scale topology (HA, multi-region)
- Visualization layer
- Extension ecosystem
- Prompt versions and routing policies

---

## 11. Scenario planning — 2030 engineer

### Scenario A — Cold start

**Situation:** Engineer arrives 2030, no chat history, repo clone only.

**Expected path:**

1. Read [`docs/project-brain/README.md`](../project-brain/README.md) + Ch 01, 16, 18
2. Read [`docs/institutional-memory/README.md`](./README.md)
3. Complete [07 AI Onboarding Curriculum](./07-ai-onboarding-curriculum.md)
4. Verify program state in AGENTS.md banner
5. Run `pnpm build && pnpm test`

**Success:** Reconstructs M4/M5/gates without asking "what is Conquest?"

---

### Scenario B — "Skip CCIS, read KB only"

**Response:** Reject. Misconception 13. CCIS wins on conflict. KB summarizes; does not replace intelligence law.

---

### Scenario C — "Enable execution for enterprise deal"

**Response:** Check BAR scope, B-25–B-28, ADR-0015, legal counsel. No deal bypasses governance. Document in build-2 blockers if pressure continues.

---

### Scenario D — "Replace Postgres with edge DB"

**Response:** ADR required. Evaluate tenant isolation, RLS path, Drizzle schema migration, MEMORY_REPO CI story. Decision framework Ch 18 escalation matrix.

---

### Scenario E — "Add eighth nav for new AI feature"

**Response:** UXMD amendment + ADR-0005 review. Almost certainly rejected — integrate into existing module zones.

---

### Scenario F — Documentation contradicts code

**Response:** Trust code for behavior, fix docs immediately. Recovery phase playbook. Update institutional memory failure encyclopedia if new class.

---

### Scenario G — "Learning layer fixed a bug — ship it"

**Response:** ADR-0009. Proposal → human review → tested deploy. B-28 must pass.

---

### Scenario H — Multi-region incident

**Response:** ADR-0022 runbooks; tracing ADR-0023; tenant isolation verification first; no ad-hoc data merge across regions.

---

## 12. BAR and B-25–B-28 detail

### Build Authorization Records (BAR) status

| BAR | Date | Scope | Status |
|-----|------|-------|--------|
| BAR-2026-06-21-001 | Build-0 | Architecture → engineering transition | Complete |
| BAR-2026-06-26-001 | Build-1 | Platform foundation, shell, cognitive stack | **Active** |
| **Build-2 BAR** | — | M5 execution + Build-2 scope reconciliation | **Not issued** |

### Build-2 BAR prerequisites (from governance checklist)

| Prerequisite | Status |
|--------------|--------|
| Build-1 BAR active | ✅ |
| B-12 PDD-I Authority Bridge | Open rows |
| B-25–B-28 intelligence contracts | **Remaining** |
| Recovery Phase 4 | Complete |
| Preview operational | Complete |
| Stakeholder authorization | Pending |

### B-25 — Stage-order golden tests

| Field | Detail |
|-------|--------|
| **Requirement** | CCIS twelve-stage / ten-phase loop order preserved in orchestrator |
| **SDD reference** | SDD-V Part 5.11, AI-2 |
| **Why** | Stage reorder breaks verification and evidence dependencies |
| **Close when** | Golden tests fail on any stage permutation |
| **Owner** | Cognitive platform team + governance |

### B-26 — VRF bypass impossible

| Field | Detail |
|-------|--------|
| **Requirement** | Verification gate cannot be skipped to user-facing output |
| **SDD reference** | AI-4, AI-20, ADR-0006 |
| **Why** | Unverified intelligence destroys trust and violates CCIS |
| **Close when** | Tests assert no path from reasoning → user without VRF |
| **Owner** | Verification engine + QA |

### B-27 — Provider abstraction boundary

| Field | Detail |
|-------|--------|
| **Requirement** | No client SDK; no direct provider calls outside gateway |
| **SDD reference** | ADR-0011 |
| **Why** | Key leakage, audit gap, swap inflexibility |
| **Close when** | Static analysis + dependency audit clean |
| **Owner** | Platform + security review |

### B-28 — Learning boundary isolation

| Field | Detail |
|-------|--------|
| **Requirement** | Learning/reflection path cannot trigger execution or code deploy |
| **SDD reference** | AI-10, ADR-0009 |
| **Why** | Autonomous self-modification safety |
| **Close when** | Isolation tests prove no learning → execution edge |
| **Owner** | Cognitive + governance |

### BAR issuance process

1. Complete build-authorization-checklist-v1.0.md rows for Build-2 scope
2. Close B-12 open rows where applicable
3. Close B-25–B-28 with test evidence
4. Program Architecture Authority + Engineering Lead signatures
5. Record BAR ID; update IMPLEMENTATION.md banner
6. **Only then** authorize M5 implementation

### RTM impact

Execution-related rows remain **Specified/In Build** until M5 verification:

- RTM-INT-006
- RTM-PDD-005–006
- ENG rows tied to execution boundary

---

## 13. Master dependency and risk register

### Immediate gate (before M5)

| Item | Prerequisite | Risk if skipped |
|------|--------------|-----------------|
| Recovery Phase 4 merge | Ch 18 + continuity test | Architectural drift |
| Preview operational | Router fix + e2e smoke | Cannot validate UX |
| Stakeholder sign-off | Phase 3 validation | Unauthorized scope |
| Build-2 BAR | B-25–B-28 + checklist | Unauthorized execution |
| Legal counsel | B2-P0-05 | Launch liability |

### Future dependency graph (simplified)

```mermaid
flowchart TD
  M4[M4 Complete] --> BAR[Build-2 BAR]
  BAR --> B25[B25 Stage order]
  BAR --> B26[B26 [VRF]]
  BAR --> B27[B27 [Provider]]
  BAR --> B28[B28 [Learning]]
  B25 --> M5[M5 Execution]
  B26 --> M5
  B27 --> M5
  B28 --> M5
  M5 --> RLS[Postgres RLS]
  M5 --> Providers[Real AI SDK]
  Providers --> Intel[Intel Platform Scale]
  RLS --> HA[Multi-region HA]
  M5 --> Marketplace[Marketplace Ecosystem]
  Intel --> Strategy[Strategy/Knowledge Depth]
```

### Consolidated risk register

| Risk | Mitigation | Future affected |
|------|------------|-----------------|
| M5 without BAR | Constitution + Project Brain gate | Execution |
| Category drift to AI wrapper | Ch 01, 16, onboarding | All |
| Doc drift returns | Recovery phases | All |
| Provider key leakage | Gateway + B-27 | Real AI |
| Tenant breach without RLS | ADR-0016 P1 | Scale |
| Learning autonomous deploy | ADR-0009, B-28 | Intelligence evolution |
| Chart-first UX | UX Intelligence Bible | Analytics |
| Extension malicious code | Marketplace review | Ecosystem |

---

## Appendix — Vision ↔ implementation traceability

| Vision element | Current code anchor | Target doc |
|----------------|---------------------|------------|
| Command Center | `apps/web` CC zones | UXMD-I Part D |
| Cognitive pipeline | `services/cognitive`, `services/platform` | CCIS, cognitive-pipeline.md |
| Execution deferred | `DecisionEngine`, `AutomationService` | ADR-0015, M5 roadmap |
| Postgres persistence | `DrizzleAuthRepository` | Ch 10 data architecture |
| Stub providers | `createStubProviders()` | ADR-0011, Section 4 above |
| Governance gates | B-25–B-28 open | build-authorization-checklist |

---

## Appendix — Related institutional memory

| Document | Relationship |
|----------|--------------|
| [02 Intelligence Philosophy Manual](./02-intelligence-philosophy-manual.md) | How Conquest thinks |
| [03 Engineering Decision Encyclopedia](./03-engineering-decision-encyclopedia.md) | ADR judgments |
| [06 UX Intelligence Bible](./06-ux-intelligence-bible.md) | Experience future |
| [07 AI Onboarding Curriculum](./07-ai-onboarding-curriculum.md) | Day 6 readings |
| [08 Failure Encyclopedia](./08-failure-encyclopedia.md) | Past risks become entries |
| [10 Living Knowledge Graph](./10-living-knowledge-graph.md) | Navigate all links |

---

*Institutional memory document 09 — Future Vision Encyclopedia. Vision amendments via ADR and BAR only.*
