/**
 * Primary navigation — UXMD-I §C.2 (seven items, frozen).
 */
export const PRIMARY_NAV_ITEMS = [
  { id: "command-center", label: "Command Center", pathSegment: "command-center" },
  { id: "reports", label: "Reports", pathSegment: "reports" },
  { id: "automation", label: "Automation", pathSegment: "automation" },
  { id: "knowledge", label: "Knowledge", pathSegment: "knowledge" },
  { id: "strategy", label: "Strategy Center", pathSegment: "strategy" },
  { id: "marketplace", label: "Marketplace", pathSegment: "marketplace" },
  { id: "settings", label: "Settings", pathSegment: "settings" },
] as const;

export type PrimaryNavId = (typeof PRIMARY_NAV_ITEMS)[number]["id"];

export function assertPrimaryNavCount(count: number): void {
  if (count !== 7) {
    throw new Error(`NAV-1 violation: primary navigation must have exactly 7 items (got ${count})`);
  }
}

assertPrimaryNavCount(PRIMARY_NAV_ITEMS.length);

export function workspacePath(workspaceId: string, segment: string): string {
  if (!workspaceId.trim()) throw new Error("workspaceId is required");
  if (!segment.trim()) throw new Error("path segment is required");
  return `/app/w/${workspaceId}/${segment}`;
}
