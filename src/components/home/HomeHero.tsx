import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { WordmarkRow } from "@/components/sections/WordmarkRow";
import { Button } from "@/components/ui";
import { videos } from "@/content/media";
import { home } from "@/content/site";

import { HeroLines } from "./HeroLines";
import { PromptBox } from "./PromptBox";

/**
 * Home hero (docs/audit/components/hero-banner.md): the monochrome wave loop and diagonal
 * linework behind an uppercase headline, a right column with the make-a-game prompt and calls
 * to action, and the wordmark row along the bottom. Full viewport height on desktop.
 */
export function HomeHero() {
  const { hero } = home;
  return (
    <section className="relative isolate overflow-clip pt-[120px] pb-20 md:pt-[230px] lg:flex lg:min-h-svh lg:flex-col lg:justify-end lg:pt-[250px] lg:pb-[100px]">
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo id={videos.hero} priority />
        <div className="absolute inset-0 bg-ink/30" />
        <HeroLines />
      </div>

      <div className="container-site flex flex-col items-center gap-[60px] lg:items-stretch lg:gap-[160px]">
        <div className="flex max-w-[520px] flex-col items-center gap-10 text-center lg:max-w-none lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="rise-600 motion-reduce:animate-none lg:max-w-[640px]">
            {/* From 1280px the headline takes the page-title weight and tracking and grows with the
                screen, so it outranks the wordmark row below it (58px at 1280, 66px at 1440, 88px
                from 1920). */}
            <h1 className="type-hero tracking-[-0.04em] text-balance-safe lg:text-[clamp(58px,4.6vw,88px)] lg:leading-[1.1] lg:font-[500] lg:tracking-[-2px]">
              {hero.title}
            </h1>
          </div>
          <div className="flex w-full max-w-[400px] rise-700 flex-col gap-8 motion-reduce:animate-none">
            <p className="type-body text-fog">{hero.lead}</p>
            <PromptBox />
            {/* The prompt box is the hero's one primary action; this quieter link is the other path. */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button href={hero.secondary.href} variant="link">
                {hero.secondary.label}
              </Button>
            </div>
          </div>
        </div>
        <div className="rise-800 motion-reduce:animate-none">
          <WordmarkRow />
        </div>
      </div>
    </section>
  );
}
