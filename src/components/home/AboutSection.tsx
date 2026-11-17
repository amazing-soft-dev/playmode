import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { BracketLabel, Button, Muted, PlayIcon, Section } from "@/components/ui";
import { photos, videos } from "@/content/media";
import { home } from "@/content/site";

/**
 * About block in the template's layout: a label beside a two-tone uppercase heading, then a
 * photo next to a muted gameplay video tile with a play badge, and the lead text with a link.
 */
export function AboutSection() {
  const { about } = home;
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-[60px]">
        <div className="grid gap-6 md:grid-cols-[1fr_61%] md:gap-10">
          <Reveal>
            <BracketLabel>{about.label}</BracketLabel>
          </Reveal>
          <Reveal index={1}>
            <h2 className="type-h2 text-balance-safe">
              {about.title} <Muted>{about.muted}</Muted>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-[58%_1fr]">
          <Reveal duration={0.8} className="relative min-h-[280px] overflow-hidden border border-line md:min-h-[420px]">
            <Media id={photos.homeAbout} sizes="(min-width: 768px) 58vw, 100vw" />
          </Reveal>
          <div className="flex flex-col gap-5">
            <Reveal duration={0.8} index={1} className="relative min-h-[240px] flex-1 overflow-hidden border border-line">
              <BackgroundVideo id={videos.gameplay} />
              <span className="absolute bottom-4 left-4 flex size-12 items-center justify-center bg-accent text-accent-ink">
                <PlayIcon className="size-5" />
              </span>
            </Reveal>
            <Reveal index={2} className="flex flex-col gap-6">
              <p className="type-body text-fog">{about.body}</p>
              <Button href={about.cta.href} variant="secondary">
                {about.cta.label}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
