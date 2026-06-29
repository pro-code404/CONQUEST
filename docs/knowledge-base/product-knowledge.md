# Product Knowledge

Cross-reference: [conquest-master-spec](./conquest-master-spec.md) · [system-overview](./system-overview.md) · [`docs/pdd/`](../pdd/) · [`docs/uxmd/`](../uxmd/)

## Mission

Conquest helps organizations **perceive, understand, reason, plan, orchestrate, verify, execute, reflect, and learn** — continuously — across research, intelligence, automation, and operations. The product home is the **Command Center** ([ADR-0002](../architecture/adr/0002-command-center-as-home.md)).

## What Conquest IS

- A **Strategic Intelligence Operating System** (CIOS)
- A **cognitive pipeline** — ten canonical phases per [CCIS](../architecture/ccis.md) and [cognitive-pipeline](../architecture/cognitive-pipeline.md)
- A **multi-tenant workspace platform** with role-based access (org → workspace context)
- A **verification-first** intelligence product — conclusions pass a verification gate before release ([ADR-0006](../architecture/adr/0006-verification-before-release.md))
- A **Digital Command Center** UX per UXMD — seven-item primary navigation ([ADR-0005](../architecture/adr/0005-seven-item-primary-navigation.md))

## What Conquest IS NOT

- A generic chatbot or single-model prompt UI
- A passive analytics dashboard with bolt-on AI
- A feature catalog exposing internal engines (Research, Memory, Models) as primary nav
- Autonomous self-modifying production code ([ADR-0009](../architecture/adr/0009-learning-boundary.md))
- Finished — the **First Law**: every interaction improves the OS

## Primary navigation (frozen)

Per UXMD and ADR-0005:

1. Command Center (home)
2. Intelligence
3. Research
4. Automation
5. Strategy Center
6. Operations
7. Settings

Workspace is **context**, not nav ([ADR-0003](../architecture/adr/0003-workspace-as-context.md)).

## Build program summary

### Build-0 (complete)

- Frozen architecture corpus (CCIS, AMD, PDD, UXMD, SDD, ADR, RTM)
- Governance CI, threat model, runbooks, BAR template
- [`docs/governance/build-authorization-record-build-0-2026-06-21.md`](../governance/build-authorization-record-build-0-2026-06-21.md)

### Build-1 (authorized, foundation shipped)

- Application shell (`apps/web`), GIS tokens, presentation components
- Platform modules: cache, jobs, AI gateway, cognitive orchestrator, memory, prompts
- Domain services in `@conquest/auth`: settings, automation, intelligence, research, legal
- [`docs/governance/build-authorization-record-build-1-2026-06-26.md`](../governance/build-authorization-record-build-1-2026-06-26.md)

### Build-2 — Integration-first (active)

**Mission:** Production readiness over feature count. Every milestone must increase demonstrability.

| Milestone | Theme | Status | Demo readiness |
|-----------|-------|--------|----------------|
| **B2-M1** | Integration fixes, route access, CC wiring | ✅ Complete | ~78% |
| **B2-M2** | Postgres persistence, legal, notifications | ✅ Complete | ~85% |
| **B2-M3** | Docker, env validation, rate limits, ops status, backup | ✅ Complete | ~92% |
| **B2-M4** | Closed-beta: Resend/SMTP, Redis jobs, Playwright e2e | ✅ Complete | ~96% |
| **B2-M5** | Execution engine (gated post-BAR) | 📋 Planned | — |

Key Build-2 deliverables: [`docs/build-2/`](../build-2/) — integration matrix, launch readiness, production blockers, implementation roadmap.

### Post–closed-beta (roadmap)

- Real automation execution (approve → execute workflows)
- Knowledge, Strategy depth, Marketplace modules (PDD placeholders)
- Billing OAuth, privacy export/deletion background jobs
- Cognitive web UI (“Ask Conquest”, RTM-UX-009)
- Distributed tracing, HA deployment model

See [conquest-master-spec](./conquest-master-spec.md#roadmap) and [`docs/build-2/implementation-roadmap.md`](../build-2/implementation-roadmap.md).

## Status labels

Use these labels in RTM, issues, and agent communication:

| Label | Meaning |
|-------|---------|
| **Implemented** | Shipped in codebase; API + UI wired; tests exist |
| **In Progress** | Active Build-2/BAR scope; partial wiring |
| **Deferred** | Specified but explicitly postponed (post-beta or gated) |
| **Planned** | In PDD/RTM; no production code yet |

### Module status (post M3/M4)

| Module | Status | Notes |
|--------|--------|-------|
| Auth & sessions | Implemented | Postgres + cookie sessions |
| Onboarding | In Progress | Steps 4–5 cosmetic; skip works |
| Command Center | Implemented | Dashboard zones; honest empty states |
| Intelligence | Implemented | Cognitive-backed via research analyze |
| Research | Implemented | Sessions, sources, analyze → cognitive |
| Automation CRUD | Implemented | Run is audit-only; execution deferred |
| Settings (18 screens) | Implemented | Account through administration |
| Legal & cookie consent | Implemented | Acceptance API; counsel review pending |
| Operations dashboard | Implemented | Queue/cache/AI provider telemetry |
| Administration | Implemented | Feature flags; admin settings nav |
| Analytics charts | Deferred | Registry + saved views; viz layer pending |
| Email (prod) | Implemented | Resend + SMTP + console; audit trail in Postgres |
| Redis job queue | Implemented | Redis with in-memory CI fallback |
| E2E demo journey | Implemented | Playwright `closed-beta-journey.spec.ts` in CI |
| Strategy / Knowledge / Marketplace | Planned | Placeholder screens |

## Target user journey (closed beta)

```
Landing → Signup → Verify email → Create workspace → Onboarding
  → Settings → Automation → Research → Intelligence → Command Center
  → Administration → Logout → Reconnect
```

Demo script: [`docs/build-2/launch-readiness-report.md`](../build-2/launch-readiness-report.md).

## Success criteria (product)

- User receives **evidence-backed** recommendations with confidence scores
- Tenant data **never** crosses org boundaries
- Legal acceptance and cookie consent **durable** in Postgres
- Session **survives** API restart when `DATABASE_URL` configured
- Operations surfaces **honest** degradation when Redis/AI providers unavailable
