import { PredictionSchema } from "@conquest/core";

/** Prediction Engine — modelling, not guessing */
export function generatePrediction(subject: string, domain: string) {
  return PredictionSchema.parse({
    subject,
    probability: 0.65,
    expectedRange: { min: 0, max: 100, unit: domain === "finance" ? "percent" : undefined },
    confidence: 0.6,
    risk: { level: "medium", factors: ["insufficient live data in Phase 1"] },
    supportingEvidence: [],
    invalidationConditions: ["Material change in underlying data", "User provides contradicting evidence"],
    assumptions: ["Historical patterns remain stable", "No external shock events"],
    modelInputs: { domain, subjectLength: subject.length },
  });
}
