import Link from "next/link";

import { GameCover } from "@/components/game/GameCover";
import { Reveal } from "@/components/motion";
import { ArrowIcon, Button, Card, Section, SectionHeading, Tag } from "@/components/ui";
import { home } from "@/content/site";
import { serverRepos } from "@/lib/repos";

/** Trending games in the template's blog-row layout: text on the left, cover on the right. */
export async function TrendingGames() {
  const games = await serverRepos.games.listGallery({ tab: "top-week", limit: 3 });
  const { trending } = home;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <Reveal>
          <SectionHeading label={trending.label} aside={<p className="type-body text-fog">{trending.lead}</p>}>
            {trending.title}
          </SectionHeading>
        </Reveal>
        <ul className="flex flex-col gap-5">
          {games.map((game, i) => (
            <Reveal as="li" key={game.id} index={i} duration={0.7}>
              <Card interactive crosses={false}>
                <Link href={`/play/${game.id}`} className="grid gap-6 p-5 md:grid-cols-2 md:gap-[30px]">
                  <span className="flex flex-col justify-between gap-6">
                    <span className="flex flex-col gap-4">
                      <span className="flex flex-wrap gap-2">
                        {game.tags.slice(0, 3).map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </span>
                      <span className="font-sans text-[24px] leading-[1.4] tracking-[-0.5px] uppercase transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                        {game.title}
                      </span>
                      <span className="type-small text-fog">{game.description}</span>
                    </span>
                    <span className="flex items-center gap-3 type-label text-ash">
                      by {game.ownerName} · {game.weeklyLikeCount} likes this week
                      <ArrowIcon className="size-4 text-paper transition-transform duration-[400ms] ease-snap group-hover/card:translate-x-1 group-hover/card:text-accent" />
                    </span>
                  </span>
                  <span className="relative block aspect-[16/10] overflow-hidden border border-line">
                    <GameCover
                      id={game.id}
                      template={game.template}
                      title={game.title}
                      className="transition-transform duration-[600ms] ease-snap group-hover/card:scale-110"
                    />
                  </span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <Button href={trending.cta.href} variant="secondary">
            {trending.cta.label}
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
