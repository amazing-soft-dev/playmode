import type { DailyChallenge, DateKey, TemplateId } from "../domain/types.ts";

/**
 * Approved challenge backlog. The plan asks for at least 14 approved challenges before launch;
 * this list has 21 so three weeks run without a repeat. A UTC day maps to a backlog entry by
 * its day number, so every day has a challenge even when nothing new was approved.
 */
export const CHALLENGE_BACKLOG: { theme: string; template: TemplateId; scoreMax: number }[] = [
  { theme: "Midnight rooftops", template: "runner", scoreMax: 50_000 },
  { theme: "Seed sorting", template: "puzzle", scoreMax: 20_000 },
  { theme: "Comet storm", template: "shooter", scoreMax: 80_000 },
  { theme: "Bakery rush", template: "clicker", scoreMax: 100_000 },
  { theme: "Crystal caves", template: "maze", scoreMax: 10_000 },
  { theme: "Rainy city sprint", template: "runner", scoreMax: 50_000 },
  { theme: "Tide pools", template: "puzzle", scoreMax: 20_000 },
  { theme: "Paper sky", template: "shooter", scoreMax: 80_000 },
  { theme: "Power plant", template: "clicker", scoreMax: 100_000 },
  { theme: "Hedge labyrinth", template: "maze", scoreMax: 10_000 },
  { theme: "Desert dunes", template: "runner", scoreMax: 50_000 },
  { theme: "Star charts", template: "puzzle", scoreMax: 20_000 },
  { theme: "Firefly night", template: "shooter", scoreMax: 80_000 },
  { theme: "Robot workshop", template: "clicker", scoreMax: 100_000 },
  { theme: "Ice palace", template: "maze", scoreMax: 10_000 },
  { theme: "Mountain trail", template: "runner", scoreMax: 50_000 },
  { theme: "Pixel garden", template: "puzzle", scoreMax: 20_000 },
  { theme: "Satellite sweep", template: "shooter", scoreMax: 80_000 },
  { theme: "Lemonade stand", template: "clicker", scoreMax: 100_000 },
  { theme: "Library stacks", template: "maze", scoreMax: 10_000 },
  { theme: "Neon arcade", template: "runner", scoreMax: 50_000 },
];

const DAY_MS = 86_400_000;

/** Days since 1970-01-01 for a UTC date key. */
export function dayNumber(date: DateKey): number {
  return Math.floor(Date.parse(`${date}T00:00:00Z`) / DAY_MS);
}

export function challengeFor(date: DateKey, status: DailyChallenge["status"] = "approved"): DailyChallenge {
  const entry = CHALLENGE_BACKLOG[dayNumber(date) % CHALLENGE_BACKLOG.length]!;
  const id = `daily-${date}`;
  return {
    date,
    gameId: id,
    gameVersionId: `${id}-v1`,
    template: entry.template,
    theme: entry.theme,
    status,
    approvedBy: status === "approved" ? "u-founder" : null,
    scoreMin: 0,
    scoreMax: entry.scoreMax,
  };
}
