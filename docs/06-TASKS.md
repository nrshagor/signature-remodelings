# 06 — Tasks (work queue)

Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `BLOCKED: reason`

**How to pick the next task:** go top to bottom; take the first `[ ]` or `[~]` task that is not BLOCKED and whose "Needs" tasks are `[x]`. One task at a time. Follow the end-of-task steps in `CLAUDE.md`.

---

## Phase 0 — Setup

### [x] T0.1 Confirm start decisions
Result: decisions recorded in PROGRESS.md. Node 24, Solum browserslist, standalone, all security headers in next.config. VPS Node version and free ports still to verify.
Read: CLAUDE.md, 02-TECH-SPEC
Ask the user (one message, numbered):
1. Fresh scaffold, or copy shared code (components/styles/config) from `solum-constructions` / `quality-concrete-solution`? If copy: which files.
2. Node version on the VPS.
3. Browser support target + browserslist/polyfill approach used in the other repos.
4. Are ports 3003 / 3104 / 3204 free?
5. `output: 'standalone'` like the other repos, or not?
6. Does Nginx already set security headers?
Done when: answers recorded in PROGRESS.md → Decisions. (If the user can't answer one, use the default in 02-TECH-SPEC and note it.)

### [x] T0.2 Check versions and scaffold
Result: Next 16.4.6, React 19.3.1, TS 5.9.3, ESLint 9.39.5. Prod audit clean; 14 high dev-only (picomatch ReDoS via eslint-config-next). Blank page on 3003.
Needs: T0.1 · Read: 02-TECH-SPEC → Versions, Stack
- Run the version checks in 02-TECH-SPEC; check nextjs.org/blog for advisories after 3 Nov 2026.
- Scaffold Next.js (App Router, TS, ESLint, `src/`, alias `@/*`, **no Tailwind**) at the newest patched 16.x (≥ 16.4.5).
- The repo folder already holds `CLAUDE.md` and `docs/`, so `create-next-app` may refuse a non-empty folder. If it does, scaffold into a temporary sibling folder and move the generated files in (don't overwrite `CLAUDE.md` or `docs/`), then delete the temp folder.
- Remove starter content. Set `engines.node`.
- `npm audit` → report.
Done when: `npm run dev` serves a blank page on port 3003; exact versions in PROGRESS.md.

### [x] T0.3 Project config
Result: standalone, no cacheComponents, 5 security headers verified on `next start`, browserslist + post-build CSS check (negative-tested).
Needs: T0.2 · Read: 02-TECH-SPEC → Scripts, Env, Security, Images
- Scripts and ports; `.env.example`; `.gitignore` covers `.env*` except example.
- `next.config`: `poweredByHeader: false`, images (local only, `dangerouslyAllowSVG: false`, formats AVIF/WebP), security `headers()` (skip ones Nginx already sets), standalone per T0.1.
- Browser support setup per T0.1.
Done when: build passes; headers visible in `next start` response.

### [x] T0.4 Folder structure, tokens, fonts
Result: Cormorant Garamond 600 + Inter (variable); tokens in src/styles/globals.css; two colours adjusted for contrast (see PROGRESS Decisions).
Needs: T0.3 · Read: 02-TECH-SPEC → Folder structure, 04-DESIGN
- Create folders from the spec. `globals.css`: reset, color/type/spacing tokens, base typography, focus styles, reduced-motion rules, `.js` class guard for reveal.
- Fonts via `next/font/google` (one serif + one sans).
- Set `html.js` class with a tiny inline script in `layout.tsx`.
Done when: a test page shows headings/body in the right fonts and colors.

### [x] T0.5 Git init and first commit
Result: branch `main`, `.gitattributes` (LF, as in Solum), `.claude/settings.local.json` ignored, `launch.json` committed. No remote (the user adds it and pushes).
Needs: T0.4
Done when: clean `git status`, first commit made (no push).

## Phase 1 — Design system, layout, content layer

### [x] T1.1 Content layer
Result: site, services, projects, faq, seo + `types.ts` and `pages.ts` (page copy). Grep clean; SEO lengths within limits.
Needs: T0.4 · Read: 03-CONTENT, 02-TECH-SPEC → Content rules
- Types + data in `src/content/` (`site.ts`, `services.ts`, `projects.ts`, `faq.ts`, `seo.ts`) from 03-CONTENT.
- [NEEDS CLIENT] fields → optional, `undefined`. Add `status` where useful.
Done when: types compile; no placeholder strings anywhere (`grep -ri "tbd\|lorem\|xxx\|placeholder" src` is clean).

### [x] T1.2 UI primitives
Result: 8 primitives in `src/components/ui/`, checked on a temporary /dev-ui page (deleted).
Needs: T1.1 · Read: 04-DESIGN → Components
Container, Section, Eyebrow, Heading, Button (link + button variants), Card, ImageFrame (handles missing image gracefully), Wordmark.
Done when: a temporary `/dev-ui` page shows all primitives (delete the page at the end of the task or exclude it from build).

### [x] T1.3 Header and mobile menu
Result: fixed header (solid + transparent overlay), mobile dialog menu, skip link. User browser test done; temporary `/dev-header` test pages removed.
Needs: T1.2
Transparent-over-hero variant + solid variant; sticky; mobile full-screen menu with focus trap, Esc, scroll lock; skip link; active link state.
Done when: keyboard-only navigation works; no layout shift on scroll.

### [ ] T1.4 Footer
Needs: T1.2
Shows only fields that exist in `site.ts`. Privacy link only when the page exists.

### [ ] T1.5 Reveal animation
Needs: T0.4 · Read: 02-TECH-SPEC → Animation policy
`Reveal` client component (IntersectionObserver, once, stagger support). Content visible without JS and in browsers without IO.
Done when: works, and with JS disabled all content is visible.

### [ ] T1.6 Root layout and metadata base
Needs: T1.3, T1.4
`layout.tsx` with header, footer, `<main id="main">`, base metadata from `seo.ts`, `SITE_INDEXABLE` robots handling.

## Phase 2 — Pages

### [ ] T2.1 Home page
Needs: T1.6, T1.5 · Read: 03-CONTENT → Home, 04-DESIGN, 05-IMAGES
Sections 1–6 as specified. Hero image `priority`. Process section can be static here (GSAP version is on About).
Done when: matches content exactly; responsive at 360, 768, 1280, 1600 px.

### [ ] T2.2 Services index + 3 service pages
Needs: T2.1
`/services` and `/services/[slug]` with `generateStaticParams` and per-page metadata. Unknown slug → 404.

### [ ] T2.3 Before/after slider
Needs: T1.2 · Read: 02-TECH-SPEC → Before/after slider
Native range input based; keyboard, touch, mouse; no-JS fallback; labels.

### [ ] T2.4 Projects index + project pages
Needs: T2.3
`/projects` and `/projects/[slug]`. Sections: summary, goal (if any), the work, gallery, slider (only if before/after pairs exist), rendering with caption, CTA. Handle "in progress" status.

### [ ] T2.5 GSAP scroll stories
Needs: T2.4 · Read: 02-TECH-SPEC → Animation policy
Install `gsap` + `@gsap/react` (pre-approved; note license check in PROGRESS.md). `ScrollStory` on project pages (desktop only, pinned before → after) and process animation component. Dynamic import; `gsap.matchMedia()` for reduced motion and mobile.
Done when: GSAP is absent from the Home/Services/FAQ/Contact bundles (check build output); smooth on desktop; no pinning on mobile.

### [ ] T2.6 About page
Needs: T2.5
Copy + values + process with GSAP animation + CTA. Founder block hidden until data exists.

### [ ] T2.7 FAQ page
Needs: T1.6
`<details>` accordion; hide [NEEDS CLIENT] questions; FAQ JSON-LD only for confirmed answers (none yet → no schema).

### [ ] T2.8 Contact page and form (UI + validation)
Needs: T1.6 · Read: 03-CONTENT → Contact, 02-TECH-SPEC → Contact form
Form, client + server validation, honeypot, time check, rate limit, success/error states. `sendLead()` adapter interface with a not-configured branch that returns a clear server error and logs; the UI shows the error message from 03-CONTENT.
Done when: valid/invalid/spam submissions behave correctly in dev.

### [ ] T2.9 Contact delivery
BLOCKED: user decision — SMTP (`nodemailer`, needs approval) or email API via `fetch`; plus recipient email.
Implement the chosen adapter, env vars, plain-text + simple HTML email with escaped user input.

### [ ] T2.10 404 and error pages
Needs: T1.6
`not-found.tsx` with copy from 03-CONTENT; `error.tsx` with retry.

### [ ] T2.11 Privacy policy page
BLOCKED: company legal name + contact email.
Then: simple page per 03-CONTENT; add to footer and sitemap.

## Phase 3 — SEO, quality, browser support

### [ ] T3.1 Per-page metadata and OG
Needs: Phase 2 pages · Read: 03-CONTENT → SEO copy
Title/description/canonical/OG for every route; OG image.

### [ ] T3.2 sitemap.ts and robots.ts
Needs: T3.1
Sitemap of all public routes; robots respects `SITE_INDEXABLE`. Verify both `true` and `false`.

### [ ] T3.3 Structured data
Needs: T3.1
`HomeAndConstructionBusiness` JSON-LD with only confirmed fields; omit entirely if too little is confirmed. No ratings/reviews.

### [ ] T3.4 Images pass
Needs: Phase 2
Every `next/image` has `sizes` and real alt text; hero `priority`; missing-image fallback works; `public/images/CREDITS.md` exists.

### [ ] T3.5 Accessibility pass
Headings order, landmarks, focus states, color contrast, form labels/errors (`aria-describedby`), slider operable by keyboard, reduced motion respected.

### [ ] T3.6 Performance pass
`npm run build` route table: note First Load JS per route; remove unused code; check fonts subset. Target Lighthouse (mobile) ≥ 90 Performance, ≥ 95 Accessibility/Best Practices/SEO on `next start` locally. Report numbers.

### [ ] T3.7 Cross-browser test
Give the user a checklist to test: latest Chrome, Firefox, Safari (macOS + iOS), Edge, Samsung Internet, plus the older target from T0.1. Fix reported issues.

## Phase 4 — Client content (fill as it arrives)

### [ ] T4.1 Apply confirmed facts
BLOCKED: client answers (see PROGRESS.md → Open questions).
For each answer: update 03-CONTENT tag + `src/content/*`; unhide sections that now have data.

### [ ] T4.2 Project photos and drawing
BLOCKED: attachments from client.
Add files per 05-IMAGES; build pairs; update project copy.

### [ ] T4.3 Balcony rendering / video (optional)
BLOCKED: rendering made and approved by client.
Add with "Design rendering" caption; video muted autoplay loop playsinline with poster.

### [ ] T4.4 Logo and brand colors
BLOCKED: client logo.
Swap wordmark for SVG logo; adjust tokens if brand colors differ; regenerate favicon/OG.

## Phase 5 — Launch prep

### [ ] T5.1 README
Run/build commands, env vars, ports, content-editing guide (which file holds what). No server commands.

### [ ] T5.2 Draft content report
List every remaining [DRAFT] and [NEEDS CLIENT] item for the user to send to the client.

### [ ] T5.3 Final security check
Re-check nextjs.org/blog for new advisories; upgrade to newest patched 16.x if needed; `npm audit`; rebuild.

### [ ] T5.4 Handoff for the server chat
In PROGRESS.md → "For the server chat": build command, start command, port, env vars needed, Node version, when to flip `SITE_INDEXABLE=true`.
