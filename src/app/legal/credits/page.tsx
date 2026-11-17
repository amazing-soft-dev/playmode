import type { Metadata } from "next";

import { BracketLabel, Section } from "@/components/ui";
import { credits } from "@/lib/media";

export const metadata: Metadata = {
  title: "Media credits",
  description: "The photographers and videographers whose free-licence work appears on PlayerMode.",
};

/** Generated from media/manifest.json, so every photo and video on the site is credited. */
export default function CreditsPage() {
  const items = credits();
  return (
    <Section className="pt-[120px] md:pt-[150px]">
      <div className="container-site flex flex-col gap-10">
        <div className="flex max-w-[760px] flex-col gap-6">
          <BracketLabel accent>Legal</BracketLabel>
          <h1 className="type-page">Media credits</h1>
          <p className="type-body text-fog">
            Every photo and video on PlayerMode comes from Unsplash or Pexels under their free licences. Thank you to the
            people who made them. Generated game covers and the sample games are original to PlayerMode.
          </p>
        </div>
        <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 border-r border-b border-line p-5">
              <span className="type-label text-ash">
                {item.kind} · {item.source === "unsplash" ? "Unsplash" : "Pexels"}
              </span>
              <span className="type-small text-paper">{item.alt || item.id}</span>
              <span className="type-small text-fog">
                by{" "}
                {item.authorUrl ? (
                  <a href={item.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {item.author}
                  </a>
                ) : (
                  item.author
                )}{" "}
                ·{" "}
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  source
                </a>{" "}
                ·{" "}
                <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  {item.license}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
