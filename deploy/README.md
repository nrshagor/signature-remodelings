# Deploying Signature Remodelings (VPS + Nginx + PM2)

Signature Remodelings runs on the shared builders server, next to the other HBS sites
(Hera, Solum, QCSI). It uses the same deploy user `builders`, the same Node/PM2 under
builders' nvm, the same deploy gate and the same deploy lock. This kit was adapted from
`solum-constructions/deploy`.

| Environment | PM2 process            | Port (127.0.0.1) | Public name                                      | Indexing                 |
| ----------- | ---------------------- | ---------------- | ------------------------------------------------ | ------------------------ |
| Staging     | `signature-staging`    | 3104             | none (local only, see "Staging")                 | always `false`           |
| Production  | `signature-production` | 3204             | `signatureremodelings.com` (+ `www` → bare name) | `false` until the launch |

**Right now the domain shows a client preview:** Nginx sends `signatureremodelings.com` to
`signature-production` on 3204. That build has `SITE_INDEXABLE=false` (every page
`noindex, nofollow`, `robots.txt` = `Disallow: /`), and Nginx adds `X-Robots-Tag: noindex,
nofollow` on every response. No password. Launch steps are in "At launch".

> [!WARNING]
> **This server also runs `holisticbusinessservice.com` and the other builders sites.**
> Never edit `/etc/nginx/sites-available/default` (it holds that site, `default_server`
> and its Certbot SSL). Never touch the user `hbsadmin`, its PM2, port 3000,
> `/usr/bin/node` or `/usr/bin/pm2`. Signature adds only: its checkout, two folders under
> `/var/www/builders`, one Nginx file, one certificate and one GitHub deploy key.

**How commands are marked:** a line that starts with `sudo` runs as your admin user (the
server uses `sudo-rs`; everything here works with it). Blocks headed **as builders** run
after `sudo -iu builders`; type `exit` to come back. Nothing else needs root.

| File                                    | Purpose                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `deploy.sh`                             | `deploy.sh signature <env> [<commit>]`: checks, build, release, atomic switch, health check, rollback |
| `ecosystem.config.cjs`                  | PM2 process `signature-<env>`: one worker, `127.0.0.1:<port>`, env from `shared/.env`         |
| `deploy-gate.sh`                        | Shared forced command for GitHub Actions keys (all builders sites), now also knows `signature` |
| `nginx/signatureremodelings.com.conf`   | Preview site for the domain (HTTP-only first version; certbot adds HTTPS), no `default_server` |
| `ci/*.sh`                               | For a GitHub Actions deploy workflow (not added yet, see "Auto-deploy")                       |

**Not ported:** Solum's `coming-soon/` page and its Nginx file. Signature goes straight to
the preview on the domain, so there is no holding page.

### How this differs from the Solum kit

- One Next.js app at the repository root with **npm** (`package-lock.json`), not a pnpm +
  Turborepo monorepo. `deploy.sh` runs `npm ci` and `npm run build` (which runs `next
  build` and the older-browser CSS check). The standalone server is `server.js` at the
  release root, so paths have no `apps/<app>/` part.
