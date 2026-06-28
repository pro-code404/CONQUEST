import { MODULE_MIN_READ_ROLE } from "./permissions.js";
import { PRIMARY_NAV_ITEMS } from "./navigation.js";

/** All workspace module path segments with GIS read permissions (primary + secondary). */
export function workspaceModuleSegments(): string[] {
  return Object.keys(MODULE_MIN_READ_ROLE);
}

/** Whether a path segment is a registered workspace module (not a sub-route). */
export function isWorkspaceModule(segment: string): boolean {
  return segment in MODULE_MIN_READ_ROLE;
}

/** Whether a segment is one of the seven frozen primary nav items. */
export function isPrimaryNavSegment(segment: string): boolean {
  return PRIMARY_NAV_ITEMS.some((item) => item.pathSegment === segment);
}

/**
 * Parses `/app/w/:workspaceId/:moduleSegment/...` — module segment is always the first
 * path segment after the workspace id so nested routes inherit module authorization.
 */
export function parseWorkspaceModulePath(
  pathname: string,
): { workspaceId: string; moduleSegment: string } | null {
  const match = pathname.match(/^\/app\/w\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { workspaceId: match[1]!, moduleSegment: match[2]! };
}
