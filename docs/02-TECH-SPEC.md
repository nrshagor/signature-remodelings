# 02 — Technical spec

## Versions (security first)

Research date: 18 Nov 2026. **Re-check before installing** — Next.js ships security releases often.

- **Next.js:** latest 16.4.x patch, and **never below 16.4.5**. 16.4.5 / 15.5.29 (3 Nov 2026) patched seven advisories, some affecting self-hosted `next start` and the image optimizer — both apply to this project. 16.2.x and 16.3.x got no backport.
- **React / React DOM:** the versions `next@16.4.x` lists as peer dependencies (install the latest matching patch).
- **Node.js:** must be `>= 20.9.0` (Next 16 requirement). Use the same Node version the HBS VPS already runs for the other client sites; ask the user which one. Add an `engines` field to `package.json`.
- **TypeScript:** whatever `create-next-app` installs for that Next version.

Before scaffolding (task T0.2) run and report:

```bash
npm view next dist-tags
npm view next@16.4 version
```

Then check https://nextjs.org/blog for any security release newer than 3 Nov 2026 and install the newest patched 16.x version. After install, run `npm audit` and report results. Record the exact versions in `PROGRESS.md` → Decisions.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js App Router, TypeScript, `src/` directory, import alias `@/*` |
| Styling | Plain CSS: `src/styles/globals.css` (tokens, reset, base) + CSS Modules per component. **No Tailwind.** |
| Fonts | `next/font/google` (self-hosted at build, no runtime Google requests) |
| Images | `next/image`, AVIF/WebP, local files in `public/images/` |
| Animation | CSS transitions/keyframes + `IntersectionObserver` for reveals; GSAP + ScrollTrigger + SplitText site-wide via dynamic import (see Animation policy) |
| Content | Typed TypeScript objects in `src/content/` (no CMS in v1) |
| Forms | Route handler `src/app/api/contact/route.ts` (server-side validation, honeypot, rate limit) |
| Rendering | Static (SSG) for all pages; only `/api/contact` is dynamic |
| Lint | ESLint config from `create-next-app` |

## Pre-approved dependencies

Only these may be added without asking:

