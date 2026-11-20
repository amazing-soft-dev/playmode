"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { SearchIcon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { trapFocus } from "@/lib/focus-trap";
import { searchSite } from "@/lib/search-index";

/**
 * Header search (docs/audit/components/search.md). "SEARCH" opens a 95% black overlay (150ms)
 * with an 800px bar that springs in. Results update as you type; arrow keys move the selection
 * and Enter opens it. Ctrl/Cmd+K opens it from anywhere; Escape or a backdrop click closes it.
 */
export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchSite(query), [query]);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    inputRef.current?.focus();
    const trigger = buttonRef.current;
    return () => {
      root.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      router.push(results[active].href);
      close();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        className="border-b border-paper/30 type-nav transition-colors duration-[400ms] ease-snap hover:border-accent hover:text-accent"
      >
        Search
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="search"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            onKeyDown={(e) => trapFocus(e, dialogRef.current)}
            aria-label="Search the site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-ink/95 px-5 pt-[18vh]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 40 }}
              className="w-full max-w-[800px] bg-line shadow-[0_0_50px_0_rgba(198,255,61,0.18)]"
            >
              <div className="flex items-center gap-3 px-5 py-3">
                <SearchIcon className="size-4 shrink-0 text-fog" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder="Search pages, templates and games"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls={listId}
                  aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                  className="h-[31px] w-full bg-transparent type-body text-paper placeholder:text-fog focus:outline-none"
                />
                <kbd className="hidden type-label text-ash sm:block">Esc</kbd>
              </div>
              {query.trim() !== "" && (
                <ul
                  id={listId}
                  role="listbox"
                  className="max-h-[min(441px,calc(100dvh-30vh))] overflow-y-auto border-t border-ink/40"
                >
                  {results.length === 0 && <li className="px-5 py-4 type-body text-fog">No results for “{query}”.</li>}
                  {results.map((r, i) => (
                    <li key={r.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                      <Link
                        href={r.href}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex flex-col gap-1 px-5 py-3 transition-colors",
                          i === active ? "bg-ink/50 text-accent" : "text-paper",
                        )}
                      >
                        <span className="type-body">
                          <span className="mr-3 type-label text-ash">{r.kind}</span>
                          {r.title}
                        </span>
                        <span className="line-clamp-1 type-small text-fog">{r.detail}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
