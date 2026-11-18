import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { BracketLabel, Button, Card, Section } from "@/components/ui";
import { photos, type PhotoSlot } from "@/content/media";
import { home } from "@/content/site";
import { cn } from "@/lib/cn";

const PROMO_PHOTO: Record<string, PhotoSlot> = {
  recommend: "promoRecommend",
  download: "promoDownload",
};

/**
 * Two feature promos in the template's product-promo layout (docs/audit/components/
 * product-promo.md): a framed panel with text on one side and a photo on the other, the second
 * one flipped. Below 992px the photo comes first and the text stacks under it.
 */
export function FeaturePromos() {
  return (
    <Section ruled>
      <div className="container-site flex flex-col gap-10">
        {home.promos.map((promo, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={promo.id} duration={0.8}>
              <Card className="flex flex-col gap-[30px] p-5 md:p-10 lg:flex-row lg:items-stretch lg:gap-[60px]">
                <div
                  className={cn(
                    "relative min-h-[300px] overflow-hidden lg:min-h-[345px] lg:w-[580px] lg:shrink-0",
                    flip ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <Media id={photos[PROMO_PHOTO[promo.id]!]} sizes="(min-width: 992px) 580px, 100vw" />
                </div>
                <div className={cn("flex flex-1 flex-col justify-center gap-10", flip ? "lg:order-2" : "lg:order-1")}>
                  <div className="flex max-w-[490px] flex-col gap-[15px]">
                    <BracketLabel accent>{promo.label}</BracketLabel>
                    <h3 className="type-h3">{promo.title}</h3>
                    <p className="type-body text-fog">{promo.text}</p>
                  </div>
                  <Button href={promo.cta.href}>{promo.cta.label}</Button>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
