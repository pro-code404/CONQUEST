# 18 — Architectural Decision Framework

**Permanent architectural reasoning guide.**

Chapters 01–17 explain **what** Conquest is and **how** it is built. This chapter explains **how future architects are expected to think** — the judgment framework used during Build-0 through Recovery Phase 4.

If you are about to design a new subsystem, change a boundary, or add AI capability: **read this chapter before writing code or an ADR.**

Cross-reference: [04 — Architectural philosophy](./04-architectural-philosophy.md) · [16 — Misconceptions](./16-common-misconceptions.md) · [engineering-constitution](../knowledge-base/engineering-constitution.md)

---

## Part 1 — Engineering Decision Framework

Every significant engineering decision MUST be documented using this template — in an ADR, a Project Brain amendment, or a Build report section.

### 1.1 Decision record template

```markdown
## Decision: [short title]

### Problem
What concrete problem or requirement forces a decision now?

### Alternatives considered
| Option | Summary |
|--------|---------|
| A | … |
| B | … |
| C | … |

### Chosen solution
What we selected and where it lives in the repo.

### Tradeoffs accepted
What we knowingly gave up.

### Tradeoffs rejected
What we refused to sacrifice.

### Revisit when
Conditions that would invalidate this decision.
```

### 1.2 Worked example — Postgres via Drizzle (Build-2 M2)

| Field | Content |
|-------|---------|
| **Problem** | Demo data lost on API restart; closed-beta requires durable sessions, legal acceptance, workflows |
| **Alternatives** | (A) Continue in-memory only (B) Raw SQL in handlers (C) Drizzle + repository interface (D) External BaaS |
| **Chosen** | **(C)** `DrizzleAuthRepository` implementing existing `AuthRepository`; `MEMORY_REPO=true` for CI |
| **Accepted** | Migration complexity; single initial migration; 15-table consolidated schema |
| **Rejected** | SQL in `apps/api`; breaking repository abstraction; forcing Docker in every dev machine |
| **Revisit when** | Multi-region sharding, RLS policies require schema split, or ORM blocks performance SLO |

### 1.3 Worked example — Remove intelligence seed (Build-2 M1)

| Field | Content |
|-------|---------|
| **Problem** | Intelligence feed showed fake recommendations — violated verification-first and misled demos |
| **Alternatives** | (A) Keep seed with "demo" label (B) Remove seed; honest empty (C) Seed only in dev flag |
| **Chosen** | **(B)** Remove `ensureSeed`; recommendations only from cognitive pipeline |
| **Accepted** | Empty Command Center until user runs research analyze |
| **Rejected** | Credibility damage; category drift toward "fake AI dashboard" |
| **Revisit when** | Never for fake data — use synthetic **test fixtures** only in tests |

### 1.4 Worked example — CookieConsentBanner inside router (Preview RCA)

| Field | Content |
|-------|---------|
| **Problem** | Runtime crash: `Link` outside `RouterProvider` |
| **Alternatives** | (A) Replace `Link` with `<a href>` (B) `RootLayout` route wrapper (C) `BrowserRouter` parent |
| **Chosen** | **(B)** `RootLayout` with `Outlet` + banner — preserves SPA navigation |
| **Accepted** | All routes nested one level deeper |
| **Rejected** | Raw anchors for internal legal routes; sibling components using router hooks |
| **Revisit when** | Never — global chrome using router APIs must be inside route tree |

### 1.5 Worked example — Execution remains disabled (M4 → M5 gate)

| Field | Content |
|-------|---------|
| **Problem** | Users expect "Run workflow" to do something |
| **Alternatives** | (A) Ship minimal execution in M4 (B) Audit-only until BAR (C) Fake success message |
| **Chosen** | **(B)** `executionReady: false`; `manualRun` writes `auth_executions` audit only |
| **Accepted** | Demo friction on automation run |
| **Rejected** | Ungoverned side effects; BAR bypass; security incident surface |
| **Revisit when** | Build-2 BAR issued; B-25–B-28 closed; execution engine + tests exist |

### 1.6 Decision escalation matrix

| Impact | Required artifacts |
|--------|-------------------|
| Single file bugfix | Tests; no ADR |
| New API route in existing service | Contract update; domain service; tests |
| New package or service | ADR + BAR scope check + Project Brain chapter touch |
| New primary nav module | ADR + UXMD amendment + PDD — **frozen nav rarely changes** |
| AI provider wiring | ADR-0011 compliance; gateway only; prompt registry |
| Execution capability | ADR-0015 + BAR + B-25–B-28 + Chapter 12 review |

---

## Part 2 — Architectural Principles (Immutable)

These principles are **non-negotiable** unless CCIS or an ADR explicitly supersedes them.

---

