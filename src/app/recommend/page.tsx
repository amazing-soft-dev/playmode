import type { Metadata } from "next";

import { RecommendFinder } from "@/components/recommend/RecommendFinder";
import { PageBanner } from "@/components/sections/PageBanner";
import { Section } from "@/components/ui";
import { photos } from "@/content/media";
import { recommend } from "@/content/recommend";

export const metadata: Metadata = {
  title: "Game picks",
  description: recommend.lead,
};

export default function RecommendPage() {
  return (
    <>
      <PageBanner
        photo={photos.bannerRecommend}
        label={recommend.label}
        title={recommend.title}
        lead={recommend.lead}
        compact
      />
      <Section>
        <div className="container-site">
          <RecommendFinder />
        </div>
      </Section>
    </>
  );
}
