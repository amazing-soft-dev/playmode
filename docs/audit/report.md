# Playmode template: visual-language audit

Root: https://playmode-template.framer.website · audited 2026-11-17 · Framer build `0ea0c8c`

This audit records the template's **visual language** (layout, type, spacing, motion and
interaction) so PlayerMode can rebuild the look with its own content, media and a lime accent.
Template copy and media are not reused.

## Summary

1. Monochrome, square-cornered esports look: black page, white text, 1px `#333` hairlines, glass
   cards (`rgba(0,0,0,.4)` plus a black gradient), no radii, no blur, almost no shadows.
2. Type trio: **Host Grotesk** for every heading (uppercase, tight tracking), **Geist Mono** for
   body, labels, nav and buttons, **Syne 700** only for the giant wordmark and its `( )` glyphs.
3. The template's single accent is a hover/active blue (text `#60aaff`, lines `#c1deff`), always
   with one easing, `cubic-bezier(.44,0,.56,1)`, over 400ms. **PlayerMode replaces it with neon lime
   `#C6FF3D`.**
4. Motion is one scroll reveal (opacity 0→1, y 20→0, 600–900ms, once, 100ms list stagger), a header
   that turns black after 50px of scroll, and 1s count-ups that replay. No marquee, no parallax, no
   page transition.
5. Layout: 1330px container (15px gutter, 20px at ≤1279.98), sections pad 130px (80px at
   ≤1279.98), breakpoints 1280 / 992 / 768.

## Assumptions

- Scope: audit steps 1–8 (crawl, responsive capture, components, tokens, motion, hover, hidden
  states, page transitions). No inspector or clone.
- Crawl bounded to 22 page loads (11 static pages, 1–2 items per CMS collection, a 404 probe) of the
  41 URLs in `sitemap.xml`.
- Viewports 1440×900, 1100×800, 800×1000 and 390×844 in the built-in browser. Rendering was paused
  while the pane was hidden, so animation values come from the site's shipped Framer modules and
  inlined CSS (exact configuration), confirmed by screenshot-driven sampling.
- Earlier local research (`.research/legacy-app`, `capture/`) was used as hints only. Where it
  differs, live and source values win (see Corrections).
- Screenshots and frames are in `.research/audit/` (gitignored, not part of the repository).

## Corrections to the earlier capture

| Earlier assumption                             | Audit found                                                                                                               |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Syne is the display face for headings          | Syne is used **only** for the wordmark and the `(` `)` glyphs; all headings are Host Grotesk                              |
| Nav background `#000000a1`                     | Resting nav is **transparent** and switches to **#000** after 50px of scroll; the alpha values were mid-transition frames |
| "Banner Scroll Section" is the wordmark banner | It is a 1px invisible sentinel at top:50px that drives the header colour; the wordmark row is static                      |
| Partner logos scroll in a marquee              | No marquee anywhere; a static row of 8 logos                                                                              |
| Radii 10–11px                                  | **0** radius everywhere; 10px came from Framer's button reset, 11px is the size of the "+" corner marker                  |
| Spacing steps at 992px                         | Gutter (15→20) and section padding (130→80) step at **1279.98px**                                                         |
| Breakpoints 767.98 / 991.98 / 1279.98          | Correct. Layout uses ≥1280 / 992–1279.98 / ≤991.98; type adds a ≤767 step                                                 |

## Sitemap

41 URLs in `sitemap.xml` plus 1 probe = 42 found · 22 visited · 20 listed but not opened (CMS
siblings) · 9 external · 1 placeholder (search results) · 1 broken (the probe, custom 404).

```
/                                   home (visited)
├─ /about-us                        visited
├─ /team                            visited
│  └─ /team/<6 slugs>               2 visited, 4 not opened
├─ /tournaments                     visited
│  └─ /tournaments/<8 slugs>        2 visited, 6 not opened
├─ /matches                         visited
│  └─ /matches/<6 slugs>            2 visited, 4 not opened
├─ /stream-schedule                 visited
├─ /our-sponsors                    visited
├─ /faq                             visited
├─ /contact-us                      visited
├─ /news                            visited
│  ├─ /news/<8 slugs>               2 visited, 6 not opened
│  └─ /news-categories/{news,streams}  both visited
├─ /404                             visited (HTTP 404)
└─ /this-page-does-not-exist-xyz    probe → same custom 404, HTTP 404 (no redirect)
```

