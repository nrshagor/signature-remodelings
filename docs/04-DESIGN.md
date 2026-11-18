# 04 — Design direction

Status: **proposal, revised 2026-11-18 after client feedback** ("as modern as possible"; remodeling first, home flipping second). No logo or brand colors from the client yet. Build with these tokens so a later brand change is a token edit, not a rewrite. Older-browser support (`.browserslistrc`) still applies: no `:has()`, container queries, CSS nesting, `@layer`, `oklch`/`lab` or subgrid.

## Feel

Modern, warm and confident. Clean sans-serif type, generous white space, big full-bleed photography, softly rounded cards, restrained motion. Think a current high-end design-build studio, not a discount contractor (and not an old-fashioned serif brochure). Avoid: bright saturated colors, stock icons everywhere, busy gradients, heavy drop shadows, carousels.

## Color tokens (`globals.css` `:root`)

Hex/rgb only (older-browser safe).

| Token | Value | Use |
| --- | --- | --- |
| `--color-ink` | `#1E1C1A` | Main text, dark sections |
| `--color-ink-soft` | `#4A4642` | Body text on light |
| `--color-muted` | `#7A746D` | Captions, meta |
| `--color-paper` | `#FAF8F5` | Page background (warm white) |
| `--color-stone` | `#EFEAE3` | Alternate section background |
| `--color-line` | `#DDD6CC` | Borders, dividers |
| `--color-accent` | `#9C7A4D` | Accent: links, small details, buttons on dark (muted brass) |
| `--color-accent-dark` | `#7D6139` | Accent hover |
| `--color-white` | `#FFFFFF` | Text on dark / images |

Check contrast: body text ≥ 4.5:1, large text ≥ 3:1. If `--color-accent` on `--color-paper` fails for small text, use it only for large text, borders and icons.

## Typography

- Headings: **Plus Jakarta Sans** 600/700 via `next/font/google` (replaces Cormorant Garamond). Chosen over Manrope because its rounder, geometric forms contrast clearly with Inter, so headings stand apart from body text without a serif, and it stays clean at very large display sizes with tight tracking; Manrope sits close to Inter and the two blur together.
- Large headings use tighter letter-spacing: h1 -0.035em, h2 -0.025em, h3 -0.015em.
- Body/UI: **Inter** (400/500/600).
- Max two families, only the weights used.

Fluid scale with `clamp()` (supported in the target browsers; if not, use media-query steps):

| Token | Size |
| --- | --- |
| `--fs-display` | clamp(2.75rem, 6vw + 1rem, 6rem) — hero h1 |
| `--fs-h2` | clamp(2rem, 3vw + 1rem, 3.25rem) |
| `--fs-h3` | clamp(1.375rem, 1vw + 1rem, 1.75rem) |
| `--fs-body` | 1.0625rem (17px) |
| `--fs-small` | 0.875rem |
| `--fs-eyebrow` | 0.8125rem, uppercase, letter-spacing 0.14em |

Line height: display 1.02, headings 1.1–1.2, body 1.65. Max text width ~65ch.

## Layout

- Container max width 1240px, side padding 20px mobile / 32px tablet / 48px desktop.
- Section vertical padding: 80px mobile, 144px desktop (more white space).
- 12-column feel on desktop; asymmetric image/text splits (7/5) look more premium than 50/50.
- Mobile first. Breakpoints: 640, 900, 1200.

## Shape

- `--radius-lg` **12px**: images, cards, tiles, before/after frames, project gallery.
- `--radius` **8px**: buttons, inputs, small panels.
- Pills (999px): chips and badges only.
- Full-bleed media (home hero, CTA band) has no radius. Same values everywhere.

## Components

- **Header:** transparent over the home hero (white text), solid paper on other pages. After scrolling: **frosted glass**, a translucent paper background with `backdrop-filter: blur() saturate()` (always with the `-webkit-` prefix), applied only inside `@supports`; browsers without it keep the solid paper background. Nav: Remodeling · Home Flipping · Projects · About · FAQ, plus "Book a Consultation" as a button. Mobile: full-screen menu, focus trapped, Esc closes, body scroll locked.
- **Buttons:** primary = ink background, white text; secondary = outlined; on dark = accent-light / white outline. 8px radius, 600 weight, height 48px (52px in the hero). Clear focus ring (2px accent, offset 3px).
- **Eyebrow:** small uppercase label with a short accent line before it.
- **Hero (Home):** full-bleed, full-height image with dark overlay; large left-aligned headline (`--fs-display`), sub and two buttons at the lower left.
- **Service bento (Home, /services):** remodeling only. Desktop 12-column grid: Interior as a large tall tile (7 columns, 2 rows), Exterior as a wide tile (5 columns), and a light tile listing what we remodel (5 columns). Image tiles: photo fill, bottom gradient, white title + one line + "Explore →", the whole tile is one link, image scales 1.04 on hover. A missing photo shows an ink tile with the same text. Tablet: Interior full width, the other two side by side. Mobile: stacked.
- **For investors band (Home) / flipping block (/services):** home flipping as the secondary offer, lower on the page: an Alba kitchen photo (company's own; not the cover, to avoid repeating it on Home) with its city label, eyebrow "For investors", the flipping headline and line, and a link to the flipping page. /services uses a compact version after the bento.
- **Project cards:** wide image (3:2), rounded, city + type as meta, title. Carrollton first, Alba second.
- **Before/after:** full-width, 16:10, thin white divider line with a round handle, "Before"/"After" chips.
- **Process steps:** large numerals (01–04) in the heading font, thin connecting line.
- **CTA band:** dark ink background with a darkened image, white heading, accent button.
- **FAQ:** native `<details>/<summary>` with custom +/− icon.
- **Forms:** labels above fields, 48px inputs, 1px line border, accent focus, error text below field.

## Motion (see also 02-TECH-SPEC → Animation policy)

- Reveal: fade + 24px slide-up, 600 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 80 ms in grids.
- Hero: slow Ken Burns zoom on the image (CSS, 1.0 → 1.06 over 12 s), headline reveal on load.
- Project story (GSAP): pinned section, before → after wipe tied to scroll, captions fade in per step. Desktop only; mobile shows the plain slider.
- Process (GSAP): steps and connecting line draw in sequence on scroll.
- Respect `prefers-reduced-motion` everywhere.

## Imagery

- Warm daylight interiors, natural materials (wood, stone, brass), no people facing the camera.
- Consistent color grade: slightly warm, not oversaturated.
- Dark overlay (rgba(30,28,26,0.45)) behind text on images.
- See `05-IMAGES.md` for every slot.

## Logo (until client provides one)

Text wordmark: "SIGNATURE" in the sans font, uppercase, letter-spacing 0.2em, with "Remodelings" below in the heading sans, smaller. Make it a component so it can be swapped for an SVG logo later.
