# Build-2 Preview Regression — Root Cause Analysis

**Date:** 2026-06-29  
**Status:** Resolved  
**Severity:** P0 — preview blocked  
**Build gate:** Build-2 paused until preview operational (this document closes the gate)

---

## Symptom

Opening the web preview at `http://127.0.0.1:5173/` produced:

```
Conquest failed to load
Cannot destructure property 'basename' of 'React.useContext(...)' as it is null.
```

---

## Root cause

**`CookieConsentBanner` rendered `<Link>` from `react-router-dom` outside `RouterProvider`.**

### Bootstrap chain (correct nesting after fix)

```
main.tsx
  StrictMode
    ErrorBoundary
      AuthProvider          ← session state; no router hooks
        App
          RouterProvider    ← creates router context (basename, navigator, …)
            RootLayout
              Outlet        ← matched route screen
              CookieConsentBanner  ← uses <Link>; MUST be inside RouterProvider
```

### Failure chain (M4 through preview debug)

```
App.tsx (broken)
  <>
    RouterProvider
    CookieConsentBanner   ← SIBLING: no router context
  </>
```

1. Landing route renders inside `RouterProvider` (briefly visible).
2. `CookieConsentBanner` mounts with `visible=false`, then `useEffect` sets `visible=true` when `localStorage` has no consent key.
3. Banner renders `<Link to={ROUTES.legal.cookies}>`.
4. `Link` calls `useContext(NavigationContext)` → **null** → destructuring `basename` throws.
5. `ErrorBoundary` (added during preview debugging) surfaces the error instead of a silent blank page.

### When introduced

| Change | Commit / phase | Effect |
|--------|----------------|--------|
| `CookieConsentBanner` as `RouterProvider` sibling | **Build-2 M2** (`App.tsx` at `76b02e5`) | Latent defect |
| Recovery Phase 2 | Documentation only | Did **not** introduce routing bug |
| Preview hardening | `ErrorBoundary`, boot splash, Vite aliases | Made latent defect **visible** |

Recovery Phase 2 did not modify `App.tsx` routing at M4. The architectural violation predates Recovery Phase 2.

---

## Task 1 — Bootstrap verification

| File | Role | Status |
|------|------|--------|
| `apps/web/index.html` | `#root` + boot splash | OK |
| `apps/web/src/main.tsx` | `createRoot` → `AuthProvider` → `App` | OK |
| `apps/web/src/App.tsx` | `RouterProvider` only | **Fixed** |
| `apps/web/src/routes/index.tsx` | `createBrowserRouter` route tree | OK — `RootLayout` wraps all routes |
| `apps/web/src/layouts/RootLayout.tsx` | `Outlet` + global chrome | **Added** |
| `apps/web/src/layouts/WorkspaceLayout.tsx` | Workspace shell + nav | OK — inside route tree |
| Command Center | `/app/w/:workspaceId/command-center` | OK — nested under `RequireWorkspaceRoute` |

**Router API:** `createBrowserRouter` + `RouterProvider` (not `BrowserRouter`). This is valid React Router v6 data-router pattern.

---

## Task 2 — Router API inventory

All `react-router-dom` usage in `apps/web` (verified inside route tree post-fix):

| File | APIs | Context |
|------|------|---------|
| `layouts/RootLayout.tsx` | `Outlet` | Root route element |
| `auth/RouteGuards.tsx` | `Navigate`, `Outlet`, `useLocation` | Route guard layouts |
| `layouts/WorkspaceLayout.tsx` | `Outlet`, `useNavigate`, `useLocation`, `useParams` | Workspace layout |
| `layouts/SettingsLayout.tsx` | `Outlet`, `useNavigate` | Settings layout |
| `features/legal/CookieConsentBanner.tsx` | `Link` | **RootLayout** (was App sibling) |
| `features/screens.tsx` | `Link`, `useNavigate`, `useParams`, `useSearchParams` | Route screens |
| `features/settings/*`, `intelligence/*`, etc. | `Link`, `useParams`, `useNavigate` | Route screens |
| `pages/ForbiddenPage.tsx` | `Link` | Route screen |
| `auth/AuthenticatedRedirect.tsx` | `Navigate` | Route screen |

`packages/presentation` — **no** `react-router-dom` imports (presentation uses callbacks/`href`; correct layer boundary).

No `useRoutes` or `NavLink` in codebase.

---

## Task 3 — Before / after Recovery Phase 2

| Aspect | M4 (`76b02e5`) | After fix |
|--------|----------------|-----------|
| `App.tsx` | `CookieConsentBanner` sibling of `RouterProvider` | `RouterProvider` only |
| Route tree | Flat top-level routes | `RootLayout` parent with `children` |
| `main.tsx` | `AuthProvider` → `App` | + `ErrorBoundary` |
| Recovery Phase 2 docs | N/A | No routing code changes |

