import { randomUUID } from "node:crypto";
import type { TenantScope } from "@conquest/core";
import { SERVICE_NAMES } from "@conquest/core";
import {
  CognitiveRequestSchema,
  type CognitiveLifecycleView,
  type CognitiveRequest,
  type CognitiveResponseView,
  type CognitiveTelemetryView,
} from "@conquest/contracts";
import type { AiAuditService } from "@conquest/ai-audit";
import type { AiGateway } from "@conquest/ai-gateway";
import type { CacheService } from "@conquest/cache";
import type { JobService } from "@conquest/jobs";
import type { CognitiveMemoryManager } from "@conquest/memory-service";
import type { PromptRegistry } from "@conquest/prompt-management";
import { ApplicationServiceBase } from "@conquest/service-shared";
import type { DecisionEngine } from "./decision-engine.js";
import type { EvidenceEngine } from "./evidence-engine.js";
import type { ReasoningEngine } from "./reasoning-engine.js";

export interface CognitiveMetricsRecorder {
  record(event: {
    correlationId: string;
    durationMs: number;
    cacheHit: boolean;
    evidenceCount: number;
    confidence: number;
    success: boolean;
    phases: string[];
    providerId: string | null;
    fallbackUsed: boolean;
  }): void;
}

export interface CognitiveOrchestratorDeps {
  reasoning: ReasoningEngine;
  evidence: EvidenceEngine;
  decision: DecisionEngine;
  memory: CognitiveMemoryManager;
  cache: CacheService;
  jobs: JobService;
  aiGateway: AiGateway;
  aiAudit: AiAuditService;
  prompts: PromptRegistry;
  metrics?: CognitiveMetricsRecorder;
}

interface LifecycleRecord {
  requestId: string;
  correlationId: string;
  status: CognitiveLifecycleView["status"];
  startedAt: number;
  completedAt: number | null;
  phases: string[];
  workspaceId: string;
  orgId: string;
  lastAuditId: string | null;
}

/**
 * Cognitive orchestrator — coordinates services only, contains no business logic.
 * Deterministic pipeline: memory → prompt → evidence → reasoning → decision → persistence → audit.
 */
