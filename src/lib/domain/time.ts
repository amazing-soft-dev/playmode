import type { DateKey } from "./types.ts";

const DAY_MS = 86_400_000;

/** UTC calendar day for a moment, e.g. "2026-11-17". The daily challenge rolls over at 00:00 UTC. */
export function utcDateKey(at: Date | number = Date.now()): DateKey {
  return new Date(at).toISOString().slice(0, 10);
}

export function addDays(date: DateKey, days: number): DateKey {
  return utcDateKey(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS);
}

/** Milliseconds until the next 00:00 UTC. */
export function msUntilNextUtcMidnight(at: Date | number = Date.now()): number {
  const now = typeof at === "number" ? at : at.getTime();
  return DAY_MS - (now % DAY_MS);
}

/** Start of the current gallery week: Monday 00:00 UTC (the weekly top list resets then). */
export function startOfUtcWeek(at: Date | number = Date.now()): Date {
  const now = new Date(typeof at === "number" ? at : at.getTime());
  const day = now.getUTCDay(); // 0 = Sunday
  const sinceMonday = (day + 6) % 7;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - sinceMonday));
}

/** "05:42:09" style countdown text. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}
