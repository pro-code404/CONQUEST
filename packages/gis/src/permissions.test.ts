import { describe, it, expect } from "vitest";
import {
  canAccessModuleRead,
  assertModuleReadAccess,
  ModuleAccessDeniedError,
  roleMeetsMinimum,
} from "./permissions.js";

describe("GIS permissions (RTM-UX-005)", () => {
  it("enforces Owner > Admin > Manager > Member > Viewer hierarchy", () => {
    expect(roleMeetsMinimum("owner", "viewer")).toBe(true);
    expect(roleMeetsMinimum("viewer", "member")).toBe(false);
    expect(roleMeetsMinimum("manager", "manager")).toBe(true);
  });

  it("allows viewers to read command center and reports", () => {
    expect(canAccessModuleRead("viewer", "command-center")).toBe(true);
    expect(canAccessModuleRead("viewer", "reports")).toBe(true);
  });

  it("blocks viewers from automation and settings", () => {
    expect(canAccessModuleRead("viewer", "automation")).toBe(false);
    expect(canAccessModuleRead("viewer", "settings")).toBe(false);
  });

  it("allows members into automation", () => {
    expect(canAccessModuleRead("member", "automation")).toBe(true);
  });

  it("fails closed on permission denial (RTM-UX-006)", () => {
    expect(() => assertModuleReadAccess("viewer", "automation")).toThrow(ModuleAccessDeniedError);
  });
});