---

## Task 4 — Provider ordering

| Provider | Exists? | Position | Notes |
|----------|---------|----------|-------|
| `RouterProvider` | Yes | Inside `App` | Data router |
| `AuthProvider` | Yes | Outside router in `main.tsx` | Intentional — guards call `useAuth` inside routes |
| Workspace Provider | **No** | — | Workspace = route param + `useAuth` |
| GIS Provider | **No** | — | GIS = static tokens (`@conquest/gis`) |
| Theme Provider | **No** | — | CSS variables in `global.css` |
| Query Provider | **No** | — | `fetch` in feature clients |

**Correct order:** `ErrorBoundary` → `AuthProvider` → `RouterProvider` → route layouts → screens.

No provider ordering regression. Missing providers are architectural choices, not regressions.

---

## Task 5 — Route wrappers

All guards preserved:

- `RequireGuest` — public auth routes
- `RequireAuth` — authenticated shell
- `RequireVerifyEmailRoute` — email verification
- `RequireOnboardingRoute` — onboarding flow
- `RequireAppShell` — app + settings + profile
- `RequireWorkspaceRoute` — workspace modules (CC, intelligence, research, automation, settings)

`RootLayout` added **above** existing routes without removing any wrapper.

---

## Task 6 & 7 — Runtime validation

| Check | Result |
|-------|--------|
| `App.runtime.test.tsx` (happy-dom) | **PASS** — landing + cookie banner, no basename error |
| `router-context.test.ts` (static) | **PASS** — composition guards |
| `e2e/preview-routes.spec.ts` (Playwright + Chrome) | **PASS** — landing, login, legal |
| React runtime errors | None in smoke tests |
| Blank page | None in smoke tests |
| Cookie banner + Link | Works inside `RootLayout` |

**Screenshot:** `docs/build-2/preview-landing-verified.png` (captured via Playwright)

Full closed-beta journey e2e (`e2e/closed-beta-journey.spec.ts`) remains the integration gate for authenticated workspace flows; run when Playwright browsers available in CI.

---

## Why tests passed while runtime failed

| Test type | Why it missed the bug |
|-----------|----------------------|
| Vitest unit (node) | No React DOM render; static source tests only |
| `screens.test.ts` | Asserts telemetry strings in source files |
| `route-access.test.ts` | Pure functions — no `Link` components |
| API tests (`apps/api`) | No frontend router |
| E2E in CI | Would catch bug **if** cookie banner appears before accept — but local Playwright browser install failed; CI may not have run recently on this machine |
| Latent timing | Landing visible briefly before `useEffect` shows banner; manual testing often looked like “blank” until ErrorBoundary added |

**Gap closed:** `App.runtime.test.tsx` clears `localStorage` and asserts cookie banner renders without crash.

---

## Files changed (fix + prevention)

| File | Change |
|------|--------|
| `apps/web/src/App.tsx` | Remove `CookieConsentBanner` sibling |
| `apps/web/src/layouts/RootLayout.tsx` | **New** — `Outlet` + banner inside router |
| `apps/web/src/routes/index.tsx` | Wrap all routes in `RootLayout` |
| `apps/web/src/main.tsx` | `ErrorBoundary` (preview diagnostics) |
| `apps/web/src/App.runtime.test.tsx` | **New** — runtime regression test |
| `apps/web/src/router-context.test.ts` | **New** — static composition guards |
| `e2e/preview-routes.spec.ts` | **New** — Playwright smoke |
| `vitest.config.ts` | Include `*.test.tsx` |
| `package.json` | `@testing-library/react`, `happy-dom` |
| `playwright.config.ts` | Use system Chrome locally when not CI |

---

## Regression prevention

1. **Rule:** Any component using `Link`, `NavLink`, `Navigate`, or router hooks must be a **descendant** of `RouterProvider` (typically via route `element` or `RootLayout`).
2. **Static guard:** `router-context.test.ts` fails if `CookieConsentBanner` reappears in `App.tsx`.
3. **Runtime guard:** `App.runtime.test.tsx` reproduces cookie-banner mount with empty `localStorage`.
4. **E2E guard:** `preview-routes.spec.ts` asserts no `basename` page errors on landing.
5. **Engineering constitution:** Document in `docs/knowledge-base/engineering-constitution.md` (router rule).

---

## Build-2 gate recommendation

**Preview is operational.** Build-2 may resume planning after merge of this fix. **M5 remains gated** per prior Recovery Phase 2 report (BAR B-25–B-28, legal counsel).

---

*Verified: 2026-06-29 — Vitest runtime + Playwright preview smoke passing.*
