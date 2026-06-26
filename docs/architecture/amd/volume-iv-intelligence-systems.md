# AMD VOLUME IV — COGNITIVE & INTELLIGENCE SYSTEMS ARCHITECTURE

## Document Authority

| Field | Value |
|-------|-------|
| **Title** | AMD Volume IV — Cognitive & Intelligence Systems Architecture |
| **Status** | Architectural Authority — Under Construction |
| **Version** | 1.0 |
| **Supreme Authority** | Conquest Core Intelligence Specification (CCIS) |
| **Subordinate To** | CCIS only |
| **Builds Upon** | AMD Volume I, AMD Volume II, AMD Volume III |
| **Defers To** | AMD Volume V (Platform), AMD Volume VII (UX/UI) for user-facing surfacing |

### Authority clause

If CCIS defines **what Conquest believes**, and the AMD corpus defines **what Conquest is**, then this volume defines **how Conquest actually thinks**.

No intelligence engine, agent, workflow, menu item, workspace, or product surface may be designed or implemented unless it conforms to this volume.

This volume does **not** define code, databases, APIs, infrastructure, landing pages, dashboards, or visual design. Those belong to later AMD volumes and the implementation phase, which has **not** started.

### Foundational distinction

```
Most systems:  Input → Generate → Output → End

Conquest:      Observe → Understand → Research → Reason → Challenge →
               Verify → Decide → Recommend → Execute → Measure →
               Learn → Improve → (continuous)
```

Intelligence systems are **not products**. They are **cognitive organs** inside Layer 3 — Cognitive Layer. Products and workspaces (AMD Volume V) **consume** intelligence outputs. They do not **be** intelligence systems.

---

# 50.0 COGNITIVE ARCHITECTURE PURPOSE

## What this volume governs

This volume defines every specialized intelligence system inside Conquest — its purpose, responsibilities, inputs, outputs, boundaries, prohibitions, pipeline position, and relationship to agents and memory.

## What Conquest thinking is

Conquest thinking is:

- **Continuous** — not a single inference pass
- **Layered** — specialized intelligences with defined accountability
- **Evidence-driven** — not fluency-driven
- **Adversarial** — every conclusion must survive challenge
- **Calibrated** — confidence earned, not assumed
- **Inspectable** — reasoning chains and evidence lineage preserved
- **Strategic** — oriented toward decision superiority, not answer generation

## What Conquest thinking is not

Conquest thinking is **not**:

- Text generation
- Search with summarization
- Single-model inference
- Conversational continuity without resolution
- Confidence theater
- Manipulation or deception

## Primary objective

Transform information into **decision-grade intelligence** — structured, verified, challenged, calibrated, and actionable.

---

# 51.0 COGNITIVE LAYER POSITION

All intelligence systems defined in this volume belong to **Layer 3 — Cognitive Layer** (AMD Volume II §14.0).

| Layer | Relationship to Cognitive Layer |
|-------|--------------------------------|
| **Layer 1 — Experience** | Captures requests; presents outcomes. Never reasons. |
| **Layer 2 — Orchestration** | Routes to intelligence systems. Never reasons. |
| **Layer 3 — Cognitive** | **This volume.** Transforms information into intelligence. |
| **Layer 4 — Execution** | Acts on approved intelligence. Does not reason. |
| **Layer 5 — Memory** | Preserves intelligence (AMD Volume III). Cognitive Layer reads via governed retrieval. |
| **Layer 6 — Learning** | Improves intelligence quality over time. Receives proposals from Reflection and Learning Intelligence. |

**Rule:** No intelligence system may bypass Orchestration for entry or bypass Verification for release of major conclusions.

---

# 52.0 INTELLIGENCE SYSTEM PRINCIPLES

Every intelligence system must adhere to:

| Principle | Requirement |
|-----------|-------------|
| **Single accountability** | One primary purpose per system |
| **Structured output** | Produces artifacts, not prose alone |
| **Evidence lineage** | Outputs traceable to inputs and sources |
| **Confidence declaration** | Major outputs carry calibrated confidence |
| **Boundary respect** | No system assumes another system's responsibilities |
| **Auditability** | Operations logged for observability and learning |
| **Non-deception** | Never present uncertainty as fact |
| **Decision utility** | Output must improve a decision or explicitly flag inability to do so |

## Intelligence system catalog

| # | Intelligence System | Primary question |
|---|---------------------|------------------|
| 1 | Understanding Intelligence | What does the user actually want? |
| 2 | Context Intelligence | What is the full situation? |
| 3 | Research Intelligence | What evidence exists and what is missing? |
| 4 | Evidence Intelligence | How good is the evidence? |
| 5 | Reasoning Intelligence | What explanations are possible? |
| 6 | Challenge Intelligence | Can the reasoning survive criticism? |
| 7 | Prediction Intelligence | What is likely, with what probability? |
| 8 | Strategic Intelligence | What opportunities, threats, and leverage exist? |
| 9 | Human Intelligence | Who is being served and how should intelligence be communicated? |
| 10 | Verification Intelligence | Are facts, logic, and assumptions valid? |
| 11 | Reflection Intelligence | What was right, wrong, and improvable? |
| 12 | Learning Intelligence | What should improve for future decisions? |
| 13 | Planning Intelligence | What sequence of actions achieves the goal? |
| 14 | Decision Intelligence | Which option is strongest under governance scores? |
| 15 | Optimization Intelligence | How can intelligence quality and efficiency improve? |

Systems 1–12 are **core cognitive intelligences**. Systems 13–15 are **synthesis and governance intelligences** that integrate core outputs.

---

# 53.0 UNDERSTANDING INTELLIGENCE

## Purpose

Understand what the user **actually wants** — not what they typed.

Understanding Intelligence interprets intent beneath surface language. It does not answer. It does not reason. It does not research. It **comprehends**.

## Primary question

> What is the user really asking for, in what context, with what urgency, and toward what decision?

## Responsibilities

- Parse literal request and implicit intent
- Identify business, personal, or operational context
- Detect urgency and risk level
- Surface hidden objectives the user may not have stated
- Determine decision requirement type (inform, analyze, decide, execute, monitor)
- Identify ambiguity requiring clarification before research
- Classify request domain and stakes
- Produce structured comprehension — never conversational response

## Example

**User input:** "My sales are dropping."

