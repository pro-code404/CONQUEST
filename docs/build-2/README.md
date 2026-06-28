# Build-2 — Integration-First Program

**Authorization:** Build-2 Integration-First Strategy (2026-06-27)  
**Baseline:** B2-M2 Production Persistence complete · 257 tests passing

Build-2 prioritizes **production readiness** over feature count. Every task must move Conquest closer to a demonstrable, production-ready platform.

---

## Deliverables

| # | Document | Status |
|---|----------|--------|
| 1 | [Integration Matrix](./integration-matrix.md) | Updated — post M1 |
| 2 | [Launch Readiness Report](./launch-readiness-report.md) | Updated — post M2 |
| 3 | [Master Spec Consolidation Plan](./master-spec-consolidation-plan.md) | Complete |
| 4 | [Production Blocker List](./production-blockers.md) | Updated — post M2 |
| 5 | [Implementation Roadmap](./implementation-roadmap.md) | Complete |
| 6 | [Simulation Inventory](./simulation-inventory.md) | Updated — post M2 |
| 7 | [M1 Integration Batch Report](./m1-integration-batch-report.md) | Complete |
| 8 | [M2 Production Persistence Report](./m2-production-persistence-report.md) | **Complete** |
| 9 | [Repository Migration Report](./repository-migration-report.md) | Complete |
| 10 | [Database Schema Verification](./database-schema-verification.md) | Complete |

---

## Milestone Status

| Milestone | Status | Demo readiness |
|-----------|--------|----------------|
| B2-M1 Integration Batch | ✅ Complete | ~78% |
| B2-M2 Production Persistence | ✅ Complete | ~85% |

---

## B2-M2 Highlights

- `DrizzleAuthRepository` — full Postgres persistence for auth domain (83 methods)
- `DATABASE_URL` + auto-migrate; `MEMORY_REPO=true` for CI
- `NotificationService` — email delivery with audit trail
- `LegalService` — durable acceptance records + cookie consent
- `/api/health/live` and `/api/health/ready` probes
- Legal routes accessible to all users; cookie consent banner

**To enable persistence:** `DATABASE_URL=postgresql://conquest:conquest@localhost:5432/conquest`

---

## Immediate Next Step

**B2-M3 Production Hardening:** SMTP email provider, Redis bootstrap, enforcing rate limits, Postgres in CI, persistence restart E2E test.

---

*Last updated: B2-M2 Production Persistence (2026-06-28).*
