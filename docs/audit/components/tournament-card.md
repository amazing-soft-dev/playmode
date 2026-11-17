# Tournament Card / Schedule Row

Status **C**. Three related list items.

## A. Tournament Card (home "Tournamens Section", tournament detail "Weekly ShowDown")
Framer `Tournament Card` (c1oStX2le), variants Default / Phone, hover-enabled. Whole card is a link.
- Size at 1440: **310×363**; flex column, `gap: 50px; padding: 20px`; `background: #333`; 1px #333 border.
- Top Content Wrapper (column, `gap: 20px`): bracket label (e.g. `[ WEEKLY SHOWDOWN ]`) → Title Wrapper (column, `gap: 16px`): H4 Host Grotesk **28/400/1.2/−0.2px uppercase** + schedule line Geist Mono 16/300/1.5.
- Bottom Content Wrapper (column, `gap: 30px`): info (column, `gap: 16px`): mode tag Geist Mono **12/400/1.2 uppercase** + description Geist Mono **14/400/1.35**; then CMS Button "Learn more" (244×48).
- Grid: row, `gap: 20px`. Columns: **4** (≥1280), **2** (992–1279, card 513 wide), **2** (768–991, 363 wide), **1** (≤767, full width 350).
- Hover (card): title colour → **#60aaff**; CMS Button switches to Active (ticks 50%, #c1deff, text #60aaff, arrow slide). 400ms cubic-bezier(.44,0,.56,1).
- Reveal: each card fade+rise 20px, 700ms, stagger **index × 100ms**.

## B. Tournament Card With Image (/tournaments listing)
- Size at 1440: **640×624**, column, no gap.
- Thumbnail Wrapper 640×320, `overflow: clip`, image `object-fit: cover` (hover zoom, I: scale 1.1, 0.6s — same pattern as news/team cards).
- Text Content Wrapper: `padding: 20px; gap: 50px`; 1px #333 border (no fill).
  - Top row: Title Wrapper (H4 28px + date line, `gap: 10px`) and bracket label `[ ONLINE ]` at right (`gap: 40px`).
  - Bottom: info block (440 wide) + CMS Button.
- Grid: `flex-wrap: wrap; gap: 40px 20px` → 2 columns at desktop.

## C. Schedule Row (/stream-schedule, `Schedule Item`)
- Full width row **1300×94**, `padding: 30px 20px; gap: 30px; justify-content: center; align-items: center`.
- Border: bottom + sides 1px #333 (top 0) → rows stack into a ruled table.
- Three equal 400px columns: day (Geist Mono 14/300 uppercase), time range (H4 Host Grotesk 28/400), activity (Geist Mono 14/300 uppercase).
- Rows reveal individually (fade + 20px rise).
- ≤991: columns stack (I, from Schedule Item phone variant).

## Rebuild
- One `<Card>` primitive: `bg-[#333]` variant (A) and `border border-[#333]` variant (B/C); title colour transition on `group-hover`.