**Understanding Intelligence extracts:**

| Dimension | Structured extraction |
|-----------|----------------------|
| Business context | Revenue performance concern |
| Problem type | Sales decline |
| Urgency | Elevated — implies time sensitivity |
| Risk level | Revenue and business health risk |
| Hidden objective | Likely seeks cause diagnosis and corrective action path |
| Decision requirement | Analyze → diagnose → recommend → possibly execute |
| Ambiguity flags | Time period undefined; scope undefined (product, channel, region) |
| Clarification need | May require before high-confidence research |

## Inputs

- Raw user request (all modalities via Observation)
- Session context
- User Memory (governed retrieval)
- Organization context
- Prior conversation snapshot

## Outputs

Structured **Understanding Artifact**:

- Stated request
- Inferred intent (with confidence)
- Domain classification
- Stakes level (low / medium / high / critical)
- Urgency assessment
- Decision type required
- Hidden objectives (hypothesis list with confidence)
- Ambiguity register
- Clarification recommendations
- Routing recommendation to Orchestration

## Prohibitions

Understanding Intelligence must **not**:

- Generate answers or recommendations
- Conduct research
- Assign Verified Fact status to inferences
- Persist psychological labels as permanent User Memory
- Manipulate or exploit detected emotional state

## Pipeline position

**Understand** stage — immediately after **Observe**, before **Context Expansion**.

## Agent binding

Understanding Agent operates under Understanding Intelligence authority. Agent outputs must conform to Understanding Artifact schema.

## Failure modes

| Failure | Classification |
|---------|----------------|
| Misread intent | Context Failure |
| Missed urgency | Context Failure |
| Over-inferred hidden objective without confidence | Reasoning Failure (upstream contamination) |
| Proceeded without flagging ambiguity | Context Failure |

---

# 54.0 CONTEXT INTELLIGENCE

## Purpose

Reconstruct the **full situation** before reasoning and research proceed at scale.

Understanding Intelligence comprehends the request. Context Intelligence reconstructs the world around it.

## Primary question

> What is the complete situational reality relevant to this intelligence cycle?

## Responsibilities

- Assemble workspace, project, and organizational state
- Integrate retrieved memories (via Memory Layer governed retrieval)
- Identify active goals, constraints, and dependencies
- Map relevant Business Memory Graph entities and relationships
- Identify what changed since last intelligence cycle
- Surface situational gaps for Research Intelligence
- Produce unified situational model

## Inputs

- Understanding Artifact
- Memory retrieval results (User, Project, Organization, Session, Graph)
- Observation context (systems, calendar, workspace, connected data)
- Active workflow state from Orchestration

## Outputs

Structured **Context Artifact**:

- Situation summary
- Active goals and constraints
- Relevant entities and relationships (graph references)
- Environmental state
- Change detection (what is new)
- Context confidence score
- Identified context gaps → Research Intelligence

## Prohibitions

Context Intelligence must **not**:

- Reason about causes or solutions
- Verify evidence
- Make predictions
- Execute actions

## Pipeline position

**Context Expansion** stage — after **Understand**, before **Memory Retrieval** (full) and **Research**.

## Relationship to Volume III

All memory access occurs through Memory Layer governed retrieval per AMD Volume III §41.0. Context Intelligence requests retrieval; it does not own stores.

---

# 55.0 RESEARCH INTELLIGENCE

## Purpose

Determine what information exists, what is missing, and what must be collected.

**Research is not search.**

Research is **evidence acquisition** — purposeful, scoped, ranked, and terminable.

## Primary question

> What evidence do we have, what evidence do we need, and how do we acquire it?

## Responsibilities

- Inventory existing evidence (Memory, Knowledge, Evidence stores, graph)
- Identify evidence gaps blocking confident reasoning
- Select research sources per Live Intelligence layer rules
- Acquire evidence from approved internal and external sources
- Terminate research when confidence threshold met, resource limit reached, or user-directed completion required
- Produce evidence portfolio for Evidence Intelligence evaluation
- Never present raw search results as conclusions

## Research is not

| Research is | Research is not |
|-------------|-----------------|
| Evidence acquisition | Keyword search with summary |
| Gap-driven | Open-ended browsing |
| Confidence-terminable | Infinite retrieval |
| Source-ranked | First-result bias |
| Auditable | Black-box retrieval |

## Inputs

- Understanding Artifact
- Context Artifact
- Research gap register
- Organization-approved source authorities
- Live Intelligence layer assignments
- Resource constraints from Orchestration

## Outputs

Structured **Research Artifact**:

- Evidence acquired (with source attribution)
- Evidence gaps remaining
- Sources consulted
- Research completeness score
- Termination reason (threshold / resource / user)
- Recommended additional research (if incomplete)
- Handoff to Evidence Intelligence

## Research sources

Per AMD Volume II §21.0 and Live Intelligence layers:

- Internal Knowledge and Knowledge Memory
- Memory stores (all governed categories)
- Historical cases and Success/Failure Memory
- Documentation and approved databases
- Approved APIs and external sources
- Business Memory Graph traversals
- Real-time feeds (where authorized and relevant)

## Termination conditions

Research ends when:

1. **Confidence threshold achieved** — sufficient evidence for next pipeline stage
2. **Resource constraints reached** — time, cost, or depth limits hit
3. **User-directed completion required** — user or policy forces proceed

Research that terminates on resource constraints must flag incomplete evidence in all downstream artifacts.

## Prohibitions

Research Intelligence must **not**:

- Evaluate evidence quality (Evidence Intelligence)
- Generate explanations (Reasoning Intelligence)
- Present findings as answers
- Use unapproved sources without audit flag

## Pipeline position

**Research** stage — after context and memory retrieval, before **Reason**.

## Agent binding

Research Agent operates under Research Intelligence. Multiple Research Agents may run in parallel on disjoint evidence gaps under Orchestration coordination.

---

# 56.0 EVIDENCE INTELLIGENCE

## Purpose

Evaluate evidence quality before reasoning and verification consume it.

Evidence Intelligence is the **gatekeeper of evidentiary integrity**. No major conclusion may proceed on unscored evidence.

## Primary question

> How good is this evidence — and what may it support?

## Responsibilities

