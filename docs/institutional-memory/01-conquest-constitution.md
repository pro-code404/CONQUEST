# Conquest Constitution

**Institutional Memory Corpus — Document 01**

**Status:** Canonical engineering law  
**Baseline:** Build-2 M4 complete · 278 Vitest tests · Playwright e2e in CI · `executionReady: false`  
**Supersedes:** Informal team conventions; does not supersede CCIS or ADR corpus  
**Companion:** [engineering-constitution.md](../knowledge-base/engineering-constitution.md) (operational checklist) · [Project Brain 01](../project-brain/01-philosophy-and-identity.md) · [Project Brain 18](../project-brain/18-architectural-decision-framework.md)

---

## Preamble

### Why this document exists

Conquest is a **Strategic Intelligence Operating System (CIOS)** — a governed runtime that transforms evidence into verified recommendations and human-authorized action. It is not an AI wrapper, not a chatbot, and not a dashboard that displays without explaining. Every engineering choice either strengthens that identity or erodes it.

This Constitution exists because **code alone cannot preserve intent**. Recovery Phase 3 demonstrated that when architectural judgment lived only in conversations, the repository drifted toward category error: engineers treated Conquest as "CRUD + LLM," seeded fake intelligence for demos, and placed router components outside `RouterProvider`. Institutional memory — ADRs, Project Brain, and this corpus — exists so that **future engineers and AI agents inherit reasoning, not just syntax**.

Violations of this Constitution are **defects**, not style preferences. A pull request that bypasses tenant isolation is not "a different approach." It is a security defect. A pull request that places business logic in `apps/web` is not "faster delivery." It is an architectural defect that compounds until the system is untestable.

### Relationship to authority documents

Conquest governance follows a strict hierarchy. This Constitution sits **below** supreme intelligence authority and **above** implementation code:

```
CCIS (supreme intelligence authority)
  → AMD → PDD → UXMD → Document X
  → SDD I–V
  → ADR (architectural decisions — immutable once Accepted)
  → Governance records (BAR, RTM, production blockers)
  → Build Authorization → Build
  → Engineering Constitution (checklist) + This Constitution (expanded law)
  → Project Brain (engineering memory and judgment)
  → apps/ · packages/ · services/ (as-built runtime)
```

| Document | Role relative to this Constitution |
|----------|-------------------------------------|
| [CCIS](../architecture/ccis.md) | Defines *what intelligence is*. This Constitution operationalizes engineering law that implements CCIS without contradicting it. |
| [ADR corpus](../architecture/adr/README.md) | Records *why* specific decisions were made. Each article below cross-links relevant ADRs. |
| [Project Brain](../project-brain/README.md) | Permanent engineering memory — philosophy, misconceptions, worked examples. Amend when intent changes. |
| [engineering-constitution.md](../knowledge-base/engineering-constitution.md) | Condensed rule list (38 rules). This document expands every rule until self-contained. |
| [ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md) | Frozen normative corpus. Modifications require ADR. |

**Code expresses architecture. Architecture is not retrofitted to code.**

When this Constitution and an ADR appear to conflict, the ADR prevails until superseded by a new ADR. When an ADR and CCIS conflict, CCIS prevails — and the ADR must be superseded.

### Scope and audience

This Constitution binds:

- Human engineers contributing to `apps/`, `packages/`, and `services/`
- AI agents (Cursor, OpenCode, successors) operating under `AGENTS.md`
- Reviewers evaluating pull requests against institutional law
- Architects proposing new subsystems, modules, or build waves

It does **not** replace UXMD screen specifications, PDD module definitions, or RTM verification evidence. It defines **how engineering must behave** when implementing those authorities.

### Current program state (as of M4)

| Fact | Meaning for this Constitution |
|------|------------------------------|
| Build-2 M4 complete | Closed-beta readiness ~96%; email, jobs, ops probes, e2e journey shipped |
| 278 Vitest tests | Minimum CI gate; behavior changes require meaningful test updates |
| `executionReady: false` | Decision engine hard-blocks autonomous execution ([ADR-0015](../architecture/adr/0015-execution-layer-separation.md)) |
| `AutomationService.manualRun` audit-only | Workflow runs write `auth_executions` records; no side effects until M5 BAR |
| `DrizzleAuthRepository` | Production persistence via repository abstraction; `MEMORY_REPO=true` CI fallback only |
| `createStubProviders()` in ai-gateway | Provider boundary enforced; deterministic CI without API keys |
| M5 gated | Execution requires BAR scope for B-25–B-28 — not documentation alone |

---

## Article I — Identity

### I.1 What Conquest is

Conquest is a **Strategic Intelligence Operating System (CIOS)**. It provides:

- A **kernel** — cognitive pipeline orchestration via `platform.cognitive.run`
- **System calls** — governed APIs (research analyze, intelligence feed, automation CRUD)
- **Processes** — workspace-scoped intelligence workflows
- **Memory subsystem** — `CognitiveMemoryManager` (not raw database writes)
- **Security model** — organization → workspace tenant isolation, session model, RBAC
- **Shell** — Command Center UX as home ([ADR-0002](../architecture/adr/0002-command-center-as-home.md)), not a chat thread

