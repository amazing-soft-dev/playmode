import { POLICY } from "../../domain/policy.ts";
import { addDays, utcDateKey } from "../../domain/time.ts";
import type { ChallengeScore, DateKey, Streak } from "../../domain/types.ts";
import { challengeFor, dayNumber } from "../../fixtures/challenges.ts";
import type { ChallengeRepo } from "../types.ts";
import { type KeyValueStore, memoryStore, readJson, seededRandom, writeJson } from "./store.ts";

interface ChallengeState {
  scores: ChallengeScore[];
  approved: DateKey[];
}

const KEY = "pm.challenges.v1";

/** Generated nicknames for the sample leaderboard rows. */
const SAMPLE_PLAYERS = [
  "PixelOtter42",
  "QuietFox17",
  "MossByte09",
  "LumenKite31",
  "VoltWren55",
  "CloudPine08",
  "SunnyGlitch77",
  "EchoAtlas12",
  "NovaBadger21",
  "TinyComet64",
  "RetroHeron33",
  "BlueMango90",
];

export function createMockChallenges(
  store: KeyValueStore = memoryStore(),
  now: () => number = Date.now,
): ChallengeRepo {
  const load = () => readJson<ChallengeState>(store, KEY, { scores: [], approved: [] });
  const save = (state: ChallengeState) => writeJson(store, KEY, state);
  const today = () => utcDateKey(now());

  const sampleScores = (date: DateKey): ChallengeScore[] => {
    const { scoreMax } = challengeFor(date);
    const rand = seededRandom(dayNumber(date));
    return SAMPLE_PLAYERS.map((name, i) => ({
      date,
      playerId: `sample-${i}`,
      anonymous: false,
      displayName: name,
      score: Math.round(scoreMax * (0.15 + 0.55 * rand())),
      createdAt: `${date}T0${i % 10}:00:00.000Z`,
    }));
  };

  return {
    async forDate(date) {
      const approvedByAdmin = load().approved.includes(date);
      if (date > today()) return challengeFor(date, approvedByAdmin ? "approved" : "pending");
      // Today and past days always resolve: an unapproved day falls back to the backlog entry.
      return challengeFor(date, approvedByAdmin ? "approved" : "backlog");
    },

    async leaderboard(date, limit = POLICY.leaderboardSize) {
      const real = load().scores.filter((s) => s.date === date);
      // Keep each player's best score only.
      const best = new Map<string, ChallengeScore>();
      for (const s of [...sampleScores(date), ...real]) {
        const prev = best.get(s.playerId);
        if (!prev || s.score > prev.score) best.set(s.playerId, s);
      }
      return [...best.values()]
        .sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt))
        .slice(0, limit);
    },

    async submitScore(entry) {
      const challenge = challengeFor(entry.date);
      if (entry.date !== today()) return { accepted: false, reason: "That challenge has ended." };
      if (!Number.isInteger(entry.score) || entry.score < challenge.scoreMin || entry.score > challenge.scoreMax) {
        // Scores come from browser code and can be faked; out-of-range values are rejected.
        return { accepted: false, reason: "Score outside the allowed range." };
      }
      const state = load();
      state.scores.push({ ...entry, createdAt: new Date(now()).toISOString() });
      save(state);
      return { accepted: true };
    },

    async streak(playerId): Promise<Streak> {
      const days = new Set(
        load()
          .scores.filter((s) => s.playerId === playerId)
          .map((s) => s.date),
      );
      const sorted = [...days].sort();
      let best = 0;
      let run = 0;
      let prev: DateKey | null = null;
      for (const day of sorted) {
        run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
        best = Math.max(best, run);
        prev = day;
      }
      const last = sorted.at(-1) ?? null;
      // The streak survives until the end of the day after the last finished challenge.
      const alive = last !== null && (last === today() || addDays(last, 1) === today());
      return { playerId, current: alive ? run : 0, best, lastPlayedDate: last };
    },

    async listPending() {
      const state = load();
      return Array.from({ length: 7 }, (_, i) => addDays(today(), i + 1)).map((date) =>
        challengeFor(date, state.approved.includes(date) ? "approved" : "pending"),
      );
    },

    async approve(date) {
      const state = load();
      if (!state.approved.includes(date)) state.approved.push(date);
      save(state);
    },
  };
}
