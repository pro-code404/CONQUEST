import { z } from "zod";

export type DeploymentProfile = "development" | "production";

const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  CONQUEST_API_PORT: z.coerce.number().default(3001),
  CONQUEST_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  MEMORY_REPO: z.enum(["true", "false"]).optional(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  APP_BASE_URL: z.string().url().optional(),
  EMAIL_PROVIDER: z.enum(["console", "smtp"]).optional(),
  CORS_ORIGINS: z.string().optional(),
  CONQUEST_API_KEY: z.string().optional(),
});

export type ValidatedApiEnv = z.infer<typeof BaseEnvSchema> & {
  profile: DeploymentProfile;
  persistenceMode: "memory" | "postgres";
  corsOrigins: string[];
};

const INSECURE_JWT_SECRETS = new Set([
  "change-me-in-production-use-long-random-string",
  "dev-secret-min-16-chars",
]);

/** Validates API environment at startup — fails fast on missing production config. */
export function validateApiEnvironment(
  env: NodeJS.ProcessEnv = process.env,
  profile: DeploymentProfile = env.NODE_ENV === "production" ? "production" : "development",
): ValidatedApiEnv {
  const parsed = BaseEnvSchema.parse({
    NODE_ENV: env.NODE_ENV,
    CONQUEST_API_PORT: env.CONQUEST_API_PORT,
    CONQUEST_LOG_LEVEL: env.CONQUEST_LOG_LEVEL,
    MEMORY_REPO: env.MEMORY_REPO,
    DATABASE_URL: env.DATABASE_URL,
    REDIS_URL: env.REDIS_URL,
    JWT_SECRET: env.JWT_SECRET,
    APP_BASE_URL: env.APP_BASE_URL,
    EMAIL_PROVIDER: env.EMAIL_PROVIDER,
    CORS_ORIGINS: env.CORS_ORIGINS,
    CONQUEST_API_KEY: env.CONQUEST_API_KEY,
  });

  const forceMemory = parsed.MEMORY_REPO === "true";
  const persistenceMode: "memory" | "postgres" =
    forceMemory || !parsed.DATABASE_URL ? "memory" : "postgres";

  if (profile === "production") {
    if (forceMemory) {
      throw new Error("MEMORY_REPO=true is not allowed in production profile");
    }
    if (!parsed.DATABASE_URL) {
      throw new Error("DATABASE_URL is required in production profile");
    }
    if (!parsed.JWT_SECRET || parsed.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters in production profile");
    }
    if (INSECURE_JWT_SECRETS.has(parsed.JWT_SECRET)) {
      throw new Error("JWT_SECRET must not use a default placeholder in production profile");
    }
    if (!parsed.APP_BASE_URL) {
      throw new Error("APP_BASE_URL is required in production profile");
    }
    if (!parsed.CONQUEST_API_KEY || parsed.CONQUEST_API_KEY.length < 16) {
      throw new Error("CONQUEST_API_KEY is required in production profile (min 16 chars)");
    }
  }

  const corsOrigins =
    parsed.CORS_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ??
    (profile === "production"
      ? parsed.APP_BASE_URL
        ? [parsed.APP_BASE_URL]
        : []
      : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]);

  return {
    ...parsed,
    profile,
    persistenceMode,
    corsOrigins,
  };
}
