"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { PlusIcon } from "@/components/ui";
import { allPages } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * "ALL PAGES +" dropdown from the template header (docs/audit/components/all-pages-dropdown.md):
 * a black panel of links in columns that fades in over 300ms. The plus rotates 180° on hover and
 * when open. Closes on Escape, outside click and navigation.
 */
export function AllPagesMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group/all type-nav inline-flex items-center gap-1.5 transition-colors duration-[400ms] ease-snap hover:text-accent",
          open && "text-accent",
        )}
      >
        All pages
        <PlusIcon
          className={cn(
            "size-3.5 transition-transform duration-[400ms] ease-snap group-hover/all:rotate-180",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-[calc(100%+21px)] right-0 z-40 w-[560px] border border-line bg-ink p-8 opacity-100 transition-opacity duration-300 ease-snap starting:opacity-0"
      >
        <div className="grid grid-cols-3 gap-8">
          {allPages.map((group) => (
            <div key={group.title}>
              <p className="type-label text-ash">{group.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="type-nav transition-colors duration-[400ms] ease-snap hover:text-accent aria-[current=page]:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