**Primary output:** Verified, evidence-backed recommendations with confidence, status, and lineage.  
**Primary input:** Research sessions, workspace context, structured events — not free-form chat as the product center.

### I.2 What Conquest is not

| Category error | Constitutional rejection |
|--------------|-------------------------|
| Chatbot | No "Ask Conquest" free-form thread as primary UX (RTM-UX-009) |
| AI wrapper | No direct provider SDK in UI or scattered handlers |
| Automation platform alone | Automation exists inside the OS; reasoning precedes action |
| Generic admin dashboard | UXMD-specified screens; seven-item primary nav ([ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md)) |
| Finished product | First Law: Conquest evolves under governed learning ([ADR-0009](../architecture/adr/0009-learning-boundary.md)) |

### I.3 Optimization targets

From CCIS §I.3, every feature must improve at least one:

| Metric | Engineering implication |
|--------|------------------------|
| **Accuracy** | Conclusions align with verified reality — verification gate mandatory |
| **Reliability** | Similar inputs → consistent quality — deterministic engines testable in CI |
| **Consistency** | Standards across domains — contracts in `@conquest/contracts` |
| **Verifiability** | Trace to evidence — `evidenceRefs` on recommendations ([ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md)) |
| **Outcome success** | Decisions measurably improve results — future measurement hooks |

### I.4 Refused optimizations

Engineering must **not** optimize for:

- Conversational charm without verification
- Token throughput over artifact quality
- "Looks intelligent" without evidence lineage
- Autonomous action without human authorization
- Single-model dependency without gateway abstraction ([ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md))

### I.5 Rationale

Recovery Phase 3 identified **category drift** as the primary architectural risk. When Conquest is mistaken for an AI wrapper, engineers ship chat UIs, seed fake recommendations, and skip verification. Identity is not marketing — it is **enforcement architecture**.

### I.6 Historical origin

- CCIS §I Identity (Stage 1 Final)
- Project Brain Chapter 01 — Philosophy and Identity
- Build-2 M1: removal of `ensureSeed` fake intelligence (Project Brain 18 §1.3)
- Recovery audit: ~74% knowledge coverage before Phase 2 documentation investment

### I.7 Examples

**Compliant:** User creates research session → adds sources → `POST .../analyze` → orchestrator produces recommendations → Command Center shows honest empty until pipeline runs.

**Non-compliant:** Intelligence feed pre-populated with demo recommendations to "look alive" in sales demos.

### I.8 Anti-patterns

- Marketing Conquest as "our GPT integration"
- Shipping a "quick chat tab" as primary navigation
- Treating `services/ai-gateway` existence as proof the product is "just an LLM app"
- Using stub providers as excuse to skip pipeline structure

### I.9 Enforcement

| Check | Mechanism |
|-------|-----------|
| No fake seed data | Code review; M1 decision permanent |
| Command Center home | UXMD + RTM-UX rows |
| Category error | [architectural-continuity-test.md](../project-brain/architectural-continuity-test.md) |
| Agent onboarding | [ai-agent-onboarding.md](../knowledge-base/ai-agent-onboarding.md) forbids wrapper patterns |

### I.10 Cross-links

- [ADR-0002](../architecture/adr/0002-command-center-as-home.md) — Command Center as home
- [ADR-0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md) — CCIS lifecycle order
- [ADR-0037](../architecture/adr/0037-cognitive-intelligence-foundation.md) — Cognitive intelligence foundation

---

## Article II — Authority Hierarchy

### II.1 Document chain

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

No implementation may contradict a higher layer. Lower documents elaborate and operationalize; they never override.

### II.2 Build authorization

**Build is not authorized by default.** Code in `apps/`, `packages/`, and `services/` is live implementation only within BAR scope.

| Build wave | Status (M4 baseline) |
|------------|------------------------|
| Build-1 | Authorized per BAR-2026-06-26-001 |
| Build-2 M1–M4 | Complete |
| Build-2 M5 | **Gated** — requires BAR + B-25–B-28 closure |

Engineering must confirm BAR scope before:

- Enabling `executionReady: true`
- Shipping execution engine side effects
- Adding primary navigation items
- Modifying frozen architecture corpus

### II.3 ADR immutability

Accepted ADRs are **immutable**. Supersede with a new ADR number; never rewrite historical ADR body to match new code. Link forward: "Superseded by ADR-00XX."

### II.4 Project Brain as engineering memory

Project Brain chapters 00–18 are **supreme engineering memory** for reconstruction. When intent changes, update Project Brain in the same pull request as code when possible.

### II.5 RTM and verification evidence

Requirements Traceability Matrix rows track `Specified` → `In Build` → `Verified`. Build-2 M4 complete does not automatically verify all RTM rows — formal evidence must be recorded per row.

### II.6 Rationale

Authority hierarchy prevents **local optimization** from destroying global coherence. An engineer cannot "just fix it in the handler" if the fix belongs in domain services per SDD layering.

