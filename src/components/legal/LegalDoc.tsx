import type { ReactNode } from "react";

import { BracketLabel, Section } from "@/components/ui";

export interface LegalSection {
  heading: string;
  body: string[];
}

/**
 * Layout for legal pages: title, last-updated date, a draft notice until counsel has reviewed the
 * text (the plan requires a lawyer's review before launch), and numbered sections.
 */
export function LegalDoc({
  label,
  title,
  updated,
  intro,
  sections,
  children,
}: {
  label: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <Section className="pt-[120px] md:pt-[150px]">
      <div className="container-site grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-[60px]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[90px] lg:self-start">
          <BracketLabel accent>{label}</BracketLabel>
          <p className="type-label text-ash">Last updated {updated}</p>
          <nav aria-label="Sections" className="hidden flex-col gap-2 lg:flex">
            {sections.map((s, i) => (
              <a key={s.heading} href={`#s${i + 1}`} className="type-small text-fog hover:text-accent">
                {i + 1}. {s.heading}
              </a>
            ))}
          </nav>
        </aside>
        <article className="flex max-w-[760px] flex-col gap-10">
          <header className="flex flex-col gap-6">
            <h1 className="type-page">{title}</h1>
            <p className="type-small border-l-2 border-accent pl-4 text-fog">
              Draft for legal review. This text explains how PlayerMode intends to work and will be finalised by counsel
              before public launch.
            </p>
            <p className="type-body text-fog">{intro}</p>
          </header>
          {sections.map((s, i) => (
            <section key={s.heading} id={`s${i + 1}`} className="flex scroll-mt-24 flex-col gap-4 border-t border-line pt-8">
              <h2 className="type-h4">
                <span className="text-ash">{i + 1}.</span> {s.heading}
              </h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 40)} className="type-body text-fog">
                  {p}
                </p>
              ))}
            </section>
          ))}
          {children}
        </article>
      </div>
    </Section>
  );
}
