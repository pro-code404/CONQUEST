import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import type {
  AiProviderStatusSummaryView,
  CacheStatusView,
  OperationsDashboardView,
  QueueMonitorView,
} from "@conquest/contracts";
import type { UserRole } from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";

export interface OperationsTelemetryProvider {
  getQueueMetrics(): QueueMonitorView;
  getCacheStatus(): CacheStatusView;
  listAiProviderStatus(): AiProviderStatusSummaryView[];
}

const DEFAULT_QUEUE: QueueMonitorView = {
  queued: 0,
  running: 0,
  completed: 0,
  failed: 0,
  deadLetter: 0,
};

const DEFAULT_CACHE: CacheStatusView = {
  provider: "in-memory",
  healthy: true,
  hits: 0,
  misses: 0,
};

export class OperationsService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.OPERATIONS;

  constructor(
    private readonly repo: AuthRepository,
    private readonly telemetryProvider?: OperationsTelemetryProvider,
  ) {
    super();
  }

  async getDashboard(sessionId: string, workspaceId: string): Promise<OperationsDashboardView> {
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);
    const queue = this.telemetryProvider?.getQueueMetrics() ?? DEFAULT_QUEUE;
    const cache = this.telemetryProvider?.getCacheStatus() ?? DEFAULT_CACHE;
    const aiProviders = this.telemetryProvider?.listAiProviderStatus() ?? [];
    const auditEventCount = (await this.repo.listAuditEvents(workspace.orgId, { limit: 10_000 })).length;

    const services = [
      { name: "api", healthy: true, details: "Conquest API responding" },
      { name: "auth", healthy: true, details: "Identity service healthy" },
      { name: "cache", healthy: cache.healthy, details: `provider=${cache.provider}` },
      { name: "jobs", healthy: queue.deadLetter < 100, details: `queued=${queue.queued}` },
    ];

    return {
      workspaceId,
      systemHealthy: services.every((service) => service.healthy),
      services,
      queue,
      cache,
      aiProviders,
      auditEventCount,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  private async requireWorkspaceAccess(sessionId: string, workspaceId: string) {
    const session = await this.requireSession(sessionId);
    const workspace = await this.repo.findWorkspace(workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    assertOrgAccess({ orgId: session.orgId }, workspace.orgId);
    const user = await this.repo.findUserById(session.userId);
    if (!user) throw new Error("User not found");
    return { session, user, workspace };
  }

  private requireMember(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.member) {
      throw new Error("Member access required");
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
