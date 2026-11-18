import { allPages } from "../content/nav.ts";
import { GAMES } from "./fixtures/games.ts";
import { TEMPLATES } from "./fixtures/templates.ts";

export interface SearchEntry {
  title: string;
  href: string;
  /** Short line under the title. */
  detail: string;
  kind: "page" | "game" | "template";
  /** Extra words that match but are not shown (game tags, template genre). */
  keywords?: string;
  /** Lower-cased text the query is matched against. */
  haystack: string;
}

/** Everything the header search can find: every page, every starter template and every gallery game. */
export const SEARCH_INDEX: SearchEntry[] = (
  [
    // The cast gives every entry the optional `keywords` field before the haystack is built.
    ...allPages.flatMap((group) =>
      group.links.map((link) => ({
        title: link.label,
        href: link.href,
        detail: link.description ?? group.title,
        kind: "page" as const,
      })),
    ),
    ...TEMPLATES.map((t) => ({
      title: `${t.genre} template`,
      href: `/create?template=${t.id}`,
      detail: t.summary,
      kind: "template" as const,
    })),
    ...GAMES.map((g) => ({
      title: g.title,
      href: `/play/${g.id}`,
      detail: `${g.description} · by ${g.ownerName}`,
      kind: "game" as const,
      keywords: g.tags.join(" "),
    })),
  ] as Omit<SearchEntry, "haystack">[]
)
  .filter((entry, i, all) => all.findIndex((e) => e.href === entry.href) === i)
  .map((entry) => ({ ...entry, haystack: `${entry.title} ${entry.detail} ${entry.keywords ?? ""}`.toLowerCase() }));

/**
 * Matches every word of the query. Titles that start with the query rank first, then other title
 * matches, then matches in the detail line.
 */
export function searchSite(query: string, limit = 20): SearchEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const q = words.join(" ");
  return SEARCH_INDEX.filter((e) => words.every((w) => e.haystack.includes(w)))
    .map((e) => {
      const title = e.title.toLowerCase();
      const rank = title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
      return { e, rank };
    })
    .sort((a, b) => a.rank - b.rank || a.e.title.localeCompare(b.e.title))
    .slice(0, limit)
    .map(({ e }) => e);
}