### II.7 Historical origin

- [ADR-0001](../architecture/adr/0001-document-authority-hierarchy.md) — Document authority hierarchy
- [ADR-0013](../architecture/adr/0013-authority-bridge.md) — Authority bridge
- Recovery Phase 2: six mandatory master KB documents synchronized with M4 baseline

### II.8 Examples

**Compliant:** New execution capability proposed → ADR-0015 review → BAR for B-25–B-28 → Project Brain Chapter 12 update → implementation.

**Non-compliant:** Engineer enables workflow webhooks in M4 because "users expect it to work."

### II.9 Anti-patterns

- "We'll document later" after shipping boundary change
- Editing Accepted ADR in place
- Implementing M5 execution without BAR because tests pass
- Treating `PROTOTYPE.md` quarantine as permission to ignore governance in `apps/`

### II.10 Enforcement

| Check | Mechanism |
|-------|-----------|
| Architecture freeze | [ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md) review on doc changes |
| BAR scope | [build-authorization-record](../governance/) records |
| Agent rules | `.cursor/rules/conquest-cios.mdc` — Build is not authorized |
| Continuity test | Project Brain architectural-continuity-test.md |

### II.11 Cross-links

- [ADR-0001](../architecture/adr/0001-document-authority-hierarchy.md)
- [ADR-0025](../architecture/adr/0025-production-readiness-gate.md)
- [ADR-0026](../architecture/adr/0026-cognitive-pipeline-authority.md)

---

## Article III — Presentation Law

### III.1 Layer responsibility

`apps/web` and `packages/presentation` **render and route only**. They do not:

- Reason about evidence or recommendations
- Write memory
- Call AI providers
- Enforce tenant isolation (API responsibility)
- Contain business rules duplicating `services/auth`

Presentation is **dumb by design** — intelligence stays in domain and platform layers per SDD.

### III.2 GIS inheritance

All colors, spacing, typography, radii, timing, and opacity come from `@conquest/gis` tokens ([ADR-0012](../architecture/adr/0012-gis-inheritance.md)). No scattered hex values, magic numbers, or ad-hoc animation durations in feature code.

Accessibility is mandatory: keyboard navigation, screen readers, reduced motion, focus management, contrast — ENG-23 GIS accessibility gate.

### III.3 UXMD compliance

Screens must match UXMD Volumes I–III specifications. Forbidden:

- Generic sidebar + cards + charts layout substituting for UXMD screens
- Intelligence machinery (engines, models, pipelines) as primary navigation items
- Archived pre-UXMD design docs as implementation authority

`apps/gateway/public/preview.*` is **pipeline demo only** — not the UXMD application.

### III.4 API boundary from UI

UI communicates with backend exclusively via `fetch('/api/...')` with credentials. **Never** import:

- `@conquest/cognitive`
- `@conquest/platform`
- `@conquest/ai-gateway`
- `services/auth` domain modules

### III.5 React Router law

`Link`, `NavLink`, `Navigate`, `Outlet`, and hooks (`useNavigate`, `useLocation`, `useParams`, `useRoutes`) must render **under** the route tree (e.g., `RootLayout` with `Outlet`), never as siblings of `RouterProvider`.

**Historical origin:** Preview RCA — `CookieConsentBanner` crash when `Link` was outside `RouterProvider`. Fix: `RootLayout` wrapper (Project Brain 18 §1.4).

### III.6 Workspace as context

Workspace is **context**, not primary navigation ([ADR-0003](../architecture/adr/0003-workspace-as-context.md)). Chrome shows active workspace; seven-item primary nav remains frozen.

### III.7 Rationale

Fat presentation layers are the fastest path to untestable, duplicated logic. Every rule duplicated in React is a rule that will diverge from domain truth.

### III.8 Examples

**Compliant:** `IntelligenceFeed` component fetches `GET /api/workspaces/:id/intelligence` and renders GIS-styled cards with confidence and evidence drill-down.

**Non-compliant:** Component imports `DecisionEngine` to "preview" recommendation logic client-side.

### III.9 Anti-patterns

| Anti-pattern | Detection |
|--------------|-----------|
| Business logic in UI | `@conquest/cognitive` import in `apps/web` |
| GIS bypass | Hardcoded `#1a1a2e` in component CSS |
| Router hook outside tree | Component sibling to `RouterProvider` using `Link` |
| Chat-primary UX | Free-form thread as home screen |
| Fake active states | "3 new recommendations" when pipeline produced zero |

### III.10 Enforcement

| Check | Mechanism |
|-------|-----------|
| Lint / import boundaries | Package boundary rules; code review |
| E2E smoke | Playwright `e2e/closed-beta-journey.spec.ts` in CI |
| GIS gate | ENG-23 accessibility requirements |
| UX review | UXMD screen ID reference in PR description |

### III.11 Cross-links

- [ADR-0002](../architecture/adr/0002-command-center-as-home.md)
- [ADR-0003](../architecture/adr/0003-workspace-as-context.md)
- [ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md)
- [ADR-0012](../architecture/adr/0012-gis-inheritance.md)
- [ADR-0014](../architecture/adr/0014-module-boundaries.md)

