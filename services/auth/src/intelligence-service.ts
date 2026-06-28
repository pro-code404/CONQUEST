import { randomUUID } from "node:crypto";
import type { TenantScope } from "@conquest/core";
import { assertOrgAccess } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import { ROLE_RANK } from "@conquest/gis";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  IntelligenceFeedQuerySchema,
  UpdateAdvisoryStatusSchema,
  type AdvisoryRecommendationDetailView,
  type AdvisoryRecommendationView,
  type IntelligenceFeedItemView,
  type IntelligenceFeedQuery,
  type IntelligenceFeedView,
  type IntelligenceHomeView,
  type IntelligenceTimelineView,
  type ResearchAnalysisResultView,
  type UpdateAdvisoryStatusInput,
  advisoryDetailRoute,
} from "@conquest/contracts";
import type { UserRole } from "@conquest/contracts";
import type {
  AdvisoryRecommendationRecord,
  IntelligenceFeedItemRecord,
} from "./memory-repository.js";
import type { AuthRepository } from "./auth-repository.js";

export interface CognitiveAnalysisEvidenceItem {
  sourceId: string;
  title: string;
  excerpt: string;
}

export interface CognitiveAnalysisResult {
  requestId: string;
  correlationId: string;
  recommendationSummary: string;
  confidence: number;
  evidenceCount: number;
  evidenceRefs: string[];
  evidenceItems: CognitiveAnalysisEvidenceItem[];
  reasoningId: string | null;
  decisionId: string | null;
}

export interface IntelligenceCognitiveProvider {
  analyze(
    scope: TenantScope,
    input: { objective: string; constraints?: string[]; correlationId?: string },
  ): Promise<CognitiveAnalysisResult>;
}

