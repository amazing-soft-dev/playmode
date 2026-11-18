# Hero Banner (home)

"Hero Banner Section". Status **C** unless marked.

## Layers (back → front)

1. `Hero Banner Video` — absolute inset 0, z1, `<video autoplay muted loop playsinline>` cover, 5s loop of slowly undulating black/grey ribbons (monochrome). Poster image shown before playback.
2. `Decorative Element` — absolute inset 0 background image (1440×811 artwork): thin white diagonal lines forming a large "X" plus a centre vertical line (≈1px, low contrast). Swapped for a phone-specific crop at ≤991.
3. Base Container (z2).

## Layout

- `min-height: 100vh; padding: 250px 0 100px` (laptop `min-height: 620px; padding: 230px 0 80px`; ≤991 `min-height: unset; padding: 120px 0 80px`). Content bottom-aligned.
- Container column, `gap: 160px` (≤991 `gap: 60px; align-items: center`).
  1. Title Wrapper: row, `justify-content: space-between; align-items: center` (≤991 column, centred, `gap: 15px`, max 520):
     - H1 Host Grotesk **40/400/1.35/−0.04em uppercase** (38px ≤767), 3 lines at desktop.
     - Right column (max **400**, laptop 310; column `gap: 40px`): mono body 16/300/1.5 + Primary Button "Schedule a visit".
  2. Bottom Text Wrapper (row, `gap: 20px`, laptop 12px; ≤991 column centred): Syne wordmark 100px → white dash 100×10 → `(` tagline `)` (see footer). Wordmark 84px at 768–1279, 40px ≤767; tagline 32 → 20 → 18px.
- Phone: everything centre-aligned; text centred.

## Motion

- On load (elements already in view): Heading 600ms, Text Content Wrapper 700ms, Bottom Text Wrapper 800ms; each opacity 0→1 + translateY 20→0, cubic-bezier(.44,0,.56,1). Captured mid-animation in `.research/audit/screenshots/home/390-0-hero-appear.jpg`.
- No parallax / scroll-linked transforms (no scroll effects in the bundle). Video simply plays.

## Rebuild

- Replace the template video (third-party) with an original PlayerMode loop or a CSS/Canvas monochrome ribbon shader; keep a static poster for `prefers-reduced-motion`.
- Draw the diagonal X / centre line as an inline SVG (`stroke: rgba(255,255,255,.15–.25)`, 1px, `vector-effect: non-scaling-stroke`) — I for exact opacity.
