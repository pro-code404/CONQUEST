import type { TelemetryEmitter } from "@conquest/core";
import { TelemetryCollector } from "@conquest/observability";

/** Adapts {@link TelemetryCollector} to the core {@link TelemetryEmitter} contract. */
export function telemetryFromCollector(collector: TelemetryCollector): TelemetryEmitter {
  return {
    emit(params) {
      collector.emit(params);
    },
  };
}