- Settings: `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXABLE`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL` (no `NEXT_PUBLIC_SITE_ENV`, no SMTP yet: contact delivery is task
  T2.9; until then the form says "Online requests are opening soon.").
- Static files Nginx serves itself: `/_next/static/` and `/images/` (Solum: `/media/`).
- `deploy-gate.sh` is the **shared** file: this copy adds `signature` to the app list and
  the checkout map. Copy the same change into the gate of the other three repositories, so
  all copies stay identical, and install it once on the server (step 9).
- `.nvmrc` pins Node 24, the same major the other sites use (they share builders' nvm).

## Server layout

```text
/var/www/builders/
├── signature-remodelings/     this repository's checkout + node_modules (built here)
├── .deploy.lock               one deploy at a time on the server (shared with the other sites)
├── signature-staging/
│   ├── releases/<timestamp>/  one per deploy, last 5 kept
│   ├── current -> releases/…  live release (Nginx and PM2 point here)
│   ├── shared/.env            settings, chmod 600, never in git
│   └── logs/                  PM2 output
├── signature-production/ …    same shape
└── solum-*, hera-*, qcsi-* …  the other sites (their own runbooks)
/home/builders/
├── .nvm/                      Node 24, npm, pm2 (shared with the other sites)
├── .pm2/                      builders' own PM2 (separate from hbsadmin's)
├── .ssh/github_signature_remodelings   read-only GitHub deploy key for this repository
└── bin/deploy-gate            forced command for the GitHub Actions keys (shared)
```

---

## First-time server setup

### 0. Before you start

- The `builders` user, its nvm (Node 24) + PM2 and the `pm2-builders` boot service already
  exist from the Solum/Hera setup (Solum's `deploy/README.md`, steps 2, 5 and 6). If they
  don't, do those steps first.
- DNS for `signatureremodelings.com`: `A @` and `A www` → the VPS IPv4 (and `AAAA` only
  if the server has IPv6). certbot (step 8) needs both names to point here already. Keep
  `MX` and `TXT` (SPF/DKIM/DMARC) records exactly as they are.
- An email address for Let's Encrypt expiry notices.

Read-only checks that Signature's ports and names are still free:

```bash
sudo ss -ltnp | grep -E ':(3104|3204)\b'                  # expect: nothing
sudo grep -RlE 'signatureremodelings' /etc/nginx/         # expect: nothing
dig +short signatureremodelings.com A                     # the VPS IP
dig +short www.signatureremodelings.com A                 # the VPS IP
```

### 1. Create the GitHub deploy key (as builders)

```bash
sudo -iu builders
install -d -m 700 ~/.ssh
ssh-keygen -t ed25519 -C "builders-vps signature-remodelings" -f ~/.ssh/github_signature_remodelings -N ""
```

### 2. Add the SSH config alias (as builders)

```bash
printf '\nHost github-signature-remodelings\n  HostName github.com\n  IdentityFile ~/.ssh/github_signature_remodelings\n  IdentitiesOnly yes\n' >> ~/.ssh/config
chmod 600 ~/.ssh/config
cat ~/.ssh/github_signature_remodelings.pub
```

The alias is new and per repository: GitHub accepts a deploy key on one repository only,
so the Solum and Hera aliases stay as they are.

### 3. Add the key to GitHub (in the browser, read-only)

GitHub → `nrshagor/signature-remodelings` → Settings → Deploy keys → **Add deploy key**:
paste the `.pub` line from step 2, title `builders-vps signature-remodelings`,
**Allow write access: off**. Then, still **as builders**:

```bash
ssh -T git@github-signature-remodelings
# Compare the fingerprint with GitHub's published SSH fingerprints, then "yes".
# Expect: "Hi nrshagor/signature-remodelings! You've successfully authenticated…"
```

### 4. Clone the repository (as builders)

```bash
cd /var/www/builders
git clone git@github-signature-remodelings:nrshagor/signature-remodelings.git signature-remodelings
cat signature-remodelings/.nvmrc          # 24
node -v                                   # v24.x, from /home/builders/.nvm/
which node npm pm2                        # all three under /home/builders/.nvm/
```

### 5. Folders and `.env` for both environments (as builders)

```bash
cd /var/www/builders
for env in staging production; do
  mkdir -p "signature-$env"/{releases,shared,logs}
  cp signature-remodelings/.env.example "signature-$env/shared/.env"
  chmod 600 "signature-$env/shared/.env"
done
nano signature-staging/shared/.env
nano signature-production/shared/.env
```

For now both files hold the same values:

```bash
NEXT_PUBLIC_SITE_URL=https://signatureremodelings.com
SITE_INDEXABLE=false
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

### 6. First deploy (as builders)

Production first: it is what the domain shows.

```bash
bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature production
curl -sI http://127.0.0.1:3204/ | head -1                      # HTTP/1.1 200 OK
curl -s http://127.0.0.1:3204/robots.txt                       # User-Agent: * / Disallow: /
bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature staging
curl -sI http://127.0.0.1:3104/ | head -1                      # HTTP/1.1 200 OK
pm2 ls                                                         # signature-production, signature-staging: online
exit
```

The first run takes a few minutes (package download + build) and ends with
`==> Deployed signature-<env> @ <commit>`. The two warnings about `CONTACT_*` being empty
are expected until T2.9. If another site is deploying, the script waits for it (shared
lock). If it fails, see "When a deploy fails".

### 7. Nginx: enable, test, reload (sudo)

> [!CAUTION]
> Never edit `/etc/nginx/sites-available/default`. Our site is a separate file.

```bash
sudo cp /var/www/builders/signature-remodelings/deploy/nginx/signatureremodelings.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/signatureremodelings.com.conf /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot
sudo nginx -t                       # must say "syntax is ok" and "test is successful"
sudo systemctl reload nginx         # reload, not restart: the other sites keep running
```

If `nginx -t` fails: `sudo rm /etc/nginx/sites-enabled/signatureremodelings.com.conf` and
don't reload. Check over plain HTTP before certbot:

