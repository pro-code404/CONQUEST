import { randomUUID, createHash } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import {
  CollectEvidenceSchema,
  type CollectEvidenceInput,
  type EvidenceItemView,
  type EvidencePortfolioView,
} from "@conquest/contracts";
import { ApplicationServiceBase } from "@conquest/service-shared";

interface EvidenceRecord extends EvidenceItemView {
  workspaceId: string;
}

const PRIORITY_WEIGHT = { low: 0.25, medium: 0.5, high: 0.75, critical: 1 } as const;

function fingerprint(sourceId: string, title: string, excerpt: string): string {
  return createHash("sha256").update(`${sourceId}:${title}:${excerpt}`).digest("hex").slice(0, 16);
}

function normalizeCitation(sourceId: string, title: string): string {
  return `[${sourceId}] ${title}`;
}

/** Evidence aggregation — recommendations consume evidence; evidence never consumes recommendations. */
export class EvidenceEngine extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.EVIDENCE;

  private readonly byWorkspace = new Map<string, EvidenceRecord[]>();

  collect(workspaceId: string, raw: CollectEvidenceInput): EvidencePortfolioView {
    const input = CollectEvidenceSchema.parse(raw);
    if (input.workspaceId !== workspaceId) throw new Error("Workspace mismatch");

    const existing = this.byWorkspace.get(workspaceId) ?? [];
    const fingerprints = new Set(existing.map((e) => e.fingerprint));
    let duplicateCount = 0;
    const added: EvidenceRecord[] = [];

    for (const source of input.sources) {
      const fp = fingerprint(source.sourceId, source.title, source.excerpt);
      if (fingerprints.has(fp)) {
        duplicateCount += 1;
        continue;
      }
      fingerprints.add(fp);
      const reliability = source.reliability ?? 0.7;
      const evidenceClass = source.evidenceClass ?? "inference";
      const classWeight = evidenceClass === "verified_fact" ? 1 : evidenceClass === "inference" ? 0.8 : 0.6;
      const record: EvidenceRecord = {
        id: randomUUID(),
        workspaceId,
        sourceId: source.sourceId,
        title: source.title,
        excerpt: source.excerpt,
        evidenceClass,
        reliability,
        confidenceWeight: Number((reliability * classWeight).toFixed(3)),
        citation: normalizeCitation(source.sourceId, source.title),
        fingerprint: fp,
        rank: 0,
        createdAt: new Date().toISOString(),
      };
      added.push(record);
    }

    const merged = [...existing, ...added];
    const ranked = this.rankEvidence(merged);
    this.byWorkspace.set(workspaceId, ranked);
    this.emit("evidence_collected", "info", { workspaceId, added: added.length, duplicates: duplicateCount });

    return {
      workspaceId,
      items: ranked.map((r) => this.toView(r)),
      duplicateCount,
      averageConfidence: ranked.length
        ? ranked.reduce((sum, item) => sum + item.confidenceWeight, 0) / ranked.length
        : 0,
    };
  }

  getPortfolio(workspaceId: string, evidenceIds?: string[]): EvidencePortfolioView {
    let items = [...(this.byWorkspace.get(workspaceId) ?? [])];
    if (evidenceIds?.length) {
      const idSet = new Set(evidenceIds);
      items = items.filter((item) => idSet.has(item.id));
    }
    return {
      workspaceId,
      items: items.map((item) => this.toView(item)),
      duplicateCount: 0,
      averageConfidence: items.length
        ? items.reduce((sum, item) => sum + item.confidenceWeight, 0) / items.length
        : 0,
    };
  }

  getByIds(workspaceId: string, evidenceIds: string[]): EvidenceItemView[] {
    const idSet = new Set(evidenceIds);
    return (this.byWorkspace.get(workspaceId) ?? [])
      .filter((item) => idSet.has(item.id))
      .map((item) => this.toView(item));
  }

  private rankEvidence(items: EvidenceRecord[]): EvidenceRecord[] {
    return [...items]
      .sort((a, b) => b.confidenceWeight - a.confidenceWeight || b.reliability - a.reliability)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }

  private toView(record: EvidenceRecord): EvidenceItemView {
    return {
      id: record.id,
      workspaceId: record.workspaceId,
      sourceId: record.sourceId,
      title: record.title,
      excerpt: record.excerpt,
      evidenceClass: record.evidenceClass,
      reliability: record.reliability,
      confidenceWeight: record.confidenceWeight,
      citation: record.citation,
      fingerprint: record.fingerprint,
      rank: record.rank,
      createdAt: record.createdAt,
    };
  }
}

export { PRIORITY_WEIGHT };
