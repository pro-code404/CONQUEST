import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { ConquestError, ConquestErrorCode, FailureClass } from "@conquest/core";
import type { ConquestConfig } from "@conquest/config";

export interface AuthToken {
  userId: string;
  scopes: string[];
  exp: number;
}

export interface AuthContext {
  authenticated: boolean;
  userId?: string;
  scopes: string[];
  method: "jwt" | "api_key" | "anonymous";
}

/** Legacy JWT/API-key auth — retained for service-to-service paths until Gateway rewrite. */
export class AuthService {
  constructor(private readonly config: Pick<ConquestConfig, "jwtSecret" | "apiKey">) {}

  authenticate(headers: Record<string, string | undefined>): AuthContext {
    const authHeader = headers.authorization ?? headers.Authorization;
    const apiKey = headers["x-api-key"] ?? headers["X-Api-Key"];

    if (
      apiKey &&
      this.config.apiKey &&
      apiKey.length === this.config.apiKey.length &&
      timingSafeEqual(Buffer.from(apiKey), Buffer.from(this.config.apiKey))
    ) {
      return { authenticated: true, userId: "system", scopes: ["read", "write", "execute"], method: "api_key" };
    }

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const payload = this.verifyToken(token);
        return { authenticated: true, userId: payload.userId, scopes: payload.scopes, method: "jwt" };
      } catch {
        throw new ConquestError(
          ConquestErrorCode.AUTHENTICATION_FAILED,
          "Invalid token",
          false,
          FailureClass.Internal,
        );
      }
    }

    return { authenticated: false, scopes: ["read"], method: "anonymous" };
  }

  authorize(ctx: AuthContext, requiredScope: string): void {
    if (!ctx.scopes.includes(requiredScope) && !ctx.scopes.includes("admin")) {
      throw new ConquestError(
        ConquestErrorCode.AUTHORIZATION_FAILED,
        `Missing scope: ${requiredScope}`,
        false,
        FailureClass.Internal,
      );
    }
  }

  createToken(userId: string, scopes: string[] = ["read", "write"], expiresInHours = 24): string {
    const payload: AuthToken = {
      userId,
      scopes,
      exp: Date.now() + expiresInHours * 3600_000,
    };
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = createHmac("sha256", this.config.jwtSecret).update(body).digest("base64url");
    return `${body}.${sig}`;
  }

  verifyToken(token: string): AuthToken {
    const [body, sig] = token.split(".");
    if (!body || !sig) throw new Error("Malformed token");
    const expected = createHmac("sha256", this.config.jwtSecret).update(body).digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error("Invalid signature");
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as AuthToken;
    if (payload.exp < Date.now()) throw new Error("Token expired");
    return payload;
  }

  createAnonymousUserId(): string {
    return randomUUID();
  }
}
