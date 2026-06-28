/**
 * Load testing scaffold — Phase 8H.
 * Run: node tools/load-testing/run.mjs
 */

export const LOAD_TEST_SCENARIOS = {
  apiHealth: { path: "/api/health", concurrency: 10, iterations: 50 },
  authConcurrency: { path: "/api/auth/session", concurrency: 20, iterations: 40 },
  queueThroughput: { handler: "jobs.processAll", concurrency: 5, iterations: 20 },
  aiSimulation: { handler: "ai-gateway.complete", concurrency: 3, iterations: 10 },
  cognitiveRun: {
    handler: "cognitive.run",
    concurrency: 5,
    iterations: 25,
    objective: "Load test cognitive pipeline",
  },
} as const;

export interface LoadTestScenario {
  name: string;
  concurrency: number;
  iterations: number;
  run: () => Promise<{ success: number; failure: number; avgMs: number }>;
}

export interface LoadTestResult {
  scenario: string;
  success: number;
  failure: number;
  avgMs: number;
  durationMs: number;
}

/** Framework runner — scenarios are registered and executed without production stress defaults. */
export async function runLoadScenarios(
  scenarios: LoadTestScenario[],
): Promise<LoadTestResult[]> {
  const results: LoadTestResult[] = [];
  for (const scenario of scenarios) {
    const start = Date.now();
    const outcome = await scenario.run();
    results.push({
      scenario: scenario.name,
      ...outcome,
      durationMs: Date.now() - start,
    });
  }
  return results;
}
