import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";
import { AuthService } from "@conquest/auth";
import { SessionManager } from "@conquest/session";
import { MemoryService } from "@conquest/memory-service";
import { PipelineRunner } from "@conquest/orchestrator";
import { createRequestId, createTraceId } from "@conquest/observability";
import { ConquestError, ConquestErrorCode } from "@conquest/core";
import type { ConquestConfig } from "@conquest/config";

export function createApp(config: ConquestConfig) {
  const auth = new AuthService(config);
  const sessions = new SessionManager(null);
  const memory = new MemoryService(null);
  const orchestrator = new PipelineRunner({ memory });

  const app = new Hono();

  app.use("*", async (c, next) => {
    const start = Date.now();
    await next();
    c.header("X-Response-Time", `${Date.now() - start}ms`);
    c.header("X-Conquest-Version", "0.1.0");
  });

  app.get("/health", (c) => {
    const orch = orchestrator.healthCheck();
    return c.json({ status: "healthy", orchestrator: orch, timestamp: new Date().toISOString() });
  });

  app.get("/preview", (c) => {
    const candidates = [
      join(process.cwd(), "apps/gateway/public/preview.html"),
      join(process.cwd(), "public/preview.html"),
    ];
    const path = candidates.find((p) => existsSync(p));
    if (!path) return c.text("Preview not found", 404);
    return c.html(readFileSync(path, "utf8"));
  });

  app.get("/preview.css", (c) => {
    const path = join(process.cwd(), "apps/gateway/public/preview.css");
    if (!existsSync(path)) return c.text("Not found", 404);
    return c.body(readFileSync(path), 200, { "Content-Type": "text/css" });
  });

  app.get("/preview.js", (c) => {
    const path = join(process.cwd(), "apps/gateway/public/preview.js");
    if (!existsSync(path)) return c.text("Not found", 404);
    return c.body(readFileSync(path), 200, { "Content-Type": "application/javascript" });
  });

  app.get("/preview-data.js", (c) => {
    const path = join(process.cwd(), "apps/gateway/public/preview-data.js");
    if (!existsSync(path)) return c.text("Not found", 404);
    return c.body(readFileSync(path), 200, { "Content-Type": "application/javascript" });
  });

  app.get("/preview-charts.js", (c) => {
    const path = join(process.cwd(), "apps/gateway/public/preview-charts.js");
    if (!existsSync(path)) return c.text("Not found", 404);
    return c.body(readFileSync(path), 200, { "Content-Type": "application/javascript" });
  });

  app.get("/", (c) => c.redirect("/preview"));

  app.post("/v1/conquest", async (c) => {
    const traceId = createTraceId();
    c.header("X-Trace-Id", traceId);

    const authCtx = auth.authenticate({
      authorization: c.req.header("authorization"),
      "x-api-key": c.req.header("x-api-key"),
    });

    if (!authCtx.authenticated) {
      auth.authorize(authCtx, "write");
    }

    const body = await c.req.json<{ text: string; sessionId?: string }>();
    if (!body.text?.trim()) {
      return c.json({ error: "text is required" }, 400);
    }

    const session = body.sessionId
      ? await sessions.recover(body.sessionId)
      : await sessions.create(authCtx.userId);

    await sessions.appendMessage(session.id, body.text);

    const requestId = createRequestId();
    const result = await orchestrator.run({
      requestId,
      sessionId: session.id,
      userId: authCtx.userId,
      text: body.text,
      sessionMessages: session.messages,
    });

    if (result.context.memoryDelta) {
      await memory.applyDelta(result.context.memoryDelta, authCtx.userId);
    }
    await memory.saveEvolutionRecord(result.evolutionRecord);

    return c.json({
      requestId,
      traceId,
      sessionId: session.id,
      response: result.response,
      confidence: result.context.orchestrationResult?.aggregatedConfidence,
      verification: result.context.verificationReport?.passed,
      metrics: result.metrics,
      optimizationScore: result.optimizationScore,
      pipeline: {
        phasesCompleted: 10,
        goal: result.context.successCriteria?.primaryGoal,
        humanContext: result.context.humanContext,
      },
    });
  });

  app.post("/v1/auth/token", async (c) => {
    const body = await c.req.json<{ userId?: string; scopes?: string[] }>();
    const userId = body.userId ?? auth.createAnonymousUserId();
    const token = auth.createToken(userId, body.scopes);
    return c.json({ token, userId, expiresIn: config.jwtExpiresIn });
  });

  app.get("/v1/session/:id", async (c) => {
    const session = await sessions.get(c.req.param("id"));
    if (!session) return c.json({ error: "Session not found" }, 404);
    return c.json(session);
  });

  app.onError((err, c) => {
    if (err instanceof ConquestError) {
      const status = err.code === ConquestErrorCode.AUTHENTICATION_FAILED ? 401
        : err.code === ConquestErrorCode.AUTHORIZATION_FAILED ? 403 : 500;
      return c.json({ error: err.message, code: err.code, recoverable: err.recoverable }, status);
    }
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
  });

  return app;
}
