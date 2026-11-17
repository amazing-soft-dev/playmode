# Mobile Menu

Header variant "Phone Opened" (≤991.98px). Status **C** (values read live at 390×844 and from the Header module).

## Closed
- Header row: logo (left), "SEARCH" text button + hamburger icon 22×22 (`gap 20px`), padding 20px 0, container padding 0 20px.
- Hamburger: 3-line SVG (24×17 artwork). Close: X SVG (32×30 artwork), same 22px box.

## Open
- Header background → `#000`; header height grows from 62px to **420px** (390 wide viewport).
- `padding: 20px 0 40px`; container switches to `flex-direction: column; gap: 40px; align-items: flex-start`.
- "Phone Nav Links Wrapper": column, `gap: 12px`, starts at y≈82, `z-index: 5`.
- 9 links: About Us, Players, Tournaments, Stream Schedule, Matches, Our Sponsors, News, FAQ, Contact Us — nav preset 14px/500/22.4px uppercase.
- Page scroll is locked (`overflow: hidden` on html + body via the `Stop Scroll` component).
- No full-screen overlay: the page below stays visible under the 420px panel.

## Motion
| Element | From | To | Duration | Delay | Ease |
|---|---|---|---|---|---|
| Header height / bg | 62px, transparent | 420px, #000 | 400ms (layout) — I | 0 | cubic-bezier(.44,0,.56,1) |
| Links wrapper | opacity 0.001 | 1 | 500ms | 200ms | cubic-bezier(.44,0,.56,1) — C |
| Icon swap | hamburger | X | instant swap (variant) — I | | |
Close reverses (links fade out with the variant change; header collapses).

## Screenshot
`.research/audit/screenshots/states/mobile-menu-open-390.jpg`

## Rebuild
- `<button aria-expanded aria-controls>`; panel is part of the fixed header; lock scroll with `overflow:hidden` on `<html>`.
- Motion: `animate={{height}}` (or CSS grid-rows trick) 0.4s; links `initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2,duration:.5,ease:[.44,0,.56,1]}}`.
- Close on route change and on Esc.
