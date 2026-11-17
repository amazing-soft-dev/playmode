#!/usr/bin/env bash
# Opens the pull request that moves work along the branch flow:
#   feat/ fix/ docs/ ci/ build/ branches  ->  dev
#   dev                                    ->  main  (body rewritten so merging closes issues)
# Requires GH_TOKEN (a token that can start workflows) and BRANCH.
set -euo pipefail

: "${BRANCH:?BRANCH is required}"
: "${GH_TOKEN:?GH_TOKEN is required}"

PREFIX_RE='^(feat|fix|docs|ci|build)/([0-9]+)-'

# Issue numbers referenced by "Closes/Fixes/Resolves #N" lines in commit messages on stdin.
keyword_issues() {
  grep -ioE '\b(close[sd]?|fix(e[sd])?|resolve[sd]?)[[:space:]]+#[0-9]+' | grep -oE '[0-9]+' || true
}

# Issue numbers taken from prefix branch names (feat/12-...) on stdin.
branch_issues() {
  grep -oE '(feat|fix|docs|ci|build)/[0-9]+-' | grep -oE '[0-9]+' || true
}

open_into_dev() {
  local existing
  existing=$(gh pr list --head "$BRANCH" --base dev --state open --json number --jq '.[0].number // empty')
  if [[ -n "$existing" ]]; then
    echo "Pull request #$existing already open for $BRANCH -> dev; leaving it."
    return
  fi

  git fetch --quiet origin dev
  if [[ "$(git rev-list --count "origin/dev..HEAD")" == "0" ]]; then
    echo "$BRANCH has no commits ahead of dev; nothing to open."
    return
  fi

  local issue="" title body
  if [[ "$BRANCH" =~ $PREFIX_RE ]]; then
    issue="${BASH_REMATCH[2]}"
  fi

  title=$(git log --reverse --format=%s "origin/dev..HEAD" | head -n 1)
  if [[ -n "$issue" ]]; then
    title=$(gh issue view "$issue" --json title --jq .title 2>/dev/null || echo "$title")
  fi

  body=$(mktemp)
  {
    if [[ -n "$issue" ]]; then
      echo "Work for #$issue."
      echo
    fi
    echo "### Commits"
    git log --reverse --format='- %s' "origin/dev..HEAD"
    echo
    echo "Opened automatically by the **Open pull request** workflow. It merges into \`dev\` once **CI passed** is green."
    if [[ -n "$issue" ]]; then
      echo
      echo "Closes #$issue"
    fi
  } >"$body"

  gh pr create --base dev --head "$BRANCH" --title "$title" --body-file "$body"
}

open_dev_into_main() {
  git fetch --quiet origin main dev
  if [[ "$(git rev-list --count origin/main..origin/dev)" == "0" ]]; then
    echo "dev is not ahead of main; nothing to open."
    return
  fi

  local log issues body existing
  log=$(git log --format='%B' origin/main..origin/dev)
  issues=$( { printf '%s\n' "$log" | keyword_issues; printf '%s\n' "$log" | branch_issues; } | sort -n -u)

  body=$(mktemp)
  {
    echo "Promotes \`dev\` to \`main\`. Merges automatically once **CI passed** is green; Vercel then deploys \`main\`."
    echo
    echo "### Pull requests"
    git log --merges --format='- %s' origin/main..origin/dev | sed -E 's/^- Merge pull request (#[0-9]+) from [^ ]+/- \1/'
    if [[ -n "$issues" ]]; then
      echo
      echo "### Issues closed by this merge"
      while read -r n; do
        [[ -n "$n" ]] && echo "Closes #$n"
      done <<<"$issues"
    fi
  } >"$body"

  existing=$(gh pr list --head dev --base main --state open --json number --jq '.[0].number // empty')
  if [[ -n "$existing" ]]; then
    # REST instead of `gh pr edit`: its GraphQL query also needs read:org, which the token lacks.
    gh api --method PATCH "repos/{owner}/{repo}/pulls/$existing" -F "body=@$body" --silent
    echo "Updated pull request #$existing (dev -> main)."
  else
    gh pr create --base main --head dev --title "Release: promote dev to main" --body-file "$body"
  fi
}

if [[ "$BRANCH" == "dev" ]]; then
  open_dev_into_main
elif [[ "$BRANCH" =~ $PREFIX_RE ]] || [[ "$BRANCH" =~ ^(feat|fix|docs|ci|build)/ ]]; then
  open_into_dev
else
  echo "Branch $BRANCH is not handled by this workflow."
fi
