# PROGRESS — Signature Remodelings

Claude Code updates this file at the end of every task. Newest log entry on top.

## Current status

- Phase: 0 — Setup
- Last completed task: T1.2 UI primitives
- **Next task: T1.3 Header and mobile menu**
- Site state: Next.js 16.4.6 configured; folder structure, tokens, fonts, `html.js` flag in place; blank home page; lint + build pass. Git repo on `main` (local only, never pushed by Claude Code).

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

## Missing images

(Claude Code lists image slots from 05-IMAGES.md that are still missing.)

## For the server chat

(Things the server needs — filled in T5.4 or whenever something comes up. Claude Code does not run server commands.)

**T5.4 checklist (verify at deploy time):**
- [ ] VPS `node -v` is 24.x. The repo is provisionally pinned to Node 24 (`.nvmrc`, `engines.node ">=24 <25"`).
- [ ] Ports 3003 (dev), 3104 (staging) and 3204 (production) are free on the VPS. These are provisional.
- [ ] Nginx adds none of the security headers the app sends (below).

**Notes:**
- `output: 'standalone'`: run `node .next/standalone/server.js` (with `PORT` / `HOSTNAME=127.0.0.1`), like the other HBS sites' PM2 config. Copy `.next/static` and `public/` into the standalone folder at deploy time.
- The app sends the security headers itself (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, CSP frame-ancestors, Permissions-Policy). Nginx must not add them again.

## Log

<!-- Template — copy for each entry, newest on top:
### YYYY-MM-DD — T#.# Task name
- Done:
- Files:
- Notes / decisions:
- User action needed:
-->

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
