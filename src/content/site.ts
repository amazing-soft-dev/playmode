import type { SeoDefaults } from "./types";

export * from "./nav";
export type * from "./types";

/** Brand basics. The name was chosen from the plan's shortlist; the domain is not bought yet. */
export const brand = {
  name: "PlayerMode",
  wordmark: "PLAYERMODE",
  tagline: "Describe a game. Play it a minute later.",
  bannerTagline: "Make · Play · Share",
  shortDescription:
    "Make HTML5 games with AI, play a new challenge every day, and share what you build with the community.",
  /** Shown in the footer. */
  copyright: `© ${new Date().getUTCFullYear()} PlayerMode. All rights reserved.`,
} as const;

export const seo: SeoDefaults = {
  title: "PlayerMode: make a game with AI, play it in a minute",
  titleTemplate: "%s · PlayerMode",
  description:
    "Describe a game in plain words and play it a minute later. Daily challenges, a community gallery and honest game picks.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
};

/**
 * Public contact points. There is no published email address until the domain is bought; the
 * contact form (POST /api/contact) is the way in.
 */
export const contact = {
  formHref: "/contact",
  parentsHref: "/parents#contact",
  dmcaHref: "/legal/dmca",
  /** Social accounts are listed once they exist; no placeholder profiles are linked. */
  social: [] as { label: string; href: string }[],
};

/** Plain-language disclosures reused across pages. */
export const disclosures = {
  affiliate:
    "Some store links on this page are affiliate links. If you buy through one, PlayerMode may earn a small commission at no extra cost to you.",
  rawg: "Game data from RAWG",
  aiGames:
    "Games on PlayerMode are written by AI from player prompts and checked by automated filters. If something looks wrong, report it and we review it within 48 hours.",
} as const;

export * as home from "./home";
