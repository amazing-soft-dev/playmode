/**
 * Domain model for PlayerMode, following section 08 of the V1 website plan.
 * The mock repositories and the future Supabase tables share these shapes.
 * Dates are ISO strings; `DateKey` is a UTC calendar day ("2026-11-17").
 */

export type Id = string;
export type IsoDateTime = string;
export type DateKey = string;

/* ---------- People ---------- */

/** Stored instead of a birthday: the plan keeps only the birth year. */
export type AgeBand = "under13" | "13to17" | "adult";

export type Plan = "free" | "plus";

export interface Profile {
  id: Id;
  displayName: string;
  /** Under-18 accounts show a generated nickname instead of a chosen name. */
  nicknameGenerated: boolean;
  birthYear: number;
  ageBand: AgeBand;
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
  plan: Plan;
  isAdmin: boolean;
  createdAt: IsoDateTime;
}

/* ---------- Games ---------- */

export type TemplateId = "runner" | "puzzle" | "shooter" | "clicker" | "maze";

export type GameStatus = "draft" | "published" | "hidden" | "removed";

export type Visibility = "private" | "public";

export type License = "all-rights-reserved" | "cc-by-4.0" | "cc-by-nc-4.0" | "cc0-1.0";

export interface Game {
  id: Id;
  ownerId: Id;
  /** Denormalized for listings. */
  ownerName: string;
  title: string;
  description: string;
  tags: string[];
  template: TemplateId;
  status: GameStatus;
  visibility: Visibility;
  allowDownload: boolean;
  license: License;
  currentVersionId: Id;
  likeCount: number;
  /** Likes in the current UTC week (Monday 00:00 reset). */
  weeklyLikeCount: number;
  playCount: number;
  reportCount: number;
  staffPick: boolean;
  createdAt: IsoDateTime;
  publishedAt: IsoDateTime | null;
}

export interface GameVersion {
  id: Id;
  gameId: Id;
  prompt: string;
  /** Path of the HTML file in storage (a static file under /games in the mock). */
  htmlPath: string;
  sizeBytes: number;
  model: string;
  tokensIn: number;
  tokensOut: number;
  errorLog: string[];
  createdAt: IsoDateTime;
}

/* ---------- Usage, likes, reports ---------- */

export interface BuildUsage {
  userId: Id;
  date: DateKey;
  buildsUsed: number;
  repairsUsed: number;
}

export interface Like {
  userId: Id;
  gameId: Id;
  createdAt: IsoDateTime;
}

export type ReportReason = "inappropriate" | "copyright" | "broken" | "spam" | "other";

export type ReportStatus = "open" | "actioned" | "dismissed";

export interface Report {
  id: Id;
  gameId: Id;
  reporterId: Id;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  createdAt: IsoDateTime;
}

/* ---------- Daily challenge ---------- */

export type ChallengeStatus = "pending" | "approved" | "backlog";

export interface DailyChallenge {
  /** One row per UTC day. */
  date: DateKey;
  gameId: Id;
  gameVersionId: Id;
  template: TemplateId;
  theme: string;
  status: ChallengeStatus;
  approvedBy: Id | null;
  scoreMin: number;
  scoreMax: number;
}

/** A score from a signed-in user or an anonymous random id. */
export interface ChallengeScore {
  date: DateKey;
  playerId: Id;
  anonymous: boolean;
  displayName: string;
  score: number;
  createdAt: IsoDateTime;
}

export interface Streak {
  playerId: Id;
  current: number;
  best: number;
  lastPlayedDate: DateKey | null;
}

/* ---------- Billing ---------- */

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export interface Subscription {
  userId: Id;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: IsoDateTime;
}

/* ---------- Recommendations ---------- */

export type PlatformFamily = "pc" | "mobile" | "browser" | "console";

export type EsrbRating = "E" | "E10+" | "T" | "M" | "RP";

export interface StoreLink {
  store: string;
  url: string;
  /** True when the link carries an affiliate tag, so the page can disclose it. */
  affiliate: boolean;
}

/** A game record from the game database (RAWG in production, a fixture list in the mock). */
export interface CatalogGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  genres: string[];
  platforms: PlatformFamily[];
  esrb: EsrbRating | null;
  price: "free" | "paid";
  stores: StoreLink[];
  /** Link to the record in the source database (RAWG requires a link back). */
  sourceUrl: string;
}

/** The only output the parse step may produce: JSON filters, never game names. */
export interface RecommendationFilters {
  genres: string[];
  platforms: PlatformFamily[];
  price: "free" | "paid" | "any";
  /** Highest ESRB rating allowed; forced to "E10+" for under-13s or unknown ages. */
  ratingCeiling: EsrbRating;
  keywords: string[];
}

export interface Recommendation {
  game: CatalogGame;
  /** One line written from the record's own fields only. */
  reason: string;
}

export interface RecCacheEntry {
  queryHash: string;
  filters: RecommendationFilters;
  results: CatalogGame[];
  expiresAt: IsoDateTime;
}
