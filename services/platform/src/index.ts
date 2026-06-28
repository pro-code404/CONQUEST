import { CacheService } from "@conquest/cache";

import { AiGateway } from "@conquest/ai-gateway";

import { AiAuditService } from "@conquest/ai-audit";

import { JobService } from "@conquest/jobs";

import { MemoryPlatform, CognitiveMemoryManager } from "@conquest/memory-service";

import { PlatformMetricsCollector, CognitiveMetricsCollector } from "@conquest/performance";

import { PromptRegistry } from "@conquest/prompt-management";

import type { CognitiveRequest } from "@conquest/contracts";

import type { TenantScope } from "@conquest/core";

import {

  CognitiveOrchestrator,

  DecisionEngine,

  EvidenceEngine,

  ReasoningEngine,

} from "@conquest/cognitive";

import { AiProviderOrchestrator } from "@conquest/ai-gateway";

import { createCacheProvider, type CacheProviderFactoryOptions } from "./cache-provider-factory.js";



/** Composition root for Phase 8–11 platform services. */

export interface PlatformServices {

  cache: CacheService;

  cacheLabel: string;

  jobs: JobService;

  aiGateway: AiGateway;

  aiProvider: AiProviderOrchestrator;

  aiAudit: AiAuditService;

  memory: MemoryPlatform;

  cognitiveMemory: CognitiveMemoryManager;

  metrics: PlatformMetricsCollector;

  cognitiveMetrics: CognitiveMetricsCollector;

  prompts: PromptRegistry;

  evidence: EvidenceEngine;

  reasoning: ReasoningEngine;

  decision: DecisionEngine;

  cognitive: CognitiveOrchestrator;

}



export interface PlatformServicesOptions extends CacheProviderFactoryOptions {}



export function createPlatformServices(options: PlatformServicesOptions = {}): PlatformServices {

  const { provider: cacheProvider, label: cacheLabel } = createCacheProvider(options);

  const cache = new CacheService({ provider: cacheProvider });

  const jobs = new JobService();

  const aiAudit = new AiAuditService();

  const metrics = new PlatformMetricsCollector();

  const cognitiveMetrics = new CognitiveMetricsCollector();

  const memory = new MemoryPlatform();

  const cognitiveMemory = new CognitiveMemoryManager(memory);

  const prompts = new PromptRegistry();

  prompts.ensureDefaults();

  const evidence = new EvidenceEngine();

  const reasoning = new ReasoningEngine(evidence);

  const decision = new DecisionEngine(evidence);



  const aiGateway = new AiGateway({

    telemetryHook: {

      emit: (event, metadata) => {

        if (event === "ai_request_completed" && typeof metadata.latencyMs === "number") {

          metrics.recordAiLatency(metadata.latencyMs);

        }

      },

    },

    costHook: {

      record: (event) => {

        aiAudit.record({

          provider: event.providerId,

          model: event.model,

          orgId: "00000000-0000-0000-0000-000000000000",

          tokenCount: event.tokenCount,

          estimatedCostUsd: event.estimatedCostUsd,

          latencyMs: 0,

          success: true,

          correlationId: event.correlationId,

        });

      },

    },

  });



  const aiProvider = new AiProviderOrchestrator(aiGateway);

  const cognitive = new CognitiveOrchestrator({

    reasoning,

    evidence,

    decision,

    memory: cognitiveMemory,

    cache,

    jobs,

    aiGateway,

    aiAudit,

    prompts,

    metrics: cognitiveMetrics,

  });



  jobs.registerHandler({

    type: "ai_request",

    handle: async (job, reportProgress) => {

      const payload = job.payload as {

        kind?: string;

        requestId?: string;

        scope?: TenantScope;

        input?: CognitiveRequest;

      };

      if (payload.kind !== "cognitive.run" || !payload.requestId || !payload.scope || !payload.input) {

        return;

      }

      reportProgress(25);

      await cognitive.completeQueued(payload.requestId, payload.scope, payload.input);

      reportProgress(100);

    },

  });



  metrics.setCacheMetrics(cache.getMetrics());

  metrics.setQueueMetrics(jobs.getMetrics());



  return {

    cache,

    cacheLabel,

    jobs,

    aiGateway,

    aiProvider,

    aiAudit,

    memory,

    cognitiveMemory,

    metrics,

    cognitiveMetrics,

    prompts,

    evidence,

    reasoning,

    decision,

    cognitive,

  };

}



export { createCacheProvider } from "./cache-provider-factory.js";
export { createRedisClient } from "./redis-client.js";
export { getPlatformHealthReport, getCognitiveMetricsSnapshot } from "./platform-health.js";

export type { PlatformHealthDeps } from "./platform-health.js";


