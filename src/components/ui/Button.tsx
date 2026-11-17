import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { ArrowIcon } from "./icons";

/**
 * Buttons in the Playmode style.
 * - primary: the template's framed button (top/bottom rules, corner ticks, an arrow cell). The
 *   arrow cell is lime; on hover the frame turns lime and the arrow slides through.
 * - secondary: the same frame in white; hover turns text and arrow lime.
 * - solid: a lime block, for the single most important action on a screen.
 * - link: inline text action with a lime underline on hover.
 */
export type ButtonVariant = "primary" | "secondary" | "solid" | "link";

interface BaseProps {
  variant?: ButtonVariant;
  /** Show the sliding arrow (framed variants only). Defaults to true. */
  arrow?: boolean;
  /** Stretch to the container width. */
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type AsLink = BaseProps & { href: string; external?: boolean } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = AsLink | AsButton;

function framed(variant: ButtonVariant, block: boolean, className?: string) {
  return cn(
    "group/btn relative inline-flex h-12 shrink-0 items-stretch border-y text-paper transition-colors duration-300",
    // Corner ticks: 6px vertical strokes at each end of the left and right edges.
    "before:absolute before:-inset-y-px before:left-0 before:w-px before:bg-[linear-gradient(currentColor_0_6px,transparent_6px_calc(100%-6px),currentColor_calc(100%-6px))]",
    "after:absolute after:-inset-y-px after:right-0 after:w-px after:bg-[linear-gradient(currentColor_0_6px,transparent_6px_calc(100%-6px),currentColor_calc(100%-6px))]",
    "border-paper hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
    variant === "primary" && "border-paper",
    block && "flex w-full",
    className,
  );
}

function Inner({ variant, arrow, block, children }: Required<Pick<BaseProps, "variant" | "arrow" | "block">> & { children: ReactNode }) {
  if (variant === "solid" || variant === "link") return <>{children}</>;
  return (
    <>
      <span
        className={cn(
          "type-body flex min-w-48 items-center px-5 tracking-[0.03em] whitespace-nowrap",
          arrow && "border-r border-current",
          block && "flex-1",
        )}
      >
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "relative flex w-12 items-center justify-center overflow-hidden",
            variant === "primary" ? "bg-accent text-accent-ink" : "text-current",
          )}
        >
          <ArrowIcon className="size-5 transition-transform duration-[350ms] ease-snap group-hover/btn:translate-x-10" />
          <ArrowIcon className="absolute size-5 -translate-x-10 transition-transform duration-[350ms] ease-snap group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );
}

const SOLID =
  "type-caps inline-flex h-12 items-center justify-center gap-2 bg-accent px-6 text-accent-ink transition-colors duration-300 hover:bg-paper focus-visible:bg-paper disabled:pointer-events-none disabled:opacity-40";
const LINK =
  "type-caps inline-flex items-center gap-2 text-paper underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-accent hover:decoration-accent";

export function Button(props: ButtonProps) {
  const { variant = "primary", arrow = true, block = false, className, children } = props;
  const classes =
    variant === "solid" ? cn(SOLID, block && "w-full", className) : variant === "link" ? cn(LINK, className) : framed(variant, block, className);
  const content = (
    <Inner variant={variant} arrow={arrow} block={block}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, arrow: _a, block: _b, className: _c, children: _ch, ...rest } = props;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const { variant: _v, arrow: _a, block: _b, className: _c, children: _ch, href: _h, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
