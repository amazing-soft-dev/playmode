# Statistic Counter

Framer `Statistic Item` (u3fMkZhFZ) with a code-component counter (z8H2vnThC). Home Statistics Section, About page, Player detail page. Status **C**.

## Strip ("Sraristics Wrapper", sic)
- Sits over the bottom of a full-width video frame (Video Wrapper: 1px #333 border, min-height 588px desktop / 460px ≤991, content aligned to bottom).
- Strip: `background: rgba(0,0,0,.4)` + BG Gradient overlay (`linear-gradient(180deg, rgba(9,9,21,.2) 0%, #000 100%)` inset 0 1px 1px), 1px #333 border, `z-index: 3`.
- Layout: row, `gap: 40px; padding: 30px 50px` (laptop `gap 30px; padding 30px`; ≤991 `flex-wrap: wrap; justify-content:center; gap: 40px 60px; padding: 30px 20px`).
- Items per row: 4 (≥992), 2×2 at 800px, 1 per row at 390. Item width 270 (1440), 224 (1100), 250 (≤991).

## Item
- Column, `gap: 15px; overflow: clip`.
- Counter Wrapper: row, `gap: 8px`: number + bracket label (e.g. `[ PLAYERS ]`).
- Number: Host Grotesk **54px / 600 / line-height 59.4px / letter-spacing −3px**, #fff, same on all tiers. Optional suffix (e.g. "M").
- Description: Geist Mono 16px / 300 / 1.5 / −0.05em / **uppercase**, max ≈250px.

## Count-up behaviour
| Setting | Value |
|---|---|
| start → end | 0 → target (e.g. 8 with suffix "M", 190, 242) |
| duration | **1.0s** |
| easing | easeInOut = cubic-bezier(.4,0,.2,1) |
| trigger | in view (IntersectionObserver), item revealed at the same time (fade/slide 20px, 0.7s, +0.1s stagger per item) |
| replay | **Reset on re-entry: on** → counts again every time it re-enters the viewport |
| decimals / separator | 0 / "," |
Driven by requestAnimationFrame (JS), not CSS.

## Rebuild
- `useInView(ref, { amount: 0 })` + `animate(0, target, { duration: 1, ease: [.4,0,.2,1] })` from `motion`; re-run on every enter. Use `font-variant-numeric: tabular-nums` (template does not — I) to avoid jitter.
