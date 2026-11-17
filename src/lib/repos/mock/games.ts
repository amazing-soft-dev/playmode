import { POLICY } from "../../domain/policy.ts";
import type { Game, GameVersion, Id, Report } from "../../domain/types.ts";
import { GAMES, VERSIONS } from "../../fixtures/games.ts";
import type { GalleryQuery, GameRepo, PublishInput, ReportRepo } from "../types.ts";
import { type KeyValueStore, memoryStore, readJson, writeJson } from "./store.ts";

interface GameState {
  games: Game[];
  versions: GameVersion[];
  likes: string[]; // `${userId}:${gameId}`
  reports: Report[];
}

const KEY = "pm.games.v1";

/** Games and reports share state: reports can hide a game. */
export function createMockGames(store: KeyValueStore = memoryStore()): { games: GameRepo; reports: ReportRepo } {
  const load = (): GameState =>
    readJson<GameState>(store, KEY, {
      games: structuredClone(GAMES),
      versions: structuredClone(VERSIONS),
      likes: [],
      reports: [],
    });
  const save = (state: GameState) => writeJson(store, KEY, state);
  const visible = (g: Game) => g.status === "published" && g.visibility === "public";

  const games: GameRepo = {
    async listGallery({ tab, tag, limit = 24 }: GalleryQuery) {
      let list = load().games.filter(visible);
      if (tag) list = list.filter((g) => g.tags.includes(tag));
      if (tab === "staff-picks") list = list.filter((g) => g.staffPick);
      const byNew = (a: Game, b: Game) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
      list.sort(tab === "top-week" ? (a, b) => b.weeklyLikeCount - a.weeklyLikeCount || byNew(a, b) : byNew);
      return list.slice(0, limit);
    },
    async listByOwner(ownerId) {
      return load().games.filter((g) => g.ownerId === ownerId && g.status !== "removed");
    },
    async listTags() {
      return [...new Set(load().games.filter(visible).flatMap((g) => g.tags))].sort();
    },
    async get(id) {
      return load().games.find((g) => g.id === id) ?? null;
    },
    async getVersion(versionId) {
      return load().versions.find((v) => v.id === versionId) ?? null;
    },
    async listVersions(gameId) {
      return load()
        .versions.filter((v) => v.gameId === gameId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, POLICY.versionsKept);
    },
    async like(gameId, userId) {
      const state = load();
      const game = state.games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");
      const key = `${userId}:${gameId}`;
      if (!state.likes.includes(key)) {
        state.likes.push(key);
        game.likeCount += 1;
        game.weeklyLikeCount += 1;
        save(state);
      }
      return game.likeCount;
    },
    async hasLiked(gameId, userId) {
      return load().likes.includes(`${userId}:${gameId}`);
    },
    async publish(gameId: Id, ownerId: Id, input: PublishInput) {
      const state = load();
      const game = state.games.find((g) => g.id === gameId && g.ownerId === ownerId);
      if (!game) throw new Error("Game not found");
      Object.assign(game, input, {
        status: "published",
        visibility: "public",
        publishedAt: new Date().toISOString(),
      });
      save(state);
      return game;
    },
    async recordPlay(gameId) {
      const state = load();
      const game = state.games.find((g) => g.id === gameId);
      if (game) {
        game.playCount += 1;
        save(state);
      }
    },
  };

  const reports: ReportRepo = {
    async create(gameId, reporterId, reason, details) {
      const state = load();
      const game = state.games.find((g) => g.id === gameId);
      if (!game) throw new Error("Game not found");
      const report: Report = {
        id: `r-${state.reports.length + 1}`,
        gameId,
        reporterId,
        reason,
        details: details.slice(0, 500),
        status: "open",
        createdAt: new Date().toISOString(),
      };
      state.reports.push(report);
      game.reportCount += 1;
      // Plan section 05: a game with 3 or more reports is hidden until reviewed.
      if (game.reportCount >= POLICY.reportHideThreshold && game.status === "published") game.status = "hidden";
      save(state);
      return report;
    },
    async listQueue() {
      return load().reports.filter((r) => r.status === "open");
    },
    async resolve(reportId, status) {
      const state = load();
      const report = state.reports.find((r) => r.id === reportId);
      if (!report) return;
      report.status = status;
      const game = state.games.find((g) => g.id === report.gameId);
      if (game) {
        if (status === "actioned") game.status = "removed";
        // Dismissing every open report on a hidden game puts it back in the gallery.
        const stillOpen = state.reports.some((r) => r.gameId === game.id && r.status === "open");
        if (status === "dismissed" && !stillOpen && game.status === "hidden") {
          game.status = "published";
          game.reportCount = 0;
        }
      }
      save(state);
    },
  };

  return { games, reports };
}
