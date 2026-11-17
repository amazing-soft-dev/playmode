import type { Metadata } from "next";

import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui";
import { photos } from "@/content/media";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** 404 (docs/audit/components/404.md): a thin Geist Mono numeral over a dim photo, centred. */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-clip px-5 py-32 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-30">
        <Media id={photos.notFound} sizes="100vw" alt="" />
      </div>
      <div className="flex max-w-xl flex-col items-center gap-10">
        <Reveal className="flex flex-col items-center gap-5">
          <p className="font-mono text-[80px] leading-[1.2] font-thin tracking-[-1px] text-accent lg:text-[100px]">404</p>
          <h1 className="type-h2">Game over for this page.</h1>
        </Reveal>
        <Reveal index={1}>
          <p className="type-body text-fog">
            The page you were looking for moved or never existed. Your streak is safe, though.
          </p>
        </Reveal>
        <Reveal index={2} className="flex flex-wrap justify-center gap-4">
          <Button href="/">Back to home</Button>
          <Button href="/daily" variant="secondary">
            Play today&apos;s challenge
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
