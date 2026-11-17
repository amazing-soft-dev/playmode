# Button CTA (bracket button with arrow box)

Framer `Primary Button` (JW8JW48JM), `CMS Button` (NrIW74qtu, same look with Default/Active variants driven by parent card hover), `Form Button` (submit). The signature UI element. Status **C** (measured live + module CSS; hover sampled frame-by-frame on the 404 page).

## Anatomy (desktop, all tiers identical)
```
 ┌──────────────────────────┬────────┐   ← 1px top border (#fff)
 │ Learn more               │   →    │   height 48
 └──────────────────────────┴────────┘   ← 1px bottom border (#fff)
 ^ left edge: two 1×8px ticks only (top + bottom), no full left border
                            ^ arrow box: 48×48 with four 1×8px corner ticks, no side borders
```
- Root: `display:flex; justify-content: space-between; align-items:center; padding-left: 14px; overflow: clip; cursor: pointer; width: min-content` (e.g. 244px for "Learn more", 254 for "Schedule a visit").
- Borders: `--border-top-width: 1px; --border-bottom-width: 1px; left/right: 0; color #fff` drawn with an ::after overlay.
- Left ticks: two `Line` divs, 1px wide × **8px** tall, absolute at top-left and bottom-left, `z-index: 1`.
- CTA Text Wrapper: `padding: 14px 20px 14px 0`. Text = button preset: Geist Mono **16px / 300 / line-height 1.2 / letter-spacing 0.5px**, no transform, #fff.
- Arrow Wrapper: **48×48**, `padding: 14px; gap: 15px; justify-content: flex-end; overflow: clip`; four 1×8px ticks at its corners (top-left, bottom-left, top-right, bottom-right).
- Arrow Wrapp (icon track): **20×20**, `overflow: clip`, `justify-content: flex-end`, contains TWO 20px arrow icons side by side (variant Active at x−20, Default at x0).
- Phone variant: same structure (`Phone` variant exists; spacing identical in measurements at 390).

## States
| Property | Default | Hover (Primary) / Active (CMS, when card hovered) |
|---|---|---|
| Tick height (all 6) | 8px | **50%** of button (24px on 48px) — ticks grow into full side borders |
| Tick + border colour | #fff | **#c1deff** |
| Text colour | #fff | **#60aaff** |
| Arrow track `justify-content` | flex-end | flex-start → arrows slide **+20px** (new arrow enters from left, old exits right) |
| Transition | — | **400ms cubic-bezier(.44,0,.56,1)** on all of the above |

Sampled (hover-in on 404 CTA): t=72ms tick 9px / arrows +1px; 128ms 11px / +4; 183ms 14px / +8; 261ms 20px / +15; ~400ms 24px / +20. Frames: `.research/audit/frames/button-hover/`.

Form Button extra variants: Disabled `opacity .5`; Loading shows a 20px conic spinner (rotate 360°, 1s linear, infinite); Success / Error variants exist (labels not captured — **I**). Form button hover: text #60aaff, bg transparent.

Focus: no custom focus style observed (**I**). Add `:focus-visible` = same as hover state.

## Rebuild (Tailwind + Motion)
- Root `relative inline-flex h-12 items-center pl-3.5 border-y border-white` (use `outline`/pseudo if you want zero layout shift).
- Ticks: `absolute left-0 w-px h-2 bg-white transition-[height,background-color] duration-400 group-hover:h-1/2 group-hover:bg-[#c1deff]`.
- Arrow track: `flex w-5 overflow-hidden justify-end group-hover:justify-start` won't animate in CSS — use `translateX(-20px→0)` on a 40px strip instead (equivalent visual).
- Easing token: `cubic-bezier(.44,0,.56,1)`.
