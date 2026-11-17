import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PlayView } from "@/components/play/PlayView";
import { Section } from "@/components/ui";
import { GAMES } from "@/lib/fixtures/games";

/** Static pages for seeded gallery games, plus /play/local for games published in this browser. */
export function generateStaticParams() {
  return [...GAMES.map((g) => ({ id: g.id })), { id: "local" }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) return { title: "Play", robots: { index: false } };
  return {
    title: `${game.title} by ${game.ownerName}`,
    description: game.description,
  };
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "local" && !GAMES.some((g) => g.id === id)) notFound();
  return (
    <Section className="pt-[120px] md:pt-[150px]">
      <div className="container-site">
        <Suspense>
          <PlayView id={id} />
        </Suspense>
      </div>
    </Section>
  );
}
