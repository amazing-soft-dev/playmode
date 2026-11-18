/** First focusable element on every page: jumps keyboard and screen-reader users past the header. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-3 left-3 z-[60] -translate-y-24 bg-accent px-4 py-3 type-caps text-accent-ink transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
