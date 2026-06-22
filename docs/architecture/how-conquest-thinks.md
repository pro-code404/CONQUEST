# How Conquest Thinks

## Status

**Canonical reasoning specification.** This document defines the cognitive machinery inside the Conquest pipeline — how Conquest reasons, calibrates confidence, understands humans, processes domains, and produces intelligence rather than text.

The Cognitive Pipeline ([`cognitive-pipeline.md`](cognitive-pipeline.md)) is the nervous system. This document is the mind.

---

## Core Distinction

Most AI:

```
Input → Generate → Output → End
```

Conquest never ends at output. Thinking is continuous, layered, evidence-driven, and calibrated.

Every thought passes through structured reasoning before it becomes action. Every fact carries confidence. Every domain uses the same cognitive architecture — only knowledge and tools change.

---

## The Thinking Stack

Thinking occurs primarily across pipeline phases 2–7 and 9:

```
Human Understanding (Phase 2)
      ↓
Context Reconstruction (Phase 3)
      ↓
Goal Reasoning (Phase 4)
      ↓
Strategy Planning (Phase 5)
      ↓
Multi-Layer Reasoning (Phase 6 — during Orchestration)
      ↓
Knowledge Confidence Evaluation (Phase 6–7)
      ↓
Verification (Phase 7)
      ↓
Live Reasoning Monitor (Phase 6–8 — continuous)
      ↓
Reflection (Phase 9)
```

---

## Human Understanding Engine (HUE)

Formerly referenced as HIE. Same role, expanded scope.

**Question:** Who am I helping right now?

HUE is the translator between humans and machines. It does not generate responses.

### Inferences (contextual, revisable, never permanent labels)

| Signal | Purpose |
|--------|---------|
| Expertise level | Adapt explanation depth |
| Confidence | Match evidence presentation |
| Frustration | Adjust tone and pacing |
| Curiosity | Expand or invite exploration |
| Confusion | Simplify or clarify |
| Intent | Route goal reasoning |
| Decision stage | Match communication to journey |
| Time pressure | Prioritize concision vs depth |
| Communication preference | Technical vs analogical vs visual |

### Output artifacts

```typescript
interface HumanContext {
  expertiseLevel: 'novice' | 'intermediate' | 'advanced' | 'expert';
  emotionalSignals: EmotionalSignal[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  decisionStage: string;
  trustLevel: 'low' | 'medium' | 'high';
  communicationPreference: string;
  intent: string;
  objectives: string[];
  constraints: string[];
  confidence: number;  // confidence in this assessment
  sessionScoped: true; // always true — never persist as identity
}

interface CommunicationStrategy {
  tone: string;
  evidenceLevel: 'low' | 'medium' | 'high';
  explanationDepth: 'minimal' | 'moderate' | 'detailed';
  preferredFormat: 'analogical' | 'technical' | 'visual' | 'step-by-step';
  askForClarification: boolean;
}
```

**Principle:** Adapt communication to context. Never manipulate or deceive.

---

## Knowledge Confidence Engine

**Question:** How sure are we?

Conquest never simply answers. Every important claim carries confidence derived from evidence.

### Confidence pipeline

```
Question
  ↓
Retrieve Information
  ↓
Gather Evidence
  ↓
Cross-Verification
  ↓
Confidence Score
  ↓
Decision
```

### Confidence thresholds

| Confidence | Behavior |
|------------|----------|
| ≥ 99% | Answer normally; cite evidence when appropriate |
| 80–98% | Answer with stated uncertainty; optional deeper research |
| 40–79% | Research deeper → verify again → answer or ask clarification |
| < 40% | Do not assert; search, ask clarification, or escalate |

```typescript
interface ConfidenceAssessment {
  score: number;           // 0.0 – 1.0
  evidence: Evidence[];
  contradictions: Contradiction[];
  gaps: KnowledgeGap[];
  recommendedAction: 'answer' | 'research' | 'clarify' | 'refuse';
  reasoning: string;
}
```

**Principle:** Conquest must know when it knows. It must know when it does not know. That is intelligence.

---

## Multi-Layer Reasoning

**Question:** What does it mean from every necessary angle?

Never use one reasoning path. Different questions activate different layers.

### Reasoning layers

```
Question
  ↓
Logical Analysis
  ↓
Numerical Analysis
  ↓
Business Analysis
  ↓
Psychological Analysis
  ↓
Risk Analysis
  ↓
Ethical Analysis
  ↓
Future Prediction
  ↓
Merge Results
  ↓
Unified Reasoning Artifact
```

Not every layer activates for every task. The Planner selects required layers based on goal type and domain.

```typescript
interface MultiLayerReasoningResult {
  layers: {
    logical?: LayerResult;
    numerical?: LayerResult;
    business?: LayerResult;
    psychological?: LayerResult;
    risk?: LayerResult;
    ethical?: LayerResult;
    predictive?: LayerResult;
  };
  mergedConclusion: string;
  mergedConfidence: number;
  layerConflicts: Conflict[];
  resolution: string;
}
```

---

## Predictive Intelligence Engine

**Question:** What is likely to happen, and under what conditions?

Prediction is not guessing. Prediction is modelling.

### Prediction output (always structured)

```typescript
interface Prediction {
  subject: string;
  probability: number;
  expectedRange: Range;
  confidence: number;
  risk: RiskAssessment;
  supportingEvidence: Evidence[];
  invalidationConditions: string[];  // what would prove this wrong
  assumptions: string[];
  modelInputs: Record<string, unknown>;
}
```

### Example domains

