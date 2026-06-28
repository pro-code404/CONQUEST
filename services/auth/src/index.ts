export { AuthService, type AuthContext, type AuthToken } from "./legacy-auth-service.js";
export { IdentityService } from "./identity-service.js";
export { MemoryAuthRepository } from "./memory-repository.js";
export { AsyncMemoryAuthRepository } from "./async-memory-repository.js";
export { DrizzleAuthRepository } from "./drizzle-repository.js";
export { createAuthRepository, resolveRepositoryMode, closeAuthRepository, type RepositoryMode } from "./create-repository.js";
export type { AuthRepository } from "./auth-repository.js";
export { hashPassword, verifyPassword } from "./password.js";
export {
  SESSION_TTL_MS,
  SLIDING_REFRESH_MS,
  SESSION_COOKIE_NAME,
  sessionCookieMaxAgeSec,
} from "./session-config.js";
export {
  USER_ROLES,
  SignUpInputSchema,
  LoginInputSchema,
  CompleteOnboardingSchema,
  ONBOARDING_STAGES,
  ROLE_RANK,
  type AuthResult,
  type CompleteOnboardingInput,
  type LoginInput,
  type OnboardingStage,
  type OrganizationRecord,
  type ServerSession,
  type SessionPublicView,
  type SignUpInput,
  type UserRecord,
  type UserRole,
  type WorkspaceRecord,
} from "./types.js";
export { WorkspaceService } from "./workspace-service.js";
export { SettingsService, DEFAULT_USER_PREFERENCES, SETTINGS_CATEGORIES } from "./settings-service.js";
export { AutomationService } from "./automation-service.js";
export { SecurityService } from "./security-service.js";
export { AuditService } from "./audit-service.js";
export { IntelligenceService, type IntelligenceCognitiveProvider, type CognitiveAnalysisResult } from "./intelligence-service.js";
export { buildCommandCenterDashboard, type CommandCenterIntegrationInput } from "./command-center-integration.js";
export { ResearchService } from "./research-service.js";
export { AnalyticsService } from "./analytics-service.js";
export { OperationsService, type OperationsTelemetryProvider } from "./operations-service.js";
export { AdministrationService } from "./administration-service.js";
export { NotificationService } from "./notification-service.js";
export { LegalService } from "./legal-service.js";
export { createEmailProvider } from "./email/create-email-provider.js";
export type { EmailDeliveryProvider, EmailDeliveryRecord } from "./email/types.js";
