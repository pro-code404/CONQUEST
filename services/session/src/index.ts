import { randomUUID } from "node:crypto";
import type { ConquestDatabase } from "@conquest/database";
import { sessions } from "@conquest/database";
import { eq } from "drizzle-orm";

export interface SessionState {
  id: string;
  userId?: string;
  messages: string[];
  workflowContext: Record<string, unknown>;
  version: number;
}

/** Session Manager — ephemeral + session state (SDD-II / ADR-0017) */
export class SessionManager {
  private readonly local = new Map<string, SessionState>();

  constructor(private readonly db: ConquestDatabase | null = null) {}

  async create(userId?: string): Promise<SessionState> {
    const session: SessionState = {
      id: randomUUID(),
      userId,
      messages: [],
      workflowContext: {},
      version: 1,
    };
    this.local.set(session.id, session);

    if (this.db) {
      await this.db.insert(sessions).values({ id: session.id, userId: userId ?? null, state: session });
    }
    return session;
  }

  async get(sessionId: string): Promise<SessionState | null> {
    const local = this.local.get(sessionId);
    if (local) return local;

    if (this.db) {
      const [row] = await this.db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
      if (row) {
        const state = row.state as SessionState;
        this.local.set(sessionId, state);
        return state;
      }
    }
    return null;
  }

  async appendMessage(sessionId: string, message: string): Promise<SessionState> {
    const session = await this.get(sessionId) ?? await this.create();
    session.messages.push(message);
    session.version++;
    this.local.set(sessionId, session);

    if (this.db) {
      await this.db.update(sessions).set({ state: session, version: session.version, updatedAt: new Date() }).where(eq(sessions.id, sessionId));
    }
    return session;
  }

  async recover(sessionId: string): Promise<SessionState> {
    return (await this.get(sessionId)) ?? await this.create();
  }
}
