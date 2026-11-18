# Legacy prototype: what was carried over

Before this Next.js site, a Craft Anything run produced a static generator (`app/`: `build.mjs`,
`src/main.js`, `src/styles.css`) and a capture of the Playmode template. Everything useful was
ported before the files were moved out of the repository into the gitignored `.research/` folder
(`.research/legacy-app/` and `.research/craft-anything/`).

| Legacy source | Carried into |
| --- | --- |
| `styles.css` colour tokens (`#000`, `#fff`, `#ffffffb3`, `#7b7878`, `#333`, nav `#000000a1`) | `src/app/globals.css` `@theme` (#10), corrected by the audit (#9, #13) |
| `styles.css` container 1330px, gutter 15px, section 130px, breakpoints 767.98 / 991.98 / 1279.98 | `globals.css` layout tokens and breakpoints (#10, #13) |
| `styles.css` type classes (`.label`, `.body`, `.h1-hero`, `.h2`, `.h3`, `.h4`, `.h-page`, `.wordmark`, `.stat-num`) | `type-*` utilities (#11) |
| `styles.css` `.btn` with corner ticks and arrow cell | `src/components/ui/Button.tsx` (#12, #13) |
| `styles.css` `.frame` corner crosses | `src/components/ui/Card.tsx` (#12) |
| `main.js` "All pages" dropdown | `src/components/layout/AllPagesMenu.tsx` (#19) |
| `main.js` phone/tablet menu with filter | `src/components/layout/MobileMenu.tsx` (#20) |
| `main.js` site search | `src/components/layout/SiteSearch.tsx` + `src/lib/search-index.ts` (#21) |
| `main.js` count-up counters | `src/components/motion/CountUp.tsx` (#13) |
| `main.js` play-button toggle | `src/components/game/GamePlayer.tsx` controls (#33) |
| `build.mjs` home section order (hero, banner, about, stats, cards, partners, promos, blog, team, CTA, footer) | `src/app/page.tsx` and `src/components/home/*` (#24–#29) |
| `build.mjs` inner page banner pattern | `src/components/sections/PageBanner.tsx` (#23) |
| `build.mjs` 404 page | `src/app/not-found.tsx` (#23) |
| `capture/` section names, layouts and media slots | `docs/audit/` (#9) and the photo slots in `src/content/media.ts` (#17) |

Not carried over, on purpose:

- The template's copy, player and tournament names, product names and logos (PlayerMode has its own content).
- Template media (framerusercontent, website-files CDN): replaced with credited Unsplash and Pexels files.
- Self-hosted woff2 files from `@fontsource`: fonts now come from `next/font`.
- Gradient placeholder "photos" (`.ph-*`): real photos replaced them.
