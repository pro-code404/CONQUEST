/** GIS §2.1–2.3 — role hierarchy and module read access for route guards. */
export const GIS_ROLES = ["owner", "admin", "manager", "member", "viewer"] as const;
export type GisRole = (typeof GIS_ROLES)[number];

export const ROLE_RANK: Record<GisRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1,
};

/** Minimum role required to enter a primary nav module (read access). GIS §2.3 */
export const MODULE_MIN_READ_ROLE: Record<string, GisRole> = {
  "command-center": "viewer",
  reports: "viewer",
  automation: "member",
  knowledge: "viewer",
  strategy: "viewer",
  marketplace: "viewer",
  settings: "member",
  intelligence: "viewer",
  research: "viewer",
  operations: "viewer",
};

export function roleMeetsMinimum(role: GisRole, minimum: GisRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function minimumRoleForModule(segment: string): GisRole {
  return MODULE_MIN_READ_ROLE[segment] ?? "viewer";
}

export function canAccessModuleRead(role: GisRole, segment: string): boolean {
  return roleMeetsMinimum(role, minimumRoleForModule(segment));
}

export function assertModuleReadAccess(role: GisRole, segment: string): void {
  if (!canAccessModuleRead(role, segment)) {
    throw new ModuleAccessDeniedError(role, segment);
  }
}

export class ModuleAccessDeniedError extends Error {
  constructor(
    readonly role: GisRole,
    readonly segment: string,
  ) {
    super(`Role ${role} cannot access module ${segment}`);
    this.name = "ModuleAccessDeniedError";
  }
}
