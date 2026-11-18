import type { Metadata } from "next";

import { FinalCta } from "@/components/home/FinalCta";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reveal } from "@/components/motion";
import { PageBanner } from "@/components/sections/PageBanner";
import { BracketLabel, Button, Card, Muted, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { about } from "@/content/pages";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        photo={photos.bannerAbout}
        label={about.label}
        title={about.title}
        lead={about.lead}
        action={<Button href="/create">Make a game</Button>}
      />
      <Section>
        <div className="container-site grid gap-10 md:grid-cols-[1fr_61%]">
          <Reveal>
            <BracketLabel>{about.mission.label}</BracketLabel>
          </Reveal>
          <div className="flex flex-col gap-8">
            <Reveal index={1}>
              <h2 className="type-h2 text-balance-safe">
                {about.mission.title} <Muted>{about.mission.muted}</Muted>
              </h2>
            </Reveal>
            {about.mission.body.map((p, i) => (
              <Reveal key={p.slice(0, 20)} index={i + 2}>
                <p className="type-body text-fog">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      <Section ruled>
        <div className="container-site">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.principles.map((p, i) => (
              <Reveal as="li" key={p.title} index={i}>
                <Card className="flex h-full flex-col gap-4 p-6">
                  <span className="font-mono text-[32px] leading-none font-thin text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h4 text-[22px]">{p.title}</h3>
                  <p className="type-small text-fog">{p.text}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>
      <HowItWorks />
      <FinalCta />
    </>
  );
}
