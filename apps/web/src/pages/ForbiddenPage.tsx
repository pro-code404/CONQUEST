import { Link } from "react-router-dom";
import { color, spacing, typography } from "@conquest/gis";
import { PublicAuthLayout } from "@conquest/presentation";

/** GIS §2.5 / SYS-01 — missing permission (route guard only). */
export function ForbiddenPage() {
  return (
    <PublicAuthLayout
      title="Missing permission"
      subtitle="You do not have access to this area. Contact your workspace admin."
    >
      <p style={{ color: color.textSecondary, marginBottom: spacing.lg, lineHeight: typography.lineHeightNormal }}>
        Conquest enforces role boundaries on every protected route. Your current role does not include this
        capability.
      </p>
      <Link to="/app">Return to Command Center</Link>
    </PublicAuthLayout>
  );
}
