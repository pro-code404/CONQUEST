import { type ConfidenceAssessment, ConfidenceAssessmentSchema } from "@conquest/core";

/** Research Engine — evidence gathering until confidence threshold */
export async function conductResearch(
  query: string,
  ctx: { reconstructedContext?: { relevantMemories: Array<{ summary: string }> } },
): Promise<ConfidenceAssessment> {
  const memoryEvidence = (ctx.reconstructedContext?.relevantMemories ?? []).map((m) => ({
    source: "memory",
    content: m.summary,
    reliability: 0.8,
  }));

  const score = memoryEvidence.length > 0 ? 0.85 : query.length > 20 ? 0.65 : 0.45;

  return ConfidenceAssessmentSchema.parse({
    score,
    evidence: memoryEvidence,
    contradictions: [],
    gaps: score < 0.7 ? [{ topic: query.slice(0, 50), severity: "medium" }] : [],
    recommendedAction: score >= 0.8 ? "answer" : score >= 0.4 ? "research" : "clarify",
    reasoning: memoryEvidence.length ? "Evidence from memory stores" : "Insufficient evidence — research recommended",
  });
}
