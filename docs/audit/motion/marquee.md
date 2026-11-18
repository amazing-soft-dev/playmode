# Marquee

Status **C (absence confirmed)**.

- No marquee/ticker exists on any audited page. Checks: no Framer `Ticker` component in any of the 89 loaded modules (only the core `TickerContext` in framer runtime), no `@keyframes` besides Framer internals (`__framer-blink-input`, editor spinner), no `__framer__loop` on logos (the only `__framer__loop` effects are the 1s linear spinner in Form Button and Pagination Button).
- The Partner logo row is static (`justify-content: space-between`), revealed once with the 700ms fade/rise.
- The hero/footer "PLAYMODE —( … )" row is static.

## If PlayerMode wants one (optional, not template-faithful)

Keep it consistent with the system: Geist Mono 14px uppercase or logos at 30px height, linear infinite translateX, ~40–60 px/s, pause on hover, `prefers-reduced-motion: reduce` → static.