- Score every evidence item on required dimensions
- Assign CCIS evidence class (Verified Fact through Hypothesis)
- Detect conflicts between evidence items
- Flag stale or expired evidence
- Compute composite evidence portfolio quality
- Block or downgrade evidence below minimum thresholds
- Produce evidence quality report for Reasoning and Verification

## Scoring dimensions

Every evidence item must be scored on:

| Dimension | Definition |
|-----------|------------|
| **Freshness** | How current is this evidence? |
| **Source reliability** | Historical accuracy and authority of source |
| **Completeness** | Does this evidence fully address the claim it supports? |
| **Consistency** | Does it agree with corroborating evidence? |
| **Relevance** | Does it apply to the current decision context? |

Composite evidence score feeds confidence governance per AMD Volume II §22.0 and Volume III §42.0.

## Inputs

- Research Artifact (evidence portfolio)
- Source reliability history from Memory
- CCIS evidence classification rules
- Freshness requirements for decision class

## Outputs

Structured **Evidence Assessment Artifact**:

- Per-item scores (freshness, reliability, completeness, consistency, relevance)
- Evidence class assignment per item
- Conflict register
- Stale evidence flags
- Portfolio composite score
- Permitted evidentiary uses (what conclusion types this evidence may support)
- Blocked items with reasons

## Prohibitions

Evidence Intelligence must **not**:

- Generate explanations or recommendations
- Resolve conflicts by silent merging
- Promote evidence class without meeting promotion criteria
- Accept evidence without source attribution

## Pipeline position

Concurrent with and immediately following **Research**; mandatory input to **Reason** and **Verify**.

## Relationship to Evidence Memory

Validated evidence assessments are persisted to Evidence Memory per AMD Volume III §34.0.

---

# 57.0 REASONING INTELLIGENCE

## Purpose

Generate **possible explanations** — not answers.

Reasoning Intelligence produces competing hypotheses, causal models, and structured inference chains. It does not select the final recommendation. It does not communicate to users.

## Primary question

> What explanations are consistent with the evidence?

## Responsibilities

- Generate multiple competing hypotheses
- Build structured argument chains from evidence to inference
- Apply domain-appropriate reasoning modes (logical, numerical, causal, comparative, probabilistic)
- Explicitly declare assumptions
- Quantify uncertainty at each inference step
- Produce ranked candidate conclusions — not a single answer
- Hand off all candidates to Challenge Intelligence

## Reasoning process

Per AMD Volume II §20.0:

```
Generate hypotheses
   ↓
Structure argument chains
   ↓
Apply reasoning layers (as required by domain)
   ↓
Declare assumptions
   ↓
Rank candidates by preliminary strength
   ↓
Output candidate set → Challenge Intelligence
```

## Reasoning layers (activated as required)

Not every layer activates for every task. Orchestration and Planning Intelligence select required layers.

| Layer | Application |
|-------|-------------|
| Logical | Validity of inference structure |
| Numerical | Quantitative relationships and calculations |
| Business | Commercial and operational implications |
| Causal | Cause-effect chains |
| Comparative | Alternatives and trade-offs |
| Probabilistic | Uncertainty and distributions |
| Temporal | Sequences, trends, and timing |
| Ethical | Values and policy alignment |

## Inputs

- Evidence Assessment Artifact
- Context Artifact
- Understanding Artifact
- Domain module parameters (AMD Volume II §21.0)

## Outputs

Structured **Reasoning Artifact**:

- Candidate hypotheses (multiple)
- Argument chain per hypothesis
- Assumption register per hypothesis
- Preliminary confidence per hypothesis
- Evidence linkage per inference step
- Reasoning layer activation record
- Known gaps per hypothesis

## Prohibitions

Reasoning Intelligence must **not**:

- Present a single answer without alternatives
- Skip assumption declaration
- Use evidence below permitted class for hypothesis strength claimed
- Communicate directly to users
- Bypass Challenge Intelligence

## Pipeline position

**Reason** stage — after Research and Evidence assessment, before **Challenge**.

## Critical distinction

```
Answer generation:     One output, fluent, final

Reasoning Intelligence: Multiple hypotheses, structured, provisional
```

---

# 58.0 CHALLENGE INTELLIGENCE

## Purpose

Attack reasoning.

Challenge Intelligence is one of the **largest Conquest differentiators**. Every conclusion must survive criticism before it proceeds.

## Primary question

> Why might each hypothesis be wrong?

## Responsibilities

- Adversarially test every candidate hypothesis from Reasoning Intelligence
- Generate alternative explanations not yet considered
- Search for disconfirming evidence
- Search for missing evidence that would change conclusions
- Compare against historical cases and base rates
- Detect cognitive shortcuts (anchoring, confirmation bias, recency bias)
- Eliminate hypotheses that fail challenge
- Rank surviving hypotheses by post-challenge strength
- Produce challenge report with residual risks

## Challenge process

Per CCIS §IV:

| Step | Action |
|------|--------|
| 1 | State each candidate hypothesis |
| 2 | Generate disconfirming scenarios |
| 3 | Search for missing evidence |
| 4 | Compare to historical base rates |
| 5 | Detect reasoning biases |
| 6 | Eliminate failed hypotheses |
| 7 | Rank survivors |
| 8 | Document residual risk per survivor |

## Challenge intensity scaling

| Factor | Effect on challenge depth |
|--------|--------------------------|
| Decision stakes | Deeper challenge at higher stakes |
| Reversibility | Deeper challenge for irreversible actions |
| Confidence gap between alternatives | Deeper when alternatives are close |
| Domain volatility | Deeper in volatile domains |

## Inputs

- Reasoning Artifact (all candidates)
- Evidence Assessment Artifact
- Failure Memory (similar past failures)
- Historical case memory

## Outputs

Structured **Challenge Artifact**:

- Eliminated hypotheses with elimination reasons
- Surviving hypotheses ranked
- Disconfirming evidence sought per survivor
- Residual risk flags
- Challenge intensity applied
- Recommendation for additional research (if survivors are weak)

## Prohibitions

Challenge Intelligence must **not**:

- Be skipped for major conclusions
- Accept surviving hypotheses without documented challenge pass
- Generate user-facing communication
- Collapse multiple survivors into one without Decision Intelligence

## Pipeline position

**Challenge** stage — after **Reason**, before **Plan** and **Verify**.

## Distinction from Reflection Intelligence

