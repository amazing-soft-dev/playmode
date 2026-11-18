# Section Heading block

Status **C**. Used at the top of most sections (home About/Statistics/Tournaments/Partners/Blog/Team, inner pages).

## Patterns

1. **Split row** (Tournaments, Weekly Showdown, CTA): `display:flex; justify-content: space-between; align-items: flex-start; width: 100%`.
   - Left: bracket label (14px mono).
   - Right: H2, max-width ≈ 768–800px (Tournaments H2 at x=595, w=768 inside a 1300 container).
   - ≤991.98: stacks (`flex-direction: column; gap: 15–20px; max-width: 520–680px`).
2. **Centered stack** (Statistics): Title Wrapper `flex-direction: column; gap: 20px; align-items: center; max-width: 800px` — label above, H2 centered.
3. **Two-tone heading** (About Us): one H2 where the first sentence is `#7b7878` and the rest `#fff` (two spans), Host Grotesk 40/500/1.2/−1px uppercase. Paired with a 90×90 decorative pixel icon at left (Decorative Element) and the label.
4. **Body-led** (Blog, Tournaments page): a 345–350px wide mono paragraph (16/300/1.5) instead of an H2, container gap 60px to the grid.

## Type

- H2: Host Grotesk **40px** (36px ≤991) / 500 / 1.2 / −1px / uppercase / #fff.
- Supporting copy: Geist Mono 16px / 300 / 1.5 / −0.02em.
- Gap heading→content in section container: **60px** (40px on promo stack; 160px in hero).

## Motion

- Title Wrapper reveal: opacity 0→1, translateY 20→0, **700ms** (Heading alone uses 600ms), cubic-bezier(.44,0,.56,1), once, starts as soon as any pixel enters the viewport.

## Rebuild

- `<SectionHeading label="ABOUT US" align="split|center">` with an optional muted lead span (`text-[#7b7878]`).
