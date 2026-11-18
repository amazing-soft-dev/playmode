# Partner Logo Strip

Home "Our Partners Section", also on /contact-us. Status **C**.

**Not a marquee.** The logos are a static row; there is no Ticker component, no CSS keyframes and no transform loop on this section. The only motion is the scroll reveal.

## Layout

- Section: `padding: 0 0 130px` (80px ≤1279.98). Base Container gap 60px.
- Top Content Wrapper: row, `gap: 30px` (bracket label + copy), wraps ≤991.
- Logo Wrapper (`Our Partners Logo Wrapper`): row, `justify-content: space-between; align-items:center; width:100%`.
  - ≤991.98: `flex-wrap: wrap; justify-content: center; gap: 30px 60px` → 2 rows of 4 at 800px, 4 rows of 2 at 390px.
- 8 logos (`Logo Partner`): box **130×30** (aspect 4.333), laptop **91×21**; white monochrome SVG/PNG wordmarks.

## Motion

- Each logo: opacity 0→1, translateY 20→0, **700ms**, cubic-bezier(.44,0,.56,1), once, no stagger (all logos share the same trigger time because they enter together).
- No hover effect on logos (no gesture variants found).

## Rebuild

- Simple `flex justify-between` row of 8 `<img>`/SVG at 130×30, `opacity-100`, white. Use PlayerMode partner/tech logos (or placeholder wordmarks); template logos are not reusable.
- Optional upgrade (not in template): if you want a marquee, keep it off by default to stay faithful.