| Challenge Intelligence | Reflection Intelligence |
|------------------------|-------------------------|
| Pre-release adversarial test | Post-completion review |
| Tests hypotheses before decision | Reviews outcomes after execution |
| Eliminates weak reasoning | Extracts lessons for learning |

## Distinction from Critique (AMD Volume II §18.0)

If **Critique** appears as a separate pipeline stage, Critique is subordinate to Challenge Intelligence for pre-release adversarial review. Critique must not duplicate Challenge without defined scope separation. **Challenge owns pre-release adversarial testing.**

---

# 59.0 PREDICTION INTELLIGENCE

## Purpose

Generate **probability assessments** — not guesses, not forecasts presented as facts.

Prediction Intelligence produces evidence-based projections with explicit probability, assumptions, and invalidation conditions.

## Primary question

> What is likely to happen, under what conditions, with what confidence?

## Responsibilities

- Build probabilistic models from evidence and historical data
- Produce probability distributions — not point guesses
- Declare all assumptions explicitly
- Define invalidation conditions (what would prove the prediction wrong)
- Define validation timeline and measurement plan
- Distinguish predictions from verified facts in all outputs
- Revise predictions when material evidence changes
- Analyze prediction failures for calibration learning

## Prediction is not

| Prediction is | Prediction is not |
|---------------|-------------------|
| Evidence-based probability assessment | Guess |
| Assumption-explicit | Trend extrapolation alone |
| Invalidation-defined | Certainty theater |
| Calibrated to historical accuracy | Fluent forecast prose |
| Labeled as Prediction | Presented as fact |

## Inputs

- Evidence Assessment Artifact
- Reasoning Artifact (surviving hypotheses)
- Challenge Artifact
- Historical outcome data from Memory
- Domain model parameters
- Strategic Intelligence context (where applicable)

## Outputs

Structured **Prediction Artifact**:

- Subject of prediction
- Probability or distribution
- Confidence score
- Time horizon
- Key assumptions
- Supporting evidence references
- Invalidation conditions
- Validation plan and timeline
- Risk assessment
- Evidence class: **Calculated Prediction** (never higher)

## Prohibitions

Prediction Intelligence must **not**:

- Present predictions as Verified Facts
- Produce predictions without invalidation conditions
- Omit assumptions
- Bypass Evidence Intelligence scoring on inputs

## Pipeline position

Activated during **Reason** and **Plan** stages when forward-looking assessment is required. Predictions must pass **Verify** before inclusion in recommendations.

## Relationship to Strategic Intelligence

Strategic Intelligence identifies opportunities and threats. Prediction Intelligence quantifies likelihood and timing. Both produce structured artifacts; neither communicates to users directly.

---

# 60.0 STRATEGIC INTELLIGENCE

## Purpose

Determine opportunities, threats, dependencies, leverage points, competitor weaknesses, and growth paths.

Strategic Intelligence is the system that makes Conquest feel like a **strategist** instead of a chatbot.

## Primary question

> What structural forces, opportunities, and risks shape this decision landscape?

## Responsibilities

Per CCIS §V, identify and model:

- Goals and goal conflicts
- Constraints and dependencies
- Risks (severity and likelihood)
- Opportunities and asymmetric upside
- Competitor positions and vulnerabilities
- Patterns and historical similarities
- Execution paths and failure points
- Second-order consequences
- Leverage points — where small action produces large effect

## Strategic vs tactical

| Dimension | Tactical intelligence | Strategic intelligence |
|-----------|----------------------|---------------------|
| Horizon | Immediate | Medium to long |
| Question | What to do now? | What to optimize for? |
| Output | Action options | Direction and positioning |
| Evidence | Current state | Trends, structure, competition, history |

Strategic Intelligence operates at both levels but **owns the structural layer**.

## Inputs

- Context Artifact
- Business Memory Graph traversals
- Evidence and Reasoning artifacts
- Prediction artifacts (where forward-looking)
- Organization Memory strategic priorities
- Competitive intelligence (from Research)

## Outputs

Structured **Strategic Assessment Artifact**:

- Situation assessment
- Goal alignment analysis
- Opportunity map with confidence
- Threat map with severity and likelihood
- Dependency graph
- Competitor position summary
- Leverage point identification
- Second-order consequence analysis
- Strategic options (not final recommendation)
- Early warning indicators

## Prohibitions

Strategic Intelligence must **not**:

- Present strategic assessment as final decision (Decision Intelligence)
- Ignore organizational constraints
- Collapse second-order effects
- Communicate directly to users without Human Intelligence calibration

## Pipeline position

Activated after **Context Expansion** and during **Plan**. Informs **Decision Intelligence** and **Planning Intelligence**.

## Why this differentiates Conquest

Chatbots answer questions. Strategists reframe the decision landscape. Strategic Intelligence ensures Conquest identifies what **must be understood** — including what the user did not ask.

---

# 61.0 HUMAN INTELLIGENCE

## Purpose

Understand audience, communication, trust, psychology, and decision behavior — **without manipulation and without deception**.

Human Intelligence (HIE) is the translator between machine intelligence and human decision-makers.

## Primary question

> Who is being served right now, and how should intelligence be communicated to improve their decision — not manipulate it?

## Responsibilities

Per CCIS §VI:

| Domain | Application |
|--------|-------------|
| Audience analysis | Who decides, who influences, who executes |
| Trust dynamics | How trust is earned or lost in this interaction |
| Communication style | Depth, tone, format, density |
| Decision psychology | How humans decide under uncertainty and pressure |
| Motivation | What drives action vs passive agreement |
| Behavioral economics | How framing affects comprehension (not exploitation) |
| Influence models | How recommendations gain acceptance ethically |
| Leadership dynamics | Authority, accountability, escalation |
| Relationship context | History between actors |
| Emotional context | Stress, urgency, fear — contextual, not permanent labels |
| Persuasion ethics | Boundaries between influence and manipulation |

## Inputs

- Understanding Artifact
- User Memory (governed, session-scoped inferences)
- Organization communication policy
- Decision stakes from Orchestration
- Recommendation package (from Decision Intelligence, for calibration)

## Outputs

Structured **Human Intelligence Artifact**:

