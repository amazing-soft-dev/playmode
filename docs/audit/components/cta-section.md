# CTA Section (+ corner marker, inner banner)

Status **C**.

## CTA Section ("CTA Section" component, lB_AVcWDi; Desktop/Tablet/Phone variants)
Appears before the footer on home, about, team, match detail.
- Full-bleed block, **536px** tall at 1440: `padding: 130px 0`; 1px #333 **top** border.
- Background: decorative image (`Decorative Element`, 1440×569 artwork, `object-fit: cover`, absolute inset 0). For PlayerMode use your own abstract/linework art.
- Base Container: row, `justify-content: space-between; align-items: flex-start`.
  - Left: bracket label (`[ BOOK A VISIT ]`).
  - Right: Text Content Wrapper **580** wide, column `gap: 40px`: Title Wrapper (column `gap: 20px`) with H2 Host Grotesk 40/500/1.2 uppercase + body Geist Mono 16/300/1.5; then Primary Button.
- Laptop: text max 480px, padding 0 20px. Phone: `flex-wrap: wrap; gap: 40px 160px; justify-content: flex-start`, text min-width 280 / max 480.
- Reveal: label, Title Wrapper and button each fade+rise 20px (600/700ms).

## Corner Marker ("Plus Item", D6lRfbWat)
- 11×11 box, two 1px white lines (horizontal 11×1 centred at y=5, vertical 1×11 centred at x=5) = "+" crosshair.
- Placed `position:absolute` at panel corners with **−5px** offsets so the cross centre sits exactly on the 1px border corner.
- Used on: inner-banner glass card (4 corners), product promo (top 2), team cards (top 2).

## Inner Banner (all inner pages: about, team, tournaments, matches, schedule, sponsors, faq, news, player detail)
- Section: `min-height: 95vh; padding: 250px 0 0` (laptop `min-height 700px; padding 230px 0 0`; ≤991 `min-height unset; padding 0 0 80px; gap 15px`), content pinned to bottom.
- Layers back→front: background video (cover, z1) → `BG Color` rgba(0,0,0,.6) (z1) → container (z2).
- Glass title card: **1300×280**, `background: rgba(0,0,0,.4)`, 1px border, `padding: 60px 50px; gap: 60px`, row, z3, + BG Gradient overlay (rgba(9,9,21,.2)→#000) + 4 corner markers.
  - Left: H1 (inner-banner preset 58/500/1.2/−2px uppercase; 760 wide).
  - Right: 380-wide column `gap: 40px`: body (16/300) + Primary Button.
- Simpler pages (FAQ, News) use the same banner with shorter title (I: some show only H1 + paragraph without button).
