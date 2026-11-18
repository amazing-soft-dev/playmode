# PlayerMode

Describe a game and play it a minute later. PlayerMode is an AI game site with a game maker, a daily
challenge, a community gallery and game recommendations, built on the black-and-white Playmode look
with a single neon lime accent (`#C6FF3D`).

Production is a Next.js app that Vercel deploys from `main`.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack). React Compiler is on (`reactCompiler` and `experimental.turbopackRustReactCompiler` in `next.config.ts`) |
| UI | React 19.3, TypeScript strict. `tsc` is TypeScript 7 (`@typescript/native`, `^7` in `package.json`); the `typescript` name resolves to `@typescript/typescript6` so typescript-eslint keeps the TS 6 API |
| Styling | Tailwind CSS v4, CSS-first in `src/app/globals.css`. There is no `tailwind.config` |
| Motion | Motion for scroll reveals |
| Email | Resend, called from Next.js route handlers on the Node runtime |
| Analytics | Vercel Web Analytics and Speed Insights, production only |
| Images | `sharp` pre-builds responsive WebP files for the static export |
| Lint | ESLint 10 with `eslint-config-next`, zero warnings allowed |
| Runtime in CI | Node.js latest |

## Getting started

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Everything works locally without keys: data comes from mock
repositories (state is kept in your browser), and form emails are logged instead of sent. To try
the founder admin page, sign in as `founder@playermode.test`.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero with the make-a-game prompt, how it works, about, stats, daily challenge and templates, promos, trending games, creators |
| `/create` | Game maker: template, prompt, generate, change, fix, versions, save, publish, download |
| `/daily` | Daily challenge with countdown, streak and top-100 leaderboard |
| `/gallery`, `/play/[id]` | Community gallery and the sandboxed player (like, report, download, share) |
| `/recommend` | AI game picks from a real game catalog |
| `/pricing`, `/account`, `/login` | Plans, the player's games and usage, sign-in with the age gate |
| `/parents`, `/about`, `/faq`, `/contact`, `/news` | Content pages |
| `/legal/*` | Terms, privacy, DMCA and media credits |
| `/admin` | Founder-only challenge and report queues |
| `/api/*` | Contact, waitlist, newsletter, report, parents, generate, recommend, health (server build only) |

See [docs/architecture.md](docs/architecture.md) for how it fits together and
[docs/launch-checklist.md](docs/launch-checklist.md) for what's left before launch.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build. Add `NEXT_OUTPUT=export` for the static target |
| `npm run start` | Serve the server build |
| `npm run lint` | ESLint, fails on any warning |
| `npm run typecheck` | TypeScript 7 `tsc --noEmit` |
| `npm test` | Unit tests with `node --test` |
| `npm run check:images` | Media manifest check: files exist, credited, each photo used once |
| `npm run images` | Pre-build responsive WebP variants for the static export |
| `npm run verify:export` | Check `out/` after a static build |

## Build targets

Two targets are selected in `next.config.ts`:

- **Server** (default `next build`) is what Vercel runs. Form routes and Resend work. Images use
  Next's optimizer (AVIF, then WebP).
- **Static** (`NEXT_OUTPUT=export`) writes plain HTML to `out/`. There is no server, so `/api` is
  omitted and forms cannot send email. `npm run images` pre-builds WebP variants and a custom loader
  serves them. CI builds this target so the export stays valid; Actions does not publish it.

## Project layout

```
src/app/        routes (pages, sitemap, robots, Open Graph images, llms.txt, /api handlers)
src/components/ UI primitives, motion, layout and page sections
src/content/    copy and figures (site.ts is the entry point)
src/lib/        domain types, repositories (mock now, Supabase later), helpers
public/         icons, brand, media, sample games
media/          manifest.json: source, author and license for every photo and video
scripts/        media, image and export tooling
docs/           template audit and architecture notes
```

## Contributing

Work lands on `dev` through an automatic pull request, and a green CI run promotes it to `main`.
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Code is under the [Apache License 2.0](LICENSE). Photos and videos keep their own licenses; see
`media/manifest.json` and the credits page.
