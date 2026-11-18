# FAQ Accordion

Framer `FAQ Accordion` + `FAQ Item` + `Chevron Down` + `Layout Jump Preventer` (module 2dd_…). Page /faq. Status **C** (opened live; frames in `.research/audit/frames/faq-open/`).

## Layout

- FAQ Section: `padding: 130px 0`; container gap 60px.
- Accordion: row of **2 columns**, `gap: 20px`; each column (640 wide at 1440) is a column with `gap: 20px`. 4 items per column (8 total).
- ≤991: single column (Phone/Tablet accordion variants) — I.

## Item (closed)

- 640×84: column, `gap: 10px; padding: 30px` (phone `25px 20px`), 1px #333 border, no fill, `cursor: pointer`.
- Title Wrapper: row, `gap: 20px; align-items: center`: question H6 Host Grotesk **20/500/1.2/−0.5px uppercase** (flex 1) + chevron icon **14×14** (white).

## Item (open — variant "Opened Item")

| Property        | Closed                   | Open                                               |
| --------------- | ------------------------ | -------------------------------------------------- |
| Height          | 84                       | auto (183 for a 4-line answer)                     |
| Chevron         | 0°                       | **rotate 180°**                                    |
| Question colour | #fff                     | **#60aaff**                                        |
| Answer          | not rendered / opacity 0 | Geist Mono **16/300/1.5**, max-width 96%, fades in |

Timing: height via Framer layout animation (400ms cubic-bezier(.44,0,.56,1) — I from module default); chevron + colour 400ms; answer opacity uses the 200ms-delay 500ms tween (I: sampled opacity 0.16 shortly after click).

## Behaviour

- Each item toggles independently (own onTap per item) → **multiple items can be open** at once (C: no shared active index in the module).
- No keyboard semantics in the template (div with onTap) — rebuild with `<button aria-expanded>` + region.

## Motion (page)

- Items reveal on scroll: opacity 0→1, y 20→0, 700ms; second column items share timing.

## Rebuild

- Radix Accordion `type="multiple"`; animate height with Motion `layout` or `AnimatePresence` + `height: auto`.
