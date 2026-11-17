import type { Metadata } from "next";

import { DailyChallenge } from "@/components/daily/DailyChallenge";
import { PageBanner } from "@/components/sections/PageBanner";
import { Section } from "@/components/ui";
import { daily } from "@/content/daily";
import { photos } from "@/content/media";

export const metadata: Metadata = {
  title: "Daily challenge",
  description: daily.lead,
};

export default function DailyPage() {
  return (
    <>
      <PageBanner photo={photos.bannerDaily} label={daily.label} title={daily.title} lead={daily.lead} compact />
      <Section>
        <div className="container-site">
          <DailyChallenge />
        </div>
      </Section>
    </>
  );
}