export class CognitiveOrchestrator extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.COGNITIVE_ORCHESTRATOR;

  private readonly lifecycles = new Map<string, LifecycleRecord>();
  private readonly responses = new Map<string, CognitiveResponseView>();

  constructor(private readonly deps: CognitiveOrchestratorDeps) {
    super();
  }

  async run(scope: TenantScope, raw: CognitiveRequest): Promise<CognitiveResponseView> {
    const input = CognitiveRequestSchema.parse(raw);
    if (input.workspaceId !== scope.workspaceId) throw new Error("Workspace scope mismatch");

    const requestId = randomUUID();
    const correlationId = input.correlationId ?? randomUUID();
    const lifecycle = this.beginLifecycle(requestId, correlationId, scope, input.workspaceId);

    const cacheKey = this.cacheKey(scope, input);
    const cached = await this.safeCacheGet(scope, cacheKey, lifecycle);
    if (cached) {
      lifecycle.status = "completed";
      lifecycle.completedAt = Date.now();
      lifecycle.phases.push("cache_hit");
      const response = this.attachTelemetry(
        {
          ...cached,
          requestId: lifecycle.requestId,
          correlationId: lifecycle.correlationId,
        },
        lifecycle,
        true,
      );
      this.recordMetrics(lifecycle, response, true);
      return response;
    }

    if (input.async) {
      lifecycle.status = "queued";
      lifecycle.phases.push("queued");
      await this.deps.jobs.enqueue({
        type: "ai_request",
        payload: { kind: "cognitive.run", requestId, scope, input },
        correlationId,
        tenant: scope,
      });
      return {
        requestId,
        correlationId,
        lifecycle: "queued",
        recommendationId: null,
        decisionId: null,
        evidenceCount: 0,
        confidence: 0,
      };
    }

    return this.executePipeline(scope, input, lifecycle);
  }

  /** Completes an async-queued cognitive request — invoked by the job handler. */
  async completeQueued(
    requestId: string,
    scope: TenantScope,
    input: CognitiveRequest,
  ): Promise<CognitiveResponseView> {
    const lifecycle = this.lifecycles.get(requestId);
    if (!lifecycle) throw new Error("Cognitive request not found");
    return this.executePipeline(scope, input, lifecycle);
  }

  getLifecycle(requestId: string): CognitiveLifecycleView {
    const record = this.lifecycles.get(requestId);
    if (!record) throw new Error("Cognitive request not found");
    return this.toLifecycleView(record);
  }

  getResponse(requestId: string): CognitiveResponseView | null {
    return this.responses.get(requestId) ?? null;
  }

  private beginLifecycle(
    requestId: string,
    correlationId: string,
    scope: TenantScope,
    workspaceId: string,
  ): LifecycleRecord {
    const lifecycle: LifecycleRecord = {
      requestId,
      correlationId,
      status: "accepted",
      startedAt: Date.now(),
      completedAt: null,
      phases: [],
      workspaceId,
      orgId: scope.orgId,
      lastAuditId: null,
    };
    this.lifecycles.set(requestId, lifecycle);
    return lifecycle;
  }

  private async executePipeline(
    scope: TenantScope,
    input: CognitiveRequest,
    lifecycle: LifecycleRecord,
  ): Promise<CognitiveResponseView> {
    lifecycle.status = "running";
    let providerId: string | null = null;
    let fallbackUsed = false;

    try {
      lifecycle.phases.push("memory_retrieve");
      const memories = await this.deps.memory.retrieve(scope, {
        workspaceId: input.workspaceId,
        segment: "workspace",
        query: input.objective,
        limit: 10,
      });

      lifecycle.phases.push("prompt_compile");
      this.deps.prompts.ensureDefaults();
      this.deps.prompts.render({
        templateId: "cognitive.reasoning",
        variables: {
          objective: input.objective,
          constraints: (input.constraints ?? []).join("; ") || "none",
        },
        userInput: input.objective,
      });

      lifecycle.phases.push("evidence_collect");
      const portfolio = this.deps.evidence.collect(input.workspaceId, {
        workspaceId: input.workspaceId,
        sources: [
          {
            sourceId: "workspace.memory",
            title: "Workspace memory context",
            excerpt: memories.map((m) => m.summary).join("; ") || "No prior workspace memory",
            evidenceClass: "verified_fact",
            reliability: 0.85,
          },
          {
            sourceId: "request.objective",
            title: "Request objective",
            excerpt: input.objective,
            evidenceClass: "verified_fact",
            reliability: 0.95,
          },
        ],
      });

      lifecycle.phases.push("reasoning");
      const reasoning = this.deps.reasoning.reason(input.workspaceId, {
        workspaceId: input.workspaceId,
        objective: input.objective,
        context: input.context,
        constraints: input.constraints,
        evidenceIds: portfolio.items.map((item) => item.id),
      });

      lifecycle.phases.push("decision");
      const decision = this.deps.decision.evaluate(input.workspaceId, {
        workspaceId: input.workspaceId,
        candidates: [
          {
            id: "primary",
            title: "Adopt reasoning recommendation",
            summary: reasoning.recommendation,
            evidenceIds: portfolio.items.map((item) => item.id),
            priority: "medium",
          },
        ],
        constraints: input.constraints,
      });

      lifecycle.phases.push("memory_persist");
      await this.deps.memory.storeReasoningSummary(
        scope,
        input.workspaceId,
        reasoning.id,
        reasoning.recommendation,
      );
      if (decision.topCandidateId) {
        await this.deps.memory.storeDecisionRecord(
          scope,
          input.workspaceId,
          decision.id,
          decision.rankedCandidates[0]?.summary ?? decision.topCandidateId,
        );
      }

      lifecycle.phases.push("provider_route");
      const route = this.deps.aiGateway.getRegistry().list()[0];
      providerId = route?.id ?? null;
      fallbackUsed = providerId !== "openai";

      lifecycle.phases.push("audit");
      const auditRecord = this.deps.aiAudit.record({
        provider: "cognitive-orchestrator",
        model: "deterministic",
        orgId: scope.orgId,
        workspaceId: scope.workspaceId ?? undefined,
        tokenCount: 0,
        estimatedCostUsd: 0,
        latencyMs: Date.now() - lifecycle.startedAt,
        success: true,
        correlationId: lifecycle.correlationId,
      });
      lifecycle.lastAuditId = auditRecord.id;

      const response: CognitiveResponseView = {
        requestId: lifecycle.requestId,
        correlationId: lifecycle.correlationId,
        lifecycle: "completed",
        recommendationId: reasoning.id,
        decisionId: decision.id,
        evidenceCount: portfolio.items.length,
        confidence: reasoning.confidence,
        recommendationSummary: reasoning.recommendation,
        evidenceRefs: portfolio.items.map((item) => item.id),
        evidenceSummaries: portfolio.items.map((item) => ({
          id: item.id,
          sourceId: item.sourceId,
          title: item.title,
          excerpt: item.excerpt,
        })),
      };

      await this.safeCacheSet(scope, this.cacheKey(scope, input), response, lifecycle);

      lifecycle.status = "completed";
      lifecycle.completedAt = Date.now();
      lifecycle.phases.push("telemetry");

      const final = this.attachTelemetry(response, lifecycle, false, providerId, fallbackUsed);
      this.responses.set(lifecycle.requestId, final);
      this.recordMetrics(lifecycle, final, false, providerId, fallbackUsed);
      this.emit("cognitive_completed", "info", {
        requestId: lifecycle.requestId,
        correlationId: lifecycle.correlationId,
        confidence: final.confidence,
      });
      return final;
    } catch (error) {
      return this.handleFailure(lifecycle, error, providerId, fallbackUsed);
    }
  }

  private handleFailure(
    lifecycle: LifecycleRecord,
    error: unknown,
    providerId: string | null,
    fallbackUsed: boolean,
  ): never {
    const message = error instanceof Error ? error.message : "Cognitive pipeline failed";
    lifecycle.status = "failed";
    lifecycle.completedAt = Date.now();
    lifecycle.phases.push("failed");

    const auditRecord = this.deps.aiAudit.record({
      provider: "cognitive-orchestrator",
      model: "deterministic",
      orgId: lifecycle.orgId,
      workspaceId: lifecycle.workspaceId,
      tokenCount: 0,
      estimatedCostUsd: 0,
      latencyMs: Date.now() - lifecycle.startedAt,
      success: false,
      correlationId: lifecycle.correlationId,
    });
    lifecycle.lastAuditId = auditRecord.id;

    this.recordMetrics(
      lifecycle,
      {
        requestId: lifecycle.requestId,
        correlationId: lifecycle.correlationId,
        lifecycle: "failed",
        recommendationId: null,
        decisionId: null,
        evidenceCount: 0,
        confidence: 0,
      },
      false,
      providerId,
      fallbackUsed,
    );
    this.emit("cognitive_failed", "error", {
      requestId: lifecycle.requestId,
      correlationId: lifecycle.correlationId,
      error: message,
    });
    throw new Error(message);
  }

  private async safeCacheGet(
    scope: TenantScope,
    key: string,
    lifecycle: LifecycleRecord,
  ): Promise<CognitiveResponseView | null> {
    try {
      return await this.deps.cache.getWorkspace<CognitiveResponseView>(scope, key);
    } catch {
      lifecycle.phases.push("cache_unavailable");
      return null;
    }
  }

  private async safeCacheSet(
    scope: TenantScope,
    key: string,
    value: CognitiveResponseView,
    lifecycle: LifecycleRecord,
  ): Promise<void> {
    try {
      await this.deps.cache.setWorkspace(scope, key, value, { ttlMs: 300_000 });
    } catch {
      lifecycle.phases.push("cache_write_skipped");
    }
  }

  private cacheKey(scope: TenantScope, input: CognitiveRequest): string {
    return `cognitive:${scope.orgId}:${input.workspaceId}:${input.objective}`;
  }

  private attachTelemetry(
    response: CognitiveResponseView,
    lifecycle: LifecycleRecord,
    cacheHit: boolean,
    providerId: string | null = null,
    fallbackUsed = false,
  ): CognitiveResponseView {
    const telemetry: CognitiveTelemetryView = {
      durationMs: Date.now() - lifecycle.startedAt,
      cacheHit,
      auditId: lifecycle.lastAuditId,
      phases: [...lifecycle.phases],
      providerId,
      fallbackUsed,
    };
    return { ...response, telemetry };
  }

  private recordMetrics(
    lifecycle: LifecycleRecord,
    response: CognitiveResponseView,
    cacheHit: boolean,
    providerId: string | null = null,
    fallbackUsed = false,
  ): void {
    this.deps.metrics?.record({
      correlationId: lifecycle.correlationId,
      durationMs: Date.now() - lifecycle.startedAt,
      cacheHit,
      evidenceCount: response.evidenceCount,
      confidence: response.confidence,
      success: response.lifecycle === "completed",
      phases: [...lifecycle.phases],
      providerId,
      fallbackUsed,
    });
  }

  private toLifecycleView(record: LifecycleRecord): CognitiveLifecycleView {
    return {
      requestId: record.requestId,
      correlationId: record.correlationId,
      status: record.status,
      startedAt: new Date(record.startedAt).toISOString(),
      completedAt: record.completedAt ? new Date(record.completedAt).toISOString() : null,
      phases: [...record.phases],
    };
  }
}
