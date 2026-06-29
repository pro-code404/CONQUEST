# API Reference

Catalog of all HTTP routes defined in `apps/api/src/app.ts` (**100 routes**). Cross-reference: [data-flow-reference](./data-flow-reference.md) · [architecture-reference](./architecture-reference.md)

**Base URL:** `http://localhost:3001` (dev) or behind web proxy in production.

## Global behavior

| Concern | Behavior |
|---------|----------|
| **Framework** | Hono (`createApiApp`) |
| **Auth** | Session cookie `SESSION_COOKIE_NAME` (httpOnly). Most routes return `401` if missing. |
| **Rate limiting** | All `/api/*`: **120 req / 60s** per client IP. Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Window-Ms`. `429` on exceed. Skipped in test env. |
| **CORS** | `apiEnv.corsOrigins`, `credentials: true` |
| **Correlation** | `x-correlation-id` propagated on cognitive routes |
| **Timing** | `x-response-time-ms` on responses |
| **Audit** | `securityAuditMiddleware` on `/api/*` |
| **Tenant isolation** | Workspace routes verify `session.orgId === workspace.orgId`; cognitive routes use `cognitiveScope()` |

### Auth levels

| Level | Description |
|-------|-------------|
| **None** | Public; no cookie required |
| **Session** | Valid non-revoked session cookie |
| **Session + workspace** | Session + workspace membership / GIS `canAccessModuleRead` where enforced |
| **Session + role** | Service-layer role checks (admin, member+, etc.) |

---

## Health & operations

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | None | Aggregate health: auth, workspace, settings, automation, platform |
| GET | `/api/health/live` | None | Liveness — `{ ok: true, service: "conquest-api" }` |
| GET | `/api/health/ready` | None | Readiness — DB and dependency probes |
| GET | `/api/ops/status` | None | Operational status, metrics, rate-limit events, cognitive snapshot |
| GET | `/api/ops/degradation` | None | Dependency degradation probes (DB, Redis, email, AI, queue) |

**Rate limit:** Standard `/api/*` limit applies.

---

## Legal

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/legal/documents` | None | Public legal document catalog and versions |
| GET | `/api/legal/status` | Session | User acceptance status per document |
| POST | `/api/legal/accept` | Session | Record acceptance of document version |
| POST | `/api/legal/cookie-consent` | Session | Persist cookie consent preferences |

---

## Authentication

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/auth/session` | Session | Current session public view (user, org, workspaces) |
| POST | `/api/auth/signup` | None | Create account; sends verification email |
| POST | `/api/auth/login` | None | Authenticate; sets session cookie |
| POST | `/api/auth/logout` | Session | Revoke session; clears cookie |
| POST | `/api/auth/verify-email` | None | Confirm email with token |
| POST | `/api/auth/verify-email/resend` | Session | Resend verification email |
| POST | `/api/auth/onboarding/complete` | Session | Complete onboarding (workspace creation) |
| POST | `/api/auth/onboarding/stage` | Session | Set onboarding stage |
| POST | `/api/auth/onboarding/finish` | Session | Finish onboarding flow |
| POST | `/api/auth/password/forgot` | None | Initiate password reset email |
| POST | `/api/auth/password/reset` | None | Reset password with token |
| GET | `/api/auth/invite/:token` | None | Preview invite metadata |
| POST | `/api/auth/invite/:token/accept` | None | Accept invite and create/link account |
| POST | `/api/auth/workspace/:workspaceId/select` | Session | Set active workspace on session |
| GET | `/api/auth/workspace/:workspaceId/validate` | Session | Validate workspace access for session |

**Rate limit:** Signup/login/forgot are high-abuse targets — same global limit; consider stricter per-route limits (Planned).

---

## Workspaces & Command Center

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces` | Session | List workspaces for current org |
| GET | `/api/workspaces/:workspaceId/command-center/status` | Session + workspace | Command Center status summary |
| GET | `/api/workspaces/:workspaceId/command-center/dashboard` | Session + workspace | Full dashboard zones (intelligence, automation, ops) |

---

## Settings — account & organization

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/settings/categories` | Session | Nav categories filtered by role |
| GET | `/api/settings/account` | Session | Account profile |
| PUT | `/api/settings/account` | Session | Update account |
| GET | `/api/settings/preferences` | Session | User preferences |
| PUT | `/api/settings/preferences` | Session | Update preferences |
| GET | `/api/settings/organization` | Session | Organization profile |
| GET | `/api/settings/organization/members` | Session | List org members |
| POST | `/api/settings/organization/members/invite` | Session + role | Invite org member |
| PUT | `/api/settings/organization/members/:userId/role` | Session + role | Change member role |
| DELETE | `/api/settings/organization/members/:userId` | Session + role | Remove member |
| GET | `/api/settings/notifications` | Session | Notification preferences |
| PUT | `/api/settings/notifications` | Session | Update notifications |
| GET | `/api/settings/privacy` | Session | Privacy settings |
| POST | `/api/settings/privacy/export` | Session | Request data export (job placeholder) |
| POST | `/api/settings/privacy/deletion` | Session | Request account deletion (job placeholder) |
| GET | `/api/settings/billing` | Session | Billing summary |
| GET | `/api/settings/integrations` | Session | Integration connections |
| POST | `/api/settings/integrations/:integrationId/connect` | Session | Connect integration (OAuth deferred) |
| POST | `/api/settings/integrations/:integrationId/disconnect` | Session | Disconnect integration |

---

## Settings — workspace & team

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/settings/workspace/:workspaceId` | Session + workspace | Workspace settings |
| PUT | `/api/settings/workspace/:workspaceId` | Session + workspace | Update workspace settings |
| GET | `/api/settings/workspace/:workspaceId/team` | Session + workspace | Workspace team members |
| POST | `/api/settings/workspace/:workspaceId/team/invite` | Session + workspace | Invite to workspace |
| DELETE | `/api/settings/workspace/:workspaceId/team/:userId` | Session + workspace | Remove from workspace |
| GET | `/api/settings/workspace/:workspaceId/sources` | Session + workspace | Data sources |
| POST | `/api/settings/workspace/:workspaceId/sources` | Session + workspace | Add source |
| DELETE | `/api/settings/workspace/:workspaceId/sources/:sourceId` | Session + workspace | Remove source |
| GET | `/api/settings/workspace/:workspaceId/goals` | Session + workspace | Workspace goals |
| POST | `/api/settings/workspace/:workspaceId/goals` | Session + workspace | Add goal |

---

## Settings — security, policies, memory, activity

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/settings/security` | Session | Security settings overview |
| POST | `/api/settings/security/mfa/enroll` | Session | Start MFA enrollment |
| POST | `/api/settings/security/mfa/confirm` | Session | Confirm MFA with TOTP code |
| POST | `/api/settings/security/mfa/regenerate` | Session | Regenerate recovery codes |
| GET | `/api/settings/security/devices` | Session | Trusted devices |
| DELETE | `/api/settings/security/devices/:deviceId` | Session | Revoke device |
| GET | `/api/settings/automation-policies` | Session | Automation governance policies |
| PUT | `/api/settings/automation-policies` | Session | Update automation policies |
| GET | `/api/settings/advanced` | Session | Advanced settings |
| PUT | `/api/settings/advanced` | Session | Update advanced settings |
| GET | `/api/settings/memory` | Session | Memory preferences |
| PUT | `/api/settings/memory` | Session | Update memory preferences |
| GET | `/api/settings/activity` | Session | Audit activity feed |

---

## Settings — administration & prompts

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/settings/administration` | Session + admin | Administration dashboard |
| PUT | `/api/settings/administration/feature-flags/:flagId` | Session + admin | Toggle feature flag |
| GET | `/api/settings/prompts` | Session | List prompt templates |
| POST | `/api/settings/prompts` | Session | Register prompt template |

---

## Profile

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/profile` | Session | User profile (alias to account view) |
| GET | `/api/profile/sessions` | Session | Active sessions list |
| DELETE | `/api/profile/sessions/:sessionId` | Session | Revoke specific session |

---

## Automation

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces/:workspaceId/automation/workflows` | Session + workspace | List workflows |
| GET | `/api/workspaces/:workspaceId/automation/workflows/:workflowId` | Session + workspace | Workflow detail |
| POST | `/api/workspaces/:workspaceId/automation/workflows` | Session + workspace | Create workflow |
| PUT | `/api/workspaces/:workspaceId/automation/workflows/:workflowId` | Session + workspace | Update workflow |
| DELETE | `/api/workspaces/:workspaceId/automation/workflows/:workflowId` | Session + workspace | Delete workflow |
| POST | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/enable` | Session + workspace | Enable workflow |
| POST | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/disable` | Session + workspace | Disable workflow |
| POST | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/pause` | Session + workspace | Pause workflow |
| POST | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/resume` | Session + workspace | Resume workflow |
| POST | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/run` | Session + workspace | Manual run (audit-only execution) |
| GET | `/api/workspaces/:workspaceId/automation/workflows/:workflowId/executions` | Session + workspace | Execution history |
| GET | `/api/workspaces/:workspaceId/automation/approvals` | Session + workspace | Pending approvals |
| POST | `/api/workspaces/:workspaceId/automation/approvals/:workflowId/approve` | Session + workspace | Approve workflow |
| POST | `/api/workspaces/:workspaceId/automation/approvals/:workflowId/reject` | Session + workspace | Reject workflow |
| POST | `/api/automation/validate/trigger` | Session | Validate trigger schema |
| POST | `/api/automation/validate/schedule` | Session | Validate schedule schema |

---

## Intelligence

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces/:workspaceId/intelligence/home` | Session + workspace | Intelligence home summary |
| GET | `/api/workspaces/:workspaceId/intelligence/feed` | Session + workspace | Intelligence feed |
| GET | `/api/workspaces/:workspaceId/intelligence/recommendations` | Session + workspace | List recommendations |
| GET | `/api/workspaces/:workspaceId/intelligence/recommendations/:recommendationId` | Session + workspace | Recommendation detail + evidence |
| POST | `/api/workspaces/:workspaceId/intelligence/recommendations/:recommendationId/status` | Session + workspace | Update status (approve/defer/dismiss) |
| GET | `/api/workspaces/:workspaceId/intelligence/opportunities` | Session + workspace | Opportunities list |
| GET | `/api/workspaces/:workspaceId/intelligence/risks` | Session + workspace | Risks list |
| GET | `/api/workspaces/:workspaceId/intelligence/timeline` | Session + workspace | Intelligence timeline |

---

## Research

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces/:workspaceId/research/sessions` | Session + workspace | List research sessions |
| POST | `/api/workspaces/:workspaceId/research/sessions` | Session + workspace | Create session |
| GET | `/api/workspaces/:workspaceId/research/sessions/:researchSessionId` | Session + workspace | Session detail |
| POST | `/api/workspaces/:workspaceId/research/sessions/:researchSessionId/sources` | Session + workspace | Register source |
| POST | `/api/workspaces/:workspaceId/research/sessions/:researchSessionId/analyze` | Session + workspace | Run cognitive analysis → recommendations |

---

## Analytics

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces/:workspaceId/analytics/dashboard` | Session + workspace | Analytics dashboard (`?timeRange`, `?category`) |
| GET | `/api/workspaces/:workspaceId/analytics/metrics` | Session + workspace | Metric registry |
| GET | `/api/workspaces/:workspaceId/analytics/saved-views` | Session + workspace | List saved views |
| POST | `/api/workspaces/:workspaceId/analytics/saved-views` | Session + workspace | Save view |

---

## Operations

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/workspaces/:workspaceId/operations/dashboard` | Session + workspace | Ops dashboard (queue, cache, AI providers) |

---

## Cognitive platform

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/workspaces/:workspaceId/cognitive/run` | Session + workspace | Run full cognitive pipeline (`async` optional) |
| GET | `/api/workspaces/:workspaceId/cognitive/requests/:requestId` | Session + workspace | Request lifecycle status |
| POST | `/api/workspaces/:workspaceId/cognitive/evidence` | Session + workspace | Collect evidence portfolio |
| POST | `/api/workspaces/:workspaceId/cognitive/reasoning` | Session + workspace | Run reasoning engine |
| POST | `/api/workspaces/:workspaceId/cognitive/decisions` | Session + workspace | Evaluate decision |
| POST | `/api/workspaces/:workspaceId/cognitive/providers/route` | Session + workspace | Route to AI provider |

---

## Error responses

| Code | Typical cause |
|------|---------------|
| 401 | Missing or expired session |
| 403 | Tenant isolation, workspace access, GIS permission |
| 400 | Validation failure, business rule error |
| 429 | Rate limit exceeded |
| 500 | Unhandled server error (should be rare) |

Structured errors: `{ error: string }` or `toStructuredError()` shape from `@conquest/config`.

---

## Route count summary

| Domain | Routes |
|--------|--------|
| Health & ops | 5 |
| Legal | 4 |
| Auth | 15 |
| Workspaces & CC | 3 |
| Settings | 38 |
| Profile | 3 |
| Automation | 16 |
| Intelligence | 8 |
| Research | 5 |
| Analytics | 4 |
| Operations | 1 |
| Cognitive | 6 |
| **Total** | **100** |

*Source: `apps/api/src/app.ts` — regenerate this table when routes change.*
