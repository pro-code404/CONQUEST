import { randomUUID } from "node:crypto";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  CreateResearchSessionSchema,
  RegisterResearchSourceSchema,
  type CreateResearchSessionInput,
  type RegisterResearchSourceInput,
  type ResearchSessionDetailView,
  type ResearchSessionView,
  type ResearchSourceView,
} from "@conquest/contracts";
import type { UserRole } from "@conquest/contracts";
import type { ResearchSessionRecord, ResearchSourceRecord } from "./memory-repository.js";
import type { AuthRepository } from "./auth-repository.js";

export class ResearchService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.RESEARCH;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  async listSessions(sessionId: string, workspaceId: string): Promise<ResearchSessionView[]> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    await this.ensureOrgSources((await this.requireWorkspaceAccess(sessionId, workspaceId)).workspace.orgId);
    return (await this.repo.listResearchSessionsForWorkspace(workspaceId))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((session) => this.toSummary(session));
  }

  async getSession(
    sessionId: string,
    workspaceId: string,
    researchSessionId: string,
  ): Promise<ResearchSessionDetailView> {
    const { workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const record = await this.repo.findResearchSession(researchSessionId);
    if (!record || record.workspaceId !== workspaceId) throw new Error("Research session not found");
    assertOrgAccess({ orgId: workspace.orgId }, record.orgId);
    return this.toDetail(record);
  }

  async createSession(
    sessionId: string,
    workspaceId: string,
    raw: CreateResearchSessionInput,
  ): Promise<ResearchSessionDetailView> {
    const input = CreateResearchSessionSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);
    const now = Date.now();
    const record: ResearchSessionRecord = {
      id: randomUUID(),
      workspaceId,
      orgId: workspace.orgId,
      title: input.title.trim(),
      status: "active",
      sources: [],
      citations: [],
      notes: "",
      createdAt: now,
      updatedAt: now,
    };
    await this.repo.saveResearchSession(record);
    this.emit("research_session_created", "info", { sessionId: record.id, workspaceId });
    return this.toDetail(record);
  }

  async registerSource(
    sessionId: string,
    workspaceId: string,
    researchSessionId: string,
    raw: RegisterResearchSourceInput,
  ): Promise<ResearchSessionDetailView> {
    const input = RegisterResearchSourceSchema.parse(raw);
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);
    const record = await this.repo.findResearchSession(researchSessionId);
    if (!record || record.workspaceId !== workspaceId) throw new Error("Research session not found");
    assertOrgAccess({ orgId: workspace.orgId }, record.orgId);

    const source: ResearchSourceRecord = {
      id: randomUUID(),
      orgId: workspace.orgId,
      name: input.name.trim(),
      type: input.type.trim(),
      trusted: false,
    };
    const orgSources = await this.repo.listResearchSources(workspace.orgId);
    orgSources.push(source);
    await this.repo.saveResearchSources(workspace.orgId, orgSources);

    record.sources.push(source);
    record.updatedAt = Date.now();
    await this.repo.saveResearchSession(record);
    return this.toDetail(record);
  }

  async listOrgSources(sessionId: string, workspaceId: string): Promise<ResearchSourceView[]> {
    const { workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    await this.ensureOrgSources(workspace.orgId);
    return (await this.repo.listResearchSources(workspace.orgId)).map((source) => this.toSource(source));
  }

  private async ensureOrgSources(orgId: string): Promise<void> {
    if ((await this.repo.listResearchSources(orgId)).length > 0) return;
    await this.repo.saveResearchSources(orgId, [
      { id: "src-internal", orgId, name: "Internal knowledge base", type: "internal", trusted: true },
      { id: "src-uploads", orgId, name: "Workspace uploads", type: "document", trusted: true },
    ]);
  }

  private toSummary(record: ResearchSessionRecord): ResearchSessionView {
    return {
      id: record.id,
      workspaceId: record.workspaceId,
      title: record.title,
      status: record.status,
      sourceCount: record.sources.length,
      evidenceCount: record.citations.length,
      createdAt: new Date(record.createdAt).toISOString(),
      updatedAt: new Date(record.updatedAt).toISOString(),
    };
  }

  private toDetail(record: ResearchSessionRecord): ResearchSessionDetailView {
    return {
      ...this.toSummary(record),
      sources: record.sources.map((source) => this.toSource(source)),
      citations: record.citations.map((citation) => ({
        sourceId: citation.sourceId,
        title: citation.title,
        excerpt: citation.excerpt,
        retrievedAt: new Date(citation.retrievedAt).toISOString(),
      })),
      notes: record.notes,
    };
  }

  private toSource(source: ResearchSourceRecord): ResearchSourceView {
    return {
      id: source.id,
      name: source.name,
      type: source.type,
      trusted: source.trusted,
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
