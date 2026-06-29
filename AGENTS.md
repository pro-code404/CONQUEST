# Conquest — Chief Systems Engineer Instructions

Cursor (Kosor) operates as **Chief Systems Engineer** of Conquest — not as a code generator.

Responsibilities: architecture integrity, cognitive pipeline coherence, evolution safety, and production-grade system design. Code is an expression of architecture, not the objective.

---

## The First Law of Conquest

> **Conquest is never finished. Every interaction is an opportunity to improve the operating system. Every success strengthens future intelligence. Every mistake creates a correction. Every correction becomes permanent knowledge unless disproven.**

Conquest is a **living, self-evolving intelligence system** — not software that ships and stops.

---

## The One Principle

**Conquest is not a prompt-response application. It is a cognitive operating system.**

Every user interaction is transformed through a continuous intelligence pipeline:

```
Perceive → Understand → Reconstruct Context → Reason → Plan → Orchestrate → Verify → Execute → Reflect → Learn
```

Modules are not isolated features. They are specialized cognitive functions within a single operating system.

Every architectural decision must:

- Strengthen this pipeline
- Preserve a single source of truth
- Avoid duplicated responsibility
- Improve Conquest's ability to understand, decide, execute, and continuously evolve

If a proposed feature does not have a clear place in this pipeline, it does not belong in Conquest yet.

---

## What Conquest Is

Conquest is an **Adaptive Cognitive Intelligence Operating System (CIOS)**.

It observes, understands, researches, reasons, plans, orchestrates, verifies, executes, reflects, and evolves.

It is not a chatbot. It is not a single model. Intelligence emerges from **one continuous cognitive loop**, not from disconnected modules.

The Orchestrator is the manager. Models and engines are workers.

---

## The Conquest Cognitive Loop

Every response, automation, workflow, and project passes through all ten phases:

| Phase | Name | Question answered | Output artifact |
|-------|------|-------------------|-----------------|
| 1 | **Perception** | What exists? | `ObservationContext` |
| 2 | **Human Understanding** | Who am I helping right now? | `HumanContext` + `CommunicationStrategy` |
| 3 | **Context Reconstruction** | What is the full situation? | `ReconstructedContext` |
| 4 | **Goal Reasoning** | What is success? | `SuccessCriteria` |
| 5 | **Strategy Planning** | What should happen next? | `ExecutionPlan` |
| 6 | **Intelligence Orchestration** | Who should do the work? | `OrchestrationResult` |
| 7 | **Verification** | Is it correct? | `VerificationReport` |
| 8 | **Execution** | Can it be done? | `ExecutionResult` |
| 9 | **Reflection** | What did we learn? | `ReflectionRecord` |
| 10 | **Memory Evolution** | What should we retain? | `MemoryDelta` |

No phase may be skipped unless explicitly configured with a documented routing rule.

### Architecture trilogy

| Document | Question |
|----------|----------|
| [`docs/architecture/ccis.md`](docs/architecture/ccis.md) | What is the intelligence foundation? (**supreme authority**) |
| [`docs/architecture/cognitive-pipeline.md`](docs/architecture/cognitive-pipeline.md) | What is the nervous system? |
| [`docs/architecture/how-conquest-thinks.md`](docs/architecture/how-conquest-thinks.md) | How does Conquest think? |
| [`docs/architecture/how-conquest-evolves.md`](docs/architecture/how-conquest-evolves.md) | How does Conquest evolve? |

### Experience authority

| Document | Question |
|----------|----------|
| [`docs/uxmd/volume-i-user-experience-master-document.md`](docs/uxmd/volume-i-user-experience-master-document.md) | How should Conquest feel? |
| [`docs/uxmd/volume-iii-global-interaction-standards.md`](docs/uxmd/volume-iii-global-interaction-standards.md) | GIS — inherited interaction standards |

UI is a **Digital Command Center** per UXMD — not a generic admin dashboard. Pre-UXMD design artifacts are archived at [`docs/archive/design-pre-uxmd/`](docs/archive/design-pre-uxmd/).

---

## The Eternal Loop (Evolution)

Every interaction continues beyond output:

```
Execute → Measure → Detect Weakness → Improve → Store Improvement → Future Requests Become Better
```

Every visible response generates an **invisible evolution record**. See [`how-conquest-evolves.md`](docs/architecture/how-conquest-evolves.md).

---

## Evolution Safety Boundary

The self-improvement loop **may autonomously optimize**: routing, planning, prompts, workflows, caching, memory weighting, tool orchestration.

It **must not** autonomously rewrite or deploy production code without explicit human approval and testing.

---

## Golden Rule — One Question Per Module

| Module | Question |
|--------|----------|
| Perception | What exists? |
| Human Intelligence | Who am I helping right now? |
| Memory | What do we already know? |
| Knowledge | What is true? |
| Reasoning | What does it mean? |
| Planning | What should happen next? |
| Orchestration | Who should do the work? |
| Verification | Is it correct? |
| Execution | Can it be done? |
| Automation | Should it continue automatically? |
| Reflection | What did we learn? |
| Memory Evolution | What should we retain? |

**No module duplicates another's responsibility.**

---

## Human Understanding Engine (HUE / HIE)

HUE (Human Understanding Engine) is the **translator between humans and machines**. Also referenced as HIE. It is not an assistant and does not generate responses.

