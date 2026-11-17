# Team Card

Framer `Team Card` (oSMm7xNkO) — variants Default (home 4-up), Large Card / Tablet Large Card / Phone Large Card (/team, /about-us). Status **C**.

## Default (home Team Section)
- Card **314×379** at 1440: column, `gap: 20px; padding: 15px 15px 20px`.
- Border: 1px #333 on top, left and right (bottom 0 → cards read as open-bottom frames) — measured `1px/0px/1px` top/bottom/left.
- Thumbnail Wrapper 284×280, `overflow: clip`, portrait image cover.
- Title Wrapper (column, `gap: 6px`): name H6 Host Grotesk **20px/500/1.2/−0.5px uppercase**; role Geist Mono **14px/400/1.35**.
- Corner markers ("+", 11×11, offset −5px) on the top-left and top-right corners of the card.
- Grid: 4 per row (≥992), 2×2 at 800px, 1 per row at 390 (card full width 350).
- Section has `padding: 0` (it is followed by the CTA section with its own top border).

## Large Card (/team listing)
- Same anatomy, bigger thumbnail; 6 players; phone variant stacks (I: 3/2/1 columns by tier — not measured).

## Hover
| Property | Default | Hover | Timing |
|---|---|---|---|
| Name colour | #fff | **#60aaff** | 400ms cubic-bezier(.44,0,.56,1) |
| Photo | scale 1 | **scale 1.1** | 600ms (I) |

## Motion
- Reveal per card: opacity 0→1, y 20→0, 700ms, delay index × 100ms.

## Player detail page (/team/<slug>)
- Inner banner with avatar (Avatar Wrapper) + Player Info items (`Player Info Item`, preset 18px/500 Host Grotesk values), Statistics Section (4 counters), "About The Player" rich text section.

## Rebuild
- PlayerMode reuse: "featured creators" or "games made" cards; square-ish 284×280 media.
