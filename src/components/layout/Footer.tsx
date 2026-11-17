import Link from "next/link";

import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { Reveal } from "@/components/motion";
import { WordmarkRow } from "@/components/sections/WordmarkRow";
import { videos } from "@/content/media";
import { brand, contact, footerNav } from "@/content/site";

/**
 * Site footer (docs/audit/components/footer.md): a 20%-opacity video loop behind the wordmark
 * row, link columns with "+" headings, and the copyright row in 70% white.
 */
export function Footer() {
  return (
    <footer className="relative overflow-clip border-t border-line pt-[60px] pb-10 lg:min-h-[500px]">
      <BackgroundVideo id={videos.footer} className="opacity-20" />
      <div className="relative z-10 container-site flex flex-col gap-10">
        <Reveal>
          <WordmarkRow />
        </Reveal>

        <nav
          aria-label="Footer"
          className="mx-auto grid w-full max-w-[500px] gap-8 pb-5 text-center md:mx-0 md:flex md:max-w-none md:justify-between md:text-left lg:justify-start lg:gap-[200px] lg:pb-[60px]"
        >
          {footerNav.map((group, i) => (
            <Reveal key={group.title} index={i}>
              <p className="flex items-center justify-center gap-2 font-sans text-[20px] font-medium uppercase md:justify-start">
                <span aria-hidden className="text-accent">
                  +
                </span>
                {group.title}
              </p>
              <ul className="mt-[15px] flex flex-wrap justify-center gap-x-6 gap-y-[3px] md:flex-col md:justify-start">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="type-nav transition-colors duration-[400ms] ease-snap hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          {contact.social.length > 0 && (
            <Reveal index={footerNav.length}>
              <p className="font-sans text-[20px] font-medium uppercase">+ Follow</p>
              <ul className="mt-[15px] flex flex-col gap-[3px]">
                {contact.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="type-nav hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </nav>

        <Reveal className="flex justify-center md:justify-start">
          <NewsletterForm />
        </Reveal>

        <Reveal className="type-nav flex flex-col items-center gap-1 text-fog md:flex-row md:justify-between">
          <p>{brand.copyright}</p>
          <p>
            Media from Unsplash and Pexels ·{" "}
            <Link href="/legal/credits" className="transition-colors hover:text-accent">
              Credits
            </Link>
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
