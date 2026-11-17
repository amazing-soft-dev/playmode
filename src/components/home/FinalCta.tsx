import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { BracketLabel, Button } from "@/components/ui";
import { photos } from "@/content/media";
import { home } from "@/content/site";

/** Closing call to action (docs/audit/components/cta-section.md) over the arcade photo. */
export function FinalCta() {
  const { finalCta } = home;
  return (
    <section className="relative isolate overflow-clip border-t border-line py-20 lg:py-[130px]">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Media id={photos.ctaArcade} alt="" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/75" />
      </div>
      <div className="container-site flex flex-wrap justify-between gap-10">
        <Reveal>
          <BracketLabel accent>{finalCta.label}</BracketLabel>
        </Reveal>
        <div className="flex w-full max-w-[580px] flex-col gap-10">
          <Reveal index={1} className="flex flex-col gap-5">
            <h2 className="type-h2">{finalCta.title}</h2>
            <p className="type-body text-fog">{finalCta.lead}</p>
          </Reveal>
          <Reveal index={2} className="flex flex-wrap items-center gap-6">
            <Button href={finalCta.primary.href}>{finalCta.primary.label}</Button>
            <Button href={finalCta.secondary.href} variant="link">
              {finalCta.secondary.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
