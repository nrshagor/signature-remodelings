#!/usr/bin/env bash
# GitHub Actions: writes the deploy key and the server's pinned host key, and an SSH host
# alias "deploy-target". Inputs (env): SSH_KEY (secret), DEPLOY_HOST, DEPLOY_PORT,
# DEPLOY_KNOWN_HOSTS (repository variables). The host key is never fetched on the fly.
#
#   deploy/ci/prepare-ssh.sh <app>    (signature: the app this repository's keys are bound to)
set -Eeuo pipefail

app="${1:?app}"

missing=()
[[ -n "${SSH_KEY:-}" ]] || missing+=("secret DEPLOY_SSH_KEY (in this job's environment)")
[[ -n "${DEPLOY_HOST:-}" ]] || missing+=("variable DEPLOY_HOST")
[[ -n "${DEPLOY_KNOWN_HOSTS:-}" ]] || missing+=("variable DEPLOY_KNOWN_HOSTS")
if ((${#missing[@]})); then
  for m in "${missing[@]}"; do echo "::error::Missing $m. See deploy/README.md, Auto-deploy."; done
  exit 1
fi

install -m 700 -d ~/.ssh
umask 077
printf '%s\n' "$SSH_KEY" >~/.ssh/deploy_key
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" >~/.ssh/known_hosts
cat >~/.ssh/config <<EOF
Host deploy-target
  HostName $DEPLOY_HOST
  Port ${DEPLOY_PORT:-22}
  User builders
  IdentityFile ~/.ssh/deploy_key
  IdentitiesOnly yes
  BatchMode yes
  StrictHostKeyChecking yes
  ConnectTimeout 20
  ServerAliveInterval 30
  ServerAliveCountMax 10
EOF

# Fails fast on a wrong key, host key or gate setup. "revision" is read-only.
# The command is built on the runner on purpose (SC2029); the gate checks every word.
# shellcheck disable=SC2029
if ! out="$(ssh deploy-target "revision $app ${GITHUB_JOB:-staging}" 2>&1)"; then
  echo "$out"
  echo "::error::SSH to $DEPLOY_HOST failed (key, host key or forced command). See deploy/README.md, Auto-deploy."
  exit 1
fi
echo "SSH to $DEPLOY_HOST works (live $app ${GITHUB_JOB:-staging}: ${out:0:7})."
