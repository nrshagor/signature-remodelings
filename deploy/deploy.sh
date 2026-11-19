#!/usr/bin/env bash
# Signature Remodelings deploy: one environment, on the shared builders server. Run as the
# deploy user "builders" (never root), by hand or through the forced-command gate:
#
#   bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature <env> [<commit>]
#   bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature staging
#   bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature production 3f2c…(40 hex)
#
#   <app>     signature (the only app in this repository; kept as an argument so the
#             call has the same shape as the other builders sites and the gate)
#   <env>     staging | production
#   <commit>  optional full commit id; must be on origin/main. Default: origin/main.
#
# Adapted from the solum-constructions kit. Differences: this repository is one Next.js
# app at the root (npm, package-lock.json), not a pnpm/Turborepo monorepo, so the build
# and the release layout are simpler. The deploy lock (/var/www/builders/.deploy.lock)
# is the same file the other sites use: one deploy at a time on the whole server.
#
# Layout (deploy/README.md):
#   /var/www/builders/signature-remodelings        git checkout + node_modules (built here)
#   /var/www/builders/signature-<env>/releases/    one folder per deploy, the last $KEEP kept
#   /var/www/builders/signature-<env>/current ->   live release (Nginx and PM2 point here)
#   /var/www/builders/signature-<env>/shared/.env  build + run settings, chmod 600
#   /var/www/builders/signature-<env>/logs/        PM2 output
#
# Ports (127.0.0.1 only): staging 3104, production 3204.
#
# Why build on the server: the standalone output bundles platform-specific native code
# (sharp, for next/image), so it must be built on Linux.
#
# Optional settings (environment variables, for manual runs):
#   KEEP=5  HEALTH_PATH=/  LOCK_WAIT=1800 (seconds to wait for another deploy)
set -Eeuo pipefail

BASE="${BUILDERS_BASE:-/var/www/builders}"
BRANCH="main"
KEEP="${KEEP:-5}"
HEALTH_PATH="${HEALTH_PATH:-/}"
LOCK_WAIT="${LOCK_WAIT:-1800}"
CHECKOUT="signature-remodelings"

log() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[33mWARNING: %s\033[0m\n' "$*" >&2; }
fail() { printf '\n\033[31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

usage() { fail "Usage: deploy.sh signature <staging|production> [<40-hex commit>]"; }

port_for() {
  case "$1" in
    staging) echo 3104 ;; production) echo 3204 ;; *) return 1 ;;
  esac
}