---

## Article IV — API Law

### IV.1 Composition-only API layer

`apps/api` (Hono) performs:

- HTTP routing and middleware
- Session extraction and correlation ID propagation
- Composition of domain services from `services/auth`
- Response serialization per `@conquest/contracts`

`apps/api` does **not** contain domain business logic. Delegate to `services/auth` or platform services.

### IV.2 Environment configuration

Parse environment variables **only** through `@conquest/config` via `validateApiEnvironment()`. Never scatter `process.env` reads in feature handlers.

`MEMORY_REPO=true` is permitted in CI and local dev fallback only — **validated forbidden in production** at startup.

### IV.3 Observability middleware

Every request must propagate:

- `x-correlation-id`
- `x-trace-id`
- `x-request-id`

Middleware sets these at API boundary. New route stacks must not bypass observability ([ADR-0023](../architecture/adr/0023-monitoring-observability-strategy.md)).

### IV.4 Verification gate on intelligence responses

Never return unverified intelligence as established fact ([ADR-0006](../architecture/adr/0006-verification-before-release.md)). API responses for recommendations must reflect:

- Verification status
- Confidence (calibrated — not raw model logprob)
- Evidence references where applicable
- Recommendation status: proposed / approved / deferred / rejected

### IV.5 Tenant isolation

Workspace-scoped routes must verify:

```typescript
assert session.orgId === workspace.orgId
assert canAccessModuleRead(role, module)
```

Never weaken tenant isolation for convenience ([ADR-0016](../architecture/adr/0016-tenant-isolation-strategy.md)). Future Postgres RLS is defense-in-depth — not replacement for application checks.

### IV.6 Rate limiting

Production profile: **120 requests/minute per IP** on `/api/*`. Never disable rate limiting in production.

### IV.7 Security headers

Production profile must ship security headers. Never merge production configuration that omits them.

### IV.8 Rationale

API layer as thin composition root enables:

- Domain logic tested without HTTP
- Single place for session and correlation enforcement
- Clear audit boundary for external calls

### IV.9 Historical origin

- Build-1: Hono API composition pattern
- Build-2 M2: `DrizzleAuthRepository` — API never gained raw SQL
- ADR-0017: Identity session model

### IV.10 Examples

**Compliant:** `POST /api/workspaces/:workspaceId/research/:sessionId/analyze` → `ResearchService.analyze()` → `platform.cognitive.run()`.

**Non-compliant:** Analyze handler contains 200 lines of evidence classification logic inline.

### IV.11 Anti-patterns

| Anti-pattern | Why prohibited |
|--------------|----------------|
| Domain logic in `apps/api` | Untestable; duplicates `services/auth` |
| `process.env` in handlers | Config drift; untestable environments |
| Missing correlation IDs | Incident blindness |
| Skip verification on "high confidence" | ADR-0006 violation |
| Cross-tenant workspace access | Security defect |

### IV.12 Enforcement

| Check | Mechanism |
|-------|-----------|
| Tenant isolation | Auth contract tests; workspace route tests |
| Correlation | Middleware unit tests |
| Rate limit | Production config validation |
| `MEMORY_REPO` production block | Startup validation in `@conquest/config` |
| Ops probes | `/api/ops/degradation` dependency checks (M4) |

### IV.13 Cross-links

- [ADR-0006](../architecture/adr/0006-verification-before-release.md)
- [ADR-0016](../architecture/adr/0016-tenant-isolation-strategy.md)
- [ADR-0017](../architecture/adr/0017-identity-session-model.md)
- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md)
- [ADR-0020](../architecture/adr/0020-infrastructure-trust-boundaries.md)

---

## Article V — Persistence Law

### V.1 Repository abstraction

All auth-domain persistence flows through `AuthRepository` interface. Production implementation: `DrizzleAuthRepository` in `services/auth`. CI/local fallback: `AsyncMemoryAuthRepository` when `MEMORY_REPO=true`.

**Never:**

- Raw SQL in domain services or API handlers
- Bypass repository to "just query faster"
- Parallel table models diverging from Drizzle schema

### V.2 Single schema source

Drizzle schema in `packages/database` is the **single source of truth** for Postgres table definitions. Contracts DTOs align with repository outputs — not duplicate divergent shapes.

Build-2 M2 delivered consolidated ~15-table schema with initial migration. Repository contract tests run against both memory and postgres implementations (`auth-repository.contract.test.ts`).

### V.3 Memory writes

All cognitive memory writes occur exclusively through `CognitiveMemoryManager` ([ADR-0008](../architecture/adr/0008-memory-governance.md), [ADR-0029](../architecture/adr/0029-memory-read-write-authority.md)).

Engines, modules, and agents **never** write memory stores directly.

### V.4 Memory lifecycle

AMD III lifecycle: **Proposed → Active → Expired → Archived → Deleted**

User corrections override inferred memory (CCIS M3). Memory is compression of patterns and verified knowledge — not raw conversation archives.

