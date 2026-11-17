import type { Metadata } from "next";
import { Suspense } from "react";

import { LimitNotice } from "@/components/pricing/LimitNotice";
import { PlanCards } from "@/components/pricing/PlanCards";
import { PageBanner } from "@/components/sections/PageBanner";
import { Accordion, Section, SectionHeading } from "@/components/ui";
import { photos } from "@/content/media";
import { pricing } from "@/content/pricing";
import { serverRepos } from "@/lib/repos";

export const metadata: Metadata = {
  title: "Pricing",
  description: pricing.lead,
};

export default async function PricingPage() {
  const offers = await serverRepos.billing.offers();
  return (
    <>
      <PageBanner photo={photos.bannerPricing} label={pricing.label} title={pricing.title} lead={pricing.lead} compact />
      <Section>
        <div className="container-site flex flex-col gap-10">
          <Suspense>
            <LimitNotice />
          </Suspense>
          <PlanCards offers={offers} />
        </div>
      </Section>
      <Section ruled>
        <div className="container-site flex flex-col gap-[60px]">
          <SectionHeading label="FAQ">Questions about plans</SectionHeading>
          <Accordion name="pricing-faq" items={pricing.faqs} />
        </div>
      </Section>
    </>
  );
}
