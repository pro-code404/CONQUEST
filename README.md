# Conquest

**Adaptive Cognitive Intelligence Operating System (CIOS)**

Conquest is not a chatbot. It is a self-evolving cognitive operating system that processes every interaction through a ten-phase intelligence pipeline.

## Architecture

```
docs/architecture/
├── cognitive-pipeline.md    # What — the nervous system (10 phases)
├── how-conquest-thinks.md   # How — reasoning, confidence, prediction
└── how-conquest-evolves.md  # Evolution — self-improvement, routing, learning
```

See [`AGENTS.md`](AGENTS.md) for agent operating instructions.

## Quick start

```bash
# Install dependencies
pnpm install

# Start infrastructure
pnpm docker:up

# Build all packages
pnpm build

# Run tests
pnpm test

# Start API gateway
pnpm dev
```

## API

```bash
# Health check
curl http://localhost:3000/health

# Create auth token
curl -X POST http://localhost:3000/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-1"}'

# Send request through cognitive pipeline
curl -X POST http://localhost:3000/v1/conquest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"text":"Explain black holes for a beginner"}'
```

## Monorepo structure

```
packages/
  core/           Shared types, pipeline, evolution schemas
  engines/        Cognitive phase implementations (10 phases + sub-engines)
  observability/  Structured telemetry
  config/         Environment configuration
  database/       Drizzle schema (memory, sessions, evolution, audit)

services/
  orchestrator/   Pipeline runner — sole cross-service coordinator
  memory/         Memory service (12 stores)
  auth/           Authentication & authorization
  session/        Session state management

apps/
  gateway/        API Gateway — Layer 1 Interface
```

## The First Law

> Conquest is never finished. Every interaction is an opportunity to improve the operating system.

Every response generates an invisible evolution record that updates routing, memory, and communication strategies — without autonomous code deployment.

## Implementation status

See [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) for complete capability tracking.
