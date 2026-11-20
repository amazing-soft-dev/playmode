import type { Metadata } from "next";

import { RecommendFinder } from "@/components/recommend/RecommendFinder";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui";
import { recommend } from "@/content/recommend";

export const metadata: Metadata = {
  title: "Game picks",
  description: recommend.lead,
};

export default function RecommendPage() {
  return (
    <>
      <PageHeader label={recommend.label} title={recommend.title} lead={recommend.lead} />
      <Section tightTop>
        <div className="container-site">
          <RecommendFinder />
        </div>
      </Section>
    </>
  );
}
