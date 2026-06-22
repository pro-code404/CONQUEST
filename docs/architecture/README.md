# Conquest Architecture

The architecture of Conquest is documented as three layers of understanding:

| Document | Question | Scope |
|----------|----------|-------|
| [`cognitive-pipeline.md`](cognitive-pipeline.md) | **What is the nervous system?** | Ten-phase runtime loop, phase artifacts, reroute rules |
| [`how-conquest-thinks.md`](how-conquest-thinks.md) | **How does Conquest think?** | Reasoning, confidence, prediction, HUE, multimodal, live reasoning |
| [`how-conquest-evolves.md`](how-conquest-evolves.md) | **How does Conquest evolve?** | First Law, self-improvement, routing, failure detection, safety boundaries |

## Governance hierarchy

```
Constitution
  ↓
Working Design Document (WDD)
  ↓
Working System Design Document (WSDD)
  ↓
Architecture trilogy (this folder)
  ↓
Implementation
  ↓
Configuration
  ↓
Runtime data / evolution artifacts
```

## The First Law

> Conquest is never finished. Every interaction is an opportunity to improve the operating system. Every success strengthens future intelligence. Every mistake creates a correction. Every correction becomes permanent knowledge unless disproven.

## Agent entry point

All agents begin with [`../../AGENTS.md`](../../AGENTS.md).
