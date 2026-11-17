"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/motion";
import { Chip } from "@/components/ui";
import { gallery } from "@/content/gallery";
import type { Game } from "@/lib/domain/types";
import { browserRepos } from "@/lib/repos";
import type { GalleryTab } from "@/lib/repos/types";
import { cn } from "@/lib/cn";

import { GameCard } from "./GameCard";

/**
 * Gallery tabs and tag filter. The server renders the default tab from the fixtures; after
 * hydration the browser repository takes over, so games published from the maker appear too.
 */
export function GalleryBrowser({ initialGames, initialTags }: { initialGames: Game[]; initialTags: string[] }) {
  const [tab, setTab] = useState<GalleryTab>("new");
  const [tag, setTag] = useState<string | null>(null);
  const [games, setGames] = useState(initialGames);
  const [tags, setTags] = useState(initialTags);

  useEffect(() => {
    let alive = true;
    const repo = browserRepos().games;
    void Promise.all([repo.listGallery({ tab, tag: tag ?? undefined, limit: 60 }), repo.listTags()]).then(([g, t]) => {
      if (!alive) return;
      setGames(g);
      setTags(t);
    });
    return () => {
      alive = false;
    };
  }, [tab, tag]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 border-b border-line pb-6">
        <div role="tablist" aria-label="Gallery tabs" className="flex flex-wrap gap-x-8 gap-y-3">
          {gallery.tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "type-nav border-b-2 pb-2 transition-colors duration-[400ms] ease-snap",
                tab === t.id ? "border-accent text-accent" : "border-transparent text-fog hover:text-paper",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "top-week" && <p className="type-small text-ash">{gallery.weeklyNote}</p>}
        <div className="flex flex-wrap gap-2" aria-label="Filter by tag">
          <Chip selected={tag === null} onClick={() => setTag(null)}>
            {gallery.allTags}
          </Chip>
          {tags.map((t) => (
            <Chip key={t} selected={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div role="tabpanel">
        {games.length === 0 ? (
          <p className="type-body text-fog">{gallery.empty}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game, i) => (
              <Reveal as="li" key={game.id} index={i % 4} duration={0.7}>
                <GameCard game={game} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
