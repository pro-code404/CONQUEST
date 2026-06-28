#!/usr/bin/env node
/**
 * Load testing entry point — framework scaffold only.
 * Production stress tests are not enabled in Build-1.
 */
import { runLoadScenarios, type LoadTestScenario } from "./scaffold.ts";

const scenarios: LoadTestScenario[] = [
  {
    name: "noop-baseline",
    concurrency: 4,
    iterations: 20,
    async run() {
      const times: number[] = [];
      let success = 0;
      let failure = 0;
      for (let i = 0; i < 20; i += 1) {
        const start = Date.now();
        try {
          await Promise.resolve();
          success += 1;
        } catch {
          failure += 1;
        }
        times.push(Date.now() - start);
      }
      const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
      return { success, failure, avgMs };
    },
  },
];

const results = await runLoadScenarios(scenarios);
console.log(JSON.stringify({ ok: true, results }, null, 2));
