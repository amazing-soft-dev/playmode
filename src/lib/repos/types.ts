import type {
  BuildUsage,
  CatalogGame,
  ChallengeScore,
  DailyChallenge,
  DateKey,
  Game,
  GameVersion,
  Id,
  License,
  Plan,
  Profile,
  RecommendationFilters,
  Report,
  ReportReason,
  ReportStatus,
  Streak,
  TemplateId,
} from "../domain/types.ts";

/**
 * Every data access goes through these interfaces. The mock implementations in ./mock back the
 * UI today; Supabase, the LLM provider, RAWG and Stripe implementations replace them one at a
 * time without touching pages (see docs/architecture.md).
 */

export interface SignInInput {
  email: string;
  displayName: string;
  birthYear: number;
  country: string;
}

export interface AuthRepo {
  getCurrentProfile(): Promise<Profile | null>;
  signIn(input: SignInInput): Promise<Profile>;
  signOut(): Promise<void>;
}

export type GalleryTab = "new" | "top-week" | "staff-picks";

export interface GalleryQuery {
  tab: GalleryTab;
  tag?: string;
  limit?: number;
}

export interface PublishInput {
  title: string;
  description: string;
  tags: string[];
  license: License;
  allowDownload: boolean;
}

export interface GameRepo {
  listGallery(query: GalleryQuery): Promise<Game[]>;
  listByOwner(ownerId: Id): Promise<Game[]>;
  listTags(): Promise<string[]>;
  get(id: Id): Promise<Game | null>;
  getVersion(versionId: Id): Promise<GameVersion | null>;
  listVersions(gameId: Id): Promise<GameVersion[]>;
  /** Likes once per user; returns the new like count. */
  like(gameId: Id, userId: Id): Promise<number>;
  hasLiked(gameId: Id, userId: Id): Promise<boolean>;
  publish(gameId: Id, ownerId: Id, input: PublishInput): Promise<Game>;
  recordPlay(gameId: Id): Promise<void>;
}

export interface ReportRepo {
  /** Files a report; the game is hidden once it reaches the report threshold. */
  create(gameId: Id, reporterId: Id, reason: ReportReason, details: string): Promise<Report>;
  listQueue(): Promise<Report[]>;
  resolve(reportId: Id, status: Exclude<ReportStatus, "open">): Promise<void>;
}

export interface ChallengeRepo {
  /** The challenge for a UTC day, falling back to the approved backlog. */
  forDate(date: DateKey): Promise<DailyChallenge>;
  leaderboard(date: DateKey, limit?: number): Promise<ChallengeScore[]>;
  submitScore(score: Omit<ChallengeScore, "createdAt">): Promise<{ accepted: boolean; reason?: string }>;
  streak(playerId: Id): Promise<Streak>;
  /** Admin: upcoming challenges waiting for approval. */
  listPending(): Promise<DailyChallenge[]>;
  approve(date: DateKey, adminId: Id): Promise<void>;
}

export interface UsageRepo {
  get(userId: Id, date: DateKey): Promise<BuildUsage>;
  /** Counts a successful build. Failed builds are never counted. */
  recordBuild(userId: Id, date: DateKey): Promise<BuildUsage>;
  recordRepair(userId: Id, date: DateKey): Promise<BuildUsage>;
}

export interface GenerateInput {
  template: TemplateId;
  prompt: string;
}

export interface GenerateResult {
  html: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
}

export interface AiProvider {
  generate(input: GenerateInput): Promise<GenerateResult>;
  change(html: string, instruction: string): Promise<GenerateResult>;
  repair(html: string, errors: string[]): Promise<GenerateResult>;
  /** Turns a free-text request into JSON filters only. */
  parseRequest(text: string, chips: Partial<RecommendationFilters>): Promise<RecommendationFilters>;
  /** One line per game, using only the fields the catalog returned. */
  explain(request: string, games: CatalogGame[]): Promise<Map<number, string>>;
}

export interface CatalogProvider {
  search(filters: RecommendationFilters, limit?: number): Promise<CatalogGame[]>;
  /** Staff picks served when the catalog is down or out of quota. */
  fallback(): Promise<CatalogGame[]>;
}

export interface PlanOffer {
  plan: Plan;
  name: string;
  priceMonthlyUsd: number;
  dailyBuilds: number;
  features: string[];
}

export interface BillingProvider {
  offers(): Promise<PlanOffer[]>;
  checkoutUrl(plan: Exclude<Plan, "free">): Promise<string>;
  portalUrl(): Promise<string>;
}

export interface Repos {
  auth: AuthRepo;
  games: GameRepo;
  reports: ReportRepo;
  challenges: ChallengeRepo;
  usage: UsageRepo;
  ai: AiProvider;
  catalog: CatalogProvider;
  billing: BillingProvider;
}