Responsibilities:

- Understand the human in the **current interaction** (never permanent labels)
- Recommend communication strategy for the planner
- Help the planner adapt explanations, questions, and recommendations
- Improve adaptation based on verified outcomes

HIE produces structured objects consumed by Planning and Orchestration:

```yaml
human_context:
  knowledge_level: advanced
  urgency: high
  trust_level: medium
  communication_style: technical
  emotional_state: calm
  objectives: [ship MVP, reduce infrastructure cost]
  constraints: [limited budget, time sensitive]

communication_strategy:
  tone: concise
  evidence_level: high
  explanation_depth: detailed
  ask_for_clarification: false
```

---

## Implementation Rules

### Pipeline first, modules second

Before adding any module, service, or feature, answer:

1. Which pipeline phase does it belong to?
2. What structured artifact does it consume and produce?
3. Does it duplicate an existing module's question?
4. Does it bypass the Orchestrator?

### Structured communication only

Services exchange typed, schema-validated messages — never free-form text between modules.

Every message includes: `requestId`, `correlationId`, `origin`, `destination`, `intent`, `payload`, `confidence`, `priority`, `timestamp`, `version`.

### No generation before planning

Phases 1–5 produce understanding and plans. Generation and domain work begin only after Strategy Planning and pass through Orchestration.

### Verification is mandatory

Nothing reaches the user without passing Verification. Failures reroute upstream — never deliver unverified output.

### Execution is the purpose

Conquest executes work — code, APIs, tasks, automations, reports. Responses are actions, not endpoints.

### Reflection is internal

Reflection never exposes raw self-critique to users. It produces optimization records for Learning and Memory Evolution.

### Memory is compression, not storage

Store patterns, goals, preferences, workflows, failures, and verified knowledge — not raw conversation archives.

---

## Governance Hierarchy

```
CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → Governance → Build Authorization → Build
```

See [ADR-0001](docs/architecture/adr/0001-document-authority-hierarchy.md) and [`docs/architecture/ARCHITECTURE-FREEZE.md`](docs/architecture/ARCHITECTURE-FREEZE.md).

**Runtime expression:** The ten-phase cognitive pipeline ([`cognitive-pipeline.md`](docs/architecture/cognitive-pipeline.md)) is subordinate to CCIS and [ADR-0007](docs/architecture/adr/0007-ccis-cognitive-lifecycle-order.md).

**Experience:** UXMD I–III + GIS + [Document X](docs/uxmd/document-x-product-experience-operational-details.md) — not archived pre-UXMD design docs.

When documents conflict, the higher layer in the chain above prevails.

**Project Brain (read first):** [`docs/project-brain/README.md`](docs/project-brain/README.md) — supreme engineering memory.

**Institutional memory (read after Project Brain Ch 18):** [`docs/institutional-memory/README.md`](docs/institutional-memory/README.md) — constitution, cognitive philosophy, domain encyclopedia.

**Build-1 authorized** per [`docs/governance/build-authorization-record-build-1-2026-06-26.md`](docs/governance/build-authorization-record-build-1-2026-06-26.md). **Build-2 M4 complete**. **M5 gated** (BAR, B-25–B-28 — not documentation). AI agents: Project Brain Chapters **01 + 16 + 18**, then [`docs/institutional-memory/07-ai-onboarding-curriculum.md`](docs/institutional-memory/07-ai-onboarding-curriculum.md).

See [`docs/institutional-memory/documentation-coverage-report.md`](docs/institutional-memory/documentation-coverage-report.md), [`docs/project-brain/architectural-continuity-test.md`](docs/project-brain/architectural-continuity-test.md), and [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md).

**Live implementation** is in `apps/`, `packages/`, and `services/`. Historical prototype code is archived at [`docs/archive/prototype/`](docs/archive/prototype/README.md) — see [`PROTOTYPE.md`](PROTOTYPE.md).

---

## Implementation standards (Build-1+)

Apply incrementally as each subsystem is built:

1. Centralize configuration and GIS tokens — no scattered colors, spacing, radii, timing, opacity, or sizing in feature code.
2. Presentation components are rendering-only; business logic, orchestration, and intelligence stay in their SDD layers.
3. Validate public inputs early; fail predictably.
4. Prefer modular, testable units over monoliths.
5. Cache or memoize expensive repeated computations.
6. Follow repository formatting, naming, and documentation conventions.
7. Avoid unnecessary global state; respect package boundaries and ENG-12.
8. Public modules document their API and export only intended surfaces.
9. Accessibility is mandatory per UXMD-III GIS (keyboard, screen readers, reduced motion, focus, contrast).
10. Design for independent testability — pure functions where practical; RTM-verifiable.

**Conquest-specific:** GIS for all visuals; no intelligence in Presentation; observability hooks on significant events; no architecture bypass — use ADR process for deficiencies.

---

## Before Writing Code

1. Identify the pipeline phase(s) affected
2. Define input/output schemas for the artifact(s)
3. Confirm Orchestrator ownership of cross-service coordination
4. Add observability (trace ID, confidence, duration) at phase boundaries
5. Ensure Verification and Reflection hooks exist

Engineering success is measured by the system's increasing ability to understand, decide, execute, and evolve — not by lines of code.
