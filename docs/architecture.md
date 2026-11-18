# Architecture

PlayerMode is a Next.js 16 App Router site. Version 1 ships the full user interface for every
route in the product plan, backed by **mock repositories**. Real services (Supabase, an LLM
provider, RAWG, Stripe, AdSense) replace the mocks one at a time without changing pages.

## Layout of the code

| Path | What lives there |
| --- | --- |
| `src/app/` | Routes: pages, `not-found`, `template` (page fade), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `llms.txt`, and `api/*/route.api.ts` handlers |
| `src/components/` | `ui/` primitives, `motion/`, `layout/` (header, menus, search, footer), `home/`, `sections/`, `game/`, and one folder per feature (`create`, `daily`, `gallery`, `play`, `recommend`, `pricing`, `account`, `admin`, `legal`, `forms`) |
| `src/content/` | All copy and figures; `site.ts` is the entry point, `media.ts` maps photo slots to manifest ids |
| `src/lib/domain/` | Data model types (plan section 08), product limits (`policy.ts`), age rules, time helpers, nicknames |
| `src/lib/repos/` | Repository interfaces (`types.ts`), mock implementations (`mock/`), and the factory (`index.ts`) |
| `src/lib/` | Game scanner, message protocol, moderation, quota, downloads, recommendations, media accessor, image loader, security headers |
| `src/lib/api/` | Route-handler helpers: env, Resend email, rate limiter, form wrapper, request schemas, server-side providers |
| `public/games/` | The five original starter games (single HTML files) |
| `media/` | `manifest.json` (credits for every photo and video) and the variant widths |
| `scripts/` | Media fetch, WebP variants, image check, static export check |

## Data flow

```
page or component ──► Repos interface (src/lib/repos/types.ts)
                         │
                         ├─ mock (today): fixtures + key-value store
                         │     server: in memory (static generation)
                         │     browser: localStorage (sessions, drafts, likes, scores)
                         │
                         └─ real (next milestone): Supabase, LLM, RAWG, Stripe
```

- Server components read fixtures through `serverRepos` (deterministic, good for static pages).
- Client components use `browserRepos()`, which persists mock state in `localStorage` so sign-in,
  builds, drafts, likes, reports and scores survive a reload.
- `NEXT_PUBLIC_DATA_SOURCE` is reserved to switch implementations.

## Build targets

| Target | Command | Notes |
| --- | --- | --- |
| Server | `npm run build` | What Vercel runs. Route handlers, image optimizer (AVIF, then WebP), security headers |
| Static | `npm run images && NEXT_OUTPUT=export npm run build` | Plain HTML in `out/`. `route.api.ts` files are skipped because `pageExtensions` drops `api.ts`; images use the pre-built WebP variants through `src/lib/image-loader.ts`; forms explain they work on the live site |

## Game safety (plan section 10)

Every generated game is untrusted code. The layers, from first to last:

1. **Prompt moderation** (`src/lib/moderation.ts`): blocklist refusals never cost a build;
   franchise names become original stand-ins. Production adds the OpenAI Moderation endpoint.
2. **Static scan** (`src/lib/game-scan.ts`): rejects external URLs, network APIs, storage,
   dynamic code, navigation, embeds and files over 200 KB, before saving, publishing or downloading.
3. **Sandboxed player** (`src/components/game/GamePlayer.tsx`): `sandbox="allow-scripts"` only,
   so the game has an opaque origin and cannot reach cookies, storage, forms, popups or the page.
4. **Narrow messaging** (`src/lib/game-messages.ts`): only `{type:"score"}` and `{type:"error"}`
   from the player's own frame are accepted.
5. **Game CSP** (`src/lib/security-headers.ts`): game files get `default-src 'none'`,
   `connect-src 'none'`, `form-action 'none'`.

**Production change:** serve game HTML from a separate origin (a user-content domain on Vercel or
Cloudflare R2) and point the player's iframe at it instead of `srcdoc`, so the game CSP applies to
generated games too and the main origin never runs them.

## Kids and privacy (plan section 12)

- Age is taken from the birth year as the youngest the person could be (`src/lib/domain/age.ts`).
- Under-13s play without an account; EEA accounts start at 16; the first age-gate answer is
  remembered in the browser.
- Under-18 accounts show generated nicknames; anonymous players get a random browser id only.
- Ad treatment: TFAT 1 for under-13s and unknown ages, TFAT 2 for teens. Recommendations for
  under-13s and unknown ages are capped at ESRB E10+, and a request can never widen the cap.

## Media

Every photo and video is listed in `media/manifest.json` with source, author and licence.
`npm run check:images` fails CI if a file is missing, uncredited, over budget, unlisted, or if a
photo is used more than once (each id appears once in `src/content/media.ts`). Photos come from
Unsplash and videos from Pexels; `npm run media:fetch` re-downloads and optimizes them (videos
need ffmpeg via the `FFMPEG` variable). The credits page is generated from the manifest.

## Delivery

Issue → prefix branch from `origin/dev` → push → the **Open pull request** workflow opens a PR into
`dev` → **CI** (lint, type check, image check, tests, server and static builds) → **CI passed** →
**Merge passing pull request** merges it → the `dev` → `main` PR updates and merges the same way →
Vercel deploys `main`. See `CONTRIBUTING.md`.

## Backend milestone (next)

Each item swaps one mock for a real service behind the existing interfaces:

1. Supabase project, schema migrations for every table in plan section 08, row-level security
2. Supabase Auth with the age gate on sign-up and email verification before the first build
3. Server-side sessions; `AuthRepo` and profile reads through Supabase
4. `GameRepo` and `ReportRepo` on Postgres; version HTML in Supabase Storage (last five kept)
5. Separate game origin for generated HTML with the game CSP; player iframe uses it
6. LLM provider in `src/lib/api/server-repos.ts` (model chosen after the 20-prompt test)
7. OpenAI Moderation on prompts, publish text and visible game text
8. Server-enforced build quota and one concurrent build per user; spend cap and an off switch
9. Logging of model, tokens and cost per call; a cost dashboard
10. Vercel Cron to generate tomorrow's challenge; admin approval on the server
11. Server-side score submission with range checks and one score per play session
12. RAWG Business client with a 24-hour Postgres cache (`rec_cache`) and attribution
13. Stripe Checkout, Customer Portal and the webhook writing `subscriptions`; re-sync on login
14. AdSense with age treatment tags on recommendation, gallery and play pages
15. Shared rate-limit store (for example Upstash) instead of the in-memory limiter
16. Sentry error tracking
17. Data retention jobs (inactive accounts after 24 months, anonymous ids after 12)
