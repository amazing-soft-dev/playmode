# All-Pages Dropdown

Opened by the "ALL PAGES +" nav item (desktop + laptop only). Status **C**.

## Trigger
- Nav Link with `Icon Set` "Plus" (14px). Tap toggles; hover rotates plus 180° and tints #60aaff (0.4s).
- Overlay is a Framer floating layer: `placement: bottom`, `alignment: end`, `offsetX: 100` (80 on the 992–1279 tablet variant), `offsetY: 10`, `z-index: 11`, `safeArea: true`, `role="dialog"`, dismiss on outside click / Esc.

## Panel
- Measured at 1440: x 934, y 52, **421×281px**.
- `background: #000`; border 1px #333 (drawn via ::after); `box-shadow: 0 0 10px 0 rgba(0,0,0,.04)`; radius 0.
- `display:flex; flex-direction: row; gap: 60px; padding: 26px 80px 26px 20px; overflow: clip`.
- Two columns, each `flex-direction: column; gap: 12px`.
- Links: nav preset (Geist Mono 14/500/1.6, −0.5px, uppercase, #fff), hover #60aaff (0.4s).
- transform-origin `100% 0%` (top-right).
- 14 entries: page + one "detail" example per CMS collection (about, team, player details, tournaments, tournament details, matches, match details, stream schedule, sponsors, FAQ, contact, news, news details, news category). For PlayerMode, replace with your own page list.

## Motion
| Phase | From | To | Duration | Ease |
|---|---|---|---|---|
| enter | opacity 0 | opacity 1 | 300ms | cubic-bezier(.44,0,.56,1) |
| exit | opacity 1 | opacity 0 | 300ms | same |
No scale/translate (all transform values 0/1 in the enter/exit objects).

## Rebuild
- Radix/Headless popover or a simple absolutely-positioned panel aligned to the right edge of the trigger + 100px, 10px below the header row.
- `AnimatePresence` with `opacity` only, 0.3s.
