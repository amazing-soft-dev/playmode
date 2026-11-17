import type { Metadata } from "next";

import { PageBanner } from "@/components/sections/PageBanner";
import { Accordion, BracketLabel, Button, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { faq } from "@/content/pages";

export const metadata: Metadata = {
  title: "FAQ",
  description: faq.lead,
};

export default function FaqPage() {
  return (
    <>
      <PageBanner photo={photos.bannerFaq} label={faq.label} title={faq.title} lead={faq.lead} compact />
      <Section>
        <div className="container-site flex flex-col gap-16">
          {faq.groups.map((group) => (
            <div key={group.title} className="grid gap-6 md:grid-cols-[1fr_65%]">
              <BracketLabel as="h2">{group.title}</BracketLabel>
              <Accordion name={`faq-${group.title}`} items={group.items} />
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-6 border-t border-line pt-10">
            <p className="type-body text-fog">Still stuck?</p>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