- Audience profile (contextual, revisable, session-scoped)
- Trust assessment
- Communication strategy (tone, depth, format, evidence level)
- Decision readiness assessment
- Ethical flags (if recommendation risks manipulation)
- Calibrated presentation guidance for Experience Layer

## Ethical boundaries — mandatory

Human Intelligence must **never**:

- Deceive about evidence, confidence, or certainty
- Exploit cognitive vulnerabilities for unauthorized benefit
- Manipulate users into actions against stated interests
- Conceal alternatives to create false urgency
- Impersonate human judgment where human authorization is required
- Persist emotional or psychological labels as permanent identity

Human Intelligence must **always**:

- Present confidence honestly
- Disclose inference vs fact
- Respect user autonomy on high-stakes decisions
- Adapt communication without distorting substance

## Prohibitions

Human Intelligence must **not**:

- Generate final recommendations (Decision Intelligence)
- Conduct research or reasoning
- Override evidence or verification conclusions
- Manipulate

## Pipeline position

Active during **Understand** (audience inference) and **Deliver** (communication calibration). Reviews Recommendation packages before user presentation.

## Relationship to Understanding Intelligence

| Understanding Intelligence | Human Intelligence |
|---------------------------|-------------------|
| What does the user want? | Who is the user in this moment? |
| Intent and decision type | Communication and trust calibration |
| Problem comprehension | Presentation strategy |

Both produce structured artifacts. Neither generates user-facing prose alone.

---

# 62.0 VERIFICATION INTELLIGENCE

## Purpose

Check facts, calculations, assumptions, and logic **before conclusions are released**.

Verification Intelligence is the **release gate** for major intelligence outputs.

## Primary question

> Does this conclusion meet evidence, logic, and policy standards?

## Responsibilities

Per AMD Volume II §22.0:

| Verification category | Check |
|----------------------|-------|
| **Logical validation** | Inference structure validity |
| **Numerical validation** | Calculation correctness |
| **Source validation** | Evidence provenance and class |
| **Consistency validation** | Internal and cross-artifact consistency |
| **Policy validation** | Organization and ethical policy compliance |
| **Confidence validation** | Confidence calibrated to evidence strength |

- Block outputs failing minimum thresholds
- Reroute failed outputs upstream with specific failure reasons
- Produce verification report for QA Gate and Release Authorization

## Inputs

- All upstream artifacts (Understanding through Challenge, Predictions, Strategic)
- Decision Artifact (pre-release)
- Evidence Assessment Artifact
- Organization policy constraints
- CCIS Engineering Laws

## Outputs

Structured **Verification Report**:

- Pass / fail per verification category
- Blocking failures with reroute target
- Confidence calibration assessment
- Policy compliance status
- Release authorization recommendation (approve / revise / escalate / block)

## Reroute rules

| Failure type | Default reroute |
|--------------|-----------------|
| Evidence insufficient | Research Intelligence |
| Reasoning invalid | Reasoning Intelligence |
| Challenge not passed | Challenge Intelligence |
| Prediction miscalibrated | Prediction Intelligence |
| Policy violation | Orchestration escalation |
| Confidence overstated | Evidence Intelligence + Reasoning Intelligence |

## Prohibitions

Verification Intelligence must **not**:

- Be skipped for major conclusions
- Pass outputs to satisfy convenience
- Modify reasoning — only evaluate and reroute
- Release without documented verification status

## Pipeline position

**Verify** stage — **before Decide, Recommend, and Execute** per CCIS supremacy.

> **Authority reconciliation:** CCIS and Cognitive Pipeline place Verification before Execution. AMD Volume II §18.0 pipeline ordering that places Verify after Execute is **subordinate and invalid** where it conflicts. This volume establishes Verify before Decide and Execute.

## Relationship to QA Gate

| Verification Intelligence | QA Gate (AMD Volume II §23.0) |
|--------------------------|-------------------------------|
| Validates intelligence correctness | Validates delivery compliance |
| Evidence, logic, confidence | Instruction compliance, formatting, completeness |
| Blocks incorrect intelligence | Blocks non-compliant presentation |
| Runs before Decision release | Runs before user delivery |

Both must pass for user-facing release of major conclusions.

---

# 63.0 REFLECTION INTELLIGENCE

## Purpose

Review completed intelligence work and ask: **What was right? What was wrong? What could improve?**

Reflection Intelligence operates **after** execution and measurement — not as a substitute for Challenge Intelligence.

## Primary question

> What did this intelligence cycle teach us about our own performance?

## Responsibilities

- Review full intelligence cycle artifact chain
- Compare predictions to outcomes
- Compare confidence to actual accuracy (calibration review)
- Identify which intelligence system performed well or poorly
- Attribute failures to intelligence system per failure taxonomy
- Produce improvement proposals for Learning Intelligence
- Never modify production intelligence directly

## Inputs

- Complete artifact chain from intelligence cycle
- Measurement results (outcome vs prediction)
- User feedback and corrections
- Execution results
- Verification and QA records

## Outputs

Structured **Reflection Artifact**:

- Cycle summary
- What was right (with evidence)
- What was wrong (with attribution)
- Calibration delta (confidence vs outcome)
- Intelligence system performance assessment
- Improvement proposals → Learning Intelligence
- Failure classification (if applicable)

## Prohibitions

Reflection Intelligence must **not**:

- Replace Challenge Intelligence pre-release
- Apply learning without Learning Intelligence validation
- Blame without classified root cause
- Modify memory directly

## Pipeline position

Post-**Measure**, before **Learn** and **Store**.

## Relationship to Cognitive Pipeline Phase 9 — Reflection

Reflection Intelligence is the architectural authority for Cognitive Pipeline Reflection phase.

---

# 64.0 LEARNING INTELLIGENCE

## Purpose

Convert outcomes into **future decision improvements** — not code changes.

Learning Intelligence transforms validated reflections into governed improvements to memory, confidence models, routing, and patterns.

## Primary question

> What should permanently improve — and what evidence supports that improvement?

## Responsibilities

Per CCIS §X and AMD Volume III §46.0:

- Receive improvement proposals from Reflection Intelligence
- Validate proposals against minimum evidence thresholds
- Classify learning type (confidence adjustment, pattern reinforcement, routing rule, memory update)
- Propose changes to Memory Layer (never direct write)
- Propose changes to Orchestration routing
- Propose confidence model adjustments
- Protect against bad learning (overfitting, poisoning, recency bias)
- Record learning lineage for audit

