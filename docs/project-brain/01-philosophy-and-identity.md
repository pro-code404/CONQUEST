# 01 — Philosophy and Identity

**Read this chapter before writing code, before choosing libraries, before proposing features.**

If you leave with one sentence, leave with this:

> **Conquest is a Strategic Intelligence Operating System (CIOS) — a governed runtime that transforms evidence into verified recommendations and human-authorized action. It is not an AI wrapper.**

---

## 1. Why Conquest exists

### The problem space

Modern organizations drown in:

| Symptom | Root cause |
|---------|------------|
| Conflicting reports | No single evidence lineage |
| "AI said so" decisions | No verification gate |
| Tool sprawl | No operating system — only apps |
| Automation without accountability | Execution not separated from reasoning |
| Research that never becomes action | No pipeline from evidence → decision |
| Dashboards that display without explaining | Presentation without intelligence architecture |

**Conquest exists to provide decision superiority** — not faster chat responses.

### What Conquest optimizes

From CCIS §I.3:

| Metric | Meaning |
|--------|---------|
| **Accuracy** | Conclusions align with verified reality |
| **Reliability** | Similar inputs → consistent quality |
| **Consistency** | Standards across domains and time |
| **Verifiability** | Every conclusion traces to evidence |
| **Outcome success** | Decisions measurably improve results |

A feature that does not improve at least one metric **does not belong** in Conquest.

### What Conquest refuses to optimize

- Conversational charm for its own sake  
- Token throughput  
- "Looks intelligent" without verification  
- Autonomous action without human authorization  
- Single-model dependency without gateway abstraction  

---

## 2. What Conquest IS

### Strategic Intelligence Operating System (CIOS)

An **operating system** provides:

- A **kernel** — cognitive pipeline orchestration  
- **System calls** — governed APIs (research analyze, intelligence feed, automation CRUD)  
- **Processes** — workspace-scoped intelligence workflows  
- **Memory subsystem** — cognitive memory manager (not raw DB writes)  
- **Security model** — tenant isolation, session model, RBAC  
- **Shell** — Command Center UX (home), not a chat thread  

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONQUEST INTELLIGENCE OS                      │
├─────────────────────────────────────────────────────────────────┤
│  UX Shell (Command Center, modules, settings)                   │
├─────────────────────────────────────────────────────────────────┤
│  Application API (Hono) — session, routing, composition only    │
├─────────────────────────────────────────────────────────────────┤
│  Domain services — auth, research, intelligence, automation   │
├─────────────────────────────────────────────────────────────────┤
│  Intelligence platform — orchestrator, engines, gateway, memory │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure — Postgres, Redis, email, observability         │
└─────────────────────────────────────────────────────────────────┘
```

### Continuous intelligence loop

Conquest does not "call GPT and return text." It runs a **loop**:

```
Observe → Understand → Research → Reason → Challenge → Verify
    → Decide → Recommend → [Execute when authorized] → Measure → Learn
