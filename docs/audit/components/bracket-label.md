# Bracket Label `[ ABOUT US ]`

Framer `Label Company` (QY0M090EE) / `Label Company With Link`. Status **C**.

## Anatomy

- Three separate text nodes in a row: `[`, label, `]` — `display:flex; flex-direction:row; gap: 6px; align-items:center`.
- Each: preset `1uju4ft` — Geist Mono **14px / 300 / line-height 1em (14px) / letter-spacing −0.5px / uppercase / #fff**.
- Height 14px; width = content (e.g. 146px for "WEEKLY SHOWDOWN").

## Placement

- Section eyebrow: top-left of a section's Title Wrapper, with the H2 aligned right (`justify-content: space-between`, e.g. tournaments, CTA "book a visit").
- Inside cards: tournament card top line; tournament-with-image card top-right ("[ ONLINE ]"); statistic items under the number.
- Counter label: next to the stat number (`gap: 8px`).

## Variants

- Plain label (no link) and "With Link" (uses link preset: hover text #60aaff, 0.4s) — hover only on the link variant.

## Motion

- Revealed with its parent (scroll reveal: opacity 0→1, y 20→0, 0.6–0.7s).

## Rebuild

```tsx
<span className="inline-flex items-center gap-1.5 font-mono text-[14px] leading-none font-light tracking-[-0.5px] uppercase">
  <span>[</span>
  <span>{label}</span>
  <span>]</span>
</span>
```
