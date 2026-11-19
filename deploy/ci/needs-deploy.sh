#!/usr/bin/env bash
# Does the site need a deploy to go from the live commit to <to>? For a GitHub Actions
# staging workflow (same shape as solum-constructions); runs in any git checkout with
# full history.
#
#   deploy/ci/needs-deploy.sh signature <live-commit|none|absent> <to-commit>
#
# Exit 0 = deploy, 1 = skip; one line on stdout says why. Comparing against the commit
# that is actually live (not the previous push) means a failed or cancelled run is
# caught up by the next one.
#
# This repository is one app at the root, so the rule is simple. For every file changed
# between the live commit and <to>:
#   docs only: docs/**, *.md, .github/**, deploy/ci/**, deploy/nginx/**,
#     deploy/deploy-gate.sh, .claude/**, .vscode/**, .editorconfig, .prettierrc*,
#     .prettierignore                                       → no deploy
#   anything else (src/**, public/**, scripts/**, package.json, package-lock.json,
#     next.config.ts, .nvmrc, .browserslistrc, tsconfig*, deploy/deploy.sh,
#     deploy/ecosystem.config.cjs, …)                        → deploy
set -Eeuo pipefail

app="${1:?app}" live="${2:?live commit, none or absent}" to="${3:?target commit}"

if [[ "$live" == absent ]]; then
  echo "skip: $app staging is not set up on the server yet (deploy/README.md: folders and .env)"
  exit 1
fi

if ! git cat-file -e "$to:package.json" 2>/dev/null; then
  echo "skip: no package.json in ${to:0:7}"
  exit 1
fi
if [[ "$live" == none || -z "$live" ]]; then
  echo "deploy: nothing live yet"
  exit 0
fi
if ! git cat-file -e "$live^{commit}" 2>/dev/null; then
  echo "deploy: live commit ${live:0:7} is not in this history"
  exit 0
fi
if [[ "$(git rev-parse "$live")" == "$(git rev-parse "$to")" ]]; then
  echo "skip: ${to:0:7} is already live"
  exit 1
fi
if ! git merge-base --is-ancestor "$live" "$to"; then
  echo "deploy: live commit ${live:0:7} is not an ancestor of ${to:0:7}"
  exit 0
fi

while IFS= read -r f; do
  case "$f" in
    docs/* | .github/* | deploy/ci/* | deploy/nginx/* | deploy/deploy-gate.sh) ;;
    .claude/* | .vscode/* | .editorconfig | .prettierrc* | .prettierignore) ;;
    *.md) ;; # README, CLAUDE.md, AGENTS.md, deploy/README.md, image credits
    *)
      echo "deploy: $f changed"
      exit 0
      ;;
  esac
done < <(git diff --name-only "$live" "$to")

echo "skip: no changes that affect $app since ${live:0:7}"
exit 1