### Principle 1: Conquest is an Intelligence Operating System

**Explanation:** Conquest is categorized as a CIOS — a governed runtime for decision superiority, not a single-feature app.

**Examples:**
- Command Center is home, not a chat thread
- Research triggers pipeline, not a completion API
- Modules are cognitive functions in one OS

**Anti-patterns:**
- Shipping a "quick chat tab" as primary UX
- Marketing Conquest as "our GPT integration"

**Historical rationale:** CCIS §I; category error caused Recovery Phase 3 ("AI wrapper" misconception).

---

### Principle 2: AI providers are interchangeable infrastructure

**Explanation:** Models are instruments behind `@conquest/ai-gateway`, not architectural anchors.

**Examples:**
- Stub providers in CI
- Future OpenAI/Anthropic adapters implement same gateway interface
- Prompt content in registry, not scattered strings

**Anti-patterns:**
- `import OpenAI from 'openai'` in `apps/web` or `services/auth`
- Hard-coding model names in domain services

**Historical rationale:** ADR-0011; provider churn and cost control.

---

### Principle 3: Deterministic reasoning and LLM reasoning complement each other

**Explanation:** Engines run deterministically today; LLM augments specific phases through gateway — never replaces verification or evidence classification.

**Examples:**
- `EvidenceEngine` → structured artifacts before any model call
- Stub gateway returns deterministic text in tests
- Verification gate independent of model fluency

**Anti-patterns:**
- "Let the model decide" without evidence refs
- Removing verification because "the model is smarter now"

**Historical rationale:** B-25–B-28 gates; testability; safety.

---

### Principle 4: Human governance supersedes autonomous execution

**Explanation:** Humans approve recommendations; BAR authorizes build waves; execution requires authorization records.

**Examples:**
- `POST .../recommendations/:id/status` — user decision
- `manualRun` audit-only until M5
- Learning boundary cannot trigger execution (ADR-0009)

**Anti-patterns:**
- Auto-execute on high confidence
- Self-modifying production from reflection output

**Historical rationale:** PDD D7; ADR-0015; incident prevention.

---

### Principle 5: Intelligence is evidence-driven

**Explanation:** Conclusions trace to classified evidence with lineage — not model confidence alone.

**Examples:**
- Recommendation detail includes `evidenceRefs`
- Research sessions hold sources before analyze
- CCIS evidence hierarchy

**Anti-patterns:**
- Prompt-only answers without EVD artifacts
- Dropping evidence to save latency

**Historical rationale:** ADR-0031; CCIS §III.

---

### Principle 6: Execution is permission-driven

**Explanation:** No side effect without explicit authorization path — future execution engine enforces this at infrastructure boundary.

**Examples:**
- `executionReady: false` in decision engine
- Workflow run creates audit row, not external action
- M5 gated on BAR

**Anti-patterns:**
- Webhook firing from intelligence feed automatically
- Background job that "helps" by executing without approval

**Historical rationale:** ADR-0015; separation of planning and execution.

---

### Principle 7: Platform layers remain modular

**Explanation:** Cache, jobs, AI, cognitive, memory compose through `createPlatformServices` — not a god object in domain.

**Examples:**
- `services/platform` composition root
- Swap Redis vs in-memory via env
- Cognitive orchestrator testable without HTTP

**Anti-patterns:**
- Importing all platform into `IdentityService`
- Circular deps between cognitive and auth

**Historical rationale:** Build-1 platform BAR; SDD layer model.

---

### Principle 8: Long-term maintainability outweighs short-term convenience

**Explanation:** Repository abstraction, contracts, ADRs, and Recovery phases exist because shortcuts compound into category drift.

**Examples:**
- Recovery Phase 2–4 doc investment
- `MEMORY_REPO` CI fallback instead of skipping persistence tests
- RootLayout fix instead of `<a href>` hack

**Anti-patterns:**
- "We'll document later"
- `ensureSeed` for demo impressiveness
- Merging without tests

**Historical rationale:** Recovery audit ~74% knowledge coverage before Phase 2.

---

## Part 3 — Decision Patterns (Designing New Features)

For every future subsystem, walk this checklist **in order**.

### 3.1 Identify ownership

| Question | Where answer lives |
|----------|------------------|
| Which SDD layer? | AMD II, SDD-I |
| Domain or platform? | `services/auth` vs `services/platform` |
| Who persists data? | `AuthRepository` / memory manager — not random tables in API |

**Rule:** Exactly one **accountable** owner per capability.

### 3.2 Identify dependencies

Draw dependency direction **downward** only:

```
Presentation → API → Domain → Platform → Infrastructure
```

**Forbidden:** Domain → Presentation; Platform → API routes.

### 3.3 Identify interfaces

