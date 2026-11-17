# Product Promo ("Contact Us Item")

Framer `Contact Us Item` (MaU65h9Dk), variants Default / Flip Card / Phone Card. Home "Contact Us Section" (two stacked promos), /our-sponsors. Status **C**.

## Default (image right)
- Panel **1300×425** at 1440: row, `gap: 60px; padding: 40px; align-items: center`, 1px #333 border, no fill.
- Text Content Wrapper (580 wide, column, `gap: 40px`):
  - Title Wrapper (max 490, column, `gap: 15px`): H3 Host Grotesk **34px/500/1.2/−0.5px uppercase** (32px ≤767), body Geist Mono 16/300/1.5.
  - Primary Button "Learn more" (240×48).
- Media: 580×345 image, `object-fit: cover`, absolutely filling its 580-wide slot (the slot stretches to panel height).
- Corner markers: 11×11 "+" crosshairs at the panel's top-left and top-right corners, offset −5px (see `cta-section.md` → corner marker).

## Flip Card
- Same as Default with the order reversed (image left, text right). Home shows Default then Flip.

## Responsive
- 992–1279: same row, narrower text (`max-width: 310–350px`).
- ≤991: Phone Card — column; image first (full width, ~310–323 wide at 390/800), text below (`order: 1`, `gap: 30px`).
- Section container gap between promos: **40px**.

## Motion
- Panel reveal: opacity 0→1, y 20→0, 700ms (I: J transition), once.
- No hover state on panel; only the button hovers.

## Rebuild
- PlayerMode use: "feature spotlight" blocks (e.g. AI generator, publishing) with screenshots you own.
