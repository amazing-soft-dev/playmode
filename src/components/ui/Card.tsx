import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

/**
 * The template's framed panel: a 1px #333 border with small "+" crosses on the four corners.
 * `interactive` adds the hover state used for clickable cards: the border and crosses turn lime.
 */
export function Card({
  as: Tag = "div",
  interactive = false,
  crosses = true,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & { as?: ElementType; interactive?: boolean; crosses?: boolean }) {
  return (
    <Tag
      className={cn(
        "group/card relative border border-line bg-ink transition-colors duration-300",
        interactive && "hover:border-accent focus-within:border-accent",
        className,
      )}
      {...props}
    >
      {crosses && <Crosses interactive={interactive} />}
      {children}
    </Tag>
  );
}

function Crosses({ interactive }: { interactive: boolean }) {
  const cross = cn(
    "pointer-events-none absolute z-10 size-[13px] text-paper transition-colors duration-300",
    interactive && "group-hover/card:text-accent group-focus-within/card:text-accent",
  );
  const svg = (
    <svg viewBox="0 0 13 13" aria-hidden className="size-full">
      <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <>
      <span className={cn(cross, "-top-[7px] -left-[7px]")}>{svg}</span>
      <span className={cn(cross, "-top-[7px] -right-[7px]")}>{svg}</span>
      <span className={cn(cross, "-bottom-[7px] -left-[7px]")}>{svg}</span>
      <span className={cn(cross, "-right-[7px] -bottom-[7px]")}>{svg}</span>
    </>
  );
}

/** Small pill for tags, filters and quick picks. Selected chips are lime. */
export function Chip({
  selected = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "type-label inline-flex h-9 items-center rounded-pill border px-4 transition-colors duration-200",
        selected
          ? "border-accent bg-accent text-accent-ink"
          : "border-line text-fog hover:border-accent hover:text-accent",
        className,
      )}
      {...props}
    />
  );
}

/** Non-interactive tag. */
export function Tag({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn("type-label inline-flex h-7 items-center rounded-pill border border-line px-3 text-fog", className)}
      {...props}
    />
  );
}
