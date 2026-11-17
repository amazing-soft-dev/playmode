# Blog / News Card

Framer `News Card` (Cc6Ts_kx1) — variants: Card With CMS Page (home, horizontal), Card Vertical With CMS Page (/news grid), Phone Card / Phone Card Vertical; plus `News Card With Video` on /news "Recent Streams". Status **C** (hover values from module; layout measured live).

## Horizontal (home Blog Section)
- Row **1300×300**: `padding-top: 30px; gap: 30px; align-items: center`; top border only 1px #333 (rows separated by a hairline).
- Text Content Wrapper (635 wide, column, `gap: 40px`):
  - Title Wrapper (max 500, column, `gap: 15px`): H5 Host Grotesk **24px/400/1.4/−0.5px uppercase**, excerpt Geist Mono **14px/300/1.5/−0.5px**.
  - CMS Button "Learn more" (244×48).
- Thumbnail Wrapper 635×270, `overflow: clip`; image cover.
- List: column, `gap: 30px`; 3 items.
- ≤991: card stacks (thumbnail then text — Phone Card), full width.

## Vertical (/news, /news-categories)
- Thumbnail on top, text below; 2–4 per row depending on width (I: 2 at desktop based on 8 items + pagination button).
- "Load more" Pagination Button with conic spinner loading state.

## Hover (whole card)
| Property | Default | Hover | Timing |
|---|---|---|---|
| Title colour | #fff | **#60aaff** | 400ms cubic-bezier(.44,0,.56,1) |
| Thumbnail | scale 1 | **scale 1.1** (horizontal/phone) / **1.15** (vertical) | 600ms (I: the .6s transition in module) |
| CMS Button | Default | Active (ticks 50%, #c1deff, text #60aaff, arrow slide) | 400ms |

## Motion
- Reveal per card: opacity 0→1, y 20→0, 700ms, delay index × 100ms.

## Rebuild
- `group` hover on the `<Link>`; `overflow-hidden` wrapper with `motion.img whileHover` or CSS `group-hover:scale-110 transition-transform duration-600`.
