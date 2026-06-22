/** Conquest Intelligence OS — canonical design tokens */
export const tokens = {
  color: {
    bg: "#070B13",
    surface: "#0D1420",
    card: "#101B2D",
    primary: "#2F6FFF",
    cyan: "#21D4FD",
    purple: "#8A5CFF",
    success: "#16C784",
    warning: "#F59E0B",
    danger: "#EF4444",
    textPrimary: "#FFFFFF",
    textSecondary: "#A8B3CF",
    muted: "#667085",
    border: "rgba(255,255,255,0.08)",
  },
  space: {
    unit: 8,
    navHeight: 56,
    sidebarWidth: 240,
    intelWidth: 360,
    statusHeight: 32,
  },
  radius: {
    card: 12,
    button: 8,
    chip: 6,
  },
  motion: {
    fast: 150,
    normal: 200,
    slow: 250,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  typography: {
    family: '"Inter", system-ui, sans-serif',
    scale: {
      xs: 10,
      sm: 12,
      base: 13,
      md: 14,
      lg: 16,
      xl: 20,
      "2xl": 24,
      "3xl": 28,
    },
  },
} as const;
