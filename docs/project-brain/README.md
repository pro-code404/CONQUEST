# Conquest Project Brain

**Supreme engineering memory of the Conquest repository.**

This folder is the **mandatory first read** for every human engineer and every AI coding agent working on Conquest — before `README.md`, before chat history, before assumptions.

---

## What this is

| This IS | This is NOT |
|---------|-------------|
| Permanent engineering memory | A short onboarding pamphlet |
| Complete reconstruction knowledge | A summary of other docs |
| Authority on *what Conquest is and how it works* | A replacement for frozen CCIS/AMD/PDD compliance text |
| The brain that survives if Cursor, ChatGPT, or any chat disappears | Documentation optimized for brevity |

**Depth is intentional.** If you need one paragraph, you are in the wrong document. If you need to rebuild Conquest in two years with no prior context, you are in the right place.

---

## Authority model

```
┌─────────────────────────────────────────────────────────────┐
│  docs/project-brain/          ← YOU ARE HERE                │
│  Supreme engineering memory · reconstruction · intent         │
└───────────────────────────┬─────────────────────────────────┘
                            │ interprets, never contradicts
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Frozen normative corpus (compliance & product law)         │
│  CCIS → AMD → PDD → UXMD → Document X → SDD → ADR → RTM     │
└───────────────────────────┬─────────────────────────────────┘
                            │ implemented as
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Codebase (apps/, packages/, services/) + build-2 state    │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** Project Brain explains *why* and *how to reconstruct*. Frozen architecture defines *what must remain true*. Code is *what exists today*. On conflict:

1. **Behavioral law** → frozen corpus wins  
2. **As-built fact** → code + Project Brain win over stale summaries  
3. **Intent and misunderstanding prevention** → Project Brain wins  

---

## Mandatory reading order

Read in sequence. Do not skip chapters because you "already know AI."

| # | Chapter | You will understand |
|---|---------|---------------------|
| 00 | [Supreme authority](./00-supreme-authority.md) | How this corpus relates to everything else |
| 01 | [Philosophy & identity](./01-philosophy-and-identity.md) | **Why Conquest is an Intelligence OS, not an AI wrapper** |
| 02 | [Vision & evolution](./02-vision-and-platform-evolution.md) | Where Conquest is going |
| 03 | [Intelligence model](./03-intelligence-model.md) | Every intelligence subsystem and how they cooperate |
| 04 | [Architectural philosophy](./04-architectural-philosophy.md) | Why packages, services, governance, execution isolation exist |
| 05 | [Product architecture](./05-product-architecture.md) | Every module, screen, journey |
| 06 | [Repository architecture](./06-repository-architecture.md) | Every directory, package, service, script |
| 07 | [Runtime architecture](./07-runtime-architecture.md) | Request flow, auth, persistence, Redis, tracing |
| 08 | [Cognitive architecture](./08-cognitive-architecture.md) | Pipeline, engines, deterministic today, LLM integration |
| 09 | [AI provider architecture](./09-ai-provider-architecture.md) | Gateway, prompts, routing, fallback |
| 10 | [Data architecture](./10-data-architecture.md) | Every table, relationship, lifecycle |
| 11 | [UX architecture](./11-ux-architecture.md) | Navigation, GIS, Command Center philosophy |
| 12 | [Governance & execution](./12-governance-and-execution-boundaries.md) | BAR, B-25–B-28, why execution is disabled |
| 13 | [Development history](./13-development-history.md) | Build-0 → Recovery Phase 3 chronology |
| 14 | [Future roadmap](./14-future-roadmap.md) | Everything remaining, gated and ungated |
| 15 | [Engineering standards](./15-engineering-standards.md) | How we build, test, secure, observe |
| 16 | [Common misconceptions](./16-common-misconceptions.md) | **Explicit false beliefs and why they are wrong** |
| 17 | [Worked examples](./17-worked-examples-and-scenarios.md) | End-to-end scenarios with sequence diagrams |

**After reading:** [Recovery Phase 3 validation](./recovery-phase-3-validation.md)

---

## Quick rejection test (30 seconds)

If you believe any of the following, **stop and read Chapter 01 and 16**:

- "Conquest is a chatbot with a dashboard"  
- "Conquest is an AI wrapper around OpenAI"  
- "The main value is calling an LLM from the API"  
- "Automation already executes workflows in production"  
- "Intelligence recommendations are seeded mock data"  

All of the above are **false** in the current authorized codebase (Build-2 M4).

---

## Corpus map (where else to look)

| Need | Path |
|------|------|
| Frozen CCIS intelligence law | [`docs/architecture/ccis.md`](../architecture/ccis.md) |
| ADRs (38 decisions) | [`docs/architecture/adr/`](../architecture/adr/) |
| Build-2 milestone truth | [`docs/build-2/README.md`](../build-2/README.md) |
| Operational KB (API catalog, packages) | [`docs/knowledge-base/`](../knowledge-base/) |
| Agent resume checklist | [`docs/knowledge-base/agent-handbook.md`](../knowledge-base/agent-handbook.md) |
| Engineering rules (never bypass…) | [`docs/knowledge-base/engineering-constitution.md`](../knowledge-base/engineering-constitution.md) |

---

## Current program state (baseline)

| Item | Value |
|------|-------|
| Build | Build-2 **M4 complete** |
| Next | M5 execution boundary — **gated, not started** |
| Tests | 278 Vitest + Playwright e2e |
| Closed-beta readiness | ~96% |
| Recovery | Phase 3 (this corpus) — **production blocker** |

---

*Project Brain — Recovery Phase 3. The repository is the permanent brain of Conquest.*
