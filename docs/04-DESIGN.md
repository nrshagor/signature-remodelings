# 04 — Design direction

Status: **proposal**. No logo or brand colors from the client yet. Build with these tokens so a later brand change is a token edit, not a rewrite.

## Feel

Quiet luxury. Warm, architectural, lots of white space, large photography, restrained motion. Think high-end interior design studio, not a discount contractor. Avoid: bright saturated colors, stock icons everywhere, busy gradients, heavy drop shadows, carousels.

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

- Headings: an elegant serif, e.g. **Cormorant Garamond** (600) or **Playfair Display**. Pick one, via `next/font/google`.
- Body/UI: a clean sans, e.g. **Inter** or **Manrope** (400/500/600).
- Max two families, only the weights used.

Fluid scale with `clamp()` (supported in the target browsers; if not, use media-query steps):

| Token | Size |
| --- | --- |
| `--fs-display` | clamp(2.5rem, 5vw + 1rem, 4.5rem) — hero h1 |
| `--fs-h2` | clamp(2rem, 3vw + 1rem, 3rem) |
| `--fs-h3` | clamp(1.375rem, 1vw + 1rem, 1.75rem) |
| `--fs-body` | 1.0625rem (17px) |
| `--fs-small` | 0.875rem |
| `--fs-eyebrow` | 0.8125rem, uppercase, letter-spacing 0.14em |

Line height: headings 1.1–1.2, body 1.65. Max text width ~65ch.

## Layout

- Container max width 1240px, side padding 20px mobile / 32px tablet / 48px desktop.
- Section vertical padding: 72px mobile, 120px desktop.
- 12-column feel on desktop; asymmetric image/text splits (7/5) look more premium than 50/50.
- Mobile first. Breakpoints: 640, 900, 1200.

## Components

- **Header:** transparent over the home hero (white text), solid paper background after scroll and on other pages. Logo/wordmark left, nav right, "Book a Consultation" as an outlined button. Mobile: full-screen menu, focus trapped, Esc closes, body scroll locked.
- **Buttons:** primary = ink background, white text, square or 2px radius; secondary = outlined. Height 48px. Clear focus ring (2px accent, offset 3px).
- **Eyebrow:** small uppercase label with a short accent line before it.
- **Service cards:** large image (4:5), title, one line, "Explore →". Hover: image scales 1.04 over 600 ms.
- **Project cards:** wide image (3:2), city + type as meta, title.
- **Before/after:** full-width, 16:10, thin white divider line with a round handle, "Before"/"After" chips.
- **Process steps:** large numerals (01–04) in the serif font, thin connecting line.
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

Text wordmark: "SIGNATURE" in the sans font, uppercase, letter-spacing 0.2em, with "Remodelings" below in the serif, smaller. Make it a component so it can be swapped for an SVG logo later.
