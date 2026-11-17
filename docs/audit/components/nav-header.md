# Nav / Header

Framer component `Header` (script_main), instance `kcdejHe5l`. Present on every page. Status: **C** unless marked.

## Anatomy
- Fixed bar (`position: fixed; top: 0; width: 100vw; z-index: 10`), height **62px** (20px top/bottom padding + 22px row).
- Inner row = Base Container: `max-width: 1330px; padding: 0 15px` (20px at ≤1279.98), `display:flex; justify-content: space-between; align-items: center`.
- Left: logo wordmark (SVG image, **114×12px**).
- Right group (`gap: 20px`, `min-width: 200px; min-height: 33px`):
  - Nav Links Wrapper: `gap: 30px; padding-right: 30px` (20px at laptop) → 5 links + "ALL PAGES +" trigger.
  - 1px vertical divider between links and Search (visible on desktop screenshot).
  - Search Button (see `search.md`).
- Phone/tablet (≤991.98): logo left; right = "SEARCH" text button + hamburger icon **22×22** (`gap: 20px`). Links hidden.

## Variants
| Variant | When | Background |
|---|---|---|
| Desktop / Tablet / Phone | page top (scrollY < ~50px) | `transparent` (`--token-76023a3d`) |
| Desktop BG / Tablet BG / Phone BG | after scrolling past the 1px sentinel `Banner Scroll Section` at `top: 50px` | `#000` |
| Phone Opened | hamburger tapped | `#000`, grows to fit menu (see `mobile-menu.md`) |

Desktop variant width 1280 (≥1280), Tablet 992 (992–1279.98) with dropdown offsetX 80, Phone 375 (≤991.98). Breakpoint selection is by viewport media query.

## Typography
- Links: Geist Mono 14px / 500 / line-height 1.6 (22.4px) / letter-spacing −0.5px / uppercase / #fff.
- Search text: same nav preset, with 1px bottom border.

## States
| Element | Default | Hover | Active (current page) | Transition |
|---|---|---|---|---|
| Nav link text | #fff | #60aaff | #60aaff | 0.4s cubic-bezier(.44,0,.56,1) |
| "ALL PAGES" + icon | 0° | rotate 180° + #60aaff | — | 0.4s same ease |
| Search underline | rgba(255,255,255,.3) | #60aaff | — | 0.4s |
| Header bg | transparent | — | — | ≈0.4–0.5s ease-in-out (sampled: α .01@91ms, .21@191, .74@316, .96@401, 1.0@506) |

Keyboard focus: no custom focus ring observed (Framer default outline suppressed on links) — **I**. Rebuild should add a visible `:focus-visible` ring (suggest 1px #60aaff outline, 2px offset).

## Rebuild notes
- Render as `<header>` fixed; use an IntersectionObserver sentinel 50px from page top (or `scrollY > 50`) to toggle `data-scrolled` → `background-color: #000` with `transition: background-color .4s cubic-bezier(.44,0,.56,1)`.
- Header persists across SPA navigations (not re-mounted); active link derived from route.
- "Made in Framer" badge (fixed bottom-right) is Framer hosting chrome — do not rebuild.
