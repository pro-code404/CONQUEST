# Conquest Cognitive Pipeline

## Status

**Canonical runtime specification — subordinate to CCIS and [ADR-0007](adr/0007-ccis-cognitive-lifecycle-order.md).**

This document defines the ten-phase runtime loop expression. The CCIS twelve-stage loop and AMD IV §69 prevail where they differ.

---

## Core Principle

Humans do not think: Memory → Planner → Answer.

Humans think:

```
Observe → Understand → Remember → Reason → Plan → Verify → Execute → Learn → Improve
```

Conquest operates the same way — as **one continuous cognitive loop**, not fifteen independent modules.

Every response, automation, workflow, and project passes through this loop.

---

## The Ten Phases

```
User Input
      │
      ▼
┌──────────────────────────────┐
│  1. Perception               │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  2. Human Understanding      │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  3. Context Reconstruction   │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  4. Goal Reasoning           │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  5. Strategy Planning        │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  6. Intelligence Orchestration│
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  7. Verification             │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  8. Execution                │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  9. Reflection               │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│  10. Memory Evolution        │
└──────────────────────────────┘
```

Verification failure reroutes upstream (typically to Planning or Orchestration). Execution never bypasses Verification.

---

## Phase 1 — Perception

**Question:** What exists?

**Purpose:** Collect reality. No interpretation.

Conquest observes. It never assumes.

### Inputs collected

- User request
- Attachments
- Conversation history
- Workspace state
- Active tasks
- Calendar
- Tools
- Connected systems
- Environment
- Time
- Available models

### Output artifact

```typescript
interface ObservationContext {
  requestId: string;
  timestamp: string;
  rawRequest: NormalizedRequest;
  attachments: Attachment[];
  conversationSnapshot: ConversationSnapshot;
  workspace: WorkspaceState;
  activeTasks: Task[];
  calendar: CalendarContext | null;
  availableTools: ToolDescriptor[];
  connectedSystems: SystemConnection[];
  environment: EnvironmentContext;
  availableModels: ModelDescriptor[];
}
```

Nothing has been interpreted at this stage.

---

## Phase 2 — Human Understanding

**Question:** Who am I helping right now?

**Purpose:** Build a temporary, contextual model of the human — not a permanent profile.

The question is not "What did the user say?" but "Who is the user **in this moment**?"

### Human Intelligence Engine (HIE)

HIE begins here. It is the translator between humans and machines.

- Does **not** generate responses
- Does **not** duplicate Reasoning or Planning
- Produces structured context consumed by later phases

### Output artifacts

```typescript
interface HumanContext {
  knowledgeLevel: 'novice' | 'intermediate' | 'advanced' | 'expert';
  emotionalState: string;           // contextual, not permanent
  urgency: 'low' | 'medium' | 'high' | 'critical';
  decisionStage: string;            // e.g. evaluation, commitment, exploration
  trustLevel: 'low' | 'medium' | 'high';
  communicationPreference: string;  // e.g. technical, conversational
  intent: string;
  constraints: string[];
  objectives: string[];
  // All fields are session-scoped. Never persist as permanent labels.
}

interface CommunicationStrategy {
  tone: string;
  evidenceLevel: 'low' | 'medium' | 'high';
  explanationDepth: 'minimal' | 'moderate' | 'detailed';
  askForClarification: boolean;
}
```

---

## Phase 3 — Context Reconstruction

**Question:** What is the full situation?

**Purpose:** Reconstruct reality before reasoning begins. Most AI skips this; Conquest must not.

### Questions answered

- What project is this part of?
- What goals exist?
- What decisions already happened?
- What assumptions already exist?
- What tasks are already complete?
- What tools are available?
- What memories are relevant?
- What external data matters?

### Output artifact

```typescript
interface ReconstructedContext {
  project: ProjectContext | null;
  activeGoals: Goal[];
  priorDecisions: Decision[];
  existingAssumptions: Assumption[];
  completedTasks: Task[];
  relevantMemories: MemoryReference[];
  externalData: ExternalDataReference[];
  toolAvailability: ToolAvailability;
}
```

Memory retrieval occurs here (and may be expanded during Orchestration).

---

## Phase 4 — Goal Reasoning

**Question:** What is success?

**Purpose:** Define success criteria — not "what answer should I generate?"

### Success types

| Type | Description |
|------|-------------|
| Explain | Clarify or teach |
| Research | Gather and synthesize evidence |
| Decide | Choose among options with justification |
| Create | Produce artifacts (content, code, designs) |
| Execute | Perform actions in the world |
| Automate | Set up recurring or triggered workflows |
| Collaborate | Coordinate with humans or systems |
| Monitor | Watch conditions and report |
| Learn | Update knowledge from new information |
| Predict | Forecast with confidence and assumptions |

### Output artifact

```typescript
interface SuccessCriteria {
  primaryGoal: SuccessType;
  secondaryGoals: SuccessType[];
  measurableOutcomes: Outcome[];
  constraints: Constraint[];
  confidenceRequired: number;  // 0.0 – 1.0
  timeBudget: Duration | null;
}
```

---

## Phase 5 — Strategy Planning

**Question:** What should happen next?

**Purpose:** Determine approach. **No generation happens yet. Only planning.**

### Planner decisions

- Research?
- Delegate to specialist?
- Use memory?
- Use another model?
- Ask clarifying questions?
- Verify first?
- Call tools?
- Execute directly?
- Wait?

### Output artifact

