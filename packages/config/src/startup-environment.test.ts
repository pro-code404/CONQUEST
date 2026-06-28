import { describe, it, expect } from "vitest";
import { validateApiEnvironment } from "./env-validation.js";

describe("validateApiEnvironment (startup)", () => {
  it("allows development with memory persistence", () => {
    const result = validateApiEnvironment({
      NODE_ENV: "development",
      MEMORY_REPO: "true",
    });
    expect(result.profile).toBe("development");
    expect(result.persistenceMode).toBe("memory");
  });

  it("fails production without DATABASE_URL", () => {
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

  it("passes production with required secrets", () => {
    const result = validateApiEnvironment(
      {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://user:pass@db:5432/conquest",
        JWT_SECRET: "super-secure-production-secret-key-32chars",
        APP_BASE_URL: "https://app.example.com",
        CONQUEST_API_KEY: "production-api-key-16",
      },
      "production",
    );
    expect(result.profile).toBe("production");
    expect(result.persistenceMode).toBe("postgres");
  });
});
