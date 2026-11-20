import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * The template's signature row: the giant Syne wordmark, a 100×10 white dash, and the tagline
 * set between Syne parentheses. Used to close the home hero and to open the footer.
 * Stacks into a centred column below 992px.
 *
 * `compact` is the hero size from 1280px: a 72px wordmark with the tagline on one line, so the row
 * supports the hero headline instead of outshouting it. The footer keeps the full 100px row.
 */
export function WordmarkRow({
  tagline = brand.bannerTagline,
  compact = false,
  className,
}: {
  tagline?: string;
  compact?: boolean;
  className?: string;
}) {
  const glyph = cn(
    "font-display text-[46px] leading-none font-bold sm:text-[84px]",
    compact ? "lg:text-[72px]" : "lg:text-[100px]",
  );
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-[30px] text-center md:flex-row md:justify-between md:gap-3 md:text-left lg:gap-5",
        className,
      )}
    >
      <p className={cn("type-wordmark text-[40px] sm:text-[84px]", compact ? "lg:text-[72px]" : "lg:text-[100px]")}>
        {brand.wordmark}
      </p>
      {/* In the compact row the dash stretches into a rule, so the freed width joins the two halves. */}
      <span
        aria-hidden
        className={cn("hidden h-2.5 w-[100px] shrink-0 bg-paper md:block", compact && "lg:w-auto lg:flex-1")}
      />
      <p className="flex items-center gap-5">
        <span aria-hidden className={glyph}>
          (
        </span>
        <span
          className={cn(
            "max-w-[230px] font-sans text-[18px] leading-[1.3] tracking-[-0.5px] uppercase sm:max-w-[260px] sm:text-[20px]",
            compact ? "lg:max-w-none lg:text-[24px] lg:whitespace-nowrap" : "lg:max-w-[400px] lg:text-[32px]",
          )}
        >
          {tagline}
        </span>
        <span aria-hidden className={glyph}>
          )
        </span>
      </p>
    </div>
  );
}
