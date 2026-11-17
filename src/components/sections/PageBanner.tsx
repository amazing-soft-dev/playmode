import type { ReactNode } from "react";

import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { BracketLabel, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

interface PageBannerProps {
  /** Manifest id of the background photo (use a slot from src/content/media.ts). */
  photo: string;
  title: ReactNode;
  label?: string;
  lead?: ReactNode;
  /** Usually a Button; sits under the lead text. */
  action?: ReactNode;
  /** Shorter banner for utility pages (legal, account). */
  compact?: boolean;
}

/**
 * Inner page banner (docs/audit/components/cta-section.md, "Inner Banner"): a full-bleed photo
 * under a 60% black veil, with a glass title card pinned to the bottom. The card has the
 * template's corner crosses and a dark gradient; the title uses the 58/50/46px page style.
 */
export function PageBanner({ photo, title, label, lead, action, compact = false }: PageBannerProps) {
  return (
    <section
      className={cn(
        "relative isolate flex items-end overflow-clip pt-[120px] pb-20 md:pt-[230px] lg:pt-[250px] lg:pb-0",
        compact ? "md:min-h-[520px]" : "md:min-h-[700px] lg:min-h-[95vh]",
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <Media id={photo} sizes="100vw" priority alt="" />
        <div className="absolute inset-0 bg-ink/60" />
      </div>
      <div className="container-site w-full">
        <Reveal duration={0.8}>
          <Card className="flex flex-col gap-10 bg-ink/40 bg-[linear-gradient(180deg,rgba(9,9,21,0.2)_0%,#000_100%)] px-6 py-10 md:px-[50px] md:py-[60px] lg:flex-row lg:items-end lg:justify-between lg:gap-[60px]">
            <div className="flex max-w-[760px] flex-col gap-6">
              {label && <BracketLabel accent>{label}</BracketLabel>}
              <h1 className="type-page text-balance-safe">{title}</h1>
            </div>
            {(lead || action) && (
              <div className="flex max-w-[380px] flex-col gap-10">
                {lead && <div className="type-body text-fog">{lead}</div>}
                {action}
              </div>
            )}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
