/**
 * Photo slots. Every manifest photo id appears exactly once in src/, here, which is how
 * check:images enforces "each photo used once": pages use these slot names, never raw ids.
 */
export const photos = {
  // Home page
  homeAbout: "home-about",
  templateRunner: "template-runner",
  templatePuzzle: "template-puzzle",
  templateShooter: "template-shooter",
  templateClicker: "template-clicker",
  templateMaze: "template-maze",
  promoRecommend: "promo-recommend",
  promoDownload: "promo-download",
  ctaArcade: "cta-arcade",
  dailyCard: "daily-card",
  // Featured creators (portraits; names on the site are generated nicknames)
  creator1: "creator-1",
  creator2: "creator-2",
  creator3: "creator-3",
  creator4: "creator-4",
} as const;

export type PhotoSlot = keyof typeof photos;