### V.5 Secrets

Never commit secrets. Environment variables only ([ADR-0019](../architecture/adr/0019-secrets-management-strategy.md)). Encryption key custody per [ADR-0018](../architecture/adr/0018-encryption-key-custody.md).

### V.6 Rationale

Repository abstraction enabled Build-2 M2 migration from in-memory demo data to durable Postgres **without rewriting domain services**. Direct SQL in handlers would have frozen demo-era assumptions into production.

### V.7 Historical origin

- Build-2 M2 decision: Drizzle + repository interface (Project Brain 18 §1.2)
- `MEMORY_REPO=true` for CI when Docker/Postgres unavailable
- ADR-0008: Memory Manager sole write authority

### V.8 Examples

**Compliant:** `ResearchService` calls `this.repo.createResearchSession(...)` — `DrizzleAuthRepository` persists to `auth_research_sessions`.

**Non-compliant:** `ReasoningEngine` inserts directly into `auth_memory_items` table.

### V.9 Anti-patterns

| Anti-pattern | Detection |
|--------------|-----------|
| Raw SQL in API | `sql` import in `apps/api` handlers |
| Engine direct DB write | Cognitive package importing Drizzle client for memory |
| Duplicate DTOs | Different shape in `apps/web` and `packages/contracts` |
| `MEMORY_REPO` in production | Startup validation failure |
| Second schema source | Prisma or hand-maintained SQL alongside Drizzle |

### V.10 Enforcement

| Check | Mechanism |
|-------|-----------|
| Repository contract | `auth-repository.contract.test.ts` — memory + postgres suites |
| CI persistence | `MEMORY_REPO=true` in CI test job |
| Memory boundary | Code review; B-28 learning isolation tests (M5 gated) |
| Secret scan | Pre-commit / CI secret detection |

### V.11 Cross-links

- [ADR-0008](../architecture/adr/0008-memory-governance.md)
- [ADR-0018](../architecture/adr/0018-encryption-key-custody.md)
- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md)
- [ADR-0029](../architecture/adr/0029-memory-read-write-authority.md)

---

## Article VI — Cognitive and AI Law

### VI.1 Orchestrator supremacy

Intelligence flows through `platform.cognitive.run` → `CognitiveOrchestrator`. **Never bypass** the Cognitive Orchestrator for domain intelligence work.

Legacy `services/orchestrator` `PipelineRunner` is **not** on the API path. Build-1+ uses `@conquest/cognitive` via platform composition.

### VI.2 Pipeline structure (M4 as-built)

```
platform.cognitive.run()
  → CognitiveOrchestrator
    → EvidenceEngine
    → ReasoningEngine
    → DecisionEngine (executionReady: false)
    → Verification gate
```

Orchestration **routes**; it does not replace reasoning or decision engines (RTM-ENG-003).

### VI.3 AI Gateway exclusivity

All provider calls go through `@conquest/ai-gateway` ([ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md)). **Never:**

- `import OpenAI from 'openai'` in `apps/web`, `apps/api`, or `services/auth`
- Direct Anthropic, Gemini, or Azure SDK calls outside gateway package

M4 baseline: `createStubProviders()` returns deterministic `[stub:providerId] response` for CI. Stubs enforce boundary; pipeline structure is real.

### VI.4 Prompt registry

Prompts are registered and versioned in `@conquest/prompt-management`. No inline system prompts scattered in API handlers or domain services.

### VI.5 Prompt security

User content is sanitized via `@conquest/prompt-security` before provider calls. Never bypass injection screening.

### VI.6 AI audit

`AI_AUDIT_CONSTANTS` govern redaction. **Never log prompt content by default** in production paths.

### VI.7 Evidence-first reasoning

Reasoning must cite evidence portfolio ([ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md)). Evidence hierarchy:

```
verified fact → supported inference → hypothesis → prediction
```

Evidence engine runs **before** reasoning in orchestrator. LLM context window is **not** evidence — evidence is structured artifacts with lineage.

### VI.8 Explainable recommendations

Never generate recommendations without:

- Explainable reasoning trace
- Evidence references where applicable
- Calibrated confidence score

### VI.9 Execution readiness

**Never set `executionReady: true` without governance approval.**

`DecisionEngine` hardcodes `executionReady: false` until Build-2 M5 BAR closes B-25–B-28. This is intentional — not a TODO to "fix later."

```typescript
// services/cognitive/src/decision-engine.ts — M4 baseline
executionReady: false,
```

### VI.10 Automation execution boundary

`AutomationService.manualRun` records audit only until M5 BAR. Writes `auth_executions` with deferred message — **no external side effects**.

Never execute workflows autonomously in M4.

### VI.11 Async cognitive

Long-running cognitive work enqueues `ai_request` jobs via `JobService`:

- Redis `RedisJobStore` with DLQ, retry, timeout (M4)
- In-memory fallback when Redis unavailable
- Worker health exposed in ops status

### VI.12 Rationale

Cognitive law exists because **the LLM is one instrument in an orchestra — not the orchestra**. Provider swap, safety boundaries, and verification independence require structural enforcement — not team discipline alone.

