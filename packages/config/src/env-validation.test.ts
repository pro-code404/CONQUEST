import { describe, it, expect } from "vitest";
import { validateApiEnvironment } from "./env-validation.js";

describe("validateApiEnvironment", () => {
  it("accepts development profile with defaults", () => {
    const env = validateApiEnvironment(
      { NODE_ENV: "development" },
      "development",
    );
    expect(env.profile).toBe("development");
    expect(env.persistenceMode).toBe("memory");
    expect(env.corsOrigins).toContain("http://localhost:5173");
  });

  it("requires DATABASE_URL in production", () => {
    expect(() =>
      validateApiEnvironment(
        {
          NODE_ENV: "production",
          JWT_SECRET: "a".repeat(32),
          APP_BASE_URL: "https://app.example.com",
          CONQUEST_API_KEY: "production-api-key-16",
        },
        "production",
      ),
    ).toThrow(/DATABASE_URL/);
  });

  it("rejects insecure JWT in production", () => {
    expect(() =>
      validateApiEnvironment(
        {
          NODE_ENV: "production",
          DATABASE_URL: "postgresql://u:p@localhost/db",
          JWT_SECRET: "dev-secret-min-16-chars",
          APP_BASE_URL: "https://app.example.com",
          CONQUEST_API_KEY: "production-api-key-16",
        },
        "production",
      ),
    ).toThrow(/JWT_SECRET/);
  });

  it("selects postgres when DATABASE_URL is set", () => {
    const env = validateApiEnvironment({
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://conquest:conquest@localhost:5432/conquest",
    });
    expect(env.persistenceMode).toBe("postgres");
  });
});
