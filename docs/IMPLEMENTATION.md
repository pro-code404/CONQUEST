# Conquest Implementation

**Build-1 authorized** per [BAR-2026-06-26-001](governance/build-authorization-record-build-1-2026-06-26.md). **Build-2 M4 complete** (closed-beta readiness).

## Status

| Item | Path |
|------|------|
| Build-1 BAR (issued) | [`governance/build-authorization-record-build-1-2026-06-26.md`](governance/build-authorization-record-build-1-2026-06-26.md) |
| Build-2 program | [`build-2/README.md`](build-2/README.md) |
| Knowledge base (start here) | [`knowledge-base/ai-agent-onboarding.md`](knowledge-base/ai-agent-onboarding.md) |
| Build gate checklist | [`governance/build-authorization-checklist-v1.0.md`](governance/build-authorization-checklist-v1.0.md) |

| Metric | Value |
|--------|-------|
| Tests | 278 Vitest + Playwright e2e |
| Closed-beta readiness | ~96% |
| Next milestone | B2-M5 (execution — gated) |

## Engineering

```bash
pnpm install
pnpm build && pnpm typecheck && pnpm test
pnpm dev               # API + web
pnpm test:e2e          # Playwright closed-beta journey
```

## Active implementation

| Layer | Path | Purpose |
|-------|------|---------|
| API | `apps/api` | Hono HTTP server, ~100 routes |
| Web | `apps/web` | Vite + React application shell |
| Domain | `services/auth` | Identity, settings, automation, intelligence, research, legal |
| Platform | `services/platform` | Cognitive, AI gateway, cache, jobs, memory, prompts |
| Contracts | `packages/contracts` | Cross-module Zod contracts |
| Database | `packages/database` | Drizzle schema + migrations |

## Authority

`CCIS → AMD → PDD → UXMD → Document X → SDD I–V → ADR → RTM → Architecture Freeze → BAR → Build`
