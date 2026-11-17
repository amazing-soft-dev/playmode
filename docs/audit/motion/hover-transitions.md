# Hover & focus transitions

Universal timing: **400ms cubic-bezier(0.44, 0, 0.56, 1)** for every hover variant (C). No custom cursor, no magnetic/tilt/spotlight effects (C: no pointer-follow code; `cursor` stays default/pointer).

| Target | Property changes | Duration | Status |
|---|---|---|---|
| Primary / CMS button | 6 corner ticks 8px→50% (24px); ticks + top/bottom border #fff→#c1deff; label #fff→#60aaff; arrow strip slides +20px (new arrow in from left) | 400ms | C (sampled) |
| Nav link (header/footer/dropdown) | text #fff→#60aaff | 400ms | C |
| "ALL PAGES" trigger | text →#60aaff, plus icon rotate 0→180° | 400ms | C |
| Search button | bottom border rgba(255,255,255,.3)→#60aaff | 400ms | C |
| Rich-text links (link preset) | text →#60aaff | CSS var swap (I: instant) | C colour |
| Tournament card (whole link) | title →#60aaff; CMS button → Active | 400ms | C |
| News card | title →#60aaff; thumbnail scale 1→1.1 (horizontal) / 1.15 (vertical); button → Active | 400ms colour, 600ms image (I) | C values |
| Team card | name →#60aaff; photo scale 1→1.1 | 400 / 600ms (I) | C values |
| Play button (video tile) | bg →#fff, icon →#000 | 300–350ms | C |
| Form submit | label →#60aaff, bg stays transparent | 400ms | C |
| Inputs (focus) | border rgba(255,255,255,.3)→#60aaff | 300ms `all` | C |
| Logos, FAQ items, schedule rows | no hover change | — | C |

## Touch
- All of the above are hover-only; on touch nothing replaces them (tap navigates). Framer disables the hover variants on touch (I).

## Focus (keyboard)
- No custom focus-visible styling found; browser default outline is suppressed on many elements (`outline: none` on inputs). Rebuild should map `:focus-visible` to the hover state + a 1px #60aaff outline.

## Recipe
```css
:root { --ease-framer: cubic-bezier(.44,0,.56,1); --accent: #60aaff; --accent-pale: #c1deff; }
.link { transition: color .4s var(--ease-framer); } .link:hover, .link:focus-visible { color: var(--accent); }
```