### VI.13 Historical origin

- ADR-0037, ADR-0038: Cognitive platform hardening
- Build-2 M1: Remove intelligence seed — recommendations only from pipeline
- B-25–B-28 governance rows open until M5

### VI.14 Examples

**Compliant:** `ResearchService.analyze()` → `cognitiveScope()` attaches tenant → `platform.cognitive.run()` → recommendations persisted via `IntelligenceService`.

**Non-compliant:** Handler calls OpenAI completion API directly with research session text.

### VI.15 Anti-patterns

| Anti-pattern | Detection |
|--------------|-----------|
| Direct provider SDK | Static analysis; grep for `openai` outside `ai-gateway` |
| Skip verification | High-confidence bypass in DecisionEngine |
| Prompt in feature code | Unregistered template strings |
| Auto-execute on approval | Webhook fires without execution layer |
| End-to-end LLM replaces engines | Single `complete()` call returns recommendation |

### VI.16 Enforcement

| Check | Mechanism |
|-------|-----------|
| Provider boundary | B-27 static analysis (M5 gated); gateway unit tests |
| Pipeline order | B-25 contract tests (M5 gated) |
| VRF bypass | B-26 tests (M5 gated) |
| Learning → execution | B-28 isolation tests (M5 gated) |
| `executionReady` | `decision-engine.ts` hard false; contract type in `@conquest/contracts` |
| Stub gateway | `gateway.test.ts` — stub provider completion |

### VI.17 Cross-links

- [ADR-0006](../architecture/adr/0006-verification-before-release.md)
- [ADR-0007](../architecture/adr/0007-ccis-cognitive-lifecycle-order.md)
- [ADR-0009](../architecture/adr/0009-learning-boundary.md)
- [ADR-0011](../architecture/adr/0011-ai-provider-abstraction.md)
- [ADR-0015](../architecture/adr/0015-execution-layer-separation.md)
- [ADR-0031](../architecture/adr/0031-evidence-first-reasoning.md)
- [ADR-0034](../architecture/adr/0034-ai-failure-recovery.md)
- [ADR-0035](../architecture/adr/0035-ai-safety-boundaries.md)
- [ADR-0037](../architecture/adr/0037-cognitive-intelligence-foundation.md)
- [ADR-0038](../architecture/adr/0038-cognitive-platform-hardening.md)

---

## Article VII — Contracts

### VII.1 Single contract package

Cross-module messages live in `packages/contracts` with **Zod validation**. Every structured message between services includes standard envelope fields where applicable: `requestId`, `correlationId`, `origin`, `destination`, `intent`, `payload`, `confidence`, `priority`, `timestamp`, `version`.

### VII.2 No duplicate DTOs

One canonical shape per boundary. **Never** duplicate DTO definitions in `apps/web` and `apps/api`. Frontend consumes API responses typed from shared contracts or generated OpenAPI alignment.

### VII.3 Cognitive contracts

Decision artifacts, evidence refs, and pipeline results are typed in `packages/contracts/src/cognitive/`. `executionReady: boolean` is part of the public decision contract — governance controls when it may become true.

### VII.4 HTTP API documentation

Public HTTP shapes documented in `api-reference.md` (knowledge base). Internal service interfaces remain TypeScript interfaces in owning service.

### VII.5 Event contracts

Event-driven integration ([ADR-0010](../architecture/adr/0010-event-driven-architecture.md)) uses typed event payloads — not free-form strings between modules.

### VII.6 Rationale

Duplicated contracts diverge silently. Zod validation at boundaries catches schema drift at test time rather than production.

### VII.7 Examples

**Compliant:** New recommendation status endpoint uses `RecommendationStatusUpdate` schema from `@conquest/contracts`.

**Non-compliant:** Frontend defines `interface Recommendation { ... }` with different field names than API.

### VII.8 Anti-patterns

| Anti-pattern | Consequence |
|--------------|-------------|
| Parallel type definitions | Runtime serialization bugs |
| Untyped `any` payloads | Verification bypass |
| Stringly-typed events | Orchestration routing failures |
| Contract change without tests | CI green but production broken |

### VII.9 Enforcement

| Check | Mechanism |
|-------|-----------|
| Zod parse tests | Contract package unit tests |
| Typecheck | `pnpm typecheck` across monorepo |
| API contract tests | Handler tests assert response shape |

### VII.10 Cross-links

- [ADR-0010](../architecture/adr/0010-event-driven-architecture.md)
- [ADR-0014](../architecture/adr/0014-module-boundaries.md)

---

## Article VIII — Quality Gates

### VIII.1 CI must stay green

**Never merge:**

| Gate | Command | M4 baseline |
|------|---------|-------------|
| Build | `pnpm build` | Required |
| Typecheck | `pnpm typecheck` | Required |
| Lint | `pnpm lint` | Required |
| Unit/integration tests | `pnpm test` | **278+** passing |
| E2E (UX changes) | `pnpm test:e2e` | Playwright closed-beta journey in CI |

