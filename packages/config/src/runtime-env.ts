import { z } from "zod";

export type RuntimeProfile = "development" | "production" | "test";

const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production", "staging"]).optional(),
  CONQUEST_API_PORT: z.coerce.number().optional(),
  CONQUEST_PROFILE: z.enum(["development", "production"]).optional(),
  MEMORY_REPO: z.enum(["true", "false"]).optional(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  APP_BASE_URL: z.string().url().optional(),
  CORS_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  CONQUEST_API_KEY: z.string().optional(),
});

export interface ValidatedRuntimeEnv {
  profile: RuntimeProfile;
  apiPort: number;
  memoryRepo: boolean;
  databaseUrl: string | null;
  redisUrl: string | null;
  appBaseUrl: string;
  corsOrigins: string[];
  jwtSecret: string;
  apiKey: string | null;
}

export function resolveRuntimeProfile(env: NodeJS.ProcessEnv = process.env): RuntimeProfile {
  if (env.CONQUEST_PROFILE === "production" || env.NODE_ENV === "production") return "production";
  if (env.NODE_ENV === "test") return "test";
  return "development";
}

/** Validates runtime configuration — fails fast in production when required secrets are missing. */
export function validateRuntimeEnv(env: NodeJS.ProcessEnv = process.env): ValidatedRuntimeEnv {
  const parsed = BaseEnvSchema.parse(env);
  const profile = resolveRuntimeProfile(env);
  const memoryRepo = parsed.MEMORY_REPO === "true";
  const databaseUrl = memoryRepo ? null : (parsed.DATABASE_URL ?? null);
  const redisUrl = parsed.REDIS_URL ?? null;
  const apiPort = parsed.CONQUEST_API_PORT ?? 3001;
  const corsOrigins =
    parsed.CORS_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ??
    ["http://localhost:5173", "http://127.0.0.1:5173"];

  if (profile === "production") {
    const errors: string[] = [];
    if (memoryRepo) errors.push("MEMORY_REPO must not be true in production");
    if (!databaseUrl) errors.push("DATABASE_URL is required in production");
    if (!parsed.APP_BASE_URL) errors.push("APP_BASE_URL is required in production");
    if (!parsed.JWT_SECRET || parsed.JWT_SECRET.length < 32) {
      errors.push("JWT_SECRET must be at least 32 characters in production");
    }
    if (!parsed.CONQUEST_API_KEY || parsed.CONQUEST_API_KEY.length < 16) {
      errors.push("CONQUEST_API_KEY is required in production");
    }
    if (errors.length > 0) {
      throw new Error(`Production configuration invalid:\n- ${errors.join("\n- ")}`);
    }
  }

  return {
    profile,
    apiPort,
    memoryRepo,
    databaseUrl,
    redisUrl,
    appBaseUrl: parsed.APP_BASE_URL ?? "http://localhost:5173",
    corsOrigins,
    jwtSecret: parsed.JWT_SECRET ?? "dev-secret-min-16-chars",
    apiKey: parsed.CONQUEST_API_KEY ?? null,
  };
}