export class IntelligenceService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.INTELLIGENCE;

  constructor(
    private readonly repo: AuthRepository,
    private readonly cognitive?: IntelligenceCognitiveProvider,
  ) {
    super();
  }

  async getHome(sessionId: string, workspaceId: string): Promise<IntelligenceHomeView> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const items = await this.repo.listIntelligenceFeed(workspaceId);
    const advisories = await this.repo.listAdvisories(workspaceId);
    const last = items.reduce((max, item) => Math.max(max, item.timestamp), 0);
    return {
      workspaceId,
      summary:
        advisories.length > 0
          ? "Evidence-based intelligence from cognitive analysis — explainable and auditable."
          : "No intelligence signals yet. Run research analysis to generate recommendations.",
      feedCount: items.length,
      recommendationCount: advisories.length,
      opportunityCount: items.filter((i) => i.category === "opportunity").length,
      riskCount: items.filter((i) => i.category === "risk").length,
      insightCount: items.filter((i) => i.category === "insight").length,
      lastUpdatedAt: last > 0 ? new Date(last).toISOString() : null,
    };
  }

  async getFeed(
    sessionId: string,
    workspaceId: string,
    raw?: IntelligenceFeedQuery,
  ): Promise<IntelligenceFeedView> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const query = raw ? IntelligenceFeedQuerySchema.parse(raw) : {};
    let items = await this.repo.listIntelligenceFeed(workspaceId);
    if (query.category) items = items.filter((item) => item.category === query.category);
    if (query.search?.trim()) {
      const q = query.search.trim().toLowerCase();
      items = items.filter(
        (item) => item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q),
      );
    }
    items.sort((a, b) => b.timestamp - a.timestamp);
    return {
      items: items.map((item) => this.toFeedItem(item)),
      categories: ["recommendation", "opportunity", "risk", "insight", "alert"],
    };
  }

  async listRecommendations(
    sessionId: string,
    workspaceId: string,
  ): Promise<AdvisoryRecommendationView[]> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    return (await this.repo.listAdvisories(workspaceId))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((item) => this.toAdvisory(item));
  }

  async getRecommendation(
    sessionId: string,
    workspaceId: string,
    recommendationId: string,
  ): Promise<AdvisoryRecommendationDetailView> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const record = await this.repo.findAdvisory(workspaceId, recommendationId);
    if (!record) throw new Error("Recommendation not found");
    return this.toAdvisoryDetail(record);
  }

  async updateRecommendationStatus(
    sessionId: string,
    workspaceId: string,
    recommendationId: string,
    raw: UpdateAdvisoryStatusInput,
  ): Promise<AdvisoryRecommendationDetailView> {
    const input = UpdateAdvisoryStatusSchema.parse(raw);
    const { user } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireManager(user);
    const record = await this.repo.findAdvisory(workspaceId, recommendationId);
    if (!record) throw new Error("Recommendation not found");
    record.status = input.status;
    record.updatedAt = Date.now();
    if (input.status === "approved") {
      record.approvedBy = user.displayName;
      record.approvedAt = Date.now();
    }
    await this.repo.saveAdvisories(
      workspaceId,
      (await this.repo.listAdvisories(workspaceId)).map((item) => (item.id === record.id ? record : item)),
    );
    this.emit("advisory_status_updated", "info", { recommendationId, status: input.status });
    return this.toAdvisoryDetail(record);
  }

  async listOpportunities(sessionId: string, workspaceId: string): Promise<IntelligenceFeedItemView[]> {
    return (await this.getFeed(sessionId, workspaceId, { category: "opportunity" })).items;
  }

  async listRisks(sessionId: string, workspaceId: string): Promise<IntelligenceFeedItemView[]> {
    return (await this.getFeed(sessionId, workspaceId, { category: "risk" })).items;
  }

  async getTimeline(sessionId: string, workspaceId: string): Promise<IntelligenceTimelineView> {
    this.requireMember((await this.requireWorkspaceAccess(sessionId, workspaceId)).user);
    const feed = await this.repo.listIntelligenceFeed(workspaceId);
    const advisories = await this.repo.listAdvisories(workspaceId);
    const entries = [
      ...feed.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        timestamp: new Date(item.timestamp).toISOString(),
        actor: "Cognitive evidence",
      })),
      ...advisories.map((item) => ({
        id: item.id,
        title: item.title,
        category: "recommendation" as const,
        timestamp: new Date(item.createdAt).toISOString(),
        actor: "Advisory framework",
      })),
    ].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    return { entries };
  }

  async analyzeFromResearch(
    sessionId: string,
    workspaceId: string,
    researchSessionId: string,
    correlationId?: string,
  ): Promise<ResearchAnalysisResultView> {
    if (!this.cognitive) throw new Error("Cognitive analysis is not available");
    const { user, workspace } = await this.requireWorkspaceAccess(sessionId, workspaceId);
    this.requireMember(user);

    const research = await this.repo.findResearchSession(researchSessionId);
    if (!research || research.workspaceId !== workspaceId) {
      throw new Error("Research session not found");
    }
    assertOrgAccess({ orgId: workspace.orgId }, research.orgId);

    const objective = `Research session "${research.title}": synthesize evidence and recommend next actions`;
    const constraints = research.sources.map((s) => `Source: ${s.name} (${s.type})`);

    const analysis = await this.cognitive.analyze(
      { orgId: workspace.orgId, workspaceId },
      {
        objective,
        constraints,
        ...(correlationId ? { correlationId } : {}),
      },
    );

    const advisoryId = await this.materializeFromAnalysis(
      workspaceId,
      workspace.orgId,
      research.title,
      analysis,
    );

    research.citations = analysis.evidenceItems.map((item) => ({
      sourceId: item.sourceId,
      title: item.title,
      excerpt: item.excerpt,
      retrievedAt: Date.now(),
    }));
    research.updatedAt = Date.now();
    research.notes = analysis.recommendationSummary;
    await this.repo.saveResearchSession(research);

    await this.repo.updateWorkspaceStatus(workspaceId, {
      dataSourceConnected: true,
      initializationInProgress: false,
      warningCount: 0,
      degradedZoneCount: 0,
    });

    return {
      sessionId: researchSessionId,
      workspaceId,
      recommendationId: advisoryId,
      cognitiveRequestId: analysis.requestId,
      correlationId: analysis.correlationId,
      evidenceCount: analysis.evidenceCount,
      confidence: analysis.confidence,
      recommendationSummary: analysis.recommendationSummary,
      evidenceRefs: [...analysis.evidenceRefs],
      recommendationHref: advisoryId ? advisoryDetailRoute(workspaceId, advisoryId) : null,
    };
  }

  private async materializeFromAnalysis(
    workspaceId: string,
    orgId: string,
    researchTitle: string,
    analysis: CognitiveAnalysisResult,
  ): Promise<string> {
    const now = Date.now();
    const advisoryId = randomUUID();
    const priority =
      analysis.confidence >= 0.85 ? "high" : analysis.confidence >= 0.7 ? "medium" : "low";

    const advisory: AdvisoryRecommendationRecord = {
      id: advisoryId,
      workspaceId,
      orgId,
      title: `Recommendation: ${researchTitle}`,
      summary: analysis.recommendationSummary.slice(0, 280),
      rationale: `Deterministic cognitive pipeline with ${analysis.evidenceCount} evidence item(s). Correlation ${analysis.correlationId}.`,
      evidenceRefs: [...analysis.evidenceRefs],
      priority,
      confidence: analysis.confidence,
      status: "pending",
      recommendedActions: [
        "Review evidence references",
        "Approve or modify in intelligence recommendations",
        "Monitor outcomes in Command Center",
      ],
      approvalRequired: true,
      approvedBy: null,
      approvedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const existingAdvisories = await this.repo.listAdvisories(workspaceId);
    await this.repo.saveAdvisories(workspaceId, [advisory, ...existingAdvisories]);

    const feedItems: IntelligenceFeedItemRecord[] = analysis.evidenceItems.map((item) => ({
      id: randomUUID(),
      workspaceId,
      category: classifyEvidence(item),
      title: item.title,
      summary: item.excerpt.slice(0, 200),
      confidence: analysis.confidence,
      timestamp: now,
      status: "new" as const,
    }));

    if (feedItems.length === 0) {
      feedItems.push({
        id: randomUUID(),
        workspaceId,
        category: "insight",
        title: `Analysis: ${researchTitle}`,
        summary: analysis.recommendationSummary.slice(0, 200),
        confidence: analysis.confidence,
        timestamp: now,
        status: "new",
      });
    }

    const existingFeed = await this.repo.listIntelligenceFeed(workspaceId);
    await this.repo.saveIntelligenceFeed(workspaceId, [...feedItems, ...existingFeed]);

    this.emit("intelligence_materialized", "info", {
      workspaceId,
      advisoryId,
      correlationId: analysis.correlationId,
    });

    return advisoryId;
  }

  private toFeedItem(record: IntelligenceFeedItemRecord): IntelligenceFeedItemView {
    return {
      id: record.id,
      category: record.category,
      title: record.title,
      summary: record.summary,
      confidence: record.confidence,
      timestamp: new Date(record.timestamp).toISOString(),
      status: record.status,
    };
  }

  private toAdvisory(record: AdvisoryRecommendationRecord): AdvisoryRecommendationView {
    return {
      id: record.id,
      workspaceId: record.workspaceId,
      title: record.title,
      summary: record.summary,
      rationale: record.rationale,
      evidenceRefs: [...record.evidenceRefs],
      priority: record.priority,
      confidence: record.confidence,
      status: record.status,
      recommendedActions: [...record.recommendedActions],
      createdAt: new Date(record.createdAt).toISOString(),
      updatedAt: new Date(record.updatedAt).toISOString(),
    };
  }

  private toAdvisoryDetail(record: AdvisoryRecommendationRecord): AdvisoryRecommendationDetailView {
    return {
      ...this.toAdvisory(record),
      approvalRequired: record.approvalRequired,
      approvedBy: record.approvedBy,
      approvedAt: record.approvedAt ? new Date(record.approvedAt).toISOString() : null,
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

  private requireManager(user: { role: UserRole }): void {
    if (ROLE_RANK[user.role] < ROLE_RANK.manager) {
      throw new Error("Manager access required");
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

function classifyEvidence(item: CognitiveAnalysisEvidenceItem): IntelligenceFeedItemRecord["category"] {
  const text = `${item.title} ${item.excerpt}`.toLowerCase();
  if (text.includes("risk") || text.includes("delay") || text.includes("threshold")) return "risk";
  if (text.includes("opportunity") || text.includes("expand") || text.includes("growth")) return "opportunity";
  if (text.includes("alert") || text.includes("policy") || text.includes("review")) return "alert";
  return "insight";
}
