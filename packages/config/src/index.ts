import { z } from "zod";

export const ConquestConfigSchema = z.object({
  nodeEnv: z.enum(["development", "test", "staging", "production"]).default("development"),
  port: z.coerce.number().default(3000),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
  databaseUrl: z.string().url().or(z.string().startsWith("postgresql://")),
  redisUrl: z.string().optional(),
  jwtSecret: z.string().min(16),
  jwtExpiresIn: z.string().default("24h"),
  apiKey: z.string().optional(),
});

export type ConquestConfig = z.infer<typeof ConquestConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConquestConfig {
  return ConquestConfigSchema.parse({
    nodeEnv: env.NODE_ENV ?? "development",
    port: env.CONQUEST_PORT ?? "3000",
    logLevel: env.CONQUEST_LOG_LEVEL ?? "info",
    databaseUrl: env.DATABASE_URL ?? "postgresql://conquest:conquest@localhost:5432/conquest",
    redisUrl: env.REDIS_URL,
    jwtSecret: env.JWT_SECRET ?? "dev-secret-min-16-chars",
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? "24h",
    apiKey: env.CONQUEST_API_KEY,
  });
}
