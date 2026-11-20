/**
 * Photo slots. Every manifest photo id appears exactly once in src/, here, which is how
 * check:images enforces "each photo used once": pages use these slot names, never raw ids.
 */
export const photos = {
  // Home page
  homeAbout: "home-about",
  promoRecommend: "promo-recommend",
  promoDownload: "promo-download",
  ctaArcade: "cta-arcade",
  dailyCard: "daily-card",
  // Page banners
  bannerCreate: "banner-create",
  bannerDaily: "banner-daily",
  bannerGallery: "banner-gallery",
  bannerRecommend: "banner-recommend",
  bannerPricing: "banner-pricing",
  bannerAbout: "banner-about",
  bannerParents: "banner-parents",
  bannerFaq: "banner-faq",
  bannerContact: "banner-contact",
  bannerNews: "banner-news",
  bannerLogin: "banner-login",
  notFound: "not-found",
  bannerAccount: "banner-account",
  // Page body images
  parentsTogether: "parents-together",
  newsTemplates: "news-templates",
  newsDaily: "news-daily",
  newsSafety: "news-safety",
  newsGallery: "news-gallery",
} as const;

export type PhotoSlot = keyof typeof photos;

/** Background video loops from Pexels; posters are found with posterFor(id). */
export const videos = {
  hero: "video-hero",
  gameplay: "video-gameplay",
  footer: "video-footer",
} as const;

export type VideoSlot = keyof typeof videos;
