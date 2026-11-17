import type { EsrbRating, Plan } from "./types.ts";

/**
 * Product limits from the V1 plan (sections 05, 09 and 15). They are starting values, tuned
 * after the closed beta measures the real cost per build. Server code must enforce them;
 * the UI only displays them.
 */
export const POLICY = {
  /** Builds per UTC day for each plan. */
  dailyBuilds: { free: 3, plus: 30 } satisfies Record<Plan, number>,
  /** "Fix it" passes per build before repairs start counting as builds. */
  freeRepairsPerBuild: 2,
  /** Concurrent builds per user. */
  concurrentBuilds: 1,
  promptMaxChars: 500,
  gameMaxBytes: 200 * 1024,
  versionsKept: 5,
  generationTimeoutMs: 90_000,
  publishPerDay: 5,
  reportHideThreshold: 3,
  reportReviewHours: 48,
  leaderboardSize: 100,
  recommendPerHourAnonymous: 20,
  recCacheHours: 24,
  challengeBacklogMin: 14,
  /** Minimum age for an account. EEA countries need 16 (GDPR Article 8). */
  minAccountAge: 13,
  minAccountAgeEea: 16,
} as const;

/** ESRB ratings ordered from most to least restrictive. */
export const ESRB_ORDER: readonly EsrbRating[] = ["E", "E10+", "T", "M"];

/** Ceiling applied to recommendations for under-13s and for visitors whose age is unknown. */
export const CHILD_SAFE_RATING_CEILING: EsrbRating = "E10+";

export function dailyBuildLimit(plan: Plan): number {
  return POLICY.dailyBuilds[plan];
}

/** True if a rating is at or below the ceiling. Unrated (null or "RP") games are excluded. */
export function isRatingAllowed(rating: EsrbRating | null, ceiling: EsrbRating): boolean {
  if (rating === null || rating === "RP") return false;
  return ESRB_ORDER.indexOf(rating) <= ESRB_ORDER.indexOf(ceiling);
}