```bash
curl -sI -H 'Host: signatureremodelings.com' http://127.0.0.1/ | grep -iE '^HTTP|x-robots'      # 200 + noindex, nofollow
curl -sI -H 'Host: www.signatureremodelings.com' http://127.0.0.1/ | grep -iE '^HTTP|location' # 301 → https://signatureremodelings.com/
curl -sI -H 'Host: holisticbusinessservice.com' http://127.0.0.1/ | head -1                    # unchanged answer
```

### 8. HTTPS for both names (sudo)

```bash
sudo certbot --nginx -d signatureremodelings.com -d www.signatureremodelings.com -m <your email> --agree-tos --redirect
sudo nginx -t
sudo certbot renew --dry-run
```

One certificate for both names. certbot edits only the server blocks with these names (our
file): it adds `listen 443 ssl`, the certificate lines and the HTTP→HTTPS redirects. From
now on, change the **installed** file in `sites-available/`; copying the repository file
over it again would remove certbot's lines. The other sites' certificates are not
affected.

### 9. Shared deploy gate (as builders, only when GitHub Actions is set up)

Not needed for manual deploys. When Signature gets GitHub Actions keys, install the
updated gate (it still accepts the other sites' keys exactly as before):

```bash
install -m 755 /var/www/builders/signature-remodelings/deploy/deploy-gate.sh ~/bin/deploy-gate
```

### 10. Verify

```bash
curl -sI https://signatureremodelings.com/ | grep -iE '^HTTP|x-robots|x-frame|referrer'
# HTTP/2 200, x-robots-tag: noindex, nofollow, and the app's security headers (once each)
curl -sI http://signatureremodelings.com/ | grep -iE '^HTTP|location'        # 301 → https://signatureremodelings.com/
curl -sI https://www.signatureremodelings.com/ | grep -iE '^HTTP|location'   # 301 → https://signatureremodelings.com/
curl -s https://signatureremodelings.com/robots.txt                          # Disallow: /
curl -s https://signatureremodelings.com/ | grep -o '<meta name="robots"[^>]*>'   # noindex, nofollow
curl -sI https://holisticbusinessservice.com/ | head -1                      # unchanged
```

In a browser: every page opens, photos load, the contact form shows "Online requests are
opening soon." and sends nothing. **As builders:** `pm2 logs signature-production --lines 20`
shows no errors.

---

## Operating it

**Deploy by hand** (after a push to `main`):

```bash
sudo -iu builders bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature production
sudo -iu builders bash /var/www/builders/signature-remodelings/deploy/deploy.sh signature staging
```

Optional settings: `KEEP=…` (releases kept, default 5), `HEALTH_PATH=…` (default `/`),
`LOCK_WAIT=…` (seconds to wait for another deploy, default 1800).

What `deploy.sh signature <env> [<commit>]` does: checks the `.env` (`chmod 600`, quoted
values, `NEXT_PUBLIC_SITE_URL` is `https://<host>`, `SITE_INDEXABLE` is `true`/`false`
and always `false` on staging), Node/npm/PM2 from builders' nvm and the Node major from
`.nvmrc`; takes the shared lock; fetches `origin/main` (or the given commit, which must be
on `main`); `npm ci`; `npm run build`; assembles a release (standalone server,
`.next/static`, `public/`, plus the previous release's hashed assets; no `.env` files)
and checks it has every tracked `public/` file; switches `current` atomically; `pm2
reload`; health check (`200` from a process really running the new release); keeps the
last 5 releases.

> [!IMPORTANT]
> Run `pm2` only in a `sudo -iu builders` shell, where nvm is loaded: `which pm2` must
> show `/home/builders/.nvm/…`. In a shell without nvm, `pm2` is `/usr/bin/pm2` (the other
> site's install) and would start a second, unrelated PM2 daemon for builders.

**Status and logs (as builders):** `pm2 ls`, `pm2 logs signature-production --lines 100`,
files in `/var/www/builders/signature-<env>/logs/`.
`cat /var/www/builders/signature-production/current/REVISION` shows the live commit.

### Staging

Staging has no public name: it runs on `127.0.0.1:3104` only. To look at it, open an SSH
tunnel from your computer: `ssh -L 3104:127.0.0.1:3104 <you>@<VPS>`, then
`http://localhost:3104`. A public, password-protected `staging.signatureremodelings.com`
can be added later the Solum way (DNS record, basic-auth file, its own Nginx file).

### When a deploy fails

| What happened                           | Result                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| Checks, download, install or build fail | "Stopped before the switch: the live … release is unchanged." Half-built release removed. |
| New release fails the health check      | Switches back, reloads, checks the previous release, exits with an error.                 |
| First deploy fails its check            | Nothing to go back to: the app is stopped (Nginx shows 502), other sites are unaffected.  |
| Another deploy is running               | Waits for it (up to `LOCK_WAIT`), then runs; never in parallel.                           |

### Settings changed, or manual rollback

**As builders** (example production; staging uses 3104):

```bash
cd /var/www/builders/signature-production
ls -1t releases/                                  # newest first
cat releases/<timestamp>/REVISION                 # which commit
ln -sfn releases/<timestamp> current.next && mv -Tf current.next current   # rollback only
APP=signature ENV_NAME=production PORT=3204 pm2 reload /var/www/builders/signature-remodelings/deploy/ecosystem.config.cjs --update-env
curl -sI http://127.0.0.1:3204/ | head -1
```

`NEXT_PUBLIC_SITE_URL` and `SITE_INDEXABLE` are baked in at build time: after changing
them, run a new deploy. The `CONTACT_*` values are read at run time: the last two lines
are enough.

## At launch

1. **As builders:** in `signature-production/shared/.env` set `SITE_INDEXABLE=true` (and
   the contact delivery values once T2.9 is done), then deploy production.
2. **sudo:** in `/etc/nginx/sites-available/signatureremodelings.com.conf` delete every
   `add_header X-Robots-Tag …` line (marked `PREVIEW: remove at launch`, also in the
   HTTPS parts certbot wrote), then `sudo nginx -t && sudo systemctl reload nginx`.
3. Check: `curl -sI https://signatureremodelings.com/ | grep -i x-robots` → nothing;
   `/robots.txt` → `Allow: /`; pages have no `noindex`.

Staging keeps `SITE_INDEXABLE=false` forever (`deploy.sh` refuses anything else there).

## Auto-deploy (later)

`deploy-gate.sh` and `ci/*.sh` are ready for a GitHub Actions workflow like Solum's
`.github/workflows/deploy.yml` (push to `main` → staging; manual, approved run →
production), but the workflow file is not in this repository yet. Adding it needs two new
keys bound to `signature` (`restrict,command="/home/builders/bin/deploy-gate staging
signature" …` and the same for `production`), the updated gate (step 9) and the GitHub
environments and secrets; follow Solum's `deploy/README.md`, step 14, with `signature` in
place of `solum`. `ci/needs-deploy.sh` treats `docs/`, `*.md`, `.github/`, `.claude/`,
`deploy/ci/`, `deploy/nginx/` and `deploy/deploy-gate.sh` as no-deploy changes.

---

## Reference

### Client IP and the rate limit

The contact form allows 5 submissions per 10 minutes per IP
(`src/app/contact/actions.ts`). It reads the client IP from the headers our Nginx sets:

1. `X-Real-IP`: Nginx overwrites it with `$remote_addr`, so it can't be faked.
2. Otherwise the **last** entry of `X-Forwarded-For`, the one the proxy appended.
   Earlier entries come from the visitor and are ignored.
3. In local dev there is no proxy; Next.js fills `X-Forwarded-For` with the socket
   address, so the limit still works per client.

This only holds because the app listens on `127.0.0.1`. If the Node port were reachable
directly, a visitor could send their own `X-Real-IP`. If Nginx is ever put behind a CDN
(for example Cloudflare), `$remote_addr` becomes the CDN's address: configure Nginx's
`real_ip` module with the CDN's IP ranges.

The limiter is in memory. PM2 runs **one** worker per environment in cluster mode, only so
that reloads are zero-downtime. Don't raise `instances`, or each worker keeps its own
count.

### Environment variables (`shared/.env`)

| Variable               | Notes                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://signatureremodelings.com` for both now. Canonical and Open Graph URLs. Read at **build** time. |
| `SITE_INDEXABLE`       | `false` for both now (noindex + `robots.txt` disallow). `true` only for production at launch. **Build** time. |
| `CONTACT_TO_EMAIL`     | Empty until T2.9 (contact delivery). Read at run time.                                                  |
| `CONTACT_FROM_EMAIL`   | Empty until T2.9. Quote it if it has spaces or `<…>`. Read at run time.                                 |

`HOSTNAME`, `PORT` and `NODE_ENV` are set by `ecosystem.config.cjs` and can't be
overridden from `.env`, so the app always binds to localhost on its own port.

### Headers

The app sends the security headers (`next.config.ts`: `X-Content-Type-Options`,
`Referrer-Policy`, `X-Frame-Options`, `Content-Security-Policy: frame-ancestors 'none'`,
`Permissions-Policy`). Nginx adds none of them, so they are never sent twice. Files Nginx
serves itself from disk (`/_next/static/`, `/images/`) get only their cache header and,
during the preview, `X-Robots-Tag`.