External links: social roots, the template designer's credit, the Framer badge, a map link and
mailto/tel placeholders. Full list: [`sitemap.json`](sitemap.json).

## Design system

Full values are in [`tokens.json`](tokens.json).

**Colours**: `#000` page, scrolled header and panels · `#fff` text and lines · `#333` hairlines,
card fill, form and search background · `#7b7878` muted lead text · `rgba(255,255,255,.7)` footer
meta · `rgba(255,255,255,.3)` input borders and placeholders · glass `rgba(0,0,0,.4)` · dim
`rgba(0,0,0,.6)` · search backdrop `rgba(0,0,0,.95)` · template accent `#60aaff` (text) /
`#c1deff` (lines). Glass overlay: `linear-gradient(180deg, rgba(9,9,21,.2) 0%, #000 100%)`.

**Type scale** (desktop → laptop 992–1279 → tablet 768–991 → phone ≤767)

| Role               | Family / weight    | Size (px)          | Line height | Tracking | Case  |
| ------------------ | ------------------ | ------------------ | ----------- | -------- | ----- |
| Wordmark           | Syne 700           | 100 → 84 → 84 → 40 | 1.0         | −0.5px   | Upper |
| Inner-banner H1    | Host Grotesk 500   | 58 → 50 → 50 → 46  | 1.2         | −2px     | Upper |
| Hero H1            | Host Grotesk 400   | 40 → 40 → 40 → 38  | 1.35        | −0.04em  | Upper |
| Section H2         | Host Grotesk 500   | 40 → 40 → 36 → 36  | 1.2         | −1px     | Upper |
| Promo H3           | Host Grotesk 500   | 34 → 34 → 34 → 32  | 1.2         | −0.5px   | Upper |
| Tagline (in `( )`) | Host Grotesk 400   | 32 → 20 → 20 → 18  | 1.3         | −0.5px   | Upper |
| Card H4            | Host Grotesk 400   | 28                 | 1.2         | −0.2px   | Upper |
| News H5            | Host Grotesk 400   | 24                 | 1.4         | −0.5px   | Upper |
| Name / FAQ H6      | Host Grotesk 500   | 20                 | 1.2         | −0.5px   | Upper |
| Stat number        | Host Grotesk 600   | 54                 | 1.1         | −3px     | —     |
| Body               | Geist Mono 300     | 16                 | 1.5         | −0.02em  | —     |
| Button             | Geist Mono 300     | 16                 | 1.2         | +0.5px   | —     |
| Nav                | Geist Mono 500     | 14                 | 1.6         | −0.5px   | Upper |
| Bracket label      | Geist Mono 300     | 14                 | 1.0         | −0.5px   | Upper |
| Small body         | Geist Mono 300/400 | 14                 | 1.5         | −0.5px   | —     |
| Tag / form label   | Geist Mono 400     | 12                 | 1.2         | −0.02em  | Upper |
| 404 numeral        | Geist Mono 100     | 100 → 80           | 1.2         | −1px     | —     |

**Spacing**: container 1330 max, padding 15 (20 at ≤1279.98) · section padding 130 (80 at
≤1279.98) · hero padding 250/0/100 (230/0/80; 120/0/80) · inner banner 250/0/0 with min-height
95vh · heading-to-content gap 60 · card grid gap 20 (row gap 40 when wrapped) · footer column gap 200.

**Borders**: 1px `#333` on cards, panels and rows. Buttons have a 1px white top and bottom rule
plus 1×8px corner ticks. Inputs have a 1px white-30% border.

**Signature details**: `[ LABEL ]` mono brackets · 11×11 "+" corner markers at −5px on panel
corners · a 100×10 white dash in the wordmark row · a 48px arrow box with corner ticks.

**Z-index**: content 1–3, header 10, search overlay 10, dropdown 11.

## Component catalog

