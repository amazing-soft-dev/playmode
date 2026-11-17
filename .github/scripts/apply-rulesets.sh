#!/usr/bin/env bash
# Creates or updates the repository rulesets from .github/rulesets/*.json (matched by name).
# GitHub does not read this folder by itself; run this after changing a ruleset file:
#   .github/scripts/apply-rulesets.sh [owner/repo]
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rulesets" && pwd)"

for file in "$DIR"/*.json; do
  # Read the name with Node (always present here) instead of jq, which many machines lack.
  name=$(node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync(0, "utf8")).name)' <"$file")
  id=$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name == \"$name\") | .id")
  if [[ -n "$id" ]]; then
    gh api --method PUT "repos/$REPO/rulesets/$id" --input "$file" --jq '"updated \(.name) (#\(.id))"'
  else
    gh api --method POST "repos/$REPO/rulesets" --input "$file" --jq '"created \(.name) (#\(.id))"'
  fi
done