## Learning is not

| Learning is | Learning is not |
|-------------|-----------------|
| Governed improvement of intelligence artifacts | Model weight retraining |
| Validated pattern reinforcement | Autonomous code modification |
| Confidence calibration | Unvalidated memory writes |
| Routing refinement | Production system self-modification |

## Inputs

- Reflection Artifact
- Outcome measurements
- User corrections
- Failure classifications
- Performance metrics from Observability

## Outputs

Structured **Learning Proposal Artifact**:

- Proposal type
- Target subsystem (memory, routing, confidence, pattern)
- Evidence supporting proposal
- Validation status
- Expected impact
- Rollback path
- Approval requirement (automatic / human)

## Prohibitions

Learning Intelligence must **not**:

- Modify production code
- Write active memory without Memory Layer governance
- Promote patterns from insufficient samples
- Override Correction Memory

## Pipeline position

**Learn** stage — after Reflection and Measurement. Proposals flow to Memory Layer and Orchestration for governed application.

## Agent binding

Learning Agent operates under Learning Intelligence. Memory Agent handles persistence per Memory Layer governance.

---

# 65.0 PLANNING INTELLIGENCE

## Purpose

Determine **what sequence of actions** achieves the goal once reasoning and challenge have produced surviving options.

## Primary question

> How should approved intelligence become action — in what order, with what dependencies?

## Responsibilities

- Convert strategic options and surviving hypotheses into execution plans
- Identify step dependencies and resource requirements
- Select required execution capabilities
- Define success criteria per step
- Define rollback and halt conditions
- Produce plan for Decision Intelligence evaluation and Orchestration routing

## Inputs

- Challenge Artifact (surviving hypotheses)
- Strategic Assessment Artifact
- Prediction artifacts
- Context Artifact (constraints)
- Execution capability registry

## Outputs

Structured **Planning Artifact**:

- Execution plan (ordered steps)
- Dependencies
- Resource requirements
- Success criteria
- Risk per step
- Rollback conditions
- Agent and tool assignments (recommendations to Orchestration)

## Prohibitions

Planning Intelligence must **not**:

- Execute actions
- Approve its own plan (Decision Intelligence)
- Skip verification requirements for plan steps

## Pipeline position

**Plan** stage — after **Challenge**, before **Decide** and **Execute**.

---

# 66.0 DECISION INTELLIGENCE

## Purpose

Evaluate surviving options and select the **strongest recommendation** under governance — not the first generated.

## Primary question

> Which option has the strongest supporting evidence and best satisfies decision objectives?

## Responsibilities

Per AMD Volume II §19.0 Decision Engine Framework:

Evaluate every major option using:

| Score dimension | Evaluates |
|-----------------|-----------|
| Evidence Score | Strength and class of supporting evidence |
| Confidence Score | Calibrated probability of correctness |
| Risk Score | Downside magnitude and likelihood |
| Impact Score | Upside magnitude |
| Cost Score | Resource cost |
| Time Score | Time to value and urgency fit |
| Dependency Score | Dependency risk and complexity |
| Feasibility Score | Can this actually be done? |
| Strategic Alignment Score | Fit with organizational goals |

- Rank all options
- Record rejected alternatives with rationale
- Trigger escalation when all options fall below threshold
- Trigger additional research when evidence is insufficient
- Produce decision record — even when decision is defer, escalate, or gather more evidence

## Inputs

- All verified upstream artifacts
- Verification Report (pass status)
- Organization decision policy and thresholds

## Outputs

Structured **Decision Artifact**:

- Selected option
- Rejected options with rejection rationale per score dimension
- Composite scores per option
- Decision confidence
- Escalation flags
- Authorization requirement level
- Handoff to Human Intelligence for recommendation calibration
- Handoff to Execution Layer (if authorized)

## Prohibitions

Decision Intelligence must **not**:

- Select first-generated option by default
- Proceed on failed verification
- Communicate directly to users
- Execute without authorization

## Pipeline position

**Decide** stage — after **Verify**, before **Recommend** and **Execute**.

## Relationship to Decision Engine (AMD Volume II §19.0)

Decision Intelligence **is** the architectural authority for the Decision Engine. The Decision Engine is the scoring and ranking subsystem of Decision Intelligence.

---

# 67.0 OPTIMIZATION INTELLIGENCE

## Purpose

Improve intelligence **quality and efficiency** across cycles — routing, depth, resource allocation, and pattern application.

## Primary question

> How can the next intelligence cycle be better and more efficient than the last?

## Responsibilities

- Analyze observability metrics across intelligence systems
- Recommend routing optimizations to Orchestration
- Identify over-research and under-research patterns
- Recommend challenge intensity adjustments by domain
- Propose resource allocation improvements
- Feed Learning Intelligence with efficiency patterns
- Never modify production systems directly

## Inputs

- Observability metrics (AMD Volume I §23.0)
- Reflection and Learning artifacts
- Orchestration performance data

## Outputs

Structured **Optimization Proposal Artifact**:

- Target intelligence system or route
- Proposed optimization
- Evidence from performance data
- Expected quality or efficiency impact
- Validation requirement

## Pipeline position

Operates continuously across cycles via Learning Layer — not a single pipeline stage.

---

# 68.0 INTELLIGENCE COORDINATION MODEL

## How intelligence systems work together

Intelligence systems do not operate in isolation. They produce **structured artifacts** consumed by subsequent systems under Orchestration coordination.

```
Orchestration receives request
        ↓
Understanding Intelligence → Understanding Artifact
        ↓
Context Intelligence → Context Artifact
        ↓
Memory Retrieval (Memory Layer) ← governed request
        ↓
Research Intelligence → Research Artifact
        ↓
Evidence Intelligence → Evidence Assessment Artifact
        ↓
Reasoning Intelligence → Reasoning Artifact
        ↓
Challenge Intelligence → Challenge Artifact
        ↓
Prediction Intelligence (if required) → Prediction Artifact
        ↓
Strategic Intelligence (if required) → Strategic Assessment Artifact
        ↓
Planning Intelligence → Planning Artifact
        ↓
Verification Intelligence → Verification Report
        ↓
Decision Intelligence → Decision Artifact
        ↓
Human Intelligence → Communication calibration
        ↓
Recommend (structured recommendation package)
        ↓
Execute (if authorized) → Execution Layer
        ↓
Measure → Reflection Intelligence → Learning Intelligence
```

