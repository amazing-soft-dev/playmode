"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { EASE_TEMPLATE } from "@/components/motion";
import { CloseIcon, MenuIcon } from "@/components/ui";
import { allPages } from "@/content/site";
import { cn } from "@/lib/cn";
import { trapFocus } from "@/lib/focus-trap";

/**
 * Phone and tablet menu (≤991.98px, docs/audit/components/mobile-menu.md). The button sits in the
 * header; the panel drops below it on a black background, locks page scroll, and fades the links
 * in over 500ms after a 200ms delay. A filter box narrows the list (from the legacy prototype).
 * Closes on Escape, on navigation and from the close button.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    filterRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPages;
    return allPages
      .map((g) => ({
        ...g,
        links: g.links.filter((l) => `${l.label} ${l.description ?? ""}`.toLowerCase().includes(q)),
      }))
      .filter((g) => g.links.length > 0);
  }, [query]);

  return (
    <div ref={wrapRef} className="md:hidden" onKeyDown={(e) => open && trapFocus(e, wrapRef.current)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-[22px] items-center justify-center transition-colors duration-[400ms] ease-snap hover:text-accent"
      >
        {open ? <CloseIcon className="size-[22px]" /> : <MenuIcon className="size-[22px]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease: EASE_TEMPLATE }}
            className="fixed inset-x-0 top-[62px] z-30 max-h-[calc(100dvh-62px)] overflow-y-auto border-b border-line bg-ink"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE_TEMPLATE }}
              className="container-site flex flex-col gap-8 pt-5 pb-10"
            >
              <label className="flex flex-col gap-2">
                <span className="type-label text-ash">Find a page</span>
                <input
                  ref={filterRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to filter"
                  className="h-11 border-b border-line bg-transparent type-body text-paper placeholder:text-ash focus:border-accent focus:outline-none"
                />
              </label>
              {groups.length === 0 && <p className="text-fog">No page matches “{query}”.</p>}
              {groups.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <p className="type-label text-ash">{group.title}</p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={pathname === link.href ? "page" : undefined}
                          className={cn(
                            "type-nav transition-colors duration-[400ms] ease-snap hover:text-accent aria-[current=page]:text-accent",
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
