# Page transitions

Status **C** (hooked `history.pushState`, `document.startViewTransition` and a MutationObserver before clicking the header "About us" link from the home page).

| Field                | Observed                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Mechanism            | SPA route change (`history.pushState` at **72ms** after click); no full reload (window marker survived) |
| View Transitions API | **not used** (startViewTransition never called; no page effect configured in the bundle)                |
| Exit animation       | none — old page stays until the new route's chunk is ready, then swaps instantly                        |
| Header               | persists (not re-mounted); active nav item flips to #60aaff immediately                                 |
| Scroll               | reset to top (scrollY 0 after swap)                                                                     |
| Entrance             | new page's elements run their normal on-load reveals (opacity 0→1, y 20→0, 600–800ms)                   |
| Back button          | SPA pop (I: not separately captured)                                                                    |
| Direct URL load      | SSR HTML with reveal start states inlined                                                               |

Frames: `.research/audit/frames/page-transition-home-to-about/` (a: old page after click, b: nav active updated, c: new page).

## Rebuild

- Next.js App Router default navigation already matches (no transition). Optional: keep it instant to stay faithful; the "transition feel" comes from per-section reveals on the incoming page.
- Ensure scroll-to-top on navigation (App Router default) and keep the header in the root layout.
