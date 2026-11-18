import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The template's signature row: the giant Syne wordmark, a 100×10 white dash, and the tagline
 * set between Syne parentheses. Used to close the home hero and to open the footer.
 * Stacks into a centred column below 992px.
 */
export function WordmarkRow({ tagline = brand.bannerTagline, className }: { tagline?: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-[30px] text-center md:flex-row md:justify-between md:gap-3 md:text-left lg:gap-5",
        className,
      )}
    >
      <p className="type-wordmark text-[40px] sm:text-[84px] lg:text-[100px]">{brand.wordmark}</p>
      <span aria-hidden className="hidden h-2.5 w-[100px] shrink-0 bg-paper md:block" />
      <p className="flex items-center gap-5">
        <span aria-hidden className="font-display text-[46px] leading-none font-bold sm:text-[84px] lg:text-[100px]">
          (
        </span>
        <span className="max-w-[230px] font-sans text-[18px] leading-[1.3] tracking-[-0.5px] uppercase sm:max-w-[260px] sm:text-[20px] lg:max-w-[400px] lg:text-[32px]">
          {tagline}
        </span>
        <span aria-hidden className="font-display text-[46px] leading-none font-bold sm:text-[84px] lg:text-[100px]">
          )
        </span>
      </p>
    </div>
  );
}
