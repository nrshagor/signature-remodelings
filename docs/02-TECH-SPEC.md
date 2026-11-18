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
| Animation | CSS transitions + `IntersectionObserver` for reveals; GSAP + ScrollTrigger only where listed below |
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
    motion/   Reveal (IntersectionObserver), ProcessAnimator + ProcessMotion (GSAP, on demand)
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

1. **Default:** `Reveal` component — adds a class when the element enters the viewport (`IntersectionObserver`, `threshold ~0.15`, run once). CSS handles the fade/slide (`opacity` + `transform`, 400–700 ms, ease-out).
2. **No-JS and old-browser safe:** content is visible by default. The hidden start state applies only when `html.js` is set and `IntersectionObserver` exists. Never put `opacity: 0` in plain CSS without that guard.
3. **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables transforms and long transitions.
4. **GSAP + ScrollTrigger** only in:
   - ~~project detail pages (pinned scroll story)~~ removed 2026-11-18 at the user's request: project pages use the drag slider on every screen size
   - the process section (steps reveal in sequence on scroll)
   Load GSAP with dynamic import inside client components so other pages don't ship it. Use `useGSAP` for cleanup and `gsap.matchMedia()` for reduced motion and mobile variants.
5. **Page transitions:** only a light enter animation (fade/slide-up of main content). No exit animations, no router hacks, no View Transitions API.
6. **No** Three.js, smooth-scroll hijacking, custom cursors or parallax on mobile.

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