```typescript
interface ExecutionPlan {
  planId: string;
  steps: PlanStep[];
  requiredEngines: EngineRequirement[];
  parallelizable: boolean;
  estimatedDuration: Duration;
  fallbackStrategy: FallbackStrategy;
  humanContextApplied: boolean;
  communicationStrategy: CommunicationStrategy;
}
```

---

## Phase 6 — Intelligence Orchestration

**Question:** Who should do the work?

**Purpose:** The operating system activates engines. Models are workers; CIOS is the manager.

### Engine activation examples

| Need | Engine |
|------|--------|
| Research | Research Engine |
| Reasoning | Reasoning Engine |
| Code | Code Engine |
| Automation | Automation Engine |
| Memory | Memory Engine |
| Communication optimization | Human Intelligence Engine |
| Verification | Verification Engine |

The Orchestrator is the **only** component that coordinates cross-engine execution.

### Output artifact

```typescript
interface OrchestrationResult {
  correlationId: string;
  engineOutputs: EngineOutput[];
  aggregatedConfidence: number;
  executionLog: ExecutionLogEntry[];
  traceId: string;
}
```

---

## Phase 7 — Verification

**Question:** Is it correct?

**Purpose:** Nothing leaves Conquest unchecked.

### Checks

- Is it factual?
- Is it complete?
- Is it internally consistent?
- Does it violate constraints?
- Does it conflict with memory?
- Does it satisfy the user's goal?
- Is it executable?

**If not → reroute upstream.** Never deliver unverified output.

### Output artifact

```typescript
interface VerificationReport {
  passed: boolean;
  checks: VerificationCheck[];
  confidence: number;
  rerouteTo: PipelinePhase | null;
  refinementInstructions: string | null;
}
```

---

## Phase 8 — Execution

**Question:** Can it be done?

**Purpose:** Conquest begins real work here. Most AI stops before this.

### Execution examples

- Write code
- Call APIs
- Create tasks
- Update projects
- Notify team
- Generate reports
- Schedule meetings
- Monitor events
- Deploy applications
- Create automations

**Responses become actions.**

### Output artifact

```typescript
interface ExecutionResult {
  result: unknown;
  confidence: number;
  evidence: Evidence[];
  executionLog: ExecutionLogEntry[];
  validationStatus: 'pending' | 'verified' | 'failed';
  actionsPerformed: Action[];
}
```

---

## Phase 9 — Reflection

**Question:** What did we learn?

**Purpose:** Internal improvement after acting. **Never exposed to users.**

### Questions

- Was the goal achieved?
- What worked?
- What failed?
- What assumptions were wrong?
- Should the workflow improve?
- Should prompts improve?
- Should routing improve?
- Should automation improve?

### Output artifact

```typescript
interface ReflectionRecord {
  goalAchieved: boolean;
  successes: string[];
  failures: string[];
  wrongAssumptions: string[];
  optimizationActions: OptimizationAction[];
  routingRecommendations: RoutingRecommendation[];
}
```

---

## Phase 10 — Memory Evolution

**Question:** What should we retain?

**Purpose:** Memory is compression, not storage.

### Store

- Patterns
- Goals
- Preferences
- Relationships
- Successful workflows
- Failures
- Verified knowledge
- Long-term projects
- Decision history

### Do not store

- Raw conversation archives
- Redundant or low-value information
- Permanent human labels from HIE

### Output artifact

```typescript
interface MemoryDelta {
  stores: MemoryStoreUpdate[];
  patternsExtracted: Pattern[];
  workflowsRecorded: WorkflowRecord[];
  knowledgeVerified: VerifiedKnowledge[];
  expiredEntries: string[];
}
```

---

## Mapping to engineering layers (legacy reference)

> **Superseded mapping.** WDD/WSDD nomenclature is retired. Authoritative deployment expression: SDD I–V, AMD IV §69, SDD-IV.

| Pipeline phase | Engineering layer | SDD expression |
|----------------|-------------------|----------------|
| 1. Perception | Experience / ingress | SDD-I L1 |
| 2. Human Understanding | Intelligence | SDD-IV |
| 3. Context Reconstruction | Intelligence + Data | SDD-II |
| 4. Goal Reasoning | Intelligence | SDD-IV |
| 5. Strategy Planning | Intelligence | SDD-IV |
| 6. Orchestration | Orchestration | SDD-IV, SDD-I |
| 7. Verification | Intelligence | SDD-II §5.6, ADR-0006 |
| 8. Execution | Execution L5E | SDD-I, ADR-0015 |
| 9. Reflection | Intelligence | SDD-IV |
| 10. Memory Evolution | Data / Memory | AMD III, SDD-II IL-2 |

The pipeline is a subordinate runtime expression. CCIS and ADR-0007 define canonical stage order.

---

## Reroute Rules

| Condition | Reroute to |
|-----------|------------|
| Verification failed — factual gap | Phase 6 → Research Engine |
| Verification failed — plan inadequate | Phase 5 → Strategy Planning |
| Verification failed — goal misunderstood | Phase 4 → Goal Reasoning |
| Verification failed — context incomplete | Phase 3 → Context Reconstruction |
| Verification failed — human misread | Phase 2 → Human Understanding |
| Low confidence before planning | Phase 6 → Research Engine (pre-execution) |

All reroutes emit telemetry and increment reroute counters for Optimization.

---

## Related specifications

| Document | Question |
|----------|----------|
| This document | What is the nervous system? |
| [`how-conquest-thinks.md`](how-conquest-thinks.md) | How does Conquest think? |
| [`how-conquest-evolves.md`](how-conquest-evolves.md) | How does Conquest evolve? |

Phases 9–10 connect directly to the Evolution Engine. See [`how-conquest-evolves.md`](how-conquest-evolves.md).
