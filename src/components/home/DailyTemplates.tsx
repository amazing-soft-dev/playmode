import Image from "next/image";
import Link from "next/link";

import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { ArrowIcon, BracketLabel, Button, Card, Muted, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { home } from "@/content/site";
import { TEMPLATES } from "@/lib/fixtures/templates";

import { Countdown } from "./Countdown";

/** Each template card shows its own game in play (npm run games:shots), not a stock photo. */
const shot = (id: string) => `/games/shots/${id}.webp`;

/**
 * Daily challenge highlight plus the five starter templates, in the template's tournament-card
 * style: framed cards with a photo, bracket label, uppercase title, controls line and summary.
 * Hovering a card turns its frame and title lime and zooms the photo.
 */
export function DailyTemplates() {
  const { daily, templatesSection } = home;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <Reveal>
          <Card className="grid overflow-hidden md:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-[260px] overflow-hidden">
              <Media id={photos.dailyCard} sizes="(min-width: 768px) 45vw, 100vw" />
              <div className="absolute inset-0 bg-ink/30" />
            </div>
            <div className="flex flex-col justify-between gap-10 p-6 md:p-10 lg:p-[50px]">
              <div className="flex flex-col gap-5">
                <BracketLabel accent>{daily.label}</BracketLabel>
                <h2 className="type-h2">{daily.title}</h2>
                <p className="type-body text-fog">{daily.text}</p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <p className="flex flex-col gap-2">
                  <span className="type-label text-ash">{daily.countdownLabel}</span>
                  <Countdown className="font-mono text-[40px] leading-none font-thin text-accent tabular-nums" />
                </p>
                <Button href={daily.cta.href}>{daily.cta.label}</Button>
              </div>
            </div>
          </Card>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-[1fr_60%] md:gap-10">
          <Reveal>
            <BracketLabel>{templatesSection.label}</BracketLabel>
          </Reveal>
          <Reveal index={1} className="flex flex-col gap-6">
            <h2 className="type-h2 text-balance-safe">
              {templatesSection.title} <Muted>{templatesSection.muted}</Muted>
            </h2>
            <p className="type-body text-fog">{templatesSection.lead}</p>
          </Reveal>
        </div>

        {/* Five cards without squeezing: from 1280px two featured cards over three (a six-column
            grid, spans 3 + 3 / 2 + 2 + 2); in two columns the first card spans the row so no
            card is left alone at the end. */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {TEMPLATES.map((t, i) => (
            <Reveal
              as="li"
              key={t.id}
              index={i}
              duration={0.7}
              className={i === 0 ? "sm:col-span-2 lg:col-span-3" : i === 1 ? "lg:col-span-3" : "lg:col-span-2"}
            >
              <Card interactive className="h-full">
                <Link href={`/create?template=${t.id}`} className="flex h-full flex-col">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={shot(t.id)}
                      alt={`${t.sampleTitle} in play`}
                      fill
                      sizes="(min-width: 1280px) 45vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[600ms] ease-snap group-hover/card:scale-110"
                    />
                  </span>
                  <span className="flex flex-1 flex-col gap-4 p-5">
                    <BracketLabel as="span">{t.genre}</BracketLabel>
                    <span className="type-h4 transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                      {t.sampleTitle}
                    </span>
                    <span className="font-mono text-[12px] leading-[1.2] text-ash uppercase">{t.controls}</span>
                    <span className="flex-1 type-small text-fog">{t.summary}</span>
                    <span className="inline-flex items-center gap-2 type-caps transition-colors duration-[400ms] ease-snap group-hover/card:text-accent">
                      Use this template
                      <ArrowIcon className="size-4 transition-transform duration-[400ms] ease-snap group-hover/card:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