| Domain | Model inputs (examples) |
|--------|-------------------------|
| Trading | Volume, liquidity, whale movement, cycles, sentiment, macro, ETF flow, reserves, news, regulation, volatility |
| Marketing | Engagement trends, audience clusters, creative fatigue, conversion funnels, seasonality |
| Operations | Capacity, demand signals, supply chain latency, failure rates |
| Healthcare | Symptom patterns, population data, treatment outcomes (within authorized scope) |

The architecture is universal. Only inputs and domain knowledge change.

---

## Universal Domain Intelligence

**Question:** How does Conquest operate in any field?

Conquest is never hardcoded to specific industries. Every domain follows one pipeline:

```
Understand Domain
  ↓
Collect Data
  ↓
Build Knowledge Graph
  ↓
Reason (multi-layer)
  ↓
Verify
  ↓
Predict
  ↓
Recommend
  ↓
Execute
  ↓
Learn
  ↓
Improve
```

Domains include but are not limited to: trading, finance, accounting, law, marketing, programming, medicine, research, science, cybersecurity, sales, support, education, product design, operations, logistics, manufacturing.

**Only knowledge and tools swap. The cognitive architecture never redesigns.**

---

## Multi-Modal Understanding

**Question:** What signals exist beyond text?

Conquest perceives and normalizes all available modalities into unified knowledge:

| Modality | Examples |
|----------|----------|
| Text | Messages, documents, code |
| Voice | Speech, tone, pace |
| Vision | Images, video, screens, UI, whiteboards |
| Structured | Charts, graphs, tables, financial statements |
| Systems | Databases, APIs, emails, calendars, live streams |
| Physical | Gestures, pointing, facial expression (when camera available) |
| Future | Sensors, devices (where authorized and available) |

All modalities flow through **Perception (Phase 1)** and produce normalized entries in `ObservationContext`. Interpretation begins at Phase 2.

### Gesture understanding (when camera exists)

- Pointing, hand movement, eye direction
- Facial expressions, presentation gestures
- Whiteboard interaction, object selection

Purpose: reduce friction, not perform futurism.

---

## Deep Analytics Engine

**Question:** What story do the numbers tell?

Numbers never remain numbers.

### Example: social engagement

Raw: `Likes: 5000`

Deep analytics asks:

- Who liked? When? Why?
- Demographics? Conversion? Revenue impact?
- Growth trend? Engagement quality? Retention?
- Virality? Bot percentage?
- Predicted future engagement?
- Recommended actions?

```typescript
interface DeepAnalyticsResult {
  rawMetrics: Metric[];
  interpretations: Interpretation[];
  causalHypotheses: Hypothesis[];
  predictions: Prediction[];
  recommendedActions: Action[];
  confidence: number;
}
```

---

## Live Reasoning

**Question:** Is reality still true while we think?

Instead of: Think → Answer

Use: Think → Research → Verify → **Monitor** → Update → Continue

If breaking news, market shifts, or new inputs arrive while Conquest is reasoning, the answer updates before delivery.

```typescript
interface LiveReasoningMonitor {
  watchSources: DataSource[];
  refreshInterval: Duration;
  stalenessThreshold: Duration;
  onChange: (delta: ContextDelta) => void;  // triggers re-reason or re-verify
}
```

Live reasoning activates during phases 6–8 for time-sensitive domains.

---

## Failure Detection (Thinking Side)

Conquest finds its own mistakes. It does not wait for the user.

Every generated response triggers an invisible parallel evaluation:

```
Response Generated
  ↓
Verification Engine
  ↓
Confidence Score
  ↓
Weakness Detection
  ↓
Improvement Suggestions
```

Example:

- User asks: "Explain black holes"
- Answer: scientifically correct
- Weakness detected: too technical for this user's preference (analogies)
- Improvement stored for future routing and communication strategy

See [`how-conquest-evolves.md`](how-conquest-evolves.md) for how improvements persist and change behavior.

---

## Meta-Intelligence (Thinking About Thinking)

After every task, Conquest evaluates its own cognition:

- Why this reasoning path?
- Why this model?
- Why this evidence?
- Why this order?
- Could another strategy be better?
- Should this workflow be redesigned?
- Can engines merge or simplify?
- Am I wasting computation?
- Can cost decrease without accuracy loss?

Meta-intelligence produces **optimization records**, not narrative summaries. See evolution document for how records become system change.

---

## Architectural Principles (Thinking)

Every thinking subsystem must obey:

| Principle | Requirement |
|-----------|-------------|
| Truth before speed | Never sacrifice correctness for latency |
| Evidence before confidence | Important claims require verifiable evidence |
| Reason before response | Understanding precedes generation |
| Verification before delivery | Validate internally before presenting |
| Execution before completion | Task incomplete until outcome achieved or blocker identified |
| Domain independence | Same architecture, swappable knowledge/tools |
| Human-centered intelligence | Adapt without manipulating |
| Contextual inference | HUE estimates are session-scoped and revisable |

---

## Integration with the Pipeline

| Thinking subsystem | Pipeline phase(s) |
|--------------------|-------------------|
| HUE | 2, 6 (re-invoke for communication) |
| Knowledge Confidence | 6, 7 |
| Multi-Layer Reasoning | 4, 6 |
| Predictive Intelligence | 4, 6, 8 |
| Universal Domain | 3–8 |
| Multi-Modal / Gesture | 1 |
| Deep Analytics | 4, 6, 8 |
| Live Reasoning | 6–8 |
| Failure Detection | 7, 9 |
| Meta-Intelligence | 9 |

Every subsystem produces structured artifacts. None bypasses the Orchestrator.
