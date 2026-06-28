/** Production legal document versions — update when counsel approves new copy. */
export const LEGAL_DOCUMENT_VERSIONS = {
  privacy: "2026-06-28",
  terms: "2026-06-28",
  cookies: "2026-06-28",
  ai_transparency: "2026-06-28",
  gdpr_acknowledgement: "2026-06-28",
} as const;

export type LegalDocumentType = keyof typeof LEGAL_DOCUMENT_VERSIONS;

export interface LegalDocumentView {
  type: LegalDocumentType;
  version: string;
  route: string;
}

export interface LegalAcceptanceView {
  documentType: LegalDocumentType;
  documentVersion: string;
  acceptedAt: string;
}

export interface LegalStatusView {
  documents: LegalDocumentView[];
  acceptances: LegalAcceptanceView[];
  cookieConsentRecorded: boolean;
  requiresAction: boolean;
}

export const LEGAL_ROUTES: Record<LegalDocumentType, string> = {
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  ai_transparency: "/legal/ai-transparency",
  gdpr_acknowledgement: "/legal/privacy",
};