- `next`, `react`, `react-dom`, and the dev dependencies `create-next-app` installs
- `gsap` and `@gsap/react` (GSAP is free for commercial use under Webflow's "Standard No Charge" license; check the license page once when installing and note it in PROGRESS.md)

Anything else (form libraries, validation libraries, email SDKs, icon packs, carousels, smooth-scroll libraries) → ask first. Prefer small hand-written code.

## Folder structure

```
src/
  app/
    layout.tsx              # fonts, header, footer, base metadata
    page.tsx                # Home
    services/page.tsx
    services/[slug]/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    about/page.tsx
    faq/page.tsx
    contact/page.tsx
    privacy-policy/page.tsx
    not-found.tsx
    error.tsx
    sitemap.ts
    robots.ts
    api/contact/route.ts
    opengraph-image.(png|jpg)   # static OG image
  components/
    layout/   Header, Footer, MobileMenu, SkipLink
    ui/       Button, Container, Section, Eyebrow, Heading, Card, ImageFrame
    sections/ Hero, ServiceBento, InvestorBand, WhyUs, FeaturedProjects, ProcessSteps, CtaBand, Faq
    project/  BeforeAfter, ProjectGallery, ProjectStory
    motion/   Reveal (IntersectionObserver), MotionEngine (GSAP, on demand), ProcessAnimator + ProcessMotion
    forms/    ContactForm
  content/
    site.ts       # brand, contact info, service area, nav, footer
    services.ts
    projects.ts
    faq.ts
    seo.ts
    pages.ts      # page copy: Home, services/projects index, About, Contact, 404, closing CTA
    types.ts      # shared content types (ImageAsset, NavLink, CallToAction, ContentStatus)
  lib/
    seo.ts        # metadata helpers, JSON-LD builders
    validate.ts   # contact form validation (hand-written)
    rateLimit.ts  # simple in-memory limiter
  styles/
    globals.css
public/
  images/
    stock/        # free stock images (see 05-IMAGES.md)
    projects/     # company's own photos only
    brand/        # logo, favicon sources
  images/CREDITS.md
```

## Content rules in code

- All copy comes from `src/content/*`. Components never hard-code marketing text.
- Fields the client has not confirmed are typed optional and left `undefined`. Components must render nothing (not an empty label) when a field is `undefined`.
- Each content object may carry `status: 'confirmed' | 'draft'`. Draft copy may show in preview. Before launch, task T5.2 lists every remaining draft item for the user.

## Animation policy

Updated 2026-11-18 (client wants a more modern, more animated site). GSAP + ScrollTrigger (+ SplitText, part of the `gsap` package) may be used site-wide; still pre-approved.

1. **What may animate:** `transform` and `opacity` only, plus `clip-path` for image reveals. No animation that changes layout (no width/height/top/margin animation). Hover shadows fade a pre-drawn shadow layer's `opacity`; they never animate `box-shadow`.
2. **No-JS and old-browser safe:** content is visible by default. Hidden start states apply only under `html.js` (set by the inline script only when `IntersectionObserver` exists) and are released by `[data-revealed]`, with the 3 s failsafe until `html[data-hydrated]`. Never put `opacity: 0` or a closed `clip-path` in plain CSS without that guard.
3. **Reduced motion:** `prefers-reduced-motion: reduce` → everything static and fully visible: no reveals, no word splits, no marquee movement, no parallax, no pinning, no page transitions. GSAP is not even loaded.
4. **CSS (no GSAP):**
   - Reveals: `Reveal` (`IntersectionObserver`, once) — fade + 24px rise, 600 ms; card grids stagger 80 ms (`Reveal group`).
   - Image mask-wipe (≥ 768px): `clip-path: inset(100% 0 0 0)` → `inset(0)` from the bottom, with the `-webkit-` prefix, inside `@supports`; browsers without `clip-path` and phones get the plain fade.
   - Hero (Home): headline split into words on the server; words rise in turn on load (≥ 768px; phones get a single fade). The photo scales in slowly (1.12 → 1). Pure CSS, so the headline never waits for JavaScript (no flicker, no LCP cost).
   - Services marquee (Home): CSS keyframes, paused on hover, static under reduced motion. With JavaScript it is paused until the first scroll/tap/key and while off screen (`MarqueeStrip` only toggles `data-run`), so an endless animation never runs during page load.
   - Card hover (`@media (hover: hover)` only): lift, shadow fade, image zoom, arrow slide.
   - Page enter (`app/template.tsx`): main content fades and rises 16px over 500 ms on every client navigation (skipped on the very first load, which has its own hero entrance and must not delay LCP).
5. **GSAP (one engine, `components/motion/MotionEngine`):** mounted once in the root layout. After each navigation it looks for `[data-split]`, `[data-parallax]` and `[data-pin-gallery]` on the page; only if one exists, motion is allowed and the window is at least 768px wide does it `import()` GSAP, ScrollTrigger and SplitText as a separate chunk. Pages without those targets never download GSAP. `gsap.matchMedia()` handles breakpoints and reverts everything on navigation.
   - Section headings (`h2`, ≥ 768px): SplitText line mask + word rise when they enter. Headings already on screen when the engine starts are left alone (no flicker).
   - Hero parallax (≥ 1024px): the photo moves at ~30% of scroll speed, scrubbed.
   - Alba gallery (≥ 1024px): horizontal pinned scroll; below 1024px it stays the normal grid.
   - Process steps (`ProcessMotion`, loaded on demand by `ProcessAnimator`): steps and line draw in sequence.
6. **Breakpoints:** parallax and pinning desktop only (≥ 1024px). Phones (< 768px): lighter fades only (no word splits, no mask wipes).
7. **Page transitions:** enter animation only. An optional "curtain" link transition is allowed only if prefetch, back/forward, middle-click / Ctrl/Cmd-click and focus management keep working; otherwise it is dropped. No View Transitions API.
8. **No** Three.js, smooth-scroll libraries, scroll hijacking or custom cursors.
9. **Budget:** report First Load JS per route before/after each motion change; Lighthouse mobile Performance on Home must stay ≥ 90.

## Before/after slider

- Hand-written, no library. Built on a native `<input type="range">` overlaid on two stacked images, so keyboard and screen readers work out of the box.
- Labels "Before" / "After". Both images same aspect ratio. Works with touch and mouse. Falls back to side-by-side images if JS is off.

## Contact form

- Fields and copy: `03-CONTENT.md` → Contact.
- Client-side: native HTML validation attributes. Server-side: hand-written validation in `lib/validate.ts` (required fields, lengths, email/phone format).
- Spam: hidden honeypot field + minimum time-to-submit check + in-memory rate limit per IP (e.g. 5 per 10 min).
- Photo upload: **not in v1** unless the user approves storage/email size limits.
- **Delivery method is a pending decision** (task T2.9): SMTP via `nodemailer` (needs approval as a dependency) or an email API called with `fetch` (no dependency, needs an account). Build the form and an adapter interface `sendLead(lead)`; leave the adapter unimplemented until the user decides. Secrets only via env vars.
- Success and error states in plain language; never lose what the user typed on error.

## SEO

- `metadataBase` from env `NEXT_PUBLIC_SITE_URL`.
- Per-page `title`, `description`, canonical, Open Graph from `src/content/seo.ts` (copy in `03-CONTENT.md`).
- `sitemap.ts` lists all static routes and project/service slugs.
- **Preview mode:** env `SITE_INDEXABLE=false` (default in staging) → `robots.ts` disallows all and every page gets `robots: { index: false, follow: false }`. `true` only on launch.
- JSON-LD: `HomeAndConstructionBusiness` with **only confirmed fields** (name, url, telephone, areaServed, etc.). FAQ schema only for answers marked confirmed. No `aggregateRating` or reviews.
- One `h1` per page, logical heading order, descriptive alt text, clean slugs (see sitemap in `03-CONTENT.md`).

## Images

- `next/image` everywhere, with `sizes` set. Hero uses `priority`.
- Keep `images.dangerouslyAllowSVG` at `false`. Only local images (no `remotePatterns`) unless the user approves.
- Source files: max 2400 px wide, compressed. Specs per slot in `05-IMAGES.md`.

## Security

- Patched Next.js version (above). `npm audit` in T0.2 and T5.3.
- Security headers in `next.config` `headers()`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Permissions-Policy` (camera, microphone, geolocation off). A Content-Security-Policy only if it doesn't break Next scripts; test it. Ask the user whether Nginx already sets any of these, to avoid duplicates.
- Contact route: validate and size-limit input, escape user text in emails, never echo raw input into HTML.
- No secrets in client code. `.env.example` documents all variables.
- `poweredByHeader: false`.

## Browser support

- Must work on older browsers, same target as the other HBS sites (`solum-constructions`, `quality-concrete-solution`). **Ask the user for that repo's `browserslist` / polyfill / CSS approach and copy it**, then record the target in PROGRESS.md.
- CSS: avoid features that break old Safari/Chrome without fallback — e.g. provide fallbacks for `gap` in flex (use margins if target needs), `aspect-ratio` (padding fallback), `:has()`, container queries, `oklch()`, cascade layers, nesting. Prefer hex/rgb colors.
- Test list in task T3.7.

## Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://signatureremodelings.com
SITE_INDEXABLE=false
# Contact delivery — filled after T2.9 decision
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

## Scripts and ports

```json
"scripts": {
  "dev": "next dev -p 3003",
  "build": "next build",
  "start": "next start -p 3204",
  "start:staging": "next start -p 3104",
  "lint": "eslint ."
}
```

Ports follow the HBS pattern (Solum 3001/3102/3202, QCSI 3002/3103/3203). Confirm with the user that 3003/3104/3204 are free on the VPS.

Whether to use `output: 'standalone'`: follow what the other HBS repos do (ask the user).