```

Each stage produces **structured artifacts** (evidence refs, reasoning traces, decision records) — not prose alone.

**Source:** [CCIS §II](../architecture/ccis.md), [cognitive-pipeline.md](../architecture/cognitive-pipeline.md)

### Multi-tenant workspace platform

- **Organization** → billing, members, legal acceptance  
- **Workspace** → scope for research, intelligence, automation  
- **Roles** → GIS-defined minimum read roles per module  

Workspace is **context**, not primary navigation (ADR-0003).

### Verification-first intelligence

No major intelligence release reaches users without passing the **verification gate** (ADR-0006). Recommendations carry confidence, evidence references, and explicit status (proposed, approved, deferred).

### Human-in-the-loop by design

Users **approve** recommendations. Conquest does **not** act alone on major decisions. Execution is a **separate layer** (ADR-0015) and is **disabled** today (`executionReady: false`).

---

## 3. What Conquest IS NOT

### Not a chatbot

| Chatbot | Conquest |
|---------|----------|
| Thread is the product | Command Center is home |
| Message history drives context | Evidence + memory + workspace state |
| Output is natural language | Output is structured intelligence artifacts |
| No verification stage | Verification gate mandatory |
| User prompts model directly | User triggers governed pipelines |

There is no "Ask Conquest" free-form chat as primary UX (RTM-UX-009 specifies structured interaction when built).

### Not an AI wrapper

**An AI wrapper** is a thin application where:

1. User input → single LLM API call → display text  
2. No evidence model  
3. No verification  
4. No tenant-scoped memory governance  
5. No execution boundaries  
6. Provider SDK in the frontend or scattered in handlers  

**Conquest architecture explicitly forbids this pattern:**

| Anti-pattern | Conquest enforcement |
|--------------|---------------------|
| Direct OpenAI/Anthropic SDK in UI | UI fetches `/api/*` only |
| Direct SDK in random services | `@conquest/ai-gateway` only |
| Prompt strings in feature code | `@conquest/prompt-management` registry |
| Skip verification | `DecisionEngine` + ADR-0006 |
| Auto-execute recommendations | `executionReady: false`; audit-only `manualRun` |
| Memory writes anywhere | `CognitiveMemoryManager` only (ADR-0008) |

**The LLM is one instrument in an orchestra — not the orchestra.**

### Not an automation platform (alone)

Automation exists **inside** the intelligence OS:

- Workflows are **governed** and **approval-gated**  
- Execution engine is **separated** and **not yet live**  
- Automation without reasoning is Zapier — not Conquest  

### Not another dashboard

Dashboards **display**. Conquest **reasons, verifies, and recommends** with explainability. The Command Center synthesizes intelligence into decision-ready awareness — not chart widgets alone.

### Not finished

**First Law:** Conquest is never finished. Every interaction improves the OS. Learning proposals exist under governance (ADR-0009 learning boundary) — they do not self-modify production.

---

## 4. The category error and how to avoid it

### Why engineers mistake Conquest for an AI wrapper

| Observation | Wrong conclusion | Correct reading |
|-------------|------------------|-----------------|
| `services/ai-gateway` exists | "It's an LLM app" | Gateway is **abstraction** — swap providers without rewriting domain |
| `ResearchService.analyze` triggers cognitive | "Just prompt engineering" | Analyze runs **orchestrator** → evidence → reasoning → decision → verification |
| Stub AI providers in dev | "No real intelligence" | Stubs enforce boundary; deterministic pipeline still runs |
| React frontend | "CRUD + chat UI" | UXMD shell with 7 frozen nav items; presentation layer has **no** cognitive imports |
| `IntelligenceService` | "Mock data service" | Cognitive-backed via `IntelligenceCognitiveProvider`; empty state is **honest**, not fake |

### The decisive test

Ask: **"Where is the verification gate?"**

- AI wrapper: nowhere  
- Conquest: `DecisionEngine`, ADR-0006, recommendation status workflow  

Ask: **"Where is evidence lineage?"**

- AI wrapper: nowhere  
- Conquest: `EvidenceEngine`, research sessions, recommendation detail refs  

Ask: **"What happens on manual automation run today?"**

- AI wrapper: executes action  
- Conquest: **audit record only** — execution deferred to M5  

---

## 5. Core philosophical commitments

### Evidence before reasoning

No conclusion without classified evidence (ADR-0031). Reasoning consumes evidence artifacts — not raw user text alone.

### Orchestration routes, never concludes

The orchestration layer coordinates engines. It does not replace the reasoning or decision engines (RTM-ENG-003).

### Learning never triggers execution

Learning boundary proposals cannot directly execute (ADR-0009, RTM-ENG-004).

### Presentation is dumb

`apps/web` and `@conquest/presentation` render. They do not reason, store memory, or call providers.

### Repository is the brain

Chat is ephemeral. ADRs, Project Brain, and code are permanent. Recovery Phase 3 exists because this commitment was violated when intent lived only in conversations.

---

## 6. Identity summary table

| Dimension | Conquest identity |
|-----------|-------------------|
| **Category** | Intelligence Operating System (CIOS) |
| **Primary user surface** | Command Center (home) |
| **Primary output** | Verified, evidence-backed recommendations |
| **Primary input** | Research, workspace context, structured events |
| **AI role** | Instrument behind gateway inside pipeline |
| **Human role** | Approve, defer, modify decisions |
| **Execution** | Authorized, separated, currently disabled |
| **Tenancy** | Org → workspace isolation |
| **Evolution** | Governed learning — not autonomous rewrites |

---

## 7. Comparison matrix (for engineers from other domains)

| If you come from… | Do not import… | Instead learn… |
|-------------------|----------------|----------------|
| ChatGPT wrapper apps | "messages array to API" | Cognitive pipeline + artifacts |
| Zapier / n8n | "trigger → action" | Automation CRUD + future execution engine behind BAR |
| BI / Tableau | "charts as product" | Analytics deferred; intelligence feed is core |
| Microservices CRUD | "one service per screen" | Domain services + platform composition |
| Monolith Rails app | "fat controllers" | `apps/api` wires; logic in `services/auth` |

---

*Next: [02 — Vision & platform evolution](./02-vision-and-platform-evolution.md) · Misconceptions: [16](./16-common-misconceptions.md)*
