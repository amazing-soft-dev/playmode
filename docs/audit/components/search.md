# Search (button + overlay)

Framer `Search Button` + `Search` (script_main). Status **C** unless marked.

## Search Button (header)

- Text "SEARCH", nav preset (Geist Mono 14/500/1.6, uppercase).
- Bottom border 1px `rgba(255,255,255,.3)` (top/left/right 0) → hover `#60aaff`, 0.4s cubic-bezier(.44,0,.56,1).
- Desktop: right of a 1px vertical divider; phone: next to hamburger.

## Overlay

- Fixed layer `inset: 0; z-index: 10; display:flex; justify-content:center; align-items:flex-start`.
- Backdrop: `rgba(0,0,0,.95)` full-screen, fades in **150ms** (0ms on touch devices).
- Content column: **800px** wide (max), centered; bar top at ≈202px on a 900px-tall viewport (I: ~22% from top).
- Bar: `background: #333`, color #fff, radius 0, `box-shadow: 0 0 50px 0 rgba(193,222,255,.2)`, closed height **55px**, expands up to `min(496px, 100vh - 30px)` when results exist.
- Input row: `padding: 12px 20px; gap: 12px`; 16px magnifier icon `rgba(255,255,255,.3)`; input Geist Mono 16px/300 #fff, transparent, no border, placeholder "Enter search keyword".
- Results: list of links, each title (Geist Mono 16/300 #fff) + path line below (same font, dimmer — I). Up to 20 results shown for a short query.

## Motion

| Element           | Spec                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| Backdrop          | opacity 0→1, 150ms                                                    |
| Bar / list height | spring stiffness 800, damping 60 (I: which element gets which spring) |
| Bar enter         | spring stiffness 600, damping 40                                      |
| Loading indicator | linear rotate, 1s, infinite                                           |

## Behaviour

- Opens on click; Esc / backdrop click closes. Focus moves into input (I).
- Searches site pages + CMS items client-side (Framer site search index).

## Rebuild

- Use a dialog (`role="dialog" aria-modal`) with `cmdk`-style list or a simple filtered list over a local index of PlayerMode pages.
- Springs in Motion: `{type:'spring', stiffness:600, damping:40}`.
