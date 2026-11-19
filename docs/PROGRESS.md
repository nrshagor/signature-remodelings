# PROGRESS — Signature Remodelings

Claude Code updates this file at the end of every task. Newest log entry on top.

## Current status

- Phase: 2 — Pages built (T2.9 contact delivery and T2.11 privacy policy BLOCKED)
- Last completed task: client preview prep (Carrollton card, Contact redesign, FAQ move, robots.txt, sweep)
- **Next task: client preview deploy (user pushes, then the server chat follows `deploy/README.md` → "First-time server setup"); then T3.1 Per-page metadata and OG** (SEO tasks deferred until after the preview)
- Site state: **ready for a preview deploy** (see the log entry "Ready for preview deploy"). Lint, build and CSS check pass. Git on `main`, local only (never pushed by Claude Code).

## Open questions

### For the user (technical)
- [x] T0.1 questions — answered (see Decisions)
- [ ] Contact delivery method (decide later; T2.9 BLOCKED): SMTP via `nodemailer` reusing Solum's sender, or email API via `fetch`? Recipient email?
- VPS Node version, free ports and Nginx headers → checked at deploy time (see "For the server chat" → T5.4 checklist).

### For the client (via Jahid)
- [ ] Brand name: "Signature Remodelings" or "Signature Remodeling"?
- [ ] Logo and brand colors
- [ ] Phone, email, business address (or none), hours
- [ ] Service area: cities/counties
- [ ] Founder name, photo, short background (optional)
- [ ] License / insurance / warranty / financing — only if real and documented
- [ ] Free consultation or free estimate?
- [ ] Permits: do they handle them?
- [ ] Flipping model: service for outside investors, own flips, or both?
- [ ] Budget ranges for the contact form (optional field)
- [ ] Carrollton balcony: finished or in progress? Owner's goal? Size/materials?
- [ ] Alba flip: what was changed? Can a sale result be shown?
- [ ] Attachments: balcony drawing, renovated photos, any "before" photos they own
- [ ] Approval of tagline and all [DRAFT] copy before launch
- [ ] Alba photos: higher-resolution originals (current files are 1024 px and 665 px wide)
- [ ] Carrollton: a company-owned "before" photo of the house (no Google Maps / Street View / Zillow images)
- [ ] Privacy policy: company legal name and contact email

## Decisions

