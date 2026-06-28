import { SERVICE_NAMES } from "@conquest/core";
import { AUDIT_CONSTANTS } from "@conquest/config";
import { ApplicationServiceBase } from "@conquest/service-shared";
import { ROLE_RANK } from "@conquest/gis";
import type { AuditLogQuery, AuditLogView, AuditEventView } from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";

export class AuditService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.SETTINGS;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async listActivityLog(sessionId: string, query: AuditLogQuery = {}): Promise<AuditLogView> {
    const session = await this.requireSession(sessionId);
    const user = await this.requireUser(session.userId);
    if (ROLE_RANK[user.role] < ROLE_RANK.manager) {
      throw new Error("Manager access required");
    }
    const limit = Math.min(query.limit ?? AUDIT_CONSTANTS.DEFAULT_LIMIT, AUDIT_CONSTANTS.MAX_LIMIT);
    const events = (
      await this.repo.listAuditEvents(user.orgId, {
        ...(query.category ? { category: query.category } : {}),
        ...(query.search ? { search: query.search } : {}),
        ...(query.workspaceId ? { workspaceId: query.workspaceId } : {}),
        limit,
      })
    ).map((event) => this.toView(event));
    return { events, exportAvailable: false };
  }

  private toView(event: {
    id: string;
    category: AuditEventView["category"];
    action: string;
    actorId: string;
    actorName: string;
    resourceType: string;
    resourceId: string;
    workspaceId: string | null;
    orgId: string;
    summary: string;
    timestamp: number;
  }): AuditEventView {
    return {
      id: event.id,
      category: event.category,
      action: event.action,
      actorId: event.actorId,
      actorName: event.actorName,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      workspaceId: event.workspaceId,
      orgId: event.orgId,
      summary: event.summary,
      timestamp: new Date(event.timestamp).toISOString(),
    };
  }

  private async requireUser(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  private async requireSession(sessionId: string) {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    return session;
  }
}
