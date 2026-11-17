# Footer

Framer `Footer` (script_main), variants Desktop (≥1280, width 1280), Tablet (992 wide), Phone (375 wide). Every page. Status **C**.

## Desktop anatomy (1440)
- Block **500px** tall: `padding: 60px 0 40px; overflow: clip`; column, content bottom-aligned.
- Background: looping muted video (`Footer Video`, same clip as hero), **opacity 0.2**, cover, absolute inset 0, z1.
- Base Container: column, `gap: 40px`, padding 0 15px.
  1. **Wordmark row** (`Footer Text Wrapper`): row, `gap: 20px; align-items: center`:
     - "PLAYMODE" in Syne 100/700/1.0/−0.5px uppercase (654 wide).
     - Dash: a solid white bar **100×10px**.
     - `(` Syne 100px, tagline Host Grotesk 32/400/1.3/−0.5px uppercase (400 wide, 2 lines), `)` Syne 100px.
     The same row (identical sizes) closes the home hero.
  2. **Link columns** (`Nav Links Columns`): row, `gap: 200px; padding-bottom: 60px`. 4 columns, each column `gap: 15px`: heading "+" (Host Grotesk 20/500) then links wrapper `gap: 3px` with nav-preset links (Geist Mono 14/500/1.6 uppercase). Columns: pages / pages / CMS items (match/news titles) / socials.
  3. **Copyright row**: row, `justify-content: space-between`; "© PLAYMODE. ALL RIGHTS RESERVED" + "DESIGNED BY … / POWERED BY …" in nav preset at **rgba(255,255,255,.7)**.
- Link hover: #60aaff, 400ms cubic-bezier(.44,0,.56,1). Current page link: #60aaff.

## Tablet (992–1279)
- Container padding 0 20px; wordmark row gap 12px; tagline block min/max 260px; link columns `justify-content: space-between` (no 200px gap), `padding-bottom: 20px`.

## Phone / ≤991
- Container centred; wordmark row → column; tagline max 230px; link columns become a centred column `gap: 20px; max-width: 500px`; each column's links wrap in a row `gap: 0 24px`, centred; copyright wraps centred `gap: 4px 5px`.
- Wordmark 40px (Syne), tagline 18px.

## Motion
- Wordmark row, each link column and the copyright row reveal: opacity 0→1, y 20→0 (600–800ms), once.

## Rebuild
- PlayerMode: wordmark "PLAYERMODE" in Syne 700; keep the `—( TAGLINE )` construction; footer video → your own looping dark abstract clip at 20% opacity, or a static gradient fallback with `prefers-reduced-motion`.
