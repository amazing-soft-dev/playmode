# Contributing

Two long-lived branches: `dev` is where work lands, `main` is the release branch. Do not push to
either one. Rulesets in `.github/rulesets/` block direct pushes, force-pushes and deletion. A change
lands only through a pull request, only as a merge commit, after the **CI passed** check is green.
No human review is required.

## The path for a change

1. Open a GitHub issue and note the number.
2. Branch from `origin/dev` with one of these prefixes: `feat/`, `fix/`, `docs/`, `ci/` or `build/`.
   Put the issue number first, for example `feat/12-short-description`.

   ```bash
   git fetch origin
   git switch -c feat/12-short-description origin/dev
   ```

3. Commit with a Conventional Commit subject, for example `feat(home): short description`. A
   `Closes #12` line is optional when the branch name already has the number. `Fixes` and `Resolves`
   work the same way. Add co-author trailers when you pair:

   ```
   Co-authored-by: Name <id+login@users.noreply.github.com>
   ```

4. Push. Three workflows take it from there.

## Workflows

**Open pull request** (`.github/workflows/open-pull-request.yml`) runs on that push. A prefix branch
opens a pull request into `dev`. A push to `dev` itself opens `dev` into `main` when `dev` is ahead,
or updates the open one. It uses the `GH_TOKEN` repository secret, not the default `GITHUB_TOKEN`,
because the default token does not start the next workflow after a merge. If a pull request for that
head and base is already open, it leaves it. For the `dev` → `main` pull request it rewrites the body
so GitHub will close issues: it collects issue numbers from branch names (`feat/12-…`) and from
`Closes` / `Fixes` / `Resolves` lines in the commits since `main`. A keyword on the pull request into
`dev` does not close the issue; only the pull request into `main` does.

**CI** (`.github/workflows/ci.yml`) runs on every pull request, on every push to `dev` or `main`, and
on manual dispatch. A newer push to the same branch or pull request cancels the older run.

| Job                       | What it does                                                                                                                                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint and type check       | `npm ci`, then `npm run lint`, `npm run typecheck`, `npm run check:images` (each photo used once) and `npm test`                                                                                                                                            |
| Build (server and static) | Two builds in parallel. **server** is the full app with `/api` routes. **static** sets `NEXT_OUTPUT=export`, builds responsive WebP images, and checks that `out/` has the expected HTML, sitemap, icons and image files, and that `out/api` does not exist |
| CI passed                 | The single status check the branch rules require. It fails unless both jobs succeeded. On a pull request it posts or updates one summary comment                                                                                                            |

**Merge passing pull request** (`.github/workflows/merge-passing-pr.yml`) starts only after CI
finishes successfully on a pull request. It merge-commits the pull request if the head is still the
commit CI validated (`--match-head-commit`). Eligible pairs are a prefix branch into `dev`, and `dev`
into `main`. Anything else is left alone.

That merge into `dev` pushes `dev`, which opens or updates the `dev` → `main` pull request. CI runs
again, and a green run merges into `main`. GitHub then closes the issues listed in that pull request
body.

A merge to `main` only re-runs CI. Actions does not deploy. Vercel deploys from its Git connection,
with Production tracking `main`.

Dependabot opens weekly pull requests for npm and GitHub Actions (`.github/dependabot.yml`). Those
branches are not opened or merged by these workflows. A person merges or closes them.

## Rulesets

GitHub does not read `.github/rulesets/` on its own. After editing a ruleset file, apply it:

```bash
.github/scripts/apply-rulesets.sh
```

## Before you push

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run check:images
npm run build
```

## Media

Every photo and video comes from a free stock library (Unsplash, Pexels) and is listed in
`media/manifest.json` with its source, author and license. Each photo is used once. Add the manifest
entry in the same commit as the file.
