# 17 — Worked Examples and Scenarios

Complete workflows with sequence diagrams.

---

## Example 1: New user closed-beta journey

```mermaid
sequenceDiagram
  participant U as User
  participant W as Web
  participant API as API
  participant DB as Postgres

  U->>W: GET /
  W->>API: GET /api/auth/session
  API-->>W: user null
  W-->>U: Landing (PUB-01)

  U->>W: Signup
  W->>API: POST /api/auth/signup
  API->>DB: create user, org
  API-->>W: verificationToken (dev)

  U->>W: Verify email
  W->>API: POST /api/auth/verify-email
  API-->>W: session cookie

  U->>W: Onboarding workspace
  W->>API: POST /api/auth/onboarding/complete
  API->>DB: workspace, member
  API-->>W: activeWorkspaceId

  U->>W: Command Center
  W->>API: GET .../command-center/dashboard
  API-->>W: zones (may be empty — honest)
```

---

## Example 2: Research → recommendation → approval

```mermaid
sequenceDiagram
  participant U as User
  participant API as API
  participant RS as ResearchService
  participant P as Platform Cognitive
  participant IS as IntelligenceService

  U->>API: POST research session
  API->>RS: create
  U->>API: POST .../analyze
  RS->>P: cognitive.run(scope, input)
  P->>P: Evidence → Reason → Decide → Verify
  P-->>RS: artifacts
  RS->>IS: upsert recommendations
  U->>API: GET intelligence/feed
  API-->>U: recommendations with evidenceRefs
  U->>API: POST .../status approved
  API->>IS: update status
  Note over API: Execution NOT triggered (M4)
```

---

## Example 3: Automation manual run (audit-only)

```mermaid
sequenceDiagram
  participant U as User
  participant API as API
  participant AS as AutomationService
  participant DB as Postgres

  U->>API: POST .../workflows/:id/run
  API->>AS: manualRun
  AS->>DB: INSERT auth_executions
  AS-->>API: deferred message
  API-->>U: "Execution engine not enabled"
```

---

## Example 4: API request lifecycle

```mermaid
sequenceDiagram
  participant C as Client
  participant M as Middleware
  participant H as Handler
  participant S as DomainService

  C->>M: Request + cookie
  M->>M: correlation ID
  M->>M: rate limit
  M->>H: routed
  H->>S: business method
  S-->>H: result
  H-->>C: JSON + x-correlation-id
```

---

## Example 5: Why this is not an AI wrapper (decision flow)

```
User clicks "Analyze"
  → NOT: openai.chat(userText)
  → YES:
      1. Load workspace scope + session
      2. Build structured cognitive input from research session
      3. Orchestrator runs evidence engine on classified inputs
      4. Reasoning engine produces trace
      5. Decision engine proposes recommendation (executionReady: false)
      6. Verification gate evaluates release
      7. Persist recommendation with refs
      8. User must approve before any future execution (M5)
```

---

## Example 6: Tenant isolation check

```
Request: GET /api/workspaces/{workspaceB}/intelligence/feed
Session: user in orgA, workspaceA active

→ WorkspaceService validates workspaceB.orgId === session.orgId
→ If mismatch: 403 Forbidden
→ If role insufficient: 403 via canAccessModuleRead
```

---

*Return to: [Project Brain README](./README.md)*
