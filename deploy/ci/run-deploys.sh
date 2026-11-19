#!/usr/bin/env bash
# GitHub Actions: deploys each app in turn through the server's forced-command gate and
# streams the server output into the Actions log. A failed app doesn't stop the others;
# the job fails at the end and lists them. A failed deploy never leaves a broken release
# live: deploy.sh either stops before the switch or rolls back.
#
#   deploy/ci/run-deploys.sh <staging|production> <app>...
set -Eeuo pipefail

env_name="${1:?env}"
shift
sha="${GITHUB_SHA:?}"
failed=()
done_ok=()

for app in "$@"; do
  echo
  echo "════════ $app → $env_name @ ${sha:0:7} ════════"
  # Built on the runner on purpose; the server gate checks every word.
  # shellcheck disable=SC2029
  if ssh deploy-target "deploy $app $env_name $sha"; then
    done_ok+=("$app")
  else
    code=$?
    failed+=("$app")
    echo "::error title=$app $env_name deploy failed (exit $code)::The live $app $env_name release is unchanged (stopped before the switch) or was rolled back. Read the server output above."
  fi
done

{
  echo "### $env_name @ ${sha:0:7}"
  for a in "${done_ok[@]}"; do echo "- ✅ $a deployed"; done
  for a in "${failed[@]}"; do echo "- ❌ $a failed (previous release still live)"; done
} >>"${GITHUB_STEP_SUMMARY:-/dev/null}"

((${#failed[@]} == 0)) || exit 1
