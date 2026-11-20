import Link from "next/link";

import { GameCover } from "@/components/game/GameCover";
import { Reveal } from "@/components/motion";
import { Card, Section, SectionHeading } from "@/components/ui";
import { home } from "@/content/site";
import { GAMES } from "@/lib/fixtures/games";

const CREATORS = ["PixelOtter42", "MossByte09", "VoltWren55", "EchoAtlas12"] as const;

/** Featured creators in the template's team-card style: their featured game's cover, nickname and games. */
export function FeaturedCreators() {
  const { creators } = home;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <Reveal>
          <SectionHeading label={creators.label} aside={<p className="type-body text-fog">{creators.lead}</p>}>
            {creators.title}
          </SectionHeading>
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {CREATORS.map((name, i) => {
            const games = GAMES.filter((g) => g.ownerName === name);
            const pick = games.find((g) => g.staffPick) ?? games[0];
            return (
              <Reveal as="li" key={name} index={i} duration={0.7}>
                <Card interactive className="h-full">
                  <Link href={pick ? `/play/${pick.id}` : "/gallery"} className="flex h-full flex-col">
                    {/* The creator's featured game, never a face: names here are generated
                        nicknames, and a photo beside one would read as a real player's picture. */}
                    <span className="relative block aspect-[16/10] overflow-hidden border-b border-line">
                      {pick && (
                        <GameCover
                          id={pick.id}
                          template={pick.template}
                          title={pick.title}
                          className="transition-transform duration-[600ms] ease-snap group-hover/card:scale-110"
                        />
                      )}
                    </span>
                    <span className="flex flex-col gap-2 p-5">
                      <span className="font-sans text-[20px] font-medium tracking-[-0.5px] uppercase transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                        {name}
                      </span>
                      <span className="type-small text-fog">
                        {games.length} {games.length === 1 ? "game" : "games"}
                        {pick ? ` · ${pick.title}` : ""}
                      </span>
                    </span>
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
