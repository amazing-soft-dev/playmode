import { isChildSafeAudience } from "./domain/age.ts";
import { CHILD_SAFE_RATING_CEILING } from "./domain/policy.ts";
import type { AgeBand, EsrbRating, RecommendationFilters } from "./domain/types.ts";

/**
 * Recommendation rules (plan section 05, feature 2). The age-based rating ceiling always wins over
 * whatever the parse step returned, so a request can never widen what a child is shown.
 */
export function ratingCeilingFor(band: AgeBand | "unknown"): EsrbRating {
  if (isChildSafeAudience(band)) return CHILD_SAFE_RATING_CEILING;
  return band === "13to17" ? "T" : "M";
}

export function applyAudience(filters: RecommendationFilters, band: AgeBand | "unknown"): RecommendationFilters {
  const ceiling = ratingCeilingFor(band);
  const order: EsrbRating[] = ["E", "E10+", "T", "M"];
  const tighter = order.indexOf(filters.ratingCeiling) < order.indexOf(ceiling) ? filters.ratingCeiling : ceiling;
  return { ...filters, ratingCeiling: tighter };
}

/** Stable key for the 24-hour results cache (identical filters share one catalog query). */
export function filterKey(filters: RecommendationFilters): string {
  const sorted = (list: string[]) => [...list].sort().join(",");
  return [
    sorted(filters.genres),
    sorted(filters.platforms),
    filters.price,
    filters.ratingCeiling,
    sorted(filters.keywords),
  ].join("|");
}
