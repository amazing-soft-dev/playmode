import type { Metadata } from "next";
import Link from "next/link";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageBanner } from "@/components/sections/PageBanner";
import { ArrowIcon, BracketLabel, Section } from "@/components/ui";
import { photos } from "@/content/media";
import { contactPage } from "@/content/pages";

export const metadata: Metadata = {
  title: "Contact",
  description: contactPage.lead,
};

export default function ContactPage() {
  return (
    <>
      <PageBanner photo={photos.bannerContact} label={contactPage.label} title={contactPage.title} lead={contactPage.lead} compact />
      <Section>
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_60%] lg:gap-[60px]">
          <aside className="flex flex-col gap-6">
            <BracketLabel>{contactPage.asideTitle}</BracketLabel>
            <ul className="flex flex-col border-t border-line">
              {contactPage.aside.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="type-nav flex items-center justify-between border-b border-line py-4 transition-colors hover:text-accent">
                    {a.label}
                    <ArrowIcon className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <InquiryForm endpoint="/api/contact" topics={contactPage.topics} />
        </div>
      </Section>
    </>
  );
}