| Date | Decision | Source |
| --- | --- | --- |
| 2026-11-18 | Next.js App Router, latest patched 16.x (≥ 16.4.5) | User + Nov 2026 security release |
| 2026-11-18 | No Tailwind; plain CSS (older-browser support) | User |
| 2026-11-18 | No Three.js | User + recommendation |
| 2026-11-18 | GSAP + ScrollTrigger only for project stories and process; CSS + IntersectionObserver elsewhere | User + recommendation |
| 2026-11-18 | Page transitions: enter fade only, no exit/router hacks | Recommendation |
| 2026-11-18 | Ports proposed 3003 / 3104 / 3204 (to confirm) | HBS port pattern |
| 2026-11-18 | T0.1: Fresh scaffold, new design. Reuse proven, dependency-free pieces from `solum-constructions` / `quality-concrete-solution` (read-only); list each before copying | User |
| 2026-11-18 | T0.1: Node 24 (`.nvmrc` = `24`, `engines.node ">=24 <25"`), same as both repos (`.nvmrc` 24). VPS `node -v` not given yet — verify in server chat | Both repos' `.nvmrc`; user answer was blank |
| 2026-11-18 | T0.1: Browser target copied from Solum `.browserslistrc`: Safari/iOS ≥ 15.4, Chrome/Edge ≥ 109, Firefox ≥ 102, Samsung ≥ 17. No polyfills in either repo. CSS fallbacks via rules + a dependency-free post-build CSS check (adapt Solum `scripts/check-built-css.mjs` in T0.3) | Solum repo |
| 2026-11-18 | T0.1: Ports 3003 / 3104 / 3204 — not used by either repo's PM2/Nginx config (Hera 3101/3201, Solum 3001/3102/3202, QCSI 3002/3103/3203). Still to confirm free on the VPS (user answer was blank); not blocking until T5.4 | Repo configs |
| 2026-11-18 | T0.1: `output: 'standalone'` (both repos use it) | Solum + QCSI `next.config.ts` |
| 2026-11-18 | T0.1: Nginx sets no security headers in either repo (only `Cache-Control` and `X-Robots-Tag`) → set all security headers in `next.config` `headers()`. Re-check with the server chat | Repo Nginx configs; user answer was blank |
| 2026-11-18 | T0.2 versions: next 16.4.6 (latest; bug-fix backport, no advisory after 3 Nov per nextjs.org/blog), react / react-dom 19.3.1 (exact), eslint-config-next 16.4.6, typescript 5.9.3, eslint 9.39.5, @types/node 24.19.2 | npm, nextjs.org/blog |
| 2026-11-18 | ~~Keep `cacheComponents` + `partialPrefetching` scaffold defaults~~ → replaced by the next row | Scaffold default |
| 2026-11-18 | `cacheComponents` disabled (static marketing site, no `use cache`). User asked to keep `partialPrefetching`, but the Next 16.4 docs (`next-config-js/partialPrefetching.md`) say it requires `cacheComponents` and `next build` throws without it → `partialPrefetching` removed too. Standard `<Link>` prefetching applies | User + Next docs (conflict reported) |
| 2026-11-18 | Keep and commit the generated `AGENTS.md` (Next.js writes its block back on every `next dev`). A line outside the managed block points to CLAUDE.md, which wins on project rules | User |
| 2026-11-18 | Browser target = Solum `.browserslistrc` (Safari/iOS 15.4, Chrome/Edge 109, Firefox 102, Samsung 17). **This is below Next 16's official support (Chrome/Edge/Firefox 111+, Safari 16.4+).** Real-device testing of Safari 15.x is required in T3.7 | User |
| 2026-11-18 | Contact delivery (nodemailer / Solum SMTP sender): still open — answer was blank. T2.9 stays BLOCKED | User answer pending |
| 2026-11-18 | `npm audit` picomatch (dev-only): no `--force`; re-check in T5.3 | User |
| 2026-11-18 | Node 24 and ports 3003/3104/3204 are provisional; verified at deploy time (T5.4 checklist). Contact delivery decided later; T2.9 stays BLOCKED | User |
| 2026-11-18 | Fonts: Cormorant Garamond 600 (headings) + Inter variable (body/UI), via `next/font/google` | 04-DESIGN options |
| 2026-11-18 | Contrast fixes to 04-DESIGN tokens: `--color-muted` #7A746D → **#6F6962** (was 4.36:1 on paper, 3.86 on stone; now 5.12 / 4.53). Added `--color-accent-light` **#B08C5C** for accent on ink (5.46:1; #9C7A4D was 4.29). `--color-accent` #9C7A4D (3.73 on paper) only for large text, borders, focus ring, details; links use `--color-accent-dark` (5.44) | WCAG AA check |
| 2026-11-18 | `html.js` is added only when `IntersectionObserver` exists. Reveal targets have a 3 s CSS failsafe until `html[data-hydrated]` is set (Solum pattern; flag set in T1.5) | Spec + Solum |
| 2026-11-18 | T0.1: Keep npm single-app repo (spec), not the pnpm/turbo monorepo used by the other sites. Keep `SITE_INDEXABLE` (spec) — same noindex/robots pattern as Solum's `NEXT_PUBLIC_SITE_ENV=staging` | Spec |
| 2026-11-18 | Alba flip photos: client confirmed permission to use them on the site. **Settled** — not an open item (12 photos used, no "before" photos, no slider; unused laundry photo deleted) | User (client confirmation) |
| 2026-11-18 | Client feedback: look as modern as possible; remodeling first, home flipping second. Heading font Cormorant Garamond → **Plus Jakarta Sans** 600/700 (rounder geometric forms contrast with Inter; Manrope too close to Inter). Radius 12px images/cards/tiles, 8px buttons/inputs. Frosted header after scroll (backdrop-filter inside `@supports`, solid fallback). Nav: Remodeling · Home Flipping · Projects · About · FAQ. Home: Interior + Exterior bento, flipping as a "For investors" band (Alba cover photo). Palette unchanged | Client (via user) |
| 2026-11-18 | GSAP license checked: gsap 3.15.1 and @gsap/react 2.1.2 ship under GreenSock's Standard "no charge" license (gsap.com/standard-license), free for commercial use; this site is not a competing visual animation tool, so it qualifies. Versions pinned exactly | T2.5 license check |
| 2026-11-18 | Colour palette: modern light blue replaces the warm brass palette (navy ink #0F1E2E, paper #F7FAFC, mist #EAF3FB replaces stone, accent #1F6FB2, accent-soft #BFE0F7, accent-light #8CC8F2). Primary buttons are accent blue with white text. Every pair checked against WCAG AA (table in 04-DESIGN) | User |
| 2026-11-18 | Before/after: drag slider on all screen sizes; pinned GSAP scroll story deleted. GSAP only for the process animation. No fake or AI "before" images | User |
| 2026-11-18 | Stock photos downloaded by Claude Code at the user's request (overrides the 05-IMAGES "user downloads" note). Unsplash License checked on unsplash.com/license: free commercial use, no attribution required; not allowed: selling unmodified copies, compiling into a competing service. Sources in `public/images/CREDITS.md` | User + license check |
| 2026-11-18 | Motion refresh: GSAP + ScrollTrigger + SplitText allowed site-wide (dynamic import, client only). Policy in 02-TECH-SPEC → Animation policy, table in 04-DESIGN → Motion. Hero headline words are split on the server and animated with CSS (not SplitText), so the headline never waits for JavaScript. The services marquee moves only after the first scroll/tap and while on screen (an always-running animation cost about 2 s of main-thread work in Lighthouse). The curtain link transition is kept: prefetch, back/forward, Ctrl/Cmd/middle-click and focus were tested and unchanged | User + test |
| 2026-11-19 | Carrollton is **in progress** ("In progress" badge); no gallery or slider until the client's renderings arrive. Projects without a photo get a designed navy text card of the same size | User |
| 2026-11-19 | FAQ removed from the main nav; still in the footer, and a compact FAQ sits at the bottom of /contact | User |
| 2026-11-19 | Deferred until after the client preview: colour comparison, old-browser testing (T3.7), SEO tasks (T3.x, except the robots.txt needed for the preview) | User |
| 2026-11-19 | Carrollton balcony is at the **back** of the home (per the renderings): summary, Home card line and SEO description rewritten [DRAFT]; "front elevation" removed everywhere | User |

## Missing images

(Claude Code lists image slots from 05-IMAGES.md that are still missing.)

All slots are missing as of 2026-11-18. Used by the Home page so far (until added, they render as neutral panels or ink backgrounds):
- `public/images/stock/hero-home.jpg` (2400×1350): Home hero
- `public/images/stock/service-interior.jpg`, `service-exterior.jpg`, `service-flipping.jpg` (1600×2000): service cards
- `public/images/stock/process-plans.jpg` (1600×1200): Why us
- `public/images/stock/cta-band.jpg` (2400×1000): closing CTA
- Project card photos (company's own, pending from client): `projects/carrollton-balcony-addition/…`, `projects/alba-home-flip/…`
- Also still missing: `public/images/CREDITS.md` (create when the first stock image is added).

After adding files with these exact names, run a new build: pages are static and check for images at build time.

## For the server chat

(Things the server needs — filled in T5.4 or whenever something comes up. Claude Code does not run server commands.)

**T5.4 checklist (verify at deploy time):**
- [ ] VPS `node -v` is 24.x. The repo is provisionally pinned to Node 24 (`.nvmrc`, `engines.node ">=24 <25"`).
- [ ] Ports 3003 (dev), 3104 (staging) and 3204 (production) are free on the VPS. These are provisional.
- [ ] Nginx adds none of the security headers the app sends (below).

**Deploy kit (2026-11-19):** everything for the server is in `deploy/` — `deploy/README.md` → "First-time server setup" has the exact commands in order (deploy key + SSH alias `github-signature-remodelings`, clone to `/var/www/builders/signature-remodelings`, folders + `.env` for `signature-staging` / `signature-production`, first deploy, Nginx enable/test/reload, certbot for `signatureremodelings.com` + `www`, verify). Both builds `SITE_INDEXABLE=false`, `NEXT_PUBLIC_SITE_URL=https://signatureremodelings.com`; the domain proxies to production on 3204 with `X-Robots-Tag: noindex`. The updated shared `deploy-gate.sh` (adds `signature`) must also be copied into the hera, solum and qcsi repositories before it is installed on the server.

**Notes:**
- `output: 'standalone'`: run `node .next/standalone/server.js` (with `PORT` / `HOSTNAME=127.0.0.1`), like the other HBS sites' PM2 config. Copy `.next/static` and `public/` into the standalone folder at deploy time.
- `SITE_INDEXABLE` and `NEXT_PUBLIC_SITE_URL` are read at **build time** (static pages). Build staging with `SITE_INDEXABLE=false` and production with `SITE_INDEXABLE=true` (only at launch), each with its own `NEXT_PUBLIC_SITE_URL`. Changing them needs a rebuild, not just a restart.
- Contact form rate limit reads `X-Real-IP` first, then the last `X-Forwarded-For` entry (2026-11-19, was the first entry, which a visitor can fake). The Nginx file in `deploy/nginx/` sets both.
- The app sends the security headers itself (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, CSP frame-ancestors, Permissions-Policy). Nginx must not add them again.

## Log

<!-- Template — copy for each entry, newest on top:
### YYYY-MM-DD — T#.# Task name
- Done:
- Files:
- Notes / decisions:
- User action needed:
-->

### 2026-11-19 — Deploy kit ported from solum-constructions
- Done: `deploy/` adapted from Solum's kit for one npm app at the repo root: `deploy.sh` (`signature <env> [<commit>]`, npm ci + npm run build, standalone release, atomic switch, health check, rollback, shared `/var/www/builders/.deploy.lock`; checks `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXABLE` true/false and never true on staging), `ecosystem.config.cjs` (PM2 `signature-staging` 3104 / `signature-production` 3204), `deploy-gate.sh` (the shared gate with `signature` added), `ci/*.sh` (for a later Actions workflow; `needs-deploy.sh` skips docs-only changes), `nginx/signatureremodelings.com.conf` (preview: proxy to 3204, X-Robots-Tag noindex, X-Real-IP + X-Forwarded-For, `client_max_body_size 1m`, www → apex, no `default_server`, acme at `/var/www/certbot`, HTTP-only until certbot), `README.md` with "First-time server setup". Coming-soon page not ported (the domain goes straight to the preview). No staging Nginx file: staging is local-only on 3104 (SSH tunnel).
- Also: the contact rate limit now reads `X-Real-IP`, then the last `X-Forwarded-For` entry (the first entry can be faked by a visitor). ESLint allows `require()` in `deploy/**/*.cjs`.
- Checks: `bash -n` on every script; gate refusals tested locally (wrong app, wrong env, shell characters); `needs-deploy.sh` tested on real commits (code change → deploy, docs-only → skip); release assembly simulated on the local build (static, public and every tracked image present). Lint, build, CSS check pass. No server commands run.
- Files: `deploy/**`, `src/app/contact/actions.ts`, `eslint.config.mjs`, `docs/PROGRESS.md`.
- User action needed: push; copy the gate change into the other three repos; then the server chat runs the README steps.

### 2026-11-19 — Carrollton copy fix
- The balcony is at the back of the home (renderings). New [DRAFT] summary in `src/content/projects.ts` and the same line on the Home "Recent work" card (`src/content/pages.ts`, it repeated the old claim); new SEO description in `src/content/seo.ts`. 03-CONTENT updated; Open question removed; decision logged.
- Checks: lint, build, CSS check pass; no "front elevation" left in `src` or the built pages.

### 2026-11-19 — Client preview prep, ready for preview deploy (updated)
- **Carrollton:** in progress (badge on the page and the card), new "The work" text [DRAFT], no gallery or slider. Its card on Home and /projects is a navy text-only card (city/type labels, title, line, "In progress" chip, arrow) the same size as the photo cards. No map or Street View images anywhere.
- **FAQ:** out of the main nav (footer link stays); compact FAQ ("Common questions" [DRAFT, new]) at the bottom of /contact.
- **Contact redesign:** dark panel (h1, text, "What happens next" 1–3 [DRAFT]) beside the form in an elevated white card; stacked on phones. Project type and timeline are pill chips (real radio inputs: Tab into the group, arrows to change, visible focus ring). Validation, spam checks and the "opening soon" notice unchanged; all six form scenarios re-tested (valid, too fast, honeypot, bad phone, and with JavaScript off), and the choices are kept after every submit.
- **robots.txt:** `src/app/robots.ts` follows `SITE_INDEXABLE` (`Disallow: /` for the preview).
- **Sweep (production build with `SITE_INDEXABLE=false`):** crawled every link from Home: 11 pages, all 200, no internal 404s; every page has one h1, `noindex, nofollow` and no placeholder text (searched for lorem, TBD, TODO, [phone], [DRAFT], undefined, NaN, …); `robots.txt` = `User-Agent: * / Disallow: /`. Headless Edge at 375 px and 1440 px: no console errors, no sideways scroll. Lint, build and CSS check pass. (`/sitemap.xml` does not exist yet: T3.2, deferred.)
- **Commits:** `feat: carrollton in progress with text-only project card`, `feat: move faq from main nav to footer`, `feat: contact page redesign with pill choices and faq block`, `feat: robots.txt follows the indexing switch`, plus this docs commit.

**How to deploy the preview** (app side only; the server setup itself is for the server chat):
- **Node:** 24.x (`.nvmrc`).
- **Environment at build time** (pages are static, so these are baked in; changing them needs a rebuild):
  - `NEXT_PUBLIC_SITE_URL` = the preview URL (canonical links and Open Graph URLs use it).
  - `SITE_INDEXABLE=false` (noindex on every page + `robots.txt` disallow). Set `true` only for the live site at launch.
  - `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`: leave empty until T2.9; the form shows "Online requests are opening soon."
- **Install and build:** `npm ci`, then `npm run build` (also runs the CSS check).
- **Standalone copy steps** (`output: 'standalone'`): copy `.next/static` to `.next/standalone/.next/static`, and `public` to `.next/standalone/public`.
- **Start:** `node .next/standalone/server.js` with `PORT=3104` (staging, provisional) and `HOSTNAME=127.0.0.1`. Production later on `3204`. (`next start` prints a warning with standalone output; use the server.js file.)
- **Real visitor IP:** the contact form rate limit (5 requests per 10 minutes per IP) reads `X-Forwarded-For`. The proxy in front of the app must pass the real client IP in that header, otherwise every visitor shares one limit.
- **Security headers** are sent by the app (`next.config.ts`); the proxy must not add them again.

**Not ready for launch (fine for a preview):** contact delivery (T2.9), privacy policy (T2.11), client facts and approval of all [DRAFT] copy, sitemap and other SEO tasks, old-browser testing, Lighthouse confirmation on a real device.

### 2026-11-19 — T2.10 404 and error pages
- `src/app/not-found.tsx`: "404" label, heading and two buttons from 03-CONTENT, browser title [DRAFT, new], noindex. Checked: `/missing-page`, `/services/nope`, `/projects/nope` → 404.
- `src/app/error.tsx`: client error boundary with "Try again" (reset) and "Back to home"; copy [DRAFT, new] added to 03-CONTENT. Builds and type-checks; not triggered in a browser because no page throws.
- Shared layout: `src/components/sections/StatusPage.{tsx,module.css}`.
- Checks: lint, build, CSS check pass.

### 2026-11-19 — T2.8 Contact page and form (UI + validation)
- `/contact`: hero, form (name, phone, email, city/ZIP, project type, timeline, message; budget hidden until ranges exist), consent line. Side panel renders only confirmed contact details (none yet, so hidden).
- Server action `src/app/contact/actions.ts`: reads and validates with `src/lib/validate.ts` (same rules in the browser), honeypot, ≥ 3 s fill time, in-memory rate limit (5 per 10 min per IP from `x-forwarded-for`), then `sendLead()` (`src/lib/leads.ts`), which returns `not-configured` and logs one line without any visitor data.
- **No silent failure:** until T2.9, every submit (and every spam hit) shows "Online requests are opening soon. Your message was not sent yet." [DRAFT]. Nothing typed is lost (with or without JavaScript). Errors use `aria-invalid` + `aria-describedby`; the result gets focus.
- Tests (headless Edge, production build): valid → opening-soon notice; < 3 s → same; honeypot → same; phone "123" → field error + focus on phone; JavaScript off: bad phone → server field error with values kept, valid → opening-soon notice.
- Checks: lint, build, CSS check pass.
- Files: `src/app/contact/{page.tsx,page.module.css,actions.ts}`, `src/components/forms/ContactForm.{tsx,module.css}`, `src/lib/{validate,leads}.ts`, `src/content/pages.ts`, docs 03, 06, PROGRESS.
- For the server chat (later): Nginx must pass `X-Forwarded-For` to the app so the rate limit sees real visitor IPs.

### 2026-11-19 — T2.7 FAQ page
- `/faq`: hero (headline + intro [DRAFT, new], added to 03-CONTENT), `FaqList` accordion (native `<details>`, icon rotates via transform, works without JS), closing CTA. Only answered questions render; FAQ JSON-LD only for confirmed answers (none yet, so none output).
- Checks: lint, build, CSS check pass.
- Files: `src/app/faq/page.tsx`, `src/components/faq/FaqList.{tsx,module.css}`, `src/content/{faq,pages}.ts`, docs 03, 06, PROGRESS.

### 2026-11-19 — T2.6 About page
- `/about`: story hero, values (`Values` section, new heading [DRAFT, new] "What we stand for" added to 03-CONTENT), process with the GSAP step sequence (detail lines), closing CTA. Founder block not rendered until the client sends it.
- Checks: lint, build, CSS check pass; desktop process animation ends with all steps visible; mobile and reduced motion static.
- Files: `src/app/about/page.tsx`, `src/components/sections/Values.{tsx,module.css}`, `src/content/pages.ts`, docs 03, 06, PROGRESS.

### 2026-11-19 — Bundle check (report only), curtain 600 ms, standing rule
- CLAUDE.md: new rule, ask before worktrees, junctions/symlinks, `git stash` or deleting/reinstalling `node_modules`.
- Curtain shortened: cover 260 ms + leave 340 ms = 600 ms of animation (the panel stays up only if the next page takes longer to arrive).
- Bundle check with the built-in analyzer (`next analyze -o`, then `next analyze export --route /`; nothing installed). **No reductions applied yet; proposals below for the user's OK.**

**What "183 KB" really is.** The earlier figure counted every `<script>` in the HTML, including `polyfill-nomodule` (38.5 KB gz), which only browsers without ES modules download. Modern browsers (all of our targets) load **≈ 145 KB gz** on every route (Home 144.7, /services 144.1, /projects 144.1, project page 144.7, 404 143.6). Routes differ by < 1.5 KB, so the cost is all shared.

**Biggest client modules, Home first load (gzip):**

| Module | KB gz | Can we cut it? |
| --- | --- | --- |
| `react-dom` (client) | 64.0 | No: required for hydration |
| Next.js App Router runtime (segment cache, router reducer, app-router, layout-router, RSC client `react-server-dom-turbopack`, Turbopack runtime) | ≈ 68 | No: framework core |
| `react` + `scheduler` | 8.6 | No |
| `next/image` + `next/link` client code | 6.7 | Only by dropping next/image (not worth it: we would lose responsive srcset/AVIF) |
| **Our own client components, all together** | **≈ 6.5** | Partly, see below |
| GSAP + ScrollTrigger + SplitText | 48 (lazy) | Already out of first load; ≥ 768 px and only on pages that use it |

**Our own client code in first load (gzip):** MobileMenu 1.05 · Header 0.79 · `content/site.ts` pulled into the client by Header/MobileMenu 0.46 · Reveal 0.45 · MotionEngine 0.42 · Curtain 0.40 · ProcessAnimator 0.39 · MarqueeStrip 0.36 · Button 0.29 · TransitionLink 0.28 · Wordmark 0.26 · template 0.17 · useMediaQuery 0.16 · Container 0.15 · HydratedFlag 0.14 · navUtils 0.12 · CSS-module class maps ≈ 0.7.

**Proposed reductions (need your OK; total ≈ 3–4 KB gz, about 2–3%):**
1. Lazy-load `MobileMenu` on first open of the menu button (`import()`), ≈ 1.2 KB. Small first-tap delay (preload on pointerdown/focus).
2. Pass only `nav` / `cta` from the server layout to Header as props instead of importing `content/site.ts` into the client, ≈ 0.4 KB.
3. Make `Wordmark`, `Container` and `Button` server-only where possible: Header imports them, which pulls them into the client; render the brand and CTA in the server layout and pass them to Header as `children`/slots, ≈ 0.6 KB.
4. Load `ProcessAnimator` only on pages that use it (currently in the shared client graph via the About-only `animated` option), ≈ 0.4 KB.
5. Merge `HydratedFlag` into `MotionEngine` (one component), ≈ 0.1 KB.
6. Optional: drop the curtain (`Curtain` + `TransitionLink`, ≈ 0.7 KB). Not recommended for size alone.

Not worth doing: removing React/Next runtime (impossible without leaving Next.js), replacing `next/image`, or turning Reveal into an inline script (saves < 0.5 KB, loses the shared observer).

**Recommendation:** the real number (≈ 145 KB) is normal for a Next.js App Router site; ≈ 138 KB is the floor here. Apply 1–4 if you want the last few KB; Lighthouse TBT on this machine is dominated by React hydration, not by our code.

### 2026-11-18 — Modern shapes and site-wide motion
- Docs first: 02-TECH-SPEC Animation policy rewritten (what may animate, guards, CSS vs GSAP, breakpoints, budget); 04-DESIGN Shape (22 px, organic, arch-top), components (card hover, glass labels, marquee) and a Motion table.
- Shapes: `--radius-lg` 22 px, `--radius-card` 24 px, `--radius-organic`; `ImageFrame` gets `shape` (organic / arch, border-radius only), `mask` and `labels`. Arch on Why us and the first service-page photo; organic on the page-hero and For investors photos.
- Cards: white project cards with inset image, glass city/type labels (`GlassLabel`, `-webkit-backdrop-filter` + solid fallback in `@supports`), round arrow button. Hover (`@media (hover: hover)`) on cards and bento tiles: lift 6 px, shadow layer fades in, image 1.05 over 700 ms, arrow circle slides right.
- Motion: hero words rise one by one (CSS, ≥ 768 px), hero photo scale-in + desktop parallax; section h2 word reveal (SplitText, ≥ 768 px, reverted after playing); feature-image mask-wipe (clip-path with prefix, ≥ 768 px, fade fallback); card grids stagger (existing Reveal); services marquee on Home (CSS); Alba gallery pinned horizontal scroll ≥ 1024 px; page enter transition (`app/template.tsx`, client navigations only); blue curtain link transition (`TransitionLink` via Link `onNavigate`, `Curtain`).
- Checks: lint, build, CSS check pass. Reduced motion: no GSAP download, marquee static, all content visible. Phones: GSAP not downloaded. Curtain test (headless Edge): Ctrl-click and middle-click open a new tab with no curtain; back/forward show no curtain; the route is prefetched; focus and scroll after navigation match a plain link.
- First Load JS (gzip, all scripts in the HTML): Home 182.7 → 183.7 KB; /services and service pages 182.3 → 183.3; /projects 182.3 → 183.3; project pages 183.0 → 183.9; 404 181.8 → 182.8. GSAP + ScrollTrigger + SplitText are one on-demand chunk (44 KB gzip), loaded only on pages with targets at ≥ 768 px.
- Lighthouse mobile, Home (this machine is slow: benchmark index 560–720, results vary a lot run to run): before 64 / 83; after 97 / 74 / 86 (LCP 1.0–3.3 s, TBT 160–750 ms, CLS 0.045 as before). Not reliably ≥ 90 here, before or after; **please confirm on a faster machine or PageSpeed Insights after deploy.**
- Screenshots: `screenshots/after/home-1440.png`, `home-375.png`, `services-1440.png`, `projects-1440.png`.
- Files: `src/styles/globals.css`, `src/app/{layout,template}.tsx`, `src/app/template.module.css`, `src/app/page.tsx`, `src/components/motion/{Reveal,MotionEngine,scrollMotion,Curtain,TransitionLink}*`, `src/components/ui/{Card,ImageFrame,GlassLabel,Heading,Button}*`, `src/components/sections/{Hero,Marquee,MarqueeStrip,ServiceBento,InvestorBand,WhyUs,ServiceDetail,PageHero,FeaturedProjects}*`, `src/components/project/ProjectGallery*`, `src/components/layout/{Header,MobileMenu,Footer}.tsx`, `src/content/pages.ts`, `src/lib/{projectCards,investorBand}.ts`, docs 02, 03, 04, 06, PROGRESS.

### 2026-11-18 — Blue palette, slider everywhere, stock photos
- Colours (04-DESIGN tokens + contrast table first): navy/blue tokens in `globals.css`; `--color-stone` → `--color-mist` and Section tone `stone` → `mist` everywhere; new `--color-accent-soft`, `--color-on-ink`, `--color-on-ink-muted`, `--color-on-image`; every warm literal (brass, `#ece7e0`, `#d9d3cb`, `rgba(30,28,26,…)`, header/footer tints, theme colour) replaced with navy equivalents. Primary button = accent blue + white (5.28:1), on navy = accent-light + ink (9.36:1); links and eyebrows in accent (5.04 on paper, 4.71 on mist). All pairs pass AA.
- Slider: project pages render `BeforeAfter` (drag line, Before left, After right) on all sizes; `ScrollStory`, `PinnedStory` (+css) and `SCROLL_MOTION_QUERY` deleted. GSAP remains only in `ProcessMotion`. No pair exists yet, so no slider shows (expected).
- Stock photos (Unsplash only, each looked at before use; landscape, 2400 px wide, JPG q80): `hero-home`, `service-interior`, `service-exterior`, `service-flipping`, `process-plans`, `cta-band` in `public/images/stock/`; sizes and alt text in `src/content/images.ts`; `public/images/CREDITS.md` created. One candidate interior photo was rejected (decor letters and appliance branding). Notes: `process-plans` shows handwritten plan notes on the blueprint and `service-flipping` a small taped paper label; neither is readable as copy.
- Image check (production build, headless Edge): hero headline and text readable on the navy overlay; bento tile gradient strengthened to at least 0.6 navy wherever text sits (white text ≥ 4.5:1 even over a white patch of photo), which fixed weak contrast on the Exterior tile; service-page 4:5 crops keep the house/kitchen centred; CTA band overlay 0.72.
- Checks: lint, build, CSS check pass. Screenshots retaken: `screenshots/after/home-1440.png`, `home-375.png`, `services-1440.png`.
- Files: `src/styles/globals.css`, `src/app/layout.tsx`, `src/app/projects/[slug]/page.tsx`, most `*.module.css` under `src/components`, `Section.tsx` (tone), `src/content/images.ts`, `src/lib/useMediaQuery.ts`, deleted `src/components/project/{ScrollStory,PinnedStory}*`, `public/images/stock/*.jpg`, `public/images/CREDITS.md`, docs 02, 04, 05, 06, PROGRESS.

### 2026-11-18 — Investors band photo, cleanup
- Done: the "For investors" band (Home + compact block on /services) uses the Alba kitchen photo (`gallery-1.jpg`) instead of the cover, so the front photo is not repeated on Home. A photo capped at its natural width now stays on the band's left edge (aligned with the container). Unused laundry photo `21109811_15_0.jpg` deleted (it was never committed). Alba photo permission marked settled in Decisions.
- Stock photos: none in `public/images/stock/` yet and no `public/images/CREDITS.md`, so the stock-slot crop/contrast check is still to do; hero, bento tiles, Why-us and CTA keep their no-photo look.
- Checks: lint, build, CSS check pass. Headless Edge: band photo loads, left edge 100 px = container edge at 1440. After screenshots retaken (`screenshots/after/`: home-1440, home-375, services-1440).
- Files: `src/lib/investorBand.ts`, `src/components/sections/InvestorBand.module.css`, docs 03, 04, 05, PROGRESS.

### 2026-11-18 — Modern refresh + remodeling first (client feedback, between T2.5 and T2.6)
- Design (docs/04-DESIGN.md updated first): headings in Plus Jakarta Sans 600/700 (h1 700), tighter tracking (h1 -0.035em, h2 -0.025em, h3 -0.015em), bigger display size (`--fs-display` up to 6rem, line-height 1.02); `--font-serif*` renamed `--font-heading*`. Section padding 80/144px. `--radius-lg` 12px on every image frame (ImageFrame, slider, pinned story), `--radius` 8px on buttons. Buttons 600 weight, `large` size (52px) in the hero, header CTA now a filled button. Header after scroll: frosted glass (`rgba(250,248,245,.78)` + `saturate(1.6) blur(18px)`, `-webkit-` prefixed, inside `@supports`; solid paper otherwise). Hero: bigger left-aligned headline, more space.
- Remodeling first: nav Remodeling (`/services`) · Home Flipping (`/services/home-flipping`) · Projects · About · FAQ; `isActive` now picks the most specific matching link. New `ServiceBento` (Interior 7×2 feature tile, Exterior 5-column tile, light "What we remodel" chip tile; tablet 2 columns, mobile stacked; ink tile while a photo is missing) replaces `ServiceCards` (deleted). New `InvestorBand` (dark band on Home between Recent work and the process; compact light block at the end of `/services`) with the Alba cover photo labelled "Alba, TX · Home flipping", flipping headline + line from services.ts. Featured projects already Carrollton first. New copy (all [DRAFT]): eyebrow "Remodeling", heading "Remodeling, inside and out.", eyebrow "For investors", link "Explore home flipping" (03-CONTENT.md updated).
- Checks: lint, build and CSS check pass (342 rules; no `:has()`, container queries, nesting, `@layer`, oklch/lab or subgrid). Headless Edge: frosted header computed on `/`, `/services`, a service page, `/projects`; active nav = Remodeling on `/services` and interior, Home Flipping only on its page; no horizontal overflow at 375px on `/`, `/services`, `/services/home-flipping`, `/projects/alba-home-flip`. Palette unchanged, so token contrast stays AA; new text colours (#ece7e0 on dark tiles, #b9b1a7 on ink) are above 4.5:1.
- Screenshots (gitignored `/screenshots/`): before/ and after/ `home-1440.png`, `home-375.png`, plus after/`services-1440.png`.
- Files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/services/page.tsx`, `src/styles/globals.css`, `src/components/sections/{ServiceBento,InvestorBand}.*` (new), `ServiceCards.*` (deleted), `Hero.*`, `src/components/ui/{Button,Heading,ImageFrame}.*`, `Wordmark.tsx`, `src/components/layout/{Header,MobileMenu,navUtils}.*`, `src/components/project/{BeforeAfter,PinnedStory}.module.css`, `src/content/{site,pages}.ts`, `src/lib/{serviceCards,investorBand}.ts`, `.gitignore`, docs 02, 03, 04, 05.

### 2026-11-18 — T2.5 GSAP scroll stories
- Done: installed `gsap` 3.15.1 and `@gsap/react` 2.1.2 (pre-approved, pinned exactly; license in Decisions). `lib/useMediaQuery.ts` (`useSyncExternalStore` + `matchMedia`, false on the server; `SCROLL_MOTION_QUERY` = ≥ 900 px and no reduced motion).
  - `project/ScrollStory` replaces the slider on project pages. Desktop with motion: it `import()`s `project/PinnedStory` (own chunk with GSAP + ScrollTrigger), which pins below the fixed header for one viewport of scroll and scrubs `--position` 100% → 0% (before photo wipes away, white divider), while the step caption cross-fades "Before" → "After". `useGSAP` + `gsap.matchMedia()` clean up on unmount or when the query stops matching. Frame capped at the photos' natural size and to fit the viewport height. Mobile, reduced motion, or before the chunk loads: the plain slider (no-JS: side by side). The pair wrapper no longer uses `Reveal` (a transform on an ancestor breaks pinning).
  - `ProcessSteps` gets `animated` (for About, T2.6): `motion/ProcessAnimator` renders the list as normal and, when motion is allowed, `import()`s `motion/ProcessMotion` (renders nothing) which, once the list is 80% into view, fades each step up in turn and draws its connecting line via the `--line` custom property (scaleY on mobile, scaleX on desktop). Plays once. Home keeps the CSS reveal.
- Checks (production build, headless Edge, temporary pair + dev page, both removed): desktop 1440×900 — pinned at top 88 px through the whole range, `--position` 100/75/50/25/0% at 0/¼/½/¾/1 viewport, caption switches mid-way, unpins after, no errors, no overflow. Reduced motion and 375 px — slider, no pin spacer, GSAP chunk never downloaded. Process — steps and lines animate in on desktop and mobile; with reduced motion nothing is hidden. GSAP code not loaded on `/`, `/services`, `/services/home-flipping`, `/projects`, `/projects/alba-home-flip` (checked by fetching every loaded script). Lint + build pass.
- Files: `package.json`, `package-lock.json`, `src/lib/useMediaQuery.ts`, `src/components/project/{ScrollStory,PinnedStory}.*`, `src/components/motion/{ProcessAnimator,ProcessMotion}.tsx`, `src/components/sections/ProcessSteps.*`, `src/app/projects/[slug]/page.tsx`, docs.
- Notes: no project has a before/after pair yet (Alba has no "before" photos; Carrollton has no photos), so the pinned story is not visible on any live page until a pair is added. FAQ/Contact bundle check repeats when those pages exist (T2.7/T2.8).

### 2026-11-18 — Alba project photos (content update, between T2.4 and T2.5)
- Done: client photos wired into `/projects/alba-home-flip`. The client files had listing-style names (`21109811_*.jpg`, `genMid.21109811_*.jpg`) and were renamed to `after-1.jpg` (front exterior, cover + card) and `gallery-1` … `gallery-11` by what each shows. No "before" photos, so no slider. Descriptive alt text per photo. "The work" added as [DRAFT]. `ImageFrame` now caps each photo's frame at the widest size where `object-fit: cover` stays at or below natural size (`min(width, height ÷ frame ratio)`), via a wrapper so the padding-ratio box keeps working; gallery `sizes` tightened.
- Checks: headless Edge at 1440, 1024, 800 and 375 px: 12 images, none scaled above 1.0 (the 800 px hero hits the cap at exactly 1.0), no horizontal overflow, no slider. Lint + build pass.
- Not used: `21109811_15_0.jpg` (laundry room) was in the folder but not in the list; left uncommitted pending the user's call.
- Files: `src/content/projects.ts`, `src/components/ui/ImageFrame.*`, `src/components/project/ProjectGallery.tsx`, `public/images/projects/alba-home-flip/*`, docs 03, 05, PROGRESS.

### 2026-11-18 — T2.4 Projects index + project pages
- Done: `/projects` (PageHero + FeaturedProjects cards, card titles as h2 when no section heading) and `/projects/[slug]` (`generateStaticParams`, `dynamicParams = false`). Project page: PageHero (eyebrow "City · Type", "In progress" badge when set, card image if the file exists), facts list (city, type, status only when known — never an address), story blocks (goal, starting point, the work, result; each only if it has content), before/after section only for pairs where both photos exist (one slider each), gallery of existing images with captions (heading "Design rendering" while in progress), closing CTA. New components `project/ProjectSections` and `project/ProjectGallery`; global utilities `.section-heading` and `.stack-item`.
- Checks: with temporary test data and generated images (both reverted), headless Edge showed h1, The work, Before and after, Design rendering, badge, status fact, slider and caption on Carrollton; Alba shows only The result; no horizontal overflow at 375px; no street-address patterns; unknown slug → 404. Lint + build pass.
- Files: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/components/project/ProjectSections.*`, `src/components/project/ProjectGallery.*`, `src/styles/globals.css`, docs.
- User action needed: review checklist (services, projects, slider). Project pages stay mostly empty until the client sends photos and project facts.

### 2026-11-18 — T2.3 Before/after slider
- Done: `components/project/BeforeAfter.tsx` (client). A 16:10 padding-ratio frame: the after image underneath, the before image on top clipped with `clip-path: inset(0 calc(100% - var(--position)) 0 0)` (with `-webkit-` prefix), "Before"/"After" chips, a white divider with a round 48px handle and chevrons. An invisible native `<input type="range">` covers the image (z-index above), with `aria-label` and `aria-valuetext` ("20% before, 80% after"); `touch-action: pan-y` keeps vertical page scrolling on touch; 48px thumb hit area; the focus ring shows on the handle (`:focus-visible ~ .divider .handle`). The server render and the no-JS view are two captioned figures side by side (stacked on mobile); `useSyncExternalStore` switches to the slider after hydration without a mismatch. Labels from `pages.ts → beforeAfter`.
- Checks: temporary dev page with generated test images (deleted). The server HTML is the fallback. In headless Edge (the in-app preview pane was hidden, which stalls React) the slider replaces the fallback after hydration with no console errors: a mouse click at 75% → 76, a drag to 30% → 29, 5× ArrowRight → 34, End → 100, the clip path and divider follow, the focus ring shows. Lint + build pass.
- Not verified: iOS Safari touch dragging (in the review checklist and T3.7).
- Files: src/components/project/BeforeAfter.tsx, BeforeAfter.module.css

### 2026-11-18 — T2.2 Services index + 3 service pages
- Context: the user's message after the Home review still had template text for the image list, header test and Home review. No images or `public/images/CREDITS.md` exist in the repo, so there was nothing to fix; continued as instructed.
- Done:
  - `/services`: PageHero (h1 + intro), cards (card titles are h2 under the page h1), closing CTA.
  - `/services/[slug]`: `generateStaticParams` + `dynamicParams = false`; `generateMetadata` from `seo.ts`. Sections: PageHero 7/5 with the service image slot, the "What we remodel / build / How it works" list (numbered for Home Flipping) beside the detail image slots (interior: bath + living, exterior: patio, flipping: staged), "Who it's for", the featured project card (exterior → Carrollton, flipping → Alba), and the service CTA band.
  - New: `PageHero`, `ServiceDetail`; `lib/serviceCards.ts` and `lib/projectCards.ts` (shared card data); `ServiceCards`/`FeaturedProjects` take an optional heading and render nothing with no items. Labels added to `pages.ts` (`servicePage`, `projectPage`, `beforeAfter`) and stock slots to `images.ts`.
- Checks: lint, build and CSS check pass. Built pages have the right `<title>` and canonical. With `next start`, `/services/nope` → 404 and `/services/interior-remodeling` → 200. The flipping page has no profit/ROI claims ("positioned to sell" only).
- Files: src/app/services/page.tsx, src/app/services/[slug]/page.tsx, src/components/sections/{PageHero,ServiceDetail}.tsx + css, ServiceCards.tsx, FeaturedProjects.tsx, src/lib/{serviceCards,projectCards}.ts, src/content/{images,pages}.ts, src/app/page.tsx

### 2026-11-18 — T2.1 Home page
- Done: Home built from content (no hard-coded copy), with six section components in `src/components/sections/`:
  - `Hero`: full height (100vh with a 100svh override, min 560px, max 1000px), transparent header over it (`overlayRoutes: ["/"]`), dark overlay + gradient, CSS-only headline/sub/button entrance (no JS needed), 12 s Ken Burns zoom 1 → 1.06, image `priority` + `sizes="100vw"`.
  - `ServiceCards`: eyebrow + h2 + three 4:5 cards.
  - `WhyUs`: stone band, 2×2 promises with an accent rule, image 7/5 split on desktop.
  - `FeaturedProjects`: two 3:2 cards with "City · Type" meta; company photos only.
  - `ProcessSteps`: static 01–04 serif numerals with a thin line, vertical on mobile and horizontal on desktop.
  - `CtaBand`: ink band, darkened decorative photo with `alt=""`, centred heading and accent button.
  - All sections below the hero use `Reveal` (single or group stagger).
- Images: `src/content/images.ts` lists the stock slots (05-IMAGES names and alt text). `src/lib/images.ts → available()` checks at build time that the file exists in `public/`; a missing photo means no `<img>` at all, just a neutral panel (or an ink background for the hero and CTA). Project card copy for Home was added to `pages.ts` (`home.featured.items`).
- Checks: one h1 and a logical h2/h3 order; transparent header and no spacer on `/`; 10 reveal targets, no inline opacity in the built HTML, so it is fully visible without JS. Temporary generated test images (deleted afterwards) confirmed the photo path: the hero `<img>` isn't lazy and is preloaded; the card image is lazy with `sizes`; the CTA image has `alt=""`; the optimizer returns AVIF. Lint, build and the CSS check pass.
- Not verified here: visual layout and the scroll reveal/header colour change. The preview pane was hidden (0×0 viewport, no rendering) → part of the user's review checklist.
- Files: src/app/page.tsx, src/components/sections/{Hero,ServiceCards,WhyUs,FeaturedProjects,ProcessSteps,CtaBand}.tsx + .module.css, src/content/{images,pages,site}.ts, src/lib/images.ts
- User action needed: review Home on desktop and mobile (checklist in chat). Add stock images when ready (see "Missing images").

### 2026-11-18 — T1.6 Root layout and metadata base
- Done: `layout.tsx` renders HydratedFlag, SkipLink, Header, `<main id="main" tabIndex={-1}>` and Footer; pages now return only their sections. Base metadata: `metadataBase` from `site.url`, the home SEO title/description as defaults, `title.template: "%s"` (SEO titles are already complete), Open Graph site name/locale, `robots` from `SITE_INDEXABLE`, viewport `themeColor`. `src/lib/seo.ts` has `isIndexable`, `robotsMeta` and `pageMetadata(page, path)` (absolute title, description, canonical, OG, Twitter; pattern adapted from Solum). Home uses `pageMetadata(seo.home, "/")`. Programmatic focus targets (`tabindex="-1"`) show no outline.
- Checks: built `index.html` without the env var has `noindex, nofollow`, the canonical and og:url `https://signatureremodelings.com` and the right `<title>`. With `SITE_INDEXABLE=true` it has `index, follow`. Lint + build pass.
- Files: src/app/layout.tsx, src/app/page.tsx, src/lib/seo.ts, src/styles/globals.css
- Notes: `SITE_INDEXABLE` and `NEXT_PUBLIC_SITE_URL` are read at build time, so staging and production need their own builds (see "For the server chat").

### 2026-11-18 — T1.5 Reveal animation
- Done: `components/motion/Reveal.tsx` (client) uses one shared IntersectionObserver (threshold 0, bottom margin −12%, so tall blocks still trigger) and sets `data-revealed` once, then stops observing. Without IO it reveals at once. `group` mode staggers direct children 80 ms apart through CSS `nth-child` delays. Optional `delay`, `as` and `role` props. `HydratedFlag.tsx` sets `html[data-hydrated]`, which turns off the 3 s CSS failsafe; it's rendered in the root layout. globals.css reveal rules updated for groups and reduced motion.
- Checks: lint + build pass. No content is hidden unless `html.js` is set, and the inline script sets it only when IO exists, so no-JS and old browsers see everything. Browser behaviour is checked on the Home page in T2.1, the first page that uses Reveal.
- Files: src/components/motion/{Reveal,HydratedFlag}.tsx, src/styles/globals.css, src/app/layout.tsx

### 2026-11-18 — T1.4 Footer
- Done: `Footer` (server component, ink background). Wordmark + one-line description; columns Services (3 links from `services.ts`), Company (`site.companyLinks`), and Contact (phone/email/address/hours/service-area line, only those that exist; the column is hidden if none do). Bottom row: `© {build year} {legalName ?? name}`, plus Privacy Policy only when `site.hasPrivacyPolicy`. Wired into `layout.tsx`.
- Checks: footer text on ink is 9.6:1 and links 13.3:1; built HTML shows no empty labels; lint + build pass.
- Files: src/components/layout/Footer.tsx, Footer.module.css, src/app/layout.tsx
- Notes: the © year is set at build time (static site), so it updates on the next deploy.

### 2026-11-18 — T1.3 follow-up
- Done: user ran the header checklist and reported no specific problems (the results line in the message was left as the template text). Removed `src/app/dev-header/**` and the dev-only overlay route in `site.ts`. Added `pages.ts` and `types.ts` to the folder structure in 02-TECH-SPEC.
- Files: src/app/dev-header/** (deleted), src/content/site.ts, docs/02-TECH-SPEC.md

### 2026-11-18 — T1.3 Header and mobile menu
- Done: `SkipLink` (first focusable element; visible on focus). `Header` (client): always `position: fixed` with a constant height, plus a spacer on solid routes, so nothing shifts on scroll. Routes in `site.overlayRoutes` start transparent (white text over a soft dark shade) and turn solid after 8px of scroll (rAF-throttled passive listener); the solid header gains a bottom border once scrolled. Desktop nav ≥ 900px with an underline on hover and `aria-current="page"` (also for sub-pages). `MobileMenu` (< 900px): full-screen `role="dialog"` with `aria-modal`, its own close button, focus trap, Esc to close, focus back to the menu button, body-pinning scroll lock (works on iOS 15) with scroll restore. It closes on navigation (state is tied to the path it was opened on), on a same-page link click, and when the viewport reaches 900px. Header + SkipLink are wired into `layout.tsx` now so they can be tested; the rest of the layout is T1.6.
- Checks (dev, 375px, script-driven): menu opens with focus on "Close menu"; Tab from the last item wraps to the first, Shift+Tab from the first wraps to the last; Esc closes, focus returns to the menu button, the scroll position (600px) is restored and the body styles are cleared; tapping "Projects" navigates, closes the menu and lands at the top with Projects marked current; no horizontal overflow; the skip link is the first focusable element. Scroll-driven colour changes could not be checked because the preview pane was hidden (no animation frames) → part of the user's test. Lint + build pass; the dev test pages build as 404 in production.
- Files: src/components/layout/{SkipLink,Header,MobileMenu}.tsx + .module.css, src/components/layout/navUtils.ts, src/content/site.ts (`overlayRoutes`), src/app/layout.tsx, TEMPORARY src/app/dev-header/**
- Notes: without JavaScript the mobile menu button does nothing. All pages stay reachable through the footer links (T1.4).
- User action needed: run the header test checklist (in chat).

### 2026-11-18 — T1.2 UI primitives
- Done: `Container` (with a narrow variant), `Section` (paper/stone/ink tones; ink recolours headings and links), `Eyebrow` (accent line), `Heading` (semantic level separate from visual size), `Button` (`next/link` for internal hrefs, `<a>` for tel:/mailto:, `<button>` otherwise; primary/secondary × light/dark; 48px), `Card` (title link stretched over the card, so each card has one link; image zooms on hover), `ImageFrame` (padding-top ratio box, so no `aspect-ratio` needed; `next/image fill` with required `sizes`; a missing image shows an empty decorative stone panel, `aria-hidden`, no text; optional caption), `Wordmark` (text mark from `site.name`, swaps to `site.logo` when set).
- Checks: temporary `/dev-ui` page in dev. Buttons 48px with the right colours on light and dark, card frame 4:5, eyebrow line, wordmark "SIGNATURE / Remodelings", ink links in accent-light, no horizontal overflow. Page deleted. Lint + build pass.
- Files: src/components/ui/{Container,Section,Eyebrow,Heading,Button,Card,ImageFrame,Wordmark}.tsx + .module.css

### 2026-11-18 — T1.1 Content layer
- Done: typed content in `src/content/`: `site.ts` (brand, nav, CTA, footer links, contact fields all `undefined`, `hasPrivacyPolicy: false`, URL from `NEXT_PUBLIC_SITE_URL`), `services.ts`, `projects.ts` (city only; gallery/pairs empty until photos arrive), `faq.ts` (NEEDS CLIENT questions have no answer; `visibleFaqs()` returns only answered ones), `seo.ts`. Also `types.ts` (shared types) and `pages.ts` (Home, services/projects index, About, Contact, 404 copy and the shared closing CTA) — the spec lists no file for page copy, so I added this one.
- Checks: `tsc` OK; `grep -rniI "tbd|lorem|xxx|placeholder" src` clean; every SEO title ≤ 60 and description ≤ 160 characters; lint + build pass.
- Files: src/content/{types,site,services,projects,faq,seo,pages}.ts

### 2026-11-18 — T0.5 Git init and first commit
- Done: `git init -b main`; `.gitattributes` `* text=auto eol=lf` (same as Solum); `.gitignore` ignores `.claude/settings.local.json` (`.claude/launch.json` is committed); removed the redundant `src/styles/.gitkeep`. First commit made with the user's git identity; message checked clean. Strict git rules added to CLAUDE.md (no push/remotes, no tool mentions or co-author lines in messages, never override the author, verify each message). CLAUDE.md, AGENTS.md, `.claude/launch.json` and `docs/` stay in git (private repo; docs are the project record).
- Files: .gitattributes, .gitignore, all files from T0.2–T0.4, docs
- User action needed: add the remote and push when ready.

### 2026-11-18 — T0.4 Folder structure, tokens, fonts
- Done: spec folder tree under `src/` and `public/images/{stock,projects,brand}` (`.gitkeep` in empty folders). `src/styles/globals.css` (moved from `src/app/`) holds the colour/type/spacing/layout tokens, reset, base typography, `:focus-visible` ring, `.visually-hidden`, the reveal start state guarded by `html.js` plus a failsafe, and reduced-motion rules. Fonts via `next/font/google`. An inline script in `layout.tsx` sets `html.js`.
- Checks: a temporary `/dev-type` page showed Cormorant Garamond 600 headings in ink, Inter 17px body in ink-soft on paper, links in accent-dark, and `html.js` set. Page deleted. Lint clean, build passes, CSS check passes (36 rules).
- Files: src/styles/globals.css, src/app/layout.tsx, src/app/globals.css (deleted), folder `.gitkeep`s, .claude/launch.json (dev preview on 3003)
- Notes: after deleting a page while `next dev` ran, the build failed on stale `.next/dev/types`. Fix: delete `.next/dev`.
- User action needed: none. Please glance at the two colour changes under Decisions.

### 2026-11-18 — T0.3 Project config
- Done: `next.config.ts` with `output: 'standalone'`, `poweredByHeader: false`, `cacheComponents: false` (partialPrefetching removed, see Decisions), images (AVIF/WebP, `dangerouslyAllowSVG: false`, local only), security `headers()` on every route: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `Permissions-Policy`. No full CSP (inline Next scripts would need a nonce, which makes every page dynamic). `.env.example` per spec; `.gitignore` keeps `.env*` out but allows `.env.example`. `.browserslistrc` copied from Solum with a note that it is below Next 16's official target. `scripts/check-built-css.mjs` adapted from Solum for plain CSS (Tailwind-specific bits removed; container-query rule added), run after `next build`. `AGENTS.md` gained a "Project rules" line pointing to CLAUDE.md.
- Checks: lint clean; build passes; `next start -p 3204` returns all 5 headers and no `X-Powered-By`. Negative test: a `100svh` rule without fallback fails the check. Next's CSS compiler already adds hex fallbacks for `oklch()`/`lab()` from browserslist.
- Files: next.config.ts, .env.example, .gitignore, .browserslistrc, scripts/check-built-css.mjs, package.json, AGENTS.md
- Notes: with `output: 'standalone'`, `next start` prints a warning and recommends `node .next/standalone/server.js`. `npm start` still works locally; production runs `server.js` (see "For the server chat").
- User action needed: still open — VPS `node -v`, free ports, and the contact delivery decision (your last message had placeholders for these).

### 2026-11-18 — T0.2 Check versions and scaffold
- Done: version checks (next latest 16.4.6, published 9 Nov 2026; no security release after 3 Nov). Scaffolded with create-next-app 16.4.6 (TS, ESLint, App Router, `src/`, `@/*`, no Tailwind) in a temp sibling folder, moved in, temp deleted. Starter content and `public/*.svg` removed, Geist fonts removed. React bumped to 19.3.1. `engines.node ">=24 <25"`, `.nvmrc` 24, port scripts 3003/3104/3204.
- `npm audit`: production deps 0 vulnerabilities. Dev: 14 high, all lint tooling (`eslint-config-next` → typescript-eslint / fast-glob / tinyglobby → `picomatch` ReDoS GHSA-fc5q-39xc-vjpf). `npm audit fix --force` would downgrade eslint-config-next to 16.3.8, so not applied. Re-check in T5.3.
- Checks: `npm run lint` clean, `npm run build` passes (`/` static), `next dev -p 3003` returns 200.
- Files: package.json, package-lock.json, .nvmrc, .gitignore, AGENTS.md, eslint.config.mjs, next.config.ts, next-env.d.ts, tsconfig.json, src/app/{layout.tsx,page.tsx,globals.css,favicon.ico}
- Notes: no commit — the folder is not a git repo until T0.5. The local dev machine runs Node 24.11.1. The other HBS repos pin next 16.4.3, which is below the 16.4.5 security floor; tell their owners.
- User action needed: confirm the VPS `node -v` (24.x), that ports 3003/3104/3204 are free, and whether Nginx adds any security headers.

### 2026-11-18 — T0.1 Confirm start decisions
- Done: read `solum-constructions` and `quality-concrete-solution` (read-only); recorded the decisions above.
- Reuse candidates (to copy in their tasks, each listed before copying): `.browserslistrc` (T0.3); `scripts/check-built-css.mjs` adapted to plain CSS (T0.3); `HydratedFlag` + reveal failsafe CSS + `<noscript>` style idea (T0.4/T1.5, rewritten on IntersectionObserver — Solum's Reveal needs `motion`, not approved); robots/noindex + `pageMetadata` + JSON-LD helper pattern from `lib/seo.ts` (T1.6/T3.x); `rate-limit.ts` + `client-ip.ts` verbatim (T2.8); `sendFormEmails` / `parseMailFrom` from `mailer.ts` if SMTP + `nodemailer` is approved (T2.9). Not reusable: Solum forms use zod / react-hook-form (not approved), Tailwind preset.
- Files: docs/PROGRESS.md, docs/06-TASKS.md