| Component                                | Where                      | Shows                        | Spec                                                   |
| ---------------------------------------- | -------------------------- | ---------------------------- | ------------------------------------------------------ |
| Header / nav                             | all pages, fixed top       | always; background on scroll | [nav-header](components/nav-header.md)                 |
| All-pages dropdown                       | header (≥992)              | on click                     | [all-pages-dropdown](components/all-pages-dropdown.md) |
| Mobile menu                              | header (≤991.98)           | on hamburger tap             | [mobile-menu](components/mobile-menu.md)               |
| Search button + overlay                  | header                     | on click                     | [search](components/search.md)                         |
| Hero banner                              | home top                   | load reveal                  | [hero-banner](components/hero-banner.md)               |
| Inner banner, glass card, corner markers | inner page tops            | load reveal                  | [cta-section](components/cta-section.md)               |
| Button CTA                               | everywhere                 | hover                        | [button-cta](components/button-cta.md)                 |
| Bracket label                            | eyebrows, cards, stats     | reveal                       | [bracket-label](components/bracket-label.md)           |
| Section heading                          | most sections              | reveal                       | [section-heading](components/section-heading.md)       |
| Stat counter strip                       | home, about, player detail | reveal + count-up            | [stat-counter](components/stat-counter.md)             |
| Tournament card and schedule row         | home, listings, details    | reveal, hover                | [tournament-card](components/tournament-card.md)       |
| Partner logo strip                       | home, contact              | reveal                       | [partner-logo-strip](components/partner-logo-strip.md) |
| Product promo                            | home, sponsors             | reveal                       | [product-promo](components/product-promo.md)           |
| Blog / news card                         | home, news, categories     | reveal, hover                | [blog-news-card](components/blog-news-card.md)         |
| Team card                                | home, team, about          | reveal, hover                | [team-card](components/team-card.md)                   |
| CTA section                              | home, about, team          | reveal                       | [cta-section](components/cta-section.md)               |
| Footer                                   | all pages                  | reveal                       | [footer](components/footer.md)                         |
| FAQ accordion                            | FAQ                        | click                        | [faq-accordion](components/faq-accordion.md)           |
| Contact form                             | contact                    | focus and states             | [contact-form](components/contact-form.md)             |
| 404                                      | unknown paths              | load                         | [404](components/404.md)                               |

Home order: header → hero → about (two-tone H2, pixel icon, video tile with play button) →
statistics (video frame and stat strip) → four tournament cards → partners (8 logos) → two product
promos (normal and flipped) → three blog rows → four team cards → CTA → footer. Inner pages: inner
banner → page sections → footer.

## Responsive behaviour (home, measured)

| Feature            | ≥1280 (1440)                     | 992–1279.98 (1100) | 768–991.98 (800)        | ≤767.98 (390)  |
| ------------------ | -------------------------------- | ------------------ | ----------------------- | -------------- |
| Header             | logo, 5 links, All pages, Search | same, tighter      | logo, Search, hamburger | same           |
| Container padding  | 15                               | 20                 | 20                      | 20             |
| Section padding    | 130                              | 80                 | 80                      | 80             |
| Hero               | 100vh, H1 left / copy right      | min 620            | centred column          | centred column |
| Wordmark / tagline | 100 / 32                         | 84 / 20            | 84 / 20                 | 40 / 18        |
| Section H2         | 40                               | 40                 | 36                      | 36             |
| Stats strip        | 4 in a row                       | 4 in a row         | 2×2                     | 1 column       |
| Tournament cards   | 4 columns                        | 2 columns          | 2 columns               | 1 column       |
| Partner logos      | 8 in a row                       | 8 in a row         | 2 rows                  | 4 rows of 2    |
| Product promo      | row, image right/left            | row                | stacked, image first    | stacked        |
| Blog rows          | text + image side by side        | stacked            | stacked                 | stacked        |
| Team cards         | 4 columns                        | 4 columns          | 2×2                     | 1 column       |
| Footer             | wordmark row + 4 columns         | columns spaced     | centred column          | centred        |

Hover effects have no touch equivalent.

## Motion catalog

Details in [`motion/`](motion/).

