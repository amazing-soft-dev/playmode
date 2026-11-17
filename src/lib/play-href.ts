import type { Game } from "./domain/types.ts";

/**
 * Link to a game's play page. Seeded gallery games have static pages; games published from the
 * maker live in this browser's mock store, so they open through /play/local?id=….
 */
export function playHref(game: Pick<Game, "id">): string {
  return game.id.startsWith("draft-") ? `/play/local?id=${encodeURIComponent(game.id)}` : `/play/${game.id}`;
}
