# SEV-3 — AI Provider Degradation

**Severity:** SEV-3 | **RTM:** RTM-ENG-009, RTM-PDD-002

## Immediate actions

1. Confirm circuit breaker open for affected provider (INF-17).
2. Route to fallback provider per ADR-0011 abstraction.
3. Surface honest degradation in UI (BH-7).

## Monitoring

- Check observability dashboards for p95 latency and error rate.
- Correlate via `correlation_id` from support tickets.

## Recovery

1. Close circuit when provider healthy.
2. No kill switch unless cost attack detected (then INF-16 rate limits).
