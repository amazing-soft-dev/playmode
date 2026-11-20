import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** "[ ABOUT US ]": the template's mono bracket label. `accent` makes the brackets lime. */
export function BracketLabel({
  children,
  accent = false,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("inline-flex items-center gap-2 type-label text-paper", className)}>
      <span aria-hidden className={accent ? "text-accent" : "text-ash"}>
        [
      </span>
      <span>{children}</span>
      <span aria-hidden className={accent ? "text-accent" : "text-ash"}>
        ]
      </span>
    </Tag>
  );
}

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("container-site", className)} {...props} />;
}

/**
 * A page section with the responsive vertical rhythm and an optional top rule. `tightTop` keeps
 * the bottom rhythm but starts close to the content above (used right under a PageHeader).
 */
export function Section({
  className,
  ruled = false,
  tightTop = false,
  ...props
}: ComponentPropsWithoutRef<"section"> & { ruled?: boolean; tightTop?: boolean }) {
  return (
    <section
      className={cn(tightTop ? "pt-4 pb-(--section) md:pt-6" : "section-y", ruled && "border-t border-line", className)}
      {...props}
    />
  );
}

/**
 * Label plus uppercase heading. Text inside <Muted> renders grey, as in the template's
 * two-tone headings ("WE'RE MORE THAN A GAMING CLUB — <grey>WE'RE A COMMUNITY…</grey>").
 */
export function SectionHeading({
  label,
  children,
  as: Tag = "h2",
  className,
  aside,
}: {
  label?: ReactNode;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-[1fr_60%] md:gap-10", className)}>
      <div>{label && <BracketLabel>{label}</BracketLabel>}</div>
      <div className="flex flex-col gap-6">
        <Tag className="type-h2 text-balance-safe">{children}</Tag>
        {aside}
      </div>
    </div>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-ash">{children}</span>;
}

/** A neon-lime highlight for one or two words, used sparingly. */
export function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>;
}
