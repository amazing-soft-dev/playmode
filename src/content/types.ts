/**
 * Shapes for site copy. All words and figures shown on the site live in src/content, so copy
 * changes never touch components. Photo and video ids refer to entries in media/manifest.json.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Short description used by the search dialog and the all-pages menu. */
  description?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface Cta {
  label: string;
  href: string;
}

export interface SeoDefaults {
  title: string;
  titleTemplate: string;
  description: string;
  /** Absolute origin used for canonical URLs, the sitemap and Open Graph images. */
  siteUrl: string;
  locale: string;
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  text: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface Heading {
  label: string;
  /** Main heading text. */
  title: string;
  /** Optional grey continuation of a two-tone heading. */
  muted?: string;
  lead?: string;
}
