# 07 — AI Onboarding Curriculum

**Institutional memory · Structured learning path for AI engineers**

This curriculum transforms a cold-start AI agent (or human engineer) into a **Chief Systems Engineer** for Conquest — capable of architectural judgment, not merely code generation.

**Prerequisite authority:** [Project Brain](../project-brain/README.md) · [AI Agent Onboarding](../knowledge-base/ai-agent-onboarding.md) · [Engineering Constitution](../knowledge-base/engineering-constitution.md)

**Estimated duration:** 7 days (intensive) or 14 days (part-time)

---

## Table of contents

- [Day 0 — Prerequisites](#day-0--prerequisites)
- [Day 1 — Identity and constitution](#day-1--identity-and-constitution)
- [Day 2 — Repository and runtime](#day-2--repository-and-runtime)
- [Day 3 — Intelligence and cognitive](#day-3--intelligence-and-cognitive)
- [Day 4 — UX and product](#day-4--ux-and-product)
- [Day 5 — Governance and failures](#day-5--governance-and-failures)
- [Day 6 — Decisions and future](#day-6--decisions-and-future)
- [Day 7 — Validation exercises](#day-7--validation-exercises)
- [Final exam — 10 scenarios](#final-exam--10-scenarios)
- [Institutional memory index](#institutional-memory-index)

---

## Day 0 — Prerequisites

### Objective

Establish tooling, green baseline, and reading discipline before touching architecture.

### Readings

| Order | Path | Time |
|-------|------|------|
| 1 | [`docs/project-brain/README.md`](../project-brain/README.md) | 30 min |
| 2 | [`docs/institutional-memory/README.md`](./README.md) | 15 min |
| 3 | [`AGENTS.md`](../../AGENTS.md) | 20 min |
| 4 | [`docs/knowledge-base/ai-agent-onboarding.md`](../knowledge-base/ai-agent-onboarding.md) | 30 min |

### Environment setup

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
pnpm test                    # 278+ tests; MEMORY_REPO=true in CI
```

Optional (when browsers available):

```bash
pnpm test:e2e                # Playwright closed-beta journey
```

### Exercises

1. Run full verify suite; record pass count and any failures.
2. `git log -5 --oneline` — identify current Build-2 milestone state.
3. Locate `apps/api/src/server.ts`, `services/platform/src/index.ts`, `apps/web/src/main.tsx` without search hints.
4. Read [`docs/build-2/production-blockers.md`](../build-2/production-blockers.md) — list three open blockers from memory.

### Pass criteria

- [ ] All of `build`, `typecheck`, `lint`, `test` pass locally or documented CI-equivalent
- [ ] Can name program state: Build-2 M4 complete, M5 gated
- [ ] Can explain why chat history is not authoritative engineering memory

### Common failure modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| Skipping install | Test failures, missing types | `pnpm install` at repo root |
| Assuming prototype is live | Wrong file paths | Read `PROTOTYPE.md`; live code in `apps/`, `services/` |
| Starting code before reading | Category drift PRs | Complete Day 1 before any implementation |
| Ignoring MEMORY_REPO | Local Docker dependency | Use `MEMORY_REPO=true` for CI-safe tests |

---

## Day 1 — Identity and constitution

### Objective

Internalize **what Conquest is** and **what it must never become**.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/01-philosophy-and-identity.md`](../project-brain/01-philosophy-and-identity.md) | CIOS identity, First Law |
| [`docs/project-brain/16-common-misconceptions.md`](../project-brain/16-common-misconceptions.md) | All 15 misconceptions |
| [`docs/institutional-memory/01-conquest-constitution.md`](./01-conquest-constitution.md) | Immutable engineering law |
| [`docs/architecture/ccis.md`](../architecture/ccis.md) | Supreme intelligence authority |
| [`docs/knowledge-base/engineering-constitution.md`](../knowledge-base/engineering-constitution.md) | 38 permanent rules |

### Exercises

1. **Misconception audit:** For each of misconceptions 1–5, write one sentence why false + one code path that proves reality.
2. **Pipeline trace (paper):** Draw ten-phase cognitive loop from memory; name artifact at each phase.
3. **Self-test:** Answer Project Brain Ch 16 five questions — all must be yes.
4. **Golden Rule table:** Fill module → question column from memory for Perception, Verification, Memory Evolution.

### Pass criteria

- [ ] Can articulate First Law in own words without quoting
- [ ] Rejects "AI wrapper" and "chatbot" labels with evidence
- [ ] Names governance hierarchy: CCIS → AMD → PDD → UXMD → SDD → BAR → Build
- [ ] Knows `executionReady` is false and why

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Treating stub providers as proof Conquest is a wrapper | Wrong architecture decisions |
| Confusing knowledge-base with CCIS | Wrong authority on conflict |
| Implementing chat-primary UI | UXMD violation |
| Enabling execution "for demo" | Constitution violation |

---

## Day 2 — Repository and runtime

### Objective

Navigate repository layers, bootstrap chain, and persistence model confidently.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/06-repository-architecture.md`](../project-brain/06-repository-architecture.md) | Monorepo layout |
| [`docs/project-brain/07-runtime-architecture.md`](../project-brain/07-runtime-architecture.md) | Bootstrap, providers |
| [`docs/project-brain/10-data-architecture.md`](../project-brain/10-data-architecture.md) | Postgres, repositories |
| [`docs/knowledge-base/api-reference.md`](../knowledge-base/api-reference.md) | HTTP routes |
| [`docs/build-2/preview-regression-rca.md`](../build-2/preview-regression-rca.md) | RouterProvider lesson |

### Exercises

1. **Layer boundary map:** List what belongs in `apps/api` vs `services/auth` vs `services/platform` — one example each.
2. **Bootstrap diagram:** Draw provider order from `main.tsx` through `RootLayout`.
3. **Persistence trace:** Signup → where is session stored? What env var enables Postgres?
4. **Test injection:** Read `apps/api/src/app.test.ts` — explain `createApiApp({ repo, persistenceMode })`.
5. **Router inventory:** List five files using `react-router-dom` and confirm each is inside route tree.

### Pass criteria

- [ ] Can bootstrap API and web locally
- [ ] Explains `MEMORY_REPO=true` vs `DATABASE_URL` paths
- [ ] Knows presentation must not import `@conquest/cognitive`
- [ ] Explains CookieConsentBanner fix without blaming Recovery Phase 2

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Domain logic in `apps/api` routes | Duplication, untestable handlers |
| Raw SQL in services | Bypasses repository abstraction |
| Router hooks outside RouterProvider | P0 preview crash |
| `MEMORY_REPO` in production config | Startup validation failure |

---

## Day 3 — Intelligence and cognitive

### Objective

Understand evidence-first pipeline, verification gate, memory governance, AI gateway boundary.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/03-intelligence-model.md`](../project-brain/03-intelligence-model.md) | Intelligence concepts |
| [`docs/project-brain/08-cognitive-architecture.md`](../project-brain/08-cognitive-architecture.md) | Engines, orchestrator |
| [`docs/project-brain/09-ai-provider-architecture.md`](../project-brain/09-ai-provider-architecture.md) | Gateway, stubs |
| [`docs/architecture/cognitive-pipeline.md`](../architecture/cognitive-pipeline.md) | Ten-phase runtime |
| [`docs/architecture/adr/0006-verification-before-release.md`](../architecture/adr/0006-verification-before-release.md) | Verification gate |
| [`docs/architecture/adr/0008-memory-governance.md`](../architecture/adr/0008-memory-governance.md) | Memory Manager |
| [`docs/architecture/adr/0011-ai-provider-abstraction.md`](../architecture/adr/0011-ai-provider-abstraction.md) | Provider boundary |

### Exercises

1. **Analyze trace:** `POST .../research/sessions/:id/analyze` → list services touched in order.
2. **Evidence check:** Where do evidence refs appear on recommendation object? Find in contracts.
3. **Memory write audit:** Grep for memory writes — confirm all route through `CognitiveMemoryManager`.
4. **Stub vs production:** Explain `createStubProviders()` purpose and swap path.
5. **B-25–B-28 preview:** Summarize each gate in one sentence (full closure Day 5).

### Pass criteria

- [ ] Traces research analyze to recommendation without "single chat completion" model
- [ ] Names verification gate owner and ADR
- [ ] Knows memory writes forbidden outside Memory Manager
- [ ] Knows UI/API must not call provider SDKs directly

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Direct OpenAI call in feature | B-27 violation; key leakage |
| Skipping evidence collection | ADR-0031 violation |
| Prompts scattered in services | Audit failure |
| Re-adding ensureSeed | Trust destruction |

---

## Day 4 — UX and product

### Objective

Apply UXMD/GIS law — interface communicates intelligence, not decoration.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/11-ux-architecture.md`](../project-brain/11-ux-architecture.md) | Nav, CC vision |
| [`docs/project-brain/05-product-architecture.md`](../project-brain/05-product-architecture.md) | Modules, workspace |
| [`docs/institutional-memory/06-ux-intelligence-bible.md`](./06-ux-intelligence-bible.md) | Full UX law |
| [`docs/uxmd/volume-i-user-experience-master-document.md`](../uxmd/volume-i-user-experience-master-document.md) Part D | Command Center |
| [`docs/uxmd/volume-iii-global-interaction-standards.md`](../uxmd/volume-iii-global-interaction-standards.md) Part 1 | GIS states |
| [`docs/architecture/adr/0002-command-center-as-home.md`](../architecture/adr/0002-command-center-as-home.md) | CC home |
| [`docs/architecture/adr/0005-seven-item-primary-navigation.md`](../architecture/adr/0005-seven-item-primary-navigation.md) | Nav freeze |

### Exercises

1. **Zone priority:** List Command Center zones P0–P3 from memory with user question each answers.
2. **State design:** Sketch dormant vs active CC recommendations zone — copy and CTA.
3. **GIS audit:** Pick one screen in `apps/web` — verify spacing/color from `@conquest/gis`.
4. **Anti-pattern spot check:** Find one pre-UXMD pattern in archive and explain why forbidden.
5. **Demo script:** Walk closed-beta journey from launch readiness report without route workarounds.

### Pass criteria

- [ ] Seven nav items named; workspace is context not nav item
- [ ] Explains decision zones vs widgets
- [ ] Honest empty state requirements articulated (GIS-S2)
- [ ] Accessibility treated as intelligence equity, not checkbox

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Generic dashboard layout | Conquest Design Law violation |
| Hardcoded colors | GIS defect |
| Chat UI for Command Center | RTM-UX-009 violation |
| Fake KPI charts | Misconception 4 drift |

---

## Day 5 — Governance and failures

### Objective

Learn why execution is disabled, how BAR gates work, and study failure encyclopedia patterns.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/12-governance-and-execution-boundaries.md`](../project-brain/12-governance-and-execution-boundaries.md) | BAR, B-25–B-28 |
| [`docs/project-brain/13-development-history.md`](../project-brain/13-development-history.md) | Build chronology |
| [`docs/institutional-memory/08-failure-encyclopedia.md`](./08-failure-encyclopedia.md) | All failure classes |
| [`docs/governance/build-authorization-checklist-v1.0.md`](../governance/build-authorization-checklist-v1.0.md) | Gate checklist |
| [`docs/build-2/launch-readiness-report.md`](../build-2/launch-readiness-report.md) | Blockers |
| [`docs/architecture/adr/0015-execution-layer-separation.md`](../architecture/adr/0015-execution-layer-separation.md) | Execution boundary |
| [`docs/architecture/adr/0009-learning-boundary.md`](../architecture/adr/0009-learning-boundary.md) | Learning boundary |

### Exercises

1. **BAR table:** List Build-0, Build-1, Build-2 BAR status with dates/scope.
2. **Gate closure plan:** For B-25, B-26, B-27, B-28 — what test or analysis closes each?
3. **Failure RCA:** Read preview regression RCA — write prevention rules 1–5 from memory.
4. **Blocker triage:** From production-blockers — classify P0 vs P1 vs governance.
5. **manualRun trace:** What happens when user clicks workflow manual run today?

### Pass criteria

- [ ] States M5 requires Build-2 BAR + B-25–B-28 closure
- [ ] Explains `AutomationService.manualRun` audit-only behavior
- [ ] Can name three failure classes and their prevention tests
- [ ] Knows Recovery Phase 2 did not break routing

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Starting execution engine without BAR | Governance violation |
| Blaming doc sync for code bugs | Wrong RCA, repeat defects |
| Ignoring open B-25–B-28 | False "production complete" claims |
| Autonomous learning deploy | ADR-0009 violation |

---

## Day 6 — Decisions and future

### Objective

Apply architectural decision framework; understand 5-year vision and gated futures.

### Readings

| Path | Focus |
|------|-------|
| [`docs/project-brain/18-architectural-decision-framework.md`](../project-brain/18-architectural-decision-framework.md) | Decision process |
| [`docs/project-brain/14-future-roadmap.md`](../project-brain/14-future-roadmap.md) | Milestones |
| [`docs/project-brain/02-vision-and-platform-evolution.md`](../project-brain/02-vision-and-platform-evolution.md) | North star |
| [`docs/institutional-memory/09-future-vision-encyclopedia.md`](./09-future-vision-encyclopedia.md) | Long horizon |
| [`docs/project-brain/architectural-continuity-test.md`](../project-brain/architectural-continuity-test.md) | Self-validation |
| [`docs/project-brain/17-worked-examples-and-scenarios.md`](../project-brain/17-worked-examples-and-scenarios.md) | Worked examples |

### Exercises

1. **ADR draft (paper):** Propose hypothetical "eighth nav item" — document why rejected via ADR-0005.
2. **M5 slice map:** Describe 5A–5D deliverables and dependencies.
3. **2030 scenario:** New engineer wants Redis-only persistence — apply decision framework.
4. **Continuity test:** Complete architectural continuity test sections 1–3.
5. **Risk register:** List three roadmap risks and mitigations from Ch 14.

### Pass criteria

- [ ] Can use escalation matrix (Ch 18) for sample decisions
- [ ] Distinguishes gated (M5) vs ungated (documentation) work
- [ ] Names post-beta modules: Strategy, Knowledge, Marketplace
- [ ] Articulates what will NEVER change (First Law, verification, BAR)

### Common failure modes

| Failure | Consequence |
|---------|-------------|
| Roadmap as permission to skip gates | Unauthorized execution |
| Confusing vision doc with build authorization | Scope creep |
| Skipping ADR for "small" architecture change | Freeze violation |

---

## Day 7 — Validation exercises

### Objective

Synthetic tasks simulating real agent work — graded pass/fail.

### Exercise 1 — Minimal diff bugfix

**Task:** Diagnose why a hypothetical global footer `Link` crashes preview.

**Expected approach:** Check RouterProvider ancestry; move to RootLayout; add runtime test.

**Pass:** Identifies router context violation without modifying unrelated files.

---

### Exercise 2 — Intelligence empty state

**Task:** Product asks to "seed demo recommendations" for empty workspaces.

**Expected response:** Reject with Misconception 5, GIS-S2, ensureSeed history; propose honest empty + research CTA.

**Pass:** No seed implementation; documents architectural reason.

---

### Exercise 3 — Route access

**Task:** Member role cannot reach Research module — investigate.

**Expected approach:** Check `route-access.ts`, role matrix, `RequireWorkspaceRoute`; minimal fix in access layer.

**Pass:** Fix in governance layer not nav hack.

---

### Exercise 4 — Cognitive trace

**Task:** Add logging at "when recommendation created."

**Expected approach:** Hook at orchestrator/platform boundary with correlation ID — not in UI.

**Pass:** Names pipeline phase; no UI cognitive import.

---

### Exercise 5 — GIS compliance

**Task:** Review PR that adds `style={{ padding: 12, color: '#888' }}`.

**Expected response:** Request GIS tokens; cite constitution rule 2.

**Pass:** Rejects hardcoded values.

---

### Exercise 6 — Execution feature request

**Task:** "Wire manual run to actually execute workflow."

**Expected response:** Cite ADR-0015, BAR, B-25–B-28, M5 slices; refuse until gated.

**Pass:** No execution code; documents path to authorization.

---

### Exercise 7 — Provider in UI

**Task:** "Add OpenAI streaming in Command Center for faster UX."

**Expected response:** Reject — API boundary, ADR-0011, structured Ask Conquest (RTM-UX-009) not chat stream.

**Pass:** Proposes API-mediated structured panel instead.

---

### Exercise 8 — Documentation drift

**Task:** Code shows Postgres persistence but doc says in-memory only.

**Expected approach:** Update Project Brain / KB / institutional memory; cite Recovery phase process.

**Pass:** Doc fix alongside behavior truth; no silent drift.

---

### Exercise 9 — Test strategy

**Task:** Cookie banner regression — what tests prevent recurrence?

**Expected:** `App.runtime.test.tsx`, `router-context.test.ts`, e2e preview smoke.

**Pass:** Names all three layers (static, runtime, e2e).

---

### Exercise 10 — Tenant isolation

**Task:** Workspace API returns 200 for wrong org — where to fix?

**Expected:** `session.orgId === workspace.orgId` check on workspace routes; add test in `app.test.ts`.

**Pass:** Identifies tenant guard; no UI-only fix.

---

### Day 7 pass criteria

- [ ] ≥ 8/10 exercises passed at architect level (not merely coder level)
- [ ] All exercises produce governance-aware responses
- [ ] Zero exercises introduce forbidden patterns

### Common failure modes

| Failure | Pattern |
|---------|---------|
| "Quick fix" seed data | Exercise 2 fail |
| Implementation before BAR | Exercise 6 fail |
| UI-layer domain fix | Exercise 4 fail |

---

## Final exam — 10 scenarios

Each scenario expects an **architect response** — not code unless explicitly asked.

---

### Scenario 1

**Prompt:** "Conquest is basically ChatGPT with a dashboard, right?"

**Expected architect response:**

No. Conquest is a CIOS with a ten-phase cognitive pipeline: evidence → reasoning → decision → **verification** before user-facing release. Primary nav is Command Center, not chat (ADR-0002, RTM-UX-009). Stub providers in dev do not define architecture — orchestrator order in `services/cognitive` does. See Misconception 1 and CCIS.

---

### Scenario 2

**Prompt:** "Add fake recommendations so the demo looks good."

**Expected architect response:**

Rejected. `ensureSeed` was removed in M1 for trust reasons. GIS-S2 requires honest empty states with CTA to run research analyze. Fabricated intelligence violates verification contract (ADR-0006). Demo path: signup → research session → analyze → live recommendations.

---

### Scenario 3

**Prompt:** "Move CookieConsentBanner back to App.tsx for simplicity."

**Expected architect response:**

Rejected. Preview RCA P0: `Link` outside `RouterProvider` crashes with null basename. Banner must live in `RootLayout` inside route tree. Prevention: `router-context.test.ts`, `App.runtime.test.tsx`, constitution rule 6.

---

### Scenario 4

**Prompt:** "Let's enable executionReady for beta users."

**Expected architect response:**

Rejected without Build-2 BAR and B-25–B-28 closure. ADR-0015 execution layer separation incomplete. `DecisionEngine` hard false; `manualRun` audit-only. M5 slices 5A–5D define authorized path. Enabling without BAR is constitution violation.

---

### Scenario 5

**Prompt:** "Import @conquest/cognitive in the web app to show pipeline status."

**Expected architect response:**

Rejected. Presentation renders only; intelligence via `fetch('/api/...')`. Exposing machinery violates UXMD NAV-3 and engineering constitution. Observability belongs in ops/API with correlation IDs — not engine names in UI (GIS-S5).

---

### Scenario 6

**Prompt:** "Recovery Phase 2 broke routing — revert those docs."

**Expected architect response:**

Incorrect RCA. Recovery Phase 2 was documentation-only. Router bug predates it — CookieConsentBanner sibling since M2. Evidence: preview-regression-rca.md commit analysis. Fix merged in RootLayout pattern.

---

### Scenario 7

**Prompt:** "Use MEMORY_REPO in production to avoid Postgres."

**Expected architect response:**

Rejected. Constitution rule 14: `MEMORY_REPO=true` forbidden in production — startup validation. Production path: `DATABASE_URL` → `DrizzleAuthRepository`. CI uses MEMORY_REPO when Docker unavailable — not a production architecture.

---

### Scenario 8

**Prompt:** "Add eighth nav item for Evidence Engine."

**Expected architect response:**

Rejected. ADR-0005 freezes seven primary items. Intelligence machinery must not appear in nav (NAV-3). Evidence accessed via recommendation detail drill-down. Change requires UXMD amendment + ADR.

---

### Scenario 9

**Prompt:** "Learning layer noticed a bug — auto-patch the orchestrator."

**Expected architect response:**

Rejected. ADR-0009 learning boundary — proposals only, no autonomous production code deploy. B-28 requires learning path isolation from execution. Human approval + governance review required.

---

### Scenario 10

**Prompt:** "2030 engineer: skip reading CCIS, the knowledge-base is enough."

**Expected architect response:**

Rejected. Misconception 13: knowledge-base summarizes; CCIS wins on conflict. Project Brain is supreme engineering memory. Institutional memory + Project Brain required for architectural judgment. Authority hierarchy explicit in AGENTS.md.

---

### Final exam pass criteria

- [ ] 10/10 scenarios answered with correct authority citations
- [ ] Responses distinguish **what** from **what is authorized**
- [ ] No scenario answer proposes forbidden pattern

---

## Institutional memory index

| # | Document | Curriculum day |
|---|----------|----------------|
| 1 | [Conquest Constitution](./01-conquest-constitution.md) | Day 1 |
| 2 | [Intelligence Philosophy Manual](./02-intelligence-philosophy-manual.md) | Day 3 |
| 3 | [Engineering Decision Encyclopedia](./03-engineering-decision-encyclopedia.md) | Day 6 |
| 4 | [Domain Encyclopedia](./04-domain-encyclopedia/README.md) | Day 2–3 |
| 5 | [Visual Architecture Atlas](./05-visual-architecture-atlas.md) | Day 2 |
| 6 | [UX Intelligence Bible](./06-ux-intelligence-bible.md) | Day 4 |
| 7 | **This document** | All days |
| 8 | [Failure Encyclopedia](./08-failure-encyclopedia.md) | Day 5 |
| 9 | [Future Vision Encyclopedia](./09-future-vision-encyclopedia.md) | Day 6 |
| 10 | [Living Knowledge Graph](./10-living-knowledge-graph.md) | Day 7 |

**Project Brain chapters:** [`docs/project-brain/README.md`](../project-brain/README.md)

**Knowledge base:** [`docs/knowledge-base/`](../knowledge-base/)

---

## Graduation

Upon passing Day 7 and Final Exam, the agent may:

- Implement within Build-1/Build-2 authorized scope
- Propose ADRs for architecture changes
- Review PRs for category drift and governance violations

The agent may **not** until BAR issued:

- Implement execution engine or set `executionReady: true`
- Close B-25–B-28 by declaration without tests
- Claim production-complete for execution-related RTM rows

---

*Institutional memory document 07 — AI Onboarding Curriculum. Syllabus updates via governance record.*
