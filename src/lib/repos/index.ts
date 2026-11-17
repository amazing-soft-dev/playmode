import type { TemplateId } from "../domain/types.ts";
import { createMockAuth, createMockUsage } from "./mock/accounts.ts";
import { createMockChallenges } from "./mock/challenges.ts";
import { createMockGames } from "./mock/games.ts";
import { createMockAi, createMockBilling, createMockCatalog } from "./mock/providers.ts";
import { type KeyValueStore, memoryStore } from "./mock/store.ts";
import type { Repos } from "./types.ts";

export type { Repos } from "./types.ts";

/**
 * Data source switch. Only "mock" exists today; "supabase" arrives with the backend milestone
 * (docs/architecture.md) and is selected with NEXT_PUBLIC_DATA_SOURCE=supabase.
 */
export const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

interface RepoOptions {
  store?: KeyValueStore;
  loadTemplate?: (template: TemplateId) => Promise<string>;
}

const fetchTemplate = async (template: TemplateId) => {
  const res = await fetch(`/games/${template}.html`);
  if (!res.ok) throw new Error(`Template ${template} could not be loaded`);
  return res.text();
};

export function createRepos({ store = memoryStore(), loadTemplate = fetchTemplate }: RepoOptions = {}): Repos {
  const { games, reports } = createMockGames(store);
  return {
    auth: createMockAuth(store),
    games,
    reports,
    challenges: createMockChallenges(store),
    usage: createMockUsage(store),
    ai: createMockAi(loadTemplate),
    catalog: createMockCatalog(),
    billing: createMockBilling(),
  };
}

/** Read-only fixture data for server components and static generation. */
export const serverRepos: Repos = createRepos();

let browser: Repos | null = null;

/** Browser repositories persist mock state in localStorage so it survives reloads. */
export function browserRepos(): Repos {
  if (browser) return browser;
  const local: KeyValueStore = {
    get: (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set: (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage can be full or blocked (private mode); the mock then behaves as memory-only.
      }
    },
    remove: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore blocked storage.
      }
    },
  };
  browser = createRepos({ store: local });
  return browser;
}
