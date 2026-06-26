# Design Tokens

Implementation reference. CSS custom properties + TypeScript export.

## CSS variables (`apps/web/src/styles/tokens.css`)

```css
:root {
  /* Color — dark default */
  --bg-base: #0a0e14;
  --bg-elevated: #121820;
  --bg-sunken: #060910;
  --border-subtle: #1e2a3a;
  --border-strong: #2d3d52;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-muted: #5c6670;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;

  /* Typography */
  --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --text-xs: 0.6875rem;
  --text-sm: 0.8125rem;
  --text-base: 0.9375rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 2.5rem;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Layout */
  --command-height: 64px;
  --rail-width-collapsed: 56px;
  --rail-width-expanded: 220px;
  --dock-width: 360px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Elevation */
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.25);
}

[data-theme="light"] {
  --bg-base: #f8fafc;
  --bg-elevated: #ffffff;
  --bg-sunken: #f1f5f9;
  --border-subtle: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
}
```

## TypeScript (`packages/ui/src/tokens.ts`)

Export mirror of CSS tokens for programmatic use (charts, etc.).

## Z-index

```typescript
export const zIndex = {
  rail: 90,
  dock: 80,
  command: 100,
  modal: 200,
  commandPalette: 300,
  toast: 400,
} as const;
```

## Breakpoints

```typescript
export const breakpoints = {
  mobile: 768,
  tablet: 1280,
  desktop: 1280,
} as const;
```

Tokens are the single source of truth for visual implementation. No hardcoded colors in components.
