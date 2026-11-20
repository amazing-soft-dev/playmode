import type { Metadata } from "next";

import { DailyChallenge } from "@/components/daily/DailyChallenge";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui";
import { daily } from "@/content/daily";

export const metadata: Metadata = {
  title: "Daily challenge",
  description: daily.lead,
};

export default function DailyPage() {
  return (
    <>
      <PageHeader label={daily.label} title={daily.title} lead={daily.lead} />
      <Section tightTop>
        <div className="container-site">
          <DailyChallenge />
        </div>
      </Section>
    </>
  );
}