### VIII.2 Meaningful tests for behavior changes

Behavior changes — especially auth, tenant isolation, and cognitive paths — require tests that prove the behavior. Trivial assertion tests that guard nothing are insufficient.

Repository contract tests (`auth-repository.contract.test.ts`) must pass for both memory and postgres implementations when database is reachable.

### VIII.3 Cognitive testability

Deterministic engines and stub AI providers exist so Vitest asserts full pipeline **without API keys**. This is architectural requirement — not temporary convenience.

### VIII.4 E2E for journey integrity

M4 added `e2e/closed-beta-journey.spec.ts` to CI. UX changes affecting closed-beta journey must keep e2e green.

### VIII.5 No failing build policy

A failing CI on `main` is a **stop-ship** condition. Fix or revert — do not merge with "will fix later."

### VIII.6 Rationale

278 tests are the institutional baseline for M4. They represent closed-beta readiness investment. Regressions without test updates repeat historical failures (fake seed, router crash, tenant leaks).

### VIII.7 Historical origin

- M4 completion report: 278 Vitest + Playwright e2e
- Recovery Phase 2: CI green baseline documented
- `MEMORY_REPO=true` enables persistence tests in CI without mandatory Docker

### VIII.8 Anti-patterns

| Anti-pattern | Response |
|--------------|----------|
| Skip tests for "small change" | Reject PR |
| `.skip` postgres contract tests permanently | Fix database CI or document skip reason |
| Disable lint rule locally | Fix violation |
| Merge with known flake | Fix flake first |

### VIII.9 Enforcement

GitHub Actions CI pipeline runs build, typecheck, lint, test. Playwright job on UX-touched paths.

### VIII.10 Cross-links

- [ADR-0025](../architecture/adr/0025-production-readiness-gate.md)
- Project Brain Chapter 15 — Engineering Standards

---

## Article IX — Production Integrity

### IX.1 No silent demo activation

Never introduce demo-only code that activates silently in production. Feature-flag or env-gate explicitly via `AdministrationService` feature flags or documented environment switches.

### IX.2 No hardcoded production URLs or secrets

Configuration flows through `@conquest/config`. URLs and secrets from environment — never committed.

### IX.3 Email and notifications

M4 delivered Resend + SMTP email with retry, audit, and correlation IDs. Email flows through `NotificationService` → `createEmailProvider()` — not ad-hoc nodemailer in handlers.

### IX.4 Job queue integrity

M4 delivered Redis job queue with DLQ, retry, timeout, and in-memory fallback. Jobs created via `createJobService({ redisUrl })` — not ad-hoc setTimeout chains for critical work.

### IX.5 Cache provider

Cache via `createCacheProvider({ redisClient })` — swappable Redis vs in-memory per environment.

### IX.6 Ops and degradation

`/api/ops/degradation` dependency probes (M4) expose honest system pulse. Operations module shows live telemetry — not vanity metrics.

### IX.7 Disaster recovery awareness

Production operations must align with [ADR-0021](../architecture/adr/0021-disaster-recovery-strategy.md) and [ADR-0022](../architecture/adr/0022-high-availability-model.md) as those capabilities mature.

### IX.8 Security incident readiness

[ADR-0024](../architecture/adr/0024-security-incident-response.md) defines incident response expectations. Correlation IDs and audit trails are production integrity prerequisites.

### IX.9 Rationale

Closed-beta (M4) means real users, real sessions, real legal acceptance — not a localhost demo. Production integrity rules prevent "works on my machine" from becoming "leaks in production."

### IX.10 Anti-patterns

| Anti-pattern | Risk |
|--------------|------|
| `if (process.env.NODE_ENV !== 'production')` hiding bugs | Silent prod activation |
| Disabled rate limiting "for debugging" | Abuse surface |
| Logging full prompts | Data leak |
| Missing security headers | OWASP failures |
| Fake ops green | Incident masking |

### IX.11 Enforcement

| Check | Mechanism |
|-------|-----------|
| Startup validation | `validateApiEnvironment()` |
| Ops probes | `dependency-probes.test.ts` |
| Rate limit config | Production profile tests |
| AI audit redaction | `AI_AUDIT_CONSTANTS` unit tests |

### IX.12 Cross-links

- [ADR-0019](../architecture/adr/0019-secrets-management-strategy.md)
- [ADR-0021](../architecture/adr/0021-disaster-recovery-strategy.md)
- [ADR-0023](../architecture/adr/0023-monitoring-observability-strategy.md)
- [ADR-0024](../architecture/adr/0024-security-incident-response.md)

---

## Article X — Governance and Amendment

### X.1 Learning boundary

Learning and reflection outputs **must not** deploy to production code paths autonomously ([ADR-0009](../architecture/adr/0009-learning-boundary.md), [ADR-0032](../architecture/adr/0032-reflection-governance.md), [ADR-0033](../architecture/adr/0033-learning-proposal-governance.md)).

Learning **proposes**; governance **approves**; execution **never** auto-triggers from learning.

### X.2 Execution governance

Implementation of execution features requires:

