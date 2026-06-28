import type { WorkflowSchedule, WorkflowTrigger } from "./types.js";

const CRON_PARTS = /^(\S+\s+){4}\S+$/;
const CRON_KEYWORDS = new Set(["@daily", "@hourly", "@weekly", "@monthly", "@yearly"]);

export function validateCronExpression(cron: string): string | null {
  const trimmed = cron.trim();
  if (!trimmed) return "Schedule expression is required";
  if (CRON_KEYWORDS.has(trimmed)) return null;
  if (!CRON_PARTS.test(trimmed)) {
    return "Use a 5-field cron expression (e.g. 0 9 * * *) or @daily/@hourly";
  }
  return null;
}

export function validateTrigger(trigger: WorkflowTrigger): string | null {
  if (trigger.type === "event" && !trigger.eventName?.trim()) {
    return "Event name is required for event triggers";
  }
  return null;
}

export function validateSchedule(schedule: WorkflowSchedule): string | null {
  if (!schedule.enabled) return null;
  const cronError = validateCronExpression(schedule.cron);
  if (cronError) return cronError;
  if (!schedule.timezone.trim()) return "Timezone is required when schedule is enabled";
  return null;
}

export function validateWorkflowTriggerSchedule(
  trigger: WorkflowTrigger,
  schedule: WorkflowSchedule | null,
): string | null {
  const triggerError = validateTrigger(trigger);
  if (triggerError) return triggerError;
  if (trigger.type === "schedule") {
    if (!schedule) return "Schedule configuration is required for scheduled triggers";
    return validateSchedule(schedule);
  }
  if (schedule?.enabled) {
    return "Schedule must be disabled when trigger is not schedule-based";
  }
  return null;
}