| Animation         | Trigger                       | Duration (ms)                           | Delay / stagger     | Easing                    | Start → end                                   | Repeats             |
| ----------------- | ----------------------------- | --------------------------------------- | ------------------- | ------------------------- | --------------------------------------------- | ------------------- |
| Scroll reveal     | enters viewport (threshold 0) | 600 / 700 / 800 / 900                   | lists i×100         | cubic-bezier(.44,0,.56,1) | opacity 0, y 20 → 1, 0                        | once                |
| Fade-only reveal  | in view                       | 600                                     | 0                   | same                      | opacity 0 → 1                                 | once                |
| Hero load reveal  | hydration                     | 600 / 700 / 800                         | 0                   | same                      | as scroll reveal                              | once                |
| Header background | scrollY > 50                  | ≈400–500                                | 0                   | same                      | transparent → #000                            | both ways           |
| Count-up          | in view                       | 1000                                    | with reveal stagger | cubic-bezier(.4,0,.2,1)   | 0 → N                                         | replays on re-entry |
| Button hover      | pointer                       | 400                                     | 0                   | (.44,0,.56,1)             | ticks 8px → 50%, white → accent, arrow +20px  | each hover          |
| Card hover        | pointer                       | 400 colour / 600 image                  | 0                   | same                      | title → accent, image 1 → 1.1 (1.15 vertical) | each hover          |
| Dropdown          | click                         | 300                                     | 0                   | same                      | opacity 0 → 1                                 | toggle              |
| Mobile menu       | tap                           | ≈400 panel; links 500                   | links 200           | same                      | height 62 → 420; links opacity                | toggle              |
| Search overlay    | click                         | backdrop 150; springs 600/40 and 800/60 | 0                   | spring                    | opacity, height                               | toggle              |
| FAQ item          | click                         | ≈400; answer 500                        | answer 200          | same                      | height, chevron 0 → 180°, title → accent      | toggle              |
| Input focus       | focus                         | 300                                     | 0                   | same                      | border white-30% → accent                     | each                |
| Videos            | autoplay                      | 5s loop (hero)                          | —                   | —                         | file motion                                   | loop                |

## Hover and focus quick reference

- Text links and nav: white → accent, 400ms, `cubic-bezier(.44,0,.56,1)`.
- Button: corner ticks grow from 8px to 50% height and recolour; the label turns accent; the arrow
  slides 20px.
- Cards: title turns accent; image zooms to 1.1 (1.15 on vertical news cards).
- Search underline turns accent; the "All pages" plus icon rotates 180°; input borders turn accent
  on focus over 300ms.
- No custom cursor, magnetic or tilt effects, and **no custom focus ring** (PlayerMode adds a lime
  one).

## Page transitions

Client-side `pushState` about 72ms after the click, no View Transitions, no exit animation. The
swap happens when the next route chunk loads. The header persists, scroll resets to the top, and the
incoming page runs its own reveals. See [`motion/page-transition.md`](motion/page-transition.md).

## Hidden states

| State                                         | How reached                  | Evidence                                                      |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| All-pages dropdown                            | click "All pages +"          | values confirmed; panel 421×281, black, 14 links in 2 columns |
| Mobile menu                                   | 390px, hamburger             | screenshot                                                    |
| Search overlay and results                    | click Search, type           | values confirmed (no screenshot)                              |
| FAQ open                                      | click an item                | frames                                                        |
| Form focus, disabled, loading, success, error | focus; others from source    | focus confirmed; the rest from source (not submitted)         |
| Button hover                                  | hover the 404 call to action | frames                                                        |
| Header scrolled                               | scroll past 50px             | frames                                                        |
| 404                                           | unknown URL                  | screenshot                                                    |

## How PlayerMode applies this

| Template                                                       | PlayerMode                                                                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Blue hover accent `#60aaff` / `#c1deff`                        | Neon lime `#C6FF3D` for hover, active, focus, selection and the main calls to action, with `#0A0A0A` text on lime |
| No focus ring                                                  | 2px lime focus ring with a 3px offset                                                                             |
| Esports club content (tournaments, players, matches, sponsors) | Product content from the V1 plan: game maker, daily challenge, gallery, recommendations, pricing, parents         |
| Tournament cards                                               | Template and daily-challenge cards                                                                                |
| Team cards                                                     | Featured creators (generated nicknames)                                                                           |
| Partner logo strip                                             | "How it works" steps; no third-party logos implying partnership                                                   |
| Product promos                                                 | Recommendations and download promos                                                                               |
| Blog rows                                                      | Trending games and the devlog                                                                                     |
| Template photos and videos                                     | Unsplash and Pexels media, credited in `media/manifest.json`                                                      |

## Coverage gaps

- Rendering was paused, so captures are viewport-only and scaled to 800px wide. Per-breakpoint
  layout was measured from the DOM instead of full-page screenshots.
- 20 CMS sibling pages were not opened; their templates match the sampled items.
- Not captured visually: search with results, the open dropdown, laptop and tablet screenshots,
  match and sponsor card internals, the /news grid column count, and the /team large-card grid per
  breakpoint.
- Header background and mobile-menu height durations are sampled or inferred.
- Form success and error copy are unknown (the form was not submitted). The back-button
  transition was not sampled.

## Legend

- **Confirmed**: read from the site's shipped CSS or JS for this build, or measured live.
- **Inferred**: reasoned from partial evidence; marked "≈" in the tables.