APP="${1:-}"
ENV_NAME="${2:-}"
WANT_COMMIT="${3:-}"
[[ $# -le 3 ]] || usage
[[ "$APP" == signature ]] || usage
[[ "$ENV_NAME" =~ ^(staging|production)$ ]] || usage
[[ -z "$WANT_COMMIT" || "$WANT_COMMIT" =~ ^[0-9a-f]{40}$ ]] || usage
PORT="$(port_for "$ENV_NAME")"

NAME="$APP-$ENV_NAME" # PM2 process name and folder name
REPO_DIR="$BASE/$CHECKOUT"
TARGET="$BASE/$NAME"
ENV_FILE="$TARGET/shared/.env"
RELEASE="$TARGET/releases/$(date +%Y%m%d-%H%M%S)"
ECOSYSTEM="$REPO_DIR/deploy/ecosystem.config.cjs"

# A release folder that never went live is removed if the script stops early (failed
# build, missing files), so half-built releases don't pile up.
SWITCHED=0
cleanup() {
  local status=$?
  if [[ $SWITCHED -eq 0 ]]; then
    [[ -d "$RELEASE" ]] && rm -rf "$RELEASE"
    ((status == 0)) || printf '\n\033[31mStopped before the switch: the live %s release is unchanged.\033[0m\n' "$NAME" >&2
  fi
}
trap cleanup EXIT

# Everything runs inside main(), called on the last line. Bash then reads the whole
# file before running it, so the `git checkout` below can safely update this script
# while it runs.
main() {

# --- 0. Preflight ---------------------------------------------------------------------
[[ $EUID -ne 0 ]] || fail "Run as the deploy user (builders), not root."
[[ -d "$REPO_DIR/.git" ]] || fail "No git checkout at $REPO_DIR (README: clone the repository)."
[[ -d "$TARGET/shared" ]] || fail "$TARGET is not set up (README: folders and .env for $NAME)."
[[ -f "$ENV_FILE" ]] || fail "Missing $ENV_FILE (README: folders and .env)."
[[ "$(stat -c %a "$ENV_FILE")" == "600" ]] || fail "$ENV_FILE must be chmod 600."
mkdir -p "$TARGET/releases" "$TARGET/logs"

# Only one deploy at a time on this server, across all repositories (builds are heavy).
# Manual runs and GitHub Actions of every builders site take this lock; a second deploy
# waits for the first.
exec 9>"$BASE/.deploy.lock"
if ! flock -n 9; then
  log "Another deploy is running; waiting up to ${LOCK_WAIT}s for it to finish"
  flock -w "$LOCK_WAIT" 9 || fail "Another deploy is still running after ${LOCK_WAIT}s; nothing was changed."
fi

# Our own Node/npm/PM2 from nvm. The server also has a system node and pm2 in /usr/bin
# that belong to another site; never use those.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[[ -s "$NVM_DIR/nvm.sh" ]] || fail "nvm not found in $NVM_DIR (README: Node for builders)."
set +eu # nvm is not written for strict mode
# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"
nvm use --silent default >/dev/null
set -eu
for tool in node npm pm2; do
  path="$(command -v "$tool" || true)"
  [[ "$path" == "$NVM_DIR"/* ]] ||
    fail "$tool resolves to '${path:-nothing}', not to builders' nvm ($NVM_DIR). README: Node for builders."
done
command -v curl >/dev/null || fail "curl not found."
command -v flock >/dev/null || fail "flock not found."

# Build-time env: NEXT_PUBLIC_SITE_URL and SITE_INDEXABLE are baked into the static pages.
# The file is sourced by bash, so a value with spaces, <, >, $, ;, &, | or quotes inside
# must be quoted. Key names only in the message, never values.
unquoted="$(grep -E '^[A-Za-z_][A-Za-z0-9_]*=[^"'"'"'].*[][:space:]<>$;&|`()"'"'"'[]' "$ENV_FILE" |
  cut -d= -f1 | paste -sd, - || true)"
[[ -z "$unquoted" ]] ||
  fail "Quote these values in $ENV_FILE: $unquoted (e.g. CONTACT_FROM_EMAIL='Signature Website <website@example.com>')."
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
[[ "${NEXT_PUBLIC_SITE_URL:-}" =~ ^https://[^/[:space:]]+$ ]] ||
  fail "NEXT_PUBLIC_SITE_URL in $ENV_FILE must be https://<host> with no trailing slash."
[[ "${SITE_INDEXABLE:-}" =~ ^(true|false)$ ]] ||
  fail "SITE_INDEXABLE in $ENV_FILE must be true or false (false until launch)."
[[ "$ENV_NAME" == production || "$SITE_INDEXABLE" == false ]] ||
  fail "Staging must never be indexable: set SITE_INDEXABLE=false in $ENV_FILE."
if [[ "$SITE_INDEXABLE" == true ]]; then
  warn "SITE_INDEXABLE=true: this build lets search engines index $NEXT_PUBLIC_SITE_URL (launch only)."
fi
# Contact delivery comes with task T2.9; until then the form says "Online requests are
# opening soon." and nothing is sent.
if [[ -z "${CONTACT_TO_EMAIL:-}" || -z "${CONTACT_FROM_EMAIL:-}" ]]; then
  warn "CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL empty: the contact form shows its 'opening soon' notice."
fi

free_mb="$(df -Pm "$BASE" | awk 'NR==2 {print $4}')"
((free_mb >= 2048)) || warn "Only ${free_mb} MB free on $BASE; a build and a release need about 1.5 GB."

PREVIOUS="$(readlink -f "$TARGET/current" 2>/dev/null || true)"
[[ -n "$PREVIOUS" && -d "$PREVIOUS" ]] || PREVIOUS=""

# --- 1. Source ------------------------------------------------------------------------
log "Fetching origin/$BRANCH"
git -C "$REPO_DIR" fetch --prune origin
if [[ -n "$WANT_COMMIT" ]]; then
  git -C "$REPO_DIR" cat-file -e "$WANT_COMMIT^{commit}" 2>/dev/null ||
    fail "Commit $WANT_COMMIT not found after fetching origin."
  git -C "$REPO_DIR" merge-base --is-ancestor "$WANT_COMMIT" "origin/$BRANCH" ||
    fail "Commit $WANT_COMMIT is not on origin/$BRANCH; only $BRANCH can be deployed."
  REF="$WANT_COMMIT"
else
  REF="origin/$BRANCH"
fi
git -C "$REPO_DIR" cat-file -e "$REF:package-lock.json" 2>/dev/null ||
  fail "package-lock.json missing in $(git -C "$REPO_DIR" rev-parse --short "$REF"); nothing to deploy."

git -C "$REPO_DIR" checkout --force --detach "$REF"
# Removes everything untracked, including the last build's output (.next). node_modules
# is reinstalled by npm ci below anyway; the npm cache in ~/.npm keeps that fast.
git -C "$REPO_DIR" clean -fdx -e node_modules
COMMIT="$(git -C "$REPO_DIR" rev-parse HEAD)"
SHORT="${COMMIT:0:7}"

# The Node major the repo pins (.nvmrc). npm is the one that comes with that Node.
want_node="$(tr -d ' \r\nv' <"$REPO_DIR/.nvmrc")"
have_node="$(node -p 'process.versions.node.split(".")[0]')"
[[ "$have_node" == "$want_node" ]] ||
  fail "Node $have_node is active but .nvmrc asks for $want_node: nvm install $want_node && nvm alias default $want_node"

# --- 2. Build -------------------------------------------------------------------------
export NEXT_TELEMETRY_DISABLED=1

log "Installing dependencies (Node $(node -v), npm $(npm -v))"
# npm ci: exact versions from package-lock.json, never prompts, fails if the lock is stale.
(cd "$REPO_DIR" && CI=true npm ci --no-audit --no-fund)

log "Building $APP @ $SHORT (SITE_INDEXABLE=$SITE_INDEXABLE, NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL)"
# The build script runs next build and then the older-browser CSS check. Any failed
# step stops here, before anything switches.
(cd "$REPO_DIR" && npm run build)

# --- 3. Assemble the release ----------------------------------------------------------
# Standalone output (server.js at its root) does not include .next/static or public/,
# so both are copied in.
log "Assembling $NAME/$(basename "$RELEASE")"
[[ -f "$REPO_DIR/.next/standalone/server.js" ]] || fail "Standalone build output not found."
mkdir -p "$RELEASE"
cp -a "$REPO_DIR/.next/standalone/." "$RELEASE/"
# Contents are copied into the folders (not the folders themselves), so this also works
# when a Next.js version already puts part of them into the standalone output.
mkdir -p "$RELEASE/.next/static"
cp -a "$REPO_DIR/.next/static/." "$RELEASE/.next/static/"
# public/ = brand files and photos (/images/…). Nginx serves /images/ from here.
if [[ -d "$REPO_DIR/public" ]]; then
  mkdir -p "$RELEASE/public"
  cp -a "$REPO_DIR/public/." "$RELEASE/public/"
fi
# The standalone folder may carry a copy of the build's .env files; settings come only
# from shared/.env through PM2, so none stay in the release.
find "$RELEASE" -maxdepth 1 -name '.env*' -type f -delete
# Keep the previous release's hashed assets too, so visitors with the old page open
# don't get 404s for its JS/CSS right after the switch (no-clobber copy).
if [[ -n "$PREVIOUS" && -d "$PREVIOUS/.next/static" ]]; then
  cp -an "$PREVIOUS/.next/static/." "$RELEASE/.next/static/"
fi
echo "$COMMIT" >"$RELEASE/REVISION"

for f in server.js .next/BUILD_ID; do
  [[ -s "$RELEASE/$f" ]] || fail "Release is missing $f."
done
[[ -n "$(ls -A "$RELEASE/.next/static")" ]] || fail "Release has no .next/static files."
# Every tracked file under public/ must be in the release.
while IFS= read -r f; do
  [[ -f "$RELEASE/$f" ]] || fail "Release is missing $f."
done < <(git -C "$REPO_DIR" ls-files public)

# Nginx (www-data) serves static files straight from the release.
chmod -R a+rX "$RELEASE"
printf 'Release size: %s\n' "$(du -sh "$RELEASE" | cut -f1)"

# --- 4. Switch + reload ---------------------------------------------------------------
switch_to() {
  ln -sfn "$1" "$TARGET/current.next"
  mv -Tf "$TARGET/current.next" "$TARGET/current" # atomic rename
}

reload_app() {
  export BUILDERS_BASE="$BASE" APP ENV_NAME PORT
  if pm2 describe "$NAME" >/dev/null 2>&1; then
    pm2 reload "$ECOSYSTEM" --update-env >/dev/null
  else
    pm2 start "$ECOSYSTEM" >/dev/null
  fi
  pm2 save >/dev/null
}

# 200 on HEALTH_PATH, served by a process that really runs from release $1.
healthy() {
  local want="$1" code pid cwd
  for _ in $(seq 1 30); do
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$HEALTH_PATH" || true)"
    pid="$(pm2 pid "$NAME" 2>/dev/null | head -n1 || true)"
    cwd="$([[ -n "$pid" && "$pid" != 0 ]] && readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
    if [[ "$code" == "200" && "$cwd" == "$want" ]]; then
      echo "HTTP $code from $(basename "$1") (pid $pid, port $PORT)"
      return 0
    fi
    sleep 1
  done
  echo "Last check: HTTP ${code:-none}, process in ${cwd:-none}" >&2
  return 1
}

log "Switching $NAME → $(basename "$RELEASE")"
switch_to "$RELEASE"
SWITCHED=1
reload_app

log "Health check http://127.0.0.1:$PORT$HEALTH_PATH"
if ! healthy "$RELEASE"; then
  if [[ -n "$PREVIOUS" ]]; then
    printf '\n\033[31mNew release unhealthy. Rolling back to %s\033[0m\n' "$(basename "$PREVIOUS")" >&2
    switch_to "$PREVIOUS"
    reload_app
    HEALTH_PATH=/ healthy "$PREVIOUS" || warn "The previous release does not answer either."
    # The failed release stays on disk for inspection; a later cleanup removes it.
    fail "Deploy of $NAME @ $SHORT failed; $(basename "$PREVIOUS") is live again. Check: pm2 logs $NAME --lines 100"
  fi
  # First deploy: nothing to go back to. Stop the app rather than serve a broken release.
  pm2 stop "$NAME" >/dev/null 2>&1 || true
  fail "First deploy of $NAME @ $SHORT failed; the app is stopped. Check: pm2 logs $NAME --lines 100"
fi

# --- 5. Clean up old releases ---------------------------------------------------------
log "Keeping the last $KEEP releases of $NAME"
live="$(readlink -f "$TARGET/current")"
# Release folders are plain timestamps, so ls is safe here (newest first).
# shellcheck disable=SC2012
ls -1dt "$TARGET"/releases/*/ | tail -n +"$((KEEP + 1))" | while IFS= read -r old; do
  [[ "$(readlink -f "$old")" == "$live" ]] || rm -rf "$old"
done

log "Deployed $NAME @ $SHORT"
}

main "$@"
