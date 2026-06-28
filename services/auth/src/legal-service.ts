import { randomUUID } from "node:crypto";
import { SERVICE_NAMES } from "@conquest/core";
import { ApplicationServiceBase } from "@conquest/service-shared";
import {
  LEGAL_DOCUMENT_VERSIONS,
  LEGAL_ROUTES,
  type LegalAcceptanceView,
  type LegalDocumentType,
  type LegalStatusView,
} from "@conquest/contracts";
import type { AuthRepository } from "./auth-repository.js";
import type { LegalAcceptanceRecord } from "./types.js";

const REQUIRED_AT_SIGNUP: LegalDocumentType[] = ["terms", "privacy", "gdpr_acknowledgement"];

export class LegalService extends ApplicationServiceBase {
  readonly serviceName = SERVICE_NAMES.AUTH;

  constructor(private readonly repo: AuthRepository) {
    super();
  }

  getPublicStatus(): Pick<LegalStatusView, "documents"> {
    return {
      documents: (Object.keys(LEGAL_DOCUMENT_VERSIONS) as LegalDocumentType[]).map((type) => ({
        type,
        version: LEGAL_DOCUMENT_VERSIONS[type],
        route: LEGAL_ROUTES[type],
      })),
    };
  }

  async getUserStatus(sessionId: string): Promise<LegalStatusView> {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    const acceptances = await this.repo.listLegalAcceptances(session.userId);
    const acceptanceViews = acceptances.map((row) => this.toView(row));
    const cookieConsentRecorded = acceptances.some(
      (row) => row.documentType === "cookies" && row.documentVersion === LEGAL_DOCUMENT_VERSIONS.cookies,
    );
    const requiresAction = REQUIRED_AT_SIGNUP.some(
      (type) =>
        !acceptances.some(
          (row) => row.documentType === type && row.documentVersion === LEGAL_DOCUMENT_VERSIONS[type],
        ),
    );
    return {
      documents: this.getPublicStatus().documents,
      acceptances: acceptanceViews,
      cookieConsentRecorded,
      requiresAction,
    };
  }

  async recordAcceptance(
    sessionId: string,
    input: { documentType: LegalDocumentType; documentVersion: string; ipAddress?: string; userAgent?: string },
  ): Promise<LegalAcceptanceView> {
    const session = await this.repo.findSession(sessionId);
    if (!session || session.revoked || session.expiresAt < Date.now()) {
      throw new Error("Session expired");
    }
    const expected = LEGAL_DOCUMENT_VERSIONS[input.documentType];
    if (input.documentVersion !== expected) {
      throw new Error(`Document version mismatch — expected ${expected}`);
    }
    const record = await this.repo.recordLegalAcceptance({
      id: randomUUID(),
      userId: session.userId,
      documentType: input.documentType,
      documentVersion: input.documentVersion,
      acceptedAt: Date.now(),
      ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
      ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    });
    this.emit("legal_acceptance_recorded", "info", {
      userId: session.userId,
      documentType: input.documentType,
    });
    return this.toView(record);
  }

  async recordCookieConsent(
    sessionId: string | null,
    input: { documentVersion: string; ipAddress?: string; userAgent?: string },
  ): Promise<{ recorded: boolean }> {
    if (input.documentVersion !== LEGAL_DOCUMENT_VERSIONS.cookies) {
      throw new Error("Invalid cookie policy version");
    }
    if (!sessionId) return { recorded: false };
    await this.recordAcceptance(sessionId, {
      documentType: "cookies",
      documentVersion: input.documentVersion,
      ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
      ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    });
    return { recorded: true };
  }

  private toView(record: LegalAcceptanceRecord): LegalAcceptanceView {
    return {
      documentType: record.documentType as LegalDocumentType,
      documentVersion: record.documentVersion,
      acceptedAt: new Date(record.acceptedAt).toISOString(),
    };
  }
}
