#!/usr/bin/env bash
# Forced-command gate for the GitHub Actions deploy keys. The same file is in every site
# repository (hera-builders, solum-constructions, quality-concrete-solution,
# signature-remodelings); it is
# installed once (copied, not linked) to /home/builders/bin/deploy-gate and named in
# ~builders/.ssh/authorized_keys, one key per repository and environment:
#
#   restrict,command="/home/builders/bin/deploy-gate staging hera" ssh-ed25519 AAAA… gha-hera-staging
#   restrict,command="/home/builders/bin/deploy-gate production hera" ssh-ed25519 AAAA… gha-hera-production
#   (the same for solum, qcsi and signature)
#
# `restrict` turns off port/agent/X11 forwarding and the terminal; `command=` makes sshd
# run this script whatever the client asks for. The client's request arrives in
# SSH_ORIGINAL_COMMAND and must be exactly one of:
#
#   deploy   <app> <env> <40-hex commit>   build and switch (deploy.sh does the work)
#   revision <app> <env>                   print the live commit, "none" (set up, nothing
#                                          live yet) or "absent" (not set up on this server)
#
# <app> and <env> must equal this key's app and environment (the arguments above): the
# Solum staging key can never deploy production, nor another site. Anything else is
# refused.
set -Eeuo pipefail

BASE=/var/www/builders
ALLOWED_ENV="${1:-}"
ALLOWED_APP="${2:-}"
REQUEST="${SSH_ORIGINAL_COMMAND:-}"
LOG="$HOME/deploy-gate.log"
FROM="${SSH_CLIENT:-local}"
FROM="${FROM%% *}"

refuse() {
  printf '%s refused key=%s/%s from=%s request=%q: %s\n' "$(date -Is)" "$ALLOWED_APP" \
    "$ALLOWED_ENV" "$FROM" "${REQUEST:0:200}" "$1" >>"$LOG"
  echo "deploy-gate: refused: $1" >&2
  echo "deploy-gate: allowed: 'deploy $ALLOWED_APP $ALLOWED_ENV <40-hex commit>' or 'revision $ALLOWED_APP $ALLOWED_ENV'" >&2
  exit 2
}

# The server checkout of the repository that holds each app (as in deploy.sh).
checkout_for() {
  case "$1" in
    hera) echo hera-builders ;; solum) echo solum-constructions ;;
    qcsi) echo quality-concrete-solution ;; signature) echo signature-remodelings ;;
    *) return 1 ;;
  esac
}

[[ "$ALLOWED_ENV" =~ ^(staging|production)$ ]] || refuse "key is not bound to an environment"
[[ "$ALLOWED_APP" =~ ^(hera|solum|qcsi|signature)$ ]] || refuse "key is not bound to an app"
# Plain words only: no shell syntax can get through, nothing is ever eval'd.
[[ "$REQUEST" =~ ^[a-z0-9\ ]{1,80}$ ]] || refuse "unexpected characters or length"
read -r -a words <<<"$REQUEST"

case "${words[0]:-}" in
  deploy)
    [[ ${#words[@]} -eq 4 ]] || refuse "deploy takes exactly: <app> <env> <commit>"
    app="${words[1]}" env="${words[2]}" commit="${words[3]}"
    ;;
  revision)
    [[ ${#words[@]} -eq 3 ]] || refuse "revision takes exactly: <app> <env>"
    app="${words[1]}" env="${words[2]}"
    ;;
  *) refuse "unknown command" ;;
esac
[[ "$app" == "$ALLOWED_APP" ]] || refuse "this key may only use $ALLOWED_APP"
[[ "$env" == "$ALLOWED_ENV" ]] || refuse "this key may only use $ALLOWED_ENV"

if [[ "${words[0]}" == revision ]]; then
  if [[ ! -f "$BASE/$app-$env/shared/.env" || ! -d "$BASE/$(checkout_for "$app")/.git" ]]; then
    echo absent
    exit 0
  fi
  rev="$(cat "$BASE/$app-$env/current/REVISION" 2>/dev/null || true)"
  echo "${rev:-none}"
  exit 0
fi

[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || refuse "commit must be a full 40-character id"
printf '%s deploy %s %s %s from=%s\n' "$(date -Is)" "$app" "$env" "$commit" "$FROM" >>"$LOG"
# deploy.sh checks the rest (commit on origin/main, app present in it, server set up) and
# takes the server-wide deploy lock.
exec bash "$BASE/$(checkout_for "$app")/deploy/deploy.sh" "$app" "$env" "$commit"
