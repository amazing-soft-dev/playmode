import Link from "next/link";

import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { Card, Section, SectionHeading } from "@/components/ui";
import { photos, type PhotoSlot } from "@/content/media";
import { home } from "@/content/site";
import { GAMES } from "@/lib/fixtures/games";

const CREATORS: { name: string; photo: PhotoSlot }[] = [
  { name: "PixelOtter42", photo: "creator1" },
  { name: "MossByte09", photo: "creator2" },
  { name: "VoltWren55", photo: "creator3" },
  { name: "EchoAtlas12", photo: "creator4" },
];

/** Featured creators in the template's team-card style: portrait, nickname and their games. */
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
          {CREATORS.map((creator, i) => {
            const games = GAMES.filter((g) => g.ownerName === creator.name);
            const pick = games.find((g) => g.staffPick) ?? games[0];
            return (
              <Reveal as="li" key={creator.name} index={i} duration={0.7}>
                <Card interactive className="h-full">
                  <Link href={pick ? `/play/${pick.id}` : "/gallery"} className="flex h-full flex-col">
                    <span className="relative block aspect-[4/5] overflow-hidden">
                      <Media id={photos[creator.photo]} alt="" sizes="(min-width: 992px) 25vw, (min-width: 640px) 50vw, 100vw" zoomOnHover />
                    </span>
                    <span className="flex flex-col gap-2 p-5">
                      <span className="font-sans text-[20px] font-medium tracking-[-0.5px] uppercase transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                        {creator.name}
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