## Parallel execution

Under Orchestration authority, these may run in parallel when disjoint:

- Research on multiple evidence gaps
- Prediction and Strategic assessment (with merge at Planning)
- Multiple Reasoning layers within Reasoning Intelligence

Parallel outputs merge at defined synchronization points. Merge rules are owned by Orchestration.

## Artifact chain integrity

Every intelligence cycle must preserve the **complete artifact chain** from Understanding through Learning. No artifact may be discarded from the audit trail.

---

# 69.0 PIPELINE AND AUTHORITY RECONCILIATION

## CCIS loop (supreme)

```
Observe → Understand → Research → Reason → Challenge →
Verify → Decide → Recommend → Execute → Measure → Learn → Improve
```

## AMD Volume IV intelligence mapping

| CCIS stage | Intelligence system(s) |
|------------|------------------------|
| Observe | Observation (Orchestration + Experience Layer intake) |
| Understand | Understanding Intelligence + Human Intelligence (audience) |
| Research | Research Intelligence + Evidence Intelligence |
| Reason | Reasoning Intelligence |
| Challenge | Challenge Intelligence |
| Verify | Verification Intelligence |
| Decide | Decision Intelligence |
| Recommend | Human Intelligence (calibration) + structured recommendation package |
| Execute | Execution Layer (not cognitive) |
| Measure | Measurement (cross-cutting; Reflection input) |
| Learn | Learning Intelligence |
| Improve | Optimization Intelligence + Learning Intelligence proposals |

## Cognitive Pipeline ten phases mapping

| Cognitive Pipeline phase | Intelligence system(s) |
|--------------------------|------------------------|
| 1. Perception | Observation (pre-Understanding) |
| 2. Human Understanding | Understanding Intelligence + Human Intelligence |
| 3. Context Reconstruction | Context Intelligence |
| 4. Goal Reasoning | Understanding + Strategic Intelligence |
| 5. Strategy Planning | Strategic Intelligence + Planning Intelligence |
| 6. Intelligence Orchestration | Orchestration routes to all cognitive systems |
| 7. Verification | Verification Intelligence |
| 8. Execution | Execution Layer |
| 9. Reflection | Reflection Intelligence |
| 10. Memory Evolution | Learning Intelligence → Memory Layer |

## AMD Volume II §18.0 reconciliation

Where AMD Volume II §18.0 pipeline ordering conflicts with CCIS (notably Verify after Execute), **CCIS and this volume prevail**. Volume II §18.0 requires amendment at seal time to align with this mapping.

---

# 70.0 AGENT ECOSYSTEM BINDING

## Principle

Agents are **workers**. Intelligence systems are **authorities**. Agents operate within intelligence system boundaries.

Per AMD Volume II §24.0–§25.0 and Volume I §14.0:

| Agent | Intelligence authority | Layer |
|-------|------------------------|-------|
| Research Agent | Research Intelligence | Cognitive |
| Reasoning Agent | Reasoning Intelligence | Cognitive |
| Verification Agent | Verification Intelligence | Cognitive |
| Strategy Agent | Strategic Intelligence | Cognitive |
| Planning Agent | Planning Intelligence | Cognitive |
| Prediction Agent | Prediction Intelligence | Cognitive |
| Analytics Agent | Reasoning + Evidence Intelligence | Cognitive |
| Competitor Agent | Strategic + Research Intelligence | Cognitive |
| Finance Agent | Reasoning Intelligence (financial layer) | Cognitive |
| Trading Agent | Reasoning + Prediction Intelligence | Cognitive |
| Marketing Agent | Strategic + Research Intelligence | Cognitive |
| Intelligence Agent | General — Orchestration-assigned | Cognitive |
| Automation Agent | Execution Layer | Execution |
| Content Agent | Execution Layer | Execution |
| Coding Agent | Execution Layer | Execution |
| Memory Agent | Memory Layer governance | Memory |
| Reflection Agent | Reflection Intelligence | Cognitive |
| Learning Agent | Learning Intelligence | Learning |
| Risk Agent | Challenge + Strategic Intelligence | Cognitive |

## Agent communication

Per AMD Volume I §13.0 — structured intelligence packets only:

- Source Agent, Destination Agent, Task ID
- Evidence, Confidence Score, Reasoning Summary
- Validation Status, Timestamp

No unrestricted conversational agent exchange.

## Agent governance

Per AMD Volume II §25.0:

- Operate within authority boundaries
- Produce explainable structured outputs
- Report confidence
- Maintain audit trails
- Submit to verification
- Never override governance controls

---

# 71.0 INTERNAL INTELLIGENCE vs USER-FACING PRODUCTS

## The architectural discovery

After defining intelligence systems, Conquest can distinguish:

**Internal intelligence systems** — cognitive organs that must never appear as menu items or standalone products.

**User-facing workspaces** — surfaces that **consume** intelligence outputs to improve operational awareness and decision quality.

This distinction resolves the longstanding question: *Should Analysis, Prediction, Research, Knowledge, and Memory appear as navigation items?*

## Classification rule

```
IF it transforms information into intelligence → INTERNAL
IF it presents intelligence to improve decisions → USER-FACING (maybe)
IF it stores intelligence → INTERNAL (Memory Layer)
IF it executes authorized actions → USER-FACING workspace (Execution surface)
```

**Test:** Would exposing this as a menu item improve user decision quality — or expose internal machinery that confuses the command center experience?

## Intelligence systems — INTERNAL (never menu items)

| System | Why internal |
|--------|--------------|
| Understanding Intelligence | Interprets intent — user sees outcomes, not interpreter |
| Context Intelligence | Reconstructs situation — background machinery |
| Research Intelligence | Evidence acquisition — not search UI |
| Evidence Intelligence | Quality scoring — gatekeeper, not product |
| Reasoning Intelligence | Hypothesis generation — not answers |
| Challenge Intelligence | Adversarial testing — invisible by design |
| Prediction Intelligence | Produces probability artifacts — surfaced within monitoring, not standalone |
| Strategic Intelligence | Structural analysis — surfaced within strategy workspace |
| Human Intelligence | Communication calibration — invisible |
| Verification Intelligence | Release gate — invisible |
| Reflection Intelligence | Post-cycle review — invisible |
| Learning Intelligence | Improvement engine — invisible |
| Planning Intelligence | Plan construction — surfaced as plans, not engine |
| Decision Intelligence | Scoring engine — surfaced as decisions, not engine |
| Optimization Intelligence | Efficiency engine — invisible |

