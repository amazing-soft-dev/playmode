import Link from "next/link";

import { GameCover } from "@/components/game/GameCover";
import { Card, HeartIcon, Tag } from "@/components/ui";
import { gallery } from "@/content/gallery";
import type { Game } from "@/lib/domain/types";
import { playHref } from "@/lib/play-href";

/** Gallery card: generated cover, title, creator, likes and tags; the frame turns lime on hover. */
export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <Card interactive className="h-full" data-priority={priority || undefined}>
      <Link href={playHref(game)} className="flex h-full flex-col">
        <span className="relative block aspect-[16/10] overflow-hidden border-b border-line">
          <GameCover
            id={game.id}
            template={game.template}
            title={game.title}
            className="transition-transform duration-[600ms] ease-snap group-hover/card:scale-110"
          />
          {game.staffPick && (
            <span className="absolute top-3 left-3 bg-accent px-2 py-1 type-label text-accent-ink">Staff pick</span>
          )}
        </span>
        <span className="flex flex-1 flex-col gap-3 p-5">
          <span className="type-h5 transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
            {game.title}
          </span>
          <span className="line-clamp-2 flex-1 type-small text-fog">{game.description}</span>
          <span className="flex flex-wrap gap-2">
            {game.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </span>
          <span className="flex items-center justify-between gap-3 type-label text-ash">
            <span>by {game.ownerName}</span>
            <span className="flex items-center gap-1.5">
              <HeartIcon className="size-3.5" /> {gallery.likes(game.likeCount)}
            </span>
          </span>
        </span>
      </Link>
    </Card>
  );
}