- Public cross-module messages → `@conquest/contracts` (Zod)
- HTTP → documented in `api-reference.md`
- Internal service → TypeScript interface in owning service

**Never duplicate DTOs** in `apps/web` and `apps/api`.

### 3.4 Preserve modularity

New feature should be **deletable** without orphaning half the monorepo.

Test: "If we remove this module, what breaks?" — answer should be bounded.

### 3.5 Avoid duplication

Before adding logic, search:
- Existing domain service method
- Existing contract type
- Existing ADR

Extend; do not parallel-implement.

### 3.6 Maintain observability

Every new significant path emits:
- Correlation ID propagation (already middleware)
- Domain audit event where user-visible action
- Ops probe if external dependency

### 3.7 Preserve tenant isolation

Every workspace-scoped endpoint:
```typescript
assert session.orgId === workspace.orgId
assert canAccessModuleRead(role, module)
```

Future: Postgres RLS as defense-in-depth — not replacement for app checks.

### 3.8 Preserve governance

| Change type | Gate |
|-------------|------|
| Execution | BAR + B-25–B-28 |
| New primary nav | UXMD + ADR |
| Architecture | ADR |
| Build wave | BAR |

### 3.9 Preserve explainability

User-facing intelligence must answer:
- What is recommended?
- Why (evidence)?
- How confident?
- What happens if I approve?

If your feature cannot answer these, it is not intelligence — it is display.

### 3.10 Subsystem design worksheet

```markdown
| Field | Value |
|-------|-------|
| Subsystem name | |
| Owner service | |
| Contracts added | |
| Tables touched | |
| Pipeline phases used | |
| UXMD screen IDs | |
| ADR required? | |
| BAR scope? | |
| Misconception risk | |
```

---

## Part 4 — Architectural Anti-Patterns (Prohibited)

| Anti-pattern | Why prohibited | Detection |
|--------------|----------------|-----------|
| **Tight coupling** | Prevents swap, test, scale | Domain imports presentation |
| **Direct provider SDK** | Locks vendor; bypasses audit | `openai` outside `ai-gateway` |
| **Business logic in UI** | Untestable; duplicates domain | `@conquest/cognitive` in `apps/web` |
| **Business logic in infrastructure** | ORM handlers making product decisions | SQL rules in migration without service |
| **Hidden side effects** | Violates permission-driven execution | POST that silently executes |
| **Autonomous execution without governance** | Safety / legal | Learning → webhook |
| **Memory outside boundaries** | Corrupts memory lifecycle | Engine writes Postgres directly |
| **AI replaces deterministic validation** | Unverifiable releases | Skip verification when model confident |
| **Circular dependencies** | Build fragility | Package A ↔ B imports |
| **Duplicate domain ownership** | Inconsistent rules | Two services updating workflows |
| **Router hook outside RouterProvider** | Runtime crash | Sibling of `RouterProvider` |
| **Fake demo data in production path** | Trust destruction | `ensureSeed` pattern |
| **Chat-primary UX** | Category error | Free-form thread as home |
| **Scattered env parsing** | Config drift | `process.env` in features |
| **Bypassing prompt registry** | Injection / audit failure | Inline system prompts in API |
| **Skipping correlation ID** | Incident blindness | New middleware stack without observability |

**Response when detected:** Stop PR; refactor to pattern in Part 3; add regression test.

---

## Part 5 — Intelligence Design Philosophy

### 5.1 How intelligence should evolve

Future improvements MUST flow through:

| Lever | Meaning |
|-------|---------|
| **Better context** | Richer workspace state, research sources, operational signals |
| **Better memory** | Governed promotion, user corrections precedence |
| **Better evidence** | Classification, lineage, source quality |
| **Better reasoning** | Engine logic, challenge stage, multi-step inference |
| **Better confidence** | Calibration tied to evidence, not verbosity |
| **Better governance** | BAR, ADRs, verification tests |

### 5.2 How intelligence must NOT evolve

| Forbidden path | Why |
|----------------|-----|
| Replace engines with end-to-end LLM | Opaque; untestable; violates verification |
| More parameters, less structure | Loses artifact chain |
| Auto-execution on better model | Permission-driven execution unchanged |
| Self-modifying prompts in prod | Learning boundary |

### 5.3 Evolution decision tree

```
Proposed intelligence improvement
  ├─ Does it improve evidence, reasoning, verification, or memory governance?
  │    ├─ Yes → ADR if architectural → implement in platform/cognitive
  │    └─ No → Reject or reframe
  ├─ Does it bypass gateway or registry?
  │    └─ Yes → REJECT
  ├─ Does it reduce explainability?
  │    └─ Yes → REJECT
  └─ Does it require execution?
       └─ Yes → BAR + M5 path only
```

