import { CHILD_SAFE_RATING_CEILING, POLICY, isRatingAllowed } from "../../domain/policy.ts";
import type { CatalogGame, PlatformFamily, RecommendationFilters, TemplateId } from "../../domain/types.ts";
import { CATALOG, CATALOG_GENRES, STAFF_PICK_IDS } from "../../fixtures/catalog.ts";
import type { AiProvider, BillingProvider, CatalogProvider, GenerateResult, PlanOffer } from "../types.ts";

/**
 * Mock AI: no model is called. Generation returns the matching sample game with the request
 * stamped in, which is enough to exercise the maker, player, versions and downloads.
 */
export function createMockAi(loadTemplate: (template: TemplateId) => Promise<string>): AiProvider {
  const stamp = (html: string, note: string): GenerateResult => ({
    html: html.replace(
      /<html([^>]*)>/i,
      `<html$1>\n<!-- playermode:mock ${note.replace(/--/g, "-").slice(0, 200)} -->`,
    ),
    model: "mock-generator",
    tokensIn: 0,
    tokensOut: 0,
  });

  const PLATFORM_WORDS: Record<PlatformFamily, RegExp> = {
    pc: /\b(pc|computer|steam|windows|mac)\b/i,
    mobile: /\b(mobile|phone|ios|android|tablet)\b/i,
    browser: /\b(browser|web|online)\b/i,
    console: /\b(console|switch|playstation|ps5|xbox|nintendo)\b/i,
  };

  return {
    async generate({ template, prompt }) {
      return stamp(await loadTemplate(template), `prompt: ${prompt}`);
    },
    async change(html, instruction) {
      return stamp(html, `change: ${instruction}`);
    },
    async repair(html, errors) {
      return stamp(html, `repair: ${errors.length} error(s)`);
    },
    async parseRequest(text, chips) {
      const lower = text.toLowerCase();
      const genres = [...new Set([...(chips.genres ?? []), ...CATALOG_GENRES.filter((g) => lower.includes(g))])];
      const platforms = [
        ...new Set([
          ...(chips.platforms ?? []),
          ...(Object.keys(PLATFORM_WORDS) as PlatformFamily[]).filter((p) => PLATFORM_WORDS[p].test(text)),
        ]),
      ];
      const price = chips.price ?? (/\bfree\b/i.test(text) ? "free" : /\b(paid|buy)\b/i.test(text) ? "paid" : "any");
      const keywords = lower
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 3 && !genres.includes(w))
        .slice(0, 6);
      return { genres, platforms, price, ratingCeiling: chips.ratingCeiling ?? CHILD_SAFE_RATING_CEILING, keywords };
    },
    async explain(_request, games) {
      // Only fields from the catalog record are used, so the line can never describe a game wrongly.
      return new Map(
        games.map((g) => [
          g.id,
          `${g.genres.slice(0, 2).join(" and ")} game from ${g.released ?? "an unknown year"} on ${g.platforms.join(", ")}` +
            `${g.esrb ? `, rated ${g.esrb}` : ""}, ${g.price === "free" ? "free to play" : "paid"}.`,
        ]),
      );
    },
  };
}

export function createMockCatalog(): CatalogProvider {
  return {
    async search(filters: RecommendationFilters, limit = 10) {
      const scored = CATALOG.filter((g) => isRatingAllowed(g.esrb, filters.ratingCeiling))
        .filter((g) => filters.price === "any" || g.price === filters.price)
        .filter((g) => filters.platforms.length === 0 || filters.platforms.some((p) => g.platforms.includes(p)))
        .map((g) => {
          const genreHits = filters.genres.filter((x) => g.genres.includes(x)).length;
          const keywordHits = filters.keywords.filter((k) => g.name.toLowerCase().includes(k)).length;
          return { g, score: genreHits * 2 + keywordHits };
        })
        .filter(({ score }) => filters.genres.length === 0 || score > 0)
        .sort((a, b) => b.score - a.score || a.g.name.localeCompare(b.g.name));
      return scored.slice(0, limit).map(({ g }) => g);
    },
    async fallback() {
      return STAFF_PICK_IDS.map((id) => CATALOG.find((g) => g.id === id)).filter((g): g is CatalogGame => !!g);
    },
  };
}

export const PLAN_OFFERS: PlanOffer[] = [
  {
    plan: "free",
    name: "Free",
    priceMonthlyUsd: 0,
    dailyBuilds: POLICY.dailyBuilds.free,
    features: [
      `${POLICY.dailyBuilds.free} AI builds a day`,
      `${POLICY.freeRepairsPerBuild} free fixes per build`,
      "Publish to the gallery",
      "Download as HTML",
    ],
  },
  {
    plan: "plus",
    name: "Plus",
    // Placeholder until beta measures the real cost per build (plan section 09).
    priceMonthlyUsd: 8,
    dailyBuilds: POLICY.dailyBuilds.plus,
    features: [`${POLICY.dailyBuilds.plus} AI builds a day`, "Bigger games", "No ads", "itch.io-ready zip downloads"],
  },
];

export function createMockBilling(): BillingProvider {
  return {
    async offers() {
      return PLAN_OFFERS;
    },
    async checkoutUrl(plan) {
      return `/pricing?checkout=${plan}&mock=1`;
    },
    async portalUrl() {
      return "/account?portal=mock";
    },
  };
}
