"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useScrolledPast } from "@/components/motion";
import { primaryNav } from "@/content/site";
import { cn } from "@/lib/cn";

import { AllPagesMenu } from "./AllPagesMenu";
import { Logo } from "./Logo";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Fixed site header (docs/audit/components/nav-header.md). Transparent over the hero, black once
 * the page scrolls past 50px (450ms on the template curve). Desktop shows the primary links and
 * the all-pages menu; `actions` holds search and, below 992px, the menu button.
 */
export function Header({ actions }: { actions?: ReactNode }) {
  const pathname = usePathname();
  const scrolled = useScrolledPast(50);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-colors duration-[450ms] ease-snap",
        scrolled ? "bg-ink" : "bg-transparent",
      )}
    >
      <div className="container-site flex h-[62px] items-center justify-between gap-6">
        <Logo />

        <div className="flex items-center gap-5">
          <nav aria-label="Main" className="hidden items-center gap-[30px] pr-5 md:flex lg:pr-[30px]">
            <ul className="flex items-center gap-[30px]">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    className="type-nav transition-colors duration-[400ms] ease-snap hover:text-accent aria-[current=page]:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <AllPagesMenu />
          </nav>
          {actions && (
            <>
              <span aria-hidden className="hidden h-[33px] w-px bg-line md:block" />
              <div className="flex items-center gap-5">{actions}</div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