## Previously questioned navigation items — RECLASSIFIED

| Former menu candidate | Classification | Correct surface |
|----------------------|----------------|-----------------|
| **Analysis** | Internal capability | Command Center intelligence summaries; domain workspaces (Analytics, Commerce, etc. in Volume V) |
| **Prediction** | Internal intelligence system | Prediction **monitoring** in Command Center — not "Prediction" as nav item |
| **Research** | Internal intelligence system | Research **findings** surfaced in Command Center — not "Research" as nav item |
| **Knowledge** | Memory category + possible workspace | **Knowledge Center** (Volume V) accesses Knowledge Memory — not "Knowledge" as intelligence nav item |
| **Memory** | Memory Layer (Volume III) | **Memory Insights** in Command Center — not "Memory" as nav item |
| **Intelligence** | Too vague — reject as nav label | **Intelligence Center** or **Command Center** (Volume V) |
| **Models** | Infrastructure concern | Settings / Admin — not primary nav (Volume V/VII) |

## User-facing workspaces — CANDIDATES (AMD Volume V defines formally)

| Workspace | Purpose | Intelligence consumed |
|-----------|---------|----------------------|
| **Command Center** | Operational awareness and executive intelligence | All systems — synthesized |
| **Intelligence Center** | Deep intelligence review and drill-down | Research findings, evidence, strategic assessments |
| **Strategy Center** | Strategic planning and opportunity tracking | Strategic, Prediction, Decision |
| **Automation Center** | Workflow and execution management | Planning, Execution |
| **Reports Center** | Generated intelligence reports | All systems — formatted output |
| **Knowledge Center** | Curated knowledge access | Knowledge Memory |
| **Marketplace** | Extensions and integrations | Orchestration |
| **Settings** | Configuration and governance | Organization Memory, policy |

## Navigation principle

The user navigates **decision workspaces**, not **cognitive organs**.

Conquest must feel like an Intelligence Command Center — not a catalog of internal systems.

## Menu governance rule

No navigation item may be added unless AMD Volume V demonstrates:

1. It improves operational awareness or decision quality for the user
2. It is not merely an internal intelligence system exposed by mistake
3. It maps to consumed intelligence outputs, not production machinery
4. It passes AMD Volume II §25.0 Architectural Completeness Law

---

# 72.0 LIVE INTELLIGENCE INTEGRATION

Per AMD Volume I §18.0, intelligence systems — especially Research and Evidence Intelligence — consume layered intelligence sources:

| Layer | Content | Primary consumers |
|-------|---------|-------------------|
| Layer 1 — Core Knowledge | Stable reference | Research, Evidence |
| Layer 2 — Historical Knowledge | Trends, base rates | Research, Prediction, Strategic |
| Layer 3 — Research Sources | Documentation, databases | Research |
| Layer 4 — Daily Updates | Periodic feeds | Research, Evidence |
| Layer 5 — Real-Time Feeds | Live data | Research, Prediction, Strategic |
| Layer 6 — User Intelligence | Session and user context | Understanding, Human, Context |
| Layer 7 — Verified Outcome Intelligence | Measured results | Evidence, Learning, Reflection |

**Rule:** When freshness and reliability conflict, **trustworthy intelligence takes precedence over recent intelligence** unless domain rules specify otherwise.

---

# 73.0 FAILURE ATTRIBUTION BY INTELLIGENCE SYSTEM

Per CCIS §XI, failures must be attributed to the responsible intelligence system:

| Failure class | Primary intelligence owner |
|---------------|---------------------------|
| Reasoning Failure | Reasoning Intelligence |
| Prediction Failure | Prediction Intelligence |
| Routing Failure | Orchestration Layer |
| Research Failure | Research Intelligence |
| Memory Failure | Memory Layer (Volume III) |
| Evidence Failure | Evidence Intelligence |
| Context Failure | Context or Understanding Intelligence |
| Validation Failure | Verification Intelligence |
| Execution Failure | Execution Layer |

Reflection Intelligence performs attribution. Learning Intelligence proposes prevention. Memory Layer stores Failure Memory.

---

# 74.0 OBSERVABILITY BY INTELLIGENCE SYSTEM

Per AMD Volume I §23.0, each intelligence system must emit:

| Metric | Systems tracked |
|--------|----------------|
| Latency | All |
| Accuracy / outcome alignment | Reasoning, Prediction, Decision |
| Research duration and completeness | Research |
| Confidence calibration | Evidence, Decision, Prediction |
| Challenge elimination rate | Challenge |
| Verification pass/fail rate | Verification |
| Learning proposal acceptance rate | Learning |
| Failure classification distribution | Reflection |

Observability feeds Optimization Intelligence and Learning Intelligence. Operational infrastructure belongs to AMD Volume VI.

---

# 75.0 VOLUME DEPENDENCIES

| Topic | Owning AMD volume |
|-------|-------------------|
| Memory stores and graph | Volume III (complete) |
| User-facing workspaces and menu | Volume V — Platform Architecture |
| Infrastructure, databases, APIs | Volume VI — Infrastructure & Scalability |
| UX/UI, layouts, interaction rules | Volume VII — UX/UI Architecture |
| Security enforcement detail | Volume VIII — Security & Governance |
| Development standards | Volume IX — Development Standards |
| Implementation sequencing | Volume X — Implementation Roadmap |
| Final reconciliation and seal | Volume X — Final Architectural Directives |

---

# 76.0 ARCHITECTURAL COMPLETENESS — INTELLIGENCE SYSTEMS

No intelligence system, agent, or workspace may be approved unless it demonstrates:

- Assignment to this volume's intelligence catalog
- Structured artifact input and output definition
- Pipeline position per §69.0
- CCIS alignment
- Boundary compliance (§52.0 principles)
- Internal vs user-facing classification per §71.0
- Observability emission per §74.0
- Failure attribution per §73.0

---

*End of AMD Volume IV — Cognitive & Intelligence Systems Architecture v1.0*
