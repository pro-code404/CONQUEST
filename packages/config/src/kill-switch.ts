/**
 * Kill switch registry (INF-22, RTM-INF-014).
 * Scaffold for Build-1 — production ops console integration in Build-1+.
 */
export type KillSwitchId =
  | "execution"
  | "intelligence_release"
  | "emergency_lock"
  | "automation"
  | "ai_gateway";

export interface KillSwitchState {
  id: KillSwitchId;
  engaged: boolean;
  reason?: string;
  engagedAt?: string;
  engagedBy?: string;
}

const ENV_PREFIX = "CONQUEST_KILL_";

function envKey(id: KillSwitchId): string {
  return `${ENV_PREFIX}${id.toUpperCase()}`;
}

export class KillSwitchRegistry {
  private readonly overrides = new Map<KillSwitchId, KillSwitchState>();

  getState(id: KillSwitchId): KillSwitchState {
    const override = this.overrides.get(id);
    if (override) return override;
    const engaged = process.env[envKey(id)] === "1" || process.env[envKey(id)] === "true";
    return { id, engaged };
  }

  isEngaged(id: KillSwitchId): boolean {
    return this.getState(id).engaged;
  }

  assertOpen(id: KillSwitchId): void {
    const state = this.getState(id);
    if (state.engaged) {
      throw new KillSwitchEngagedError(id, state.reason);
    }
  }

  engage(id: KillSwitchId, reason: string, engagedBy = "system"): void {
    this.overrides.set(id, {
      id,
      engaged: true,
      reason,
      engagedAt: new Date().toISOString(),
      engagedBy,
    });
  }

  release(id: KillSwitchId): void {
    this.overrides.delete(id);
  }

  snapshot(): KillSwitchState[] {
    const ids: KillSwitchId[] = [
      "execution",
      "intelligence_release",
      "emergency_lock",
      "automation",
      "ai_gateway",
    ];
    return ids.map((id) => this.getState(id));
  }
}

export class KillSwitchEngagedError extends Error {
  constructor(
    readonly switchId: KillSwitchId,
    readonly reason?: string,
  ) {
    super(`Kill switch engaged: ${switchId}${reason ? ` — ${reason}` : ""}`);
    this.name = "KillSwitchEngagedError";
  }
}

let defaultRegistry: KillSwitchRegistry | undefined;

export function getKillSwitchRegistry(): KillSwitchRegistry {
  if (!defaultRegistry) defaultRegistry = new KillSwitchRegistry();
  return defaultRegistry;
}

export function resetKillSwitchRegistry(): void {
  defaultRegistry = undefined;
}
