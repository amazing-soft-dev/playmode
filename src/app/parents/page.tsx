import type { Metadata } from "next";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { PageBanner } from "@/components/sections/PageBanner";
import { BracketLabel, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { parents } from "@/content/parents";

export const metadata: Metadata = {
  title: "Parents and teachers",
  description: parents.lead,
};

const TOPICS = [
  { value: "question", label: "A question about safety or privacy" },
  { value: "deletion", label: "Delete an account or a child's data" },
  { value: "game", label: "A game I'm worried about" },
  { value: "classroom", label: "Using PlayerMode in class" },
];

export default function ParentsPage() {
  return (
    <>
      <PageBanner photo={photos.bannerParents} label={parents.label} title={parents.title} lead={parents.lead} />
      <Section>
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_42%] lg:gap-[60px]">
          <div className="flex flex-col gap-12">
            {parents.sections.map((section, i) => (
              <Reveal key={section.id} index={i % 2} className="flex flex-col gap-5 border-t border-line pt-8">
                <BracketLabel accent>{String(i + 1).padStart(2, "0")}</BracketLabel>
                <h2 id={section.id} className="type-h3">
                  {section.title}
                </h2>
                <ul className="type-body flex flex-col gap-3 text-fog">
                  {section.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden className="text-accent">
                        +
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <div className="relative hidden min-h-[520px] overflow-hidden border border-line lg:sticky lg:top-[90px] lg:block lg:h-[70vh]">
            <Media id={photos.parentsTogether} sizes="42vw" />
          </div>
        </div>
      </Section>
      <Section ruled id="contact">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_60%]">
          <div className="flex flex-col gap-5">
            <BracketLabel>Contact</BracketLabel>
            <h2 className="type-h2">{parents.formTitle}</h2>
            <p className="type-body text-fog">{parents.formLead}</p>
          </div>
          <InquiryForm endpoint="/api/parents" topics={TOPICS} />
        </div>
      </Section>
    </>
  );
}
