import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  UpdateFeatureFlagSchema,
  type AdministrationDashboardView,
  type UpdateFeatureFlagInput,
} from "@conquest/contracts";
import type { UserRole } from "@conquest/contracts";
import type { FeatureFlagRecord } from "./memory-repository.js";
import type { AuthRepository } from "./auth-repository.js";

const DEFAULT_FLAGS: Omit<FeatureFlagRecord, never>[] = [
  {
    id: "intelligence_feed",
    label: "Intelligence feed",
    enabled: true,
    description: "Surface orchestrated intelligence signals in workspace views.",
  },
  {
    id: "research_workspace",
    label: "Research workspace",
    enabled: true,
    description: "Enable research sessions and evidence collection framework.",
  },
  {
    id: "ai_gateway",
    label: "AI Gateway",
    enabled: true,
    description: "Allow routed AI provider calls through the platform gateway.",
  },
];

export class AdministrationService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.ADMINISTRATION;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async getDashboard(sessionId: string): Promise<AdministrationDashboardView> {
    const { session, user } = await this.requireSessionUser(sessionId);
    this.requireAdmin(user);
    const org = await this.repo.findOrg(session.orgId);
    if (!org) throw new Error("Organization not found");
    await this.ensureFeatureFlags(org.id);

    const workspaces = await this.repo.listWorkspacesForOrg(org.id);
    const members = await this.repo.listUsersForOrg(org.id);
    const mfaEnrolled = members.filter((member) => member.mfaEnrolled).length;
    const activeSessions = await this.repo.countActiveSessionsForOrg(org.id);
    const recentSecurityEvents = (
      await this.repo.listAuditEvents(org.id, { category: "security", limit: 500 })
    ).length;

    return {
      orgId: org.id,
      orgName: org.name,
      featureFlags: await this.repo.getFeatureFlags(org.id),
      providers: [
        { id: "openai", name: "OpenAI", status: "available", configured: true },
        { id: "anthropic", name: "Anthropic", status: "available", configured: true },
        { id: "gemini", name: "Gemini", status: "available", configured: true },
      ],
      security: {
        mfaEnrolledUsers: mfaEnrolled,
        activeSessions,
        recentSecurityEvents,
      },
      memberCount: members.length,
      workspaceCount: workspaces.length,
    };
  }

  async updateFeatureFlag(
    sessionId: string,
    flagId: string,
    raw: UpdateFeatureFlagInput,
  ): Promise<AdministrationDashboardView> {
    const input = UpdateFeatureFlagSchema.parse(raw);
    const { session, user } = await this.requireSessionUser(sessionId);
    this.requireAdmin(user);
    await this.ensureFeatureFlags(session.orgId);
    const flags = (await this.repo.getFeatureFlags(session.orgId)).map((flag) =>
      flag.id === flagId ? { ...flag, enabled: input.enabled } : flag,
    );
    await this.repo.saveFeatureFlags(session.orgId, flags);
    this.emit("feature_flag_updated", "info", { flagId, enabled: input.enabled });
    return this.getDashboard(sessionId);
  }

  private async ensureFeatureFlags(orgId: string): Promise<void> {
    if ((await this.repo.getFeatureFlags(orgId)).length > 0) return;
    await this.repo.saveFeatureFlags(orgId, DEFAULT_FLAGS.map((flag) => ({ ...flag })));
  }

  private async requireSessionUser(sessionId: string) {
    const session = await this.requireSession(sessionId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    assertOrgAccess({ orgId: session.orgId }, user.orgId);
    return { session, user };
  }

  private requireAdmin(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.admin) {
      throw new Error("Admin access required");
    }
  }

  private async requireSession(sessionId: string) {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }
}
