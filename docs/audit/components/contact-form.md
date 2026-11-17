# Contact Form

Page /contact-us ("Contact Us Section"). Framer native form + `Form Button` (WrWE7…). Status **C**; the form was **not submitted** (states read from the module, not triggered).

## Section layout (1440)
- Two columns: left info column (H1 "contact…" + list of contact rows with dividers, labels wrapper) and right form card at x 713, **650×610**.
- Below: Our Partners Section (logo strip).

## Form card
- `<form>`: `background: #333`; column, `gap: 30px; padding: 50px 40px 40px`; radius 0.
- Heading H3 inside ("Send us a message", promo-h3 style).
- Fields in a 2-column grid for short inputs (each **277×55**), textarea full width (**570×150**).
- Labels: Geist Mono **12px / 400 / uppercase** #fff above each field; required marked with `*` in the label text.
- Input box (`.framer-form-text-input`):
  - `padding: 16px 18px`; background transparent; radius 0.
  - Border 1px solid **rgba(255,255,255,.3)** (via ::after).
  - Text Geist Mono 16px / 400 / line-height 1em / #fff; placeholder rgba(255,255,255,.3).
  - Focus: border colour **#60aaff**, 1px; transition `all .3s cubic-bezier(.44,0,.56,1)`; no glow, no bg change; outline none.
- Fields: First name* (text), Last name, Phone* (tel), Email (email), Message* (textarea). A hidden honeypot input (`name="website"`) and ~10 zero-size decoy inputs exist (spam trap — do not rebuild visibly).

## Submit button states (Form Button)
| State | Visual |
|---|---|
| Default | bracket button (see `button-cta.md`), full width of form (I) |
| Hover | text #60aaff, bg transparent, ticks/border #c1deff (400ms) |
| Disabled | opacity 0.5 |
| Loading | 20px conic-gradient ring (transparent→#fff 342°) masked by ring SVG, rotate 360° / 1s linear infinite |
| Success / Error | dedicated variants (copy not captured — I) |

## Validation
- Browser-native `required`; no custom error styling found (`--framer-input-invalid-text-color` unset).

## Rebuild
- PlayerMode: use for "Request early access / contact"; Next.js server action; keep honeypot.