---

## Part 6 — Design Philosophy (Experience)

### 6.1 Core UX thesis

**The interface must communicate intelligence — not decoration.**

| Element | Must |
|---------|------|
| Every visual | Reduce cognitive load (GIS tokens, hierarchy) |
| Every chart | Support a decision (when built) |
| Every animation | Reinforce understanding (GIS timing tokens) — not distract |
| Every workflow | Reduce friction toward verified decision |

### 6.2 Module design philosophies

| Module | Philosophy | Today (M4) |
|--------|------------|------------|
| **Command Center** | Daily cockpit synthesizing live intelligence into decision-ready awareness — not a feed of everything | Zones bind to intelligence; honest empty |
| **Research** | Structured inquiry producing evidence — not chat | Sessions + analyze → pipeline |
| **Intelligence** | Feed of verified, approvable recommendations | Cognitive-backed; status workflow |
| **Operations** | Honest system pulse — queue, cache, providers | Live telemetry |
| **Automation** | Governed workflows — permission before action | CRUD + audit-only run |
| **Strategy** | Long-horizon planning surface (PDD) | Placeholder — no fake depth |
| **Knowledge** | Organizational memory corpus (PDD) | Placeholder — honest deferred |
| **Marketplace** | Extension ecosystem (PDD) | Placeholder — honest deferred |

**Rule for placeholders:** GIS Load state + honest copy — never fake data pretending module exists.

### 6.3 Command Center wireframe intent

```
┌─────────────────────────────────────────────────────────┐
│ PRIMARY NAV (7) — workspace context in chrome          │
├─────────────────────────────────────────────────────────┤
│ DECISION ZONES (not widgets)                            │
│  • Recommendations → actionable, evidence-backed        │
│  • Alerts → require acknowledgment or drill-down        │
│  • Status → operational truth, not vanity metrics       │
├─────────────────────────────────────────────────────────┤
│ DEEP LINKS → Intelligence, Research, Automation         │
└─────────────────────────────────────────────────────────┘
```

### 6.4 Anti-patterns in UX

- Dashboard wallpaper without decision path  
- Chat bubble as primary interaction  
- Hiding confidence or evidence  
- Fake "active" states when pipeline produced nothing  

---

## Part 7 — Project Evolution Rules

### 7.1 Introducing new modules

1. PDD module specification exists or is amended  
2. UXMD screen IDs assigned  
3. ADR for boundary impact  
4. BAR authorizes build scope  
5. Contracts in `@conquest/contracts`  
6. Domain owner in `services/auth` (typical)  
7. Project Brain chapter 05 updated  
8. Placeholder → implemented transition removes `ModulePlaceholder`  

**Never** add eighth primary nav item without ADR-0005 amendment process.

### 7.2 Retiring modules

1. ADR: deprecation rationale  
2. Migration path for data  
3. RTM rows updated  
4. Remove routes, contracts, tests in one atomic change  
5. Project Brain + KB updated same PR  

### 7.3 Migrations

- Drizzle migrations in `packages/database`  
- Single journal; no hand-edited prod without review  
- Backward-compatible expand → contract → delete pattern for risky columns  

### 7.4 Documentation evolution

| Event | Update |
|-------|--------|
| Architectural decision | ADR + optional Project Brain |
| Milestone complete | `docs/build-2/*-report.md` |
| Misconception discovered | Chapter 16 entry |
| Judgment framework change | **This chapter** |

Recovery phases exist because docs drift — **sync is part of engineering**, not optional.

### 7.5 ADR evolution

- ADRs are **immutable once Accepted** — supersede with new ADR number  
- Never edit historical ADR body to match new code  
- Link forward: "Superseded by ADR-00XX"  

### 7.6 Architectural integrity preservation

```
Code change PR
  → Constitution check (Ch 15, engineering-constitution)
  → Misconception check (Ch 16)
  → Decision framework (this chapter)
  → ADR if needed
  → Project Brain if intent changes
  → Tests
```

CI must stay green. E2E smoke for preview routes on UX changes.

---

## Part 8 — How to use this chapter (AI and human)

### Before proposing architecture

1. Read [01](./01-philosophy-and-identity.md) + [16](./16-common-misconceptions.md)  
2. Complete Part 3 worksheet  
3. Check Part 4 anti-patterns  
4. Run Part 5 evolution tree  
5. Write ADR if escalation matrix requires  

### Before claiming "done"

- [ ] Owner identified  
- [ ] No anti-pattern introduced  
- [ ] Tests prove behavior  
- [ ] Docs updated if intent changed  
- [ ] No execution without BAR  

---

*This chapter completes the Project Brain reasoning layer. Validate: [architectural-continuity-test.md](./architectural-continuity-test.md)*