1. Build Authorization Record (BAR) with scope for B-25–B-28
2. ADR-0015 compliance review
3. Project Brain Chapter 12 update
4. `executionReady` governance workflow — not a boolean flip
5. Tests proving authorization path

M5 is **gated** — documentation completeness does not authorize M5.

### X.3 Frozen architecture modifications

Modifications to frozen architecture corpus require ADR per [ARCHITECTURE-FREEZE.md](../architecture/ARCHITECTURE-FREEZE.md).

### X.4 New module introduction

Per Project Brain 18 §7.1:

1. PDD module specification exists or is amended
2. UXMD screen IDs assigned
3. ADR for boundary impact
4. BAR authorizes build scope
5. Contracts in `@conquest/contracts`
6. Domain owner in `services/auth` (typical)
7. Project Brain Chapter 05 updated
8. Placeholder → implemented removes `ModulePlaceholder`

**Never** add eighth primary nav item without ADR-0005 amendment.

### X.5 PR integrity checklist

Every significant pull request:

```
Code change PR
  → Constitution check (this document + engineering-constitution)
  → Misconception check (Project Brain 16)
  → Decision framework (Project Brain 18)
  → ADR if escalation matrix requires
  → Project Brain if intent changes
  → Tests (278+ baseline)
  → E2E if UX touched
```

### X.6 Anti-pattern response

When Part 4 anti-pattern from Project Brain 18 is detected: **stop PR**; refactor to approved pattern; add regression test.

### X.7 Institutional memory sync

| Event | Required update |
|-------|-----------------|
| Architectural decision | ADR + optional Project Brain |
| Milestone complete | `docs/build-2/*-report.md` |
| Misconception discovered | Project Brain Chapter 16 entry |
| Constitution rule change | This document + engineering-constitution |
| Judgment framework change | Project Brain Chapter 18 |

Docs drift is an engineering defect. Recovery phases exist because sync was treated as optional.

---

## Amendment Procedure

### A.1 Who may propose

Any engineer or AI agent may propose a constitutional amendment. **Approval requires** human architect review and governance artifacts — not silent merge.

### A.2 When ADR is required

Amendments that change architectural boundaries, authority interpretation, or enforcement philosophy require a **new ADR** (or superseding ADR if replacing prior decision).

Cosmetic clarifications that restate existing ADR intent without new rules may update this document directly with PR review — but must not contradict Accepted ADRs.

### A.3 Amendment workflow

```
1. Identify rule to add, modify, or deprecate
2. Check CCIS and Accepted ADRs — cannot contradict
3. If architectural: draft ADR using template (docs/architecture/adr/template.md)
4. Update engineering-constitution.md (condensed rules)
5. Update this document (expanded law)
6. Update Project Brain if judgment or intent changes
7. Update institutional-memory cross-references if needed
8. Add or update tests proving enforcement
9. Record in development-history (Project Brain 13) for significant changes
```

### A.4 Supersession — never silent edit

- ADRs: new number supersedes old; link both directions
- Constitution articles: changelog section at document footer with date and rationale
- Never rewrite historical ADR body to match new code

### A.5 Emergency exception

Production incident hotfix may temporarily diverge only with:

1. Explicit incident record
2. Time-bounded revert plan
3. Follow-up ADR or constitutional amendment within 5 business days
4. Regression test before closing incident

Emergency does not authorize permanent governance bypass.

### A.6 AI agent constraints

AI agents operating under `AGENTS.md` must treat this Constitution as binding. Agents must not:

- Enable `executionReady` without BAR
- Bypass gateway, registry, or memory manager
- Merge without CI green
- Amend this document without human review on architectural changes

---

## Approved Patterns Reference

| Pattern | Location | Notes |
|---------|----------|-------|
| UI → API | `fetch` with credentials | No cognitive imports in UI |
| API → domain | Service method on `services/auth` | `ResearchService`, `IntelligenceService`, etc. |
| Intelligence → cognitive | `IntelligenceCognitiveProvider` → `platform.cognitive.run` | Scoped via `cognitiveScope()` |
| Async cognitive | `JobService` enqueue `ai_request` | Redis or in-memory |
| Email | `NotificationService` → `createEmailProvider()` | M4 Resend + SMTP |
| Cache | `createCacheProvider({ redisClient })` | Env-swappable |
| Jobs | `createJobService({ redisUrl })` | DLQ, retry, timeout |
| Constants | `packages/config/src/constants.ts` | Including `AI_AUDIT_CONSTANTS` |
| Feature flags | `AdministrationService` | Explicit prod gating |
| Persistence | `createAuthRepository()` → `DrizzleAuthRepository` | `MEMORY_REPO` CI only |
| AI providers | `createStubProviders()` in dev/CI | Gateway interface stable |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-29 | Initial institutional memory expansion — Recovery Phase 4 |

---

*Next: [02 Intelligence Philosophy Manual](./02-intelligence-philosophy-manual.md) · Index: [README](./README.md) · Checklist: [engineering-constitution.md](../knowledge-base/engineering-constitution.md)*
