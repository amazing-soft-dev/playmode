import { POLICY } from "./policy.ts";
import type { AgeBand } from "./types.ts";

/**
 * Age rules from section 12 of the V1 plan. Only the birth year is collected, so a person's age is
 * taken as the *youngest* they could be: born in 2013 means "12" for all of 2026. That errs on the
 * side of treating someone as younger, which is the safe direction for COPPA and GDPR Article 8.
 */

/** EEA member states (EU 27 plus Iceland, Liechtenstein and Norway), ISO 3166-1 alpha-2. */
export const EEA_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
]);

export function minimumAge(birthYear: number, now: number = Date.now()): number {
  return new Date(now).getUTCFullYear() - birthYear - 1;
}

export function ageBandFor(birthYear: number, now: number = Date.now()): AgeBand {
  const age = minimumAge(birthYear, now);
  if (age < 13) return "under13";
  if (age < 18) return "13to17";
  return "adult";
}

export type AccountDecision =
  { ok: true; band: Exclude<AgeBand, "under13"> } | { ok: false; reason: "under-13" | "eea-under-16" | "invalid-year" };

/** Whether an account may be created. Under-13s play without an account in V1. */
export function accountDecision(birthYear: number, country: string, now: number = Date.now()): AccountDecision {
  const year = new Date(now).getUTCFullYear();
  if (!Number.isInteger(birthYear) || birthYear < year - 120 || birthYear > year)
    return { ok: false, reason: "invalid-year" };
  const age = minimumAge(birthYear, now);
  if (age < POLICY.minAccountAge) return { ok: false, reason: "under-13" };
  if (EEA_COUNTRIES.has(country.toUpperCase()) && age < POLICY.minAccountAgeEea)
    return { ok: false, reason: "eea-under-16" };
  const band = ageBandFor(birthYear, now);
  return { ok: true, band: band === "adult" ? "adult" : "13to17" };
}

/**
 * Google AdSense "tag for age treatment" (TFAT). 1 = child treatment (under 13 or unknown age):
 * no personalized ads, no third-party ad vendors. 2 = teen treatment. Adults get none.
 */
export function adTreatment(band: AgeBand | "unknown"): 1 | 2 | null {
  if (band === "under13" || band === "unknown") return 1;
  if (band === "13to17") return 2;
  return null;
}

/** Recommendations for under-13s and unknown ages are limited to E and E10+. */
export function isChildSafeAudience(band: AgeBand | "unknown"): boolean {
  return band === "under13" || band === "unknown";
}
