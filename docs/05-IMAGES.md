# 05 — Images

The user downloads images and puts them in the folders below with **exactly these file names**. Claude Code does not download images. If a file is missing, the component must still render cleanly (neutral `--color-stone` block, no broken-image icon, no placeholder text) and the slot is listed in PROGRESS.md under "Missing images".

## Rules

1. **Stock images** (`public/images/stock/`) are for mood only: hero, service banners, CTA backgrounds, About. Never on project pages. Never captioned as the company's work.
2. **Project images** (`public/images/projects/<slug>/`) are only the company's own photos/drawings.
3. **AI images/renderings** must have a visible caption "Design rendering". Never show them as finished work.
4. **Never** use Google Maps, Street View or Zillow images.
5. Free sources: Unsplash, Pexels, Pixabay — free for commercial use, no attribution required (check each site's license page when downloading; licenses can change). Prefer photos with no recognizable faces and no visible brand logos.
6. Log every stock image in `public/images/CREDITS.md`: file name · source site · photo page URL · photographer · date downloaded.
7. Export: JPG or WebP, sRGB, max 2400 px on the long side, quality ~80. `next/image` makes AVIF/WebP variants.

## Stock image slots

| File name | Where | Size (px) | Search terms (Unsplash / Pexels) | Alt text |
| --- | --- | --- | --- | --- |
| `stock/hero-home.jpg` | Home hero | 2400×1350 | luxury kitchen interior, modern home interior warm light | Bright remodeled kitchen with a large island and warm wood cabinets |
| `stock/service-interior.jpg` | Interior card + page hero | 1600×2000 (4:5) | white marble kitchen island, luxury kitchen | Modern kitchen with a marble island and pendant lights |
| `stock/service-interior-bath.jpg` | Interior page, bathroom block | 1600×1200 | luxury bathroom walk-in shower, modern bathroom vanity | Remodeled bathroom with a walk-in glass shower and stone tile |
| `stock/service-interior-living.jpg` | Interior page, living block | 1600×1200 | modern living room built-ins, open plan living room | Open living room with built-in shelving and wide-plank floors |
| `stock/service-exterior.jpg` | Exterior card + page hero | 1600×2000 (4:5) | house balcony exterior, two story house exterior | Two-story home exterior with a second-floor balcony |
| `stock/service-exterior-patio.jpg` | Exterior page, patio block | 1600×1200 | backyard covered patio, outdoor living patio | Covered backyard patio with outdoor seating |
| `stock/service-flipping.jpg` | Flipping card + page hero | 1600×2000 (4:5) | house renovation interior, home remodeling construction | Home interior under renovation with fresh drywall and new windows |
| `stock/service-flipping-staged.jpg` | Flipping page, result block | 1600×1200 | modern living room staging, bright empty living room | Freshly remodeled, staged living room ready for sale |
| `stock/process-plans.jpg` | Process / Why us | 1600×1200 | architect blueprints table, home design plans | Remodeling plans and material samples on a table |
| `stock/about-craft.jpg` | About | 1600×1200 | craftsman woodwork detail, tile installation close up | Close-up of finished woodwork detail |
| `stock/cta-band.jpg` | Closing CTA background | 2400×1000 | cozy modern living room evening, warm interior dusk | Warm living room in the evening |
| `brand/og-image.jpg` | Social share image (1200×630) | 1200×630 | made from hero image + wordmark | — |

Look for: Texas/US suburban homes (brick, stone, wide lots), not European apartments.

## Project image slots (company's own photos — pending from client)

### `projects/carrollton-balcony-addition/`

| File name | What | Notes |
| --- | --- | --- |
| `before-1.jpg` | House before the balcony | Company's own photo |
| `drawing-1.jpg` | Renovation drawing | From client attachment (export PDF page to JPG if needed) |
| `rendering-1.jpg` | Design rendering (optional) | AI or 3D rendering; caption "Design rendering" |
| `after-1.jpg` … | Finished balcony | When work is done; same angle as `before-1.jpg` for the slider |
| `rendering-video.mp4` + `rendering-video-poster.jpg` | Optional rendering video | ≤ 10 MB, H.264, muted autoplay loop; caption "Design rendering" |

### `projects/alba-home-flip/` (received from client, permission confirmed)

No "before" photos exist, so the page has no before/after slider. The files are small (1024×682 and 665×441): the frame is capped at each photo's natural size, so they are never upscaled. Higher-resolution originals requested (PROGRESS.md → Open questions).

| File name | Size (px) | What | Where |
| --- | --- | --- | --- |
| `after-1.jpg` | 1024×682 | Front exterior with covered porch | Cover: page hero + project card |
| `gallery-1.jpg` | 665×441 | Kitchen, peninsula view | Gallery |
| `gallery-2.jpg` | 1024×682 | Open-plan kitchen / living | Gallery |
| `gallery-3.jpg` | 1024×682 | Living room | Gallery |
| `gallery-4.jpg` | 1024×682 | Room with staircase | Gallery |
| `gallery-5.jpg` | 665×441 | Kitchen, wide view | Gallery |
| `gallery-6.jpg` | 1024×682 | Sink and backsplash detail | Gallery |
| `gallery-7.jpg` | 665×441 | Bathroom vanity | Gallery |
| `gallery-8.jpg` | 1024×682 | Tiled shower | Gallery |
| `gallery-9.jpg` | 665×441 | Vanity faucet detail | Gallery |
| `gallery-10.jpg` | 665×441 | Rear / side exterior | Gallery |
| `gallery-11.jpg` | 665×441 | Yard | Gallery |

Alt text for each photo is in `src/content/projects.ts`.

Before/after pairs must have the same aspect ratio; crop to 16:10 (e.g. 2000×1250).

If the company has no "before" photos of its own, the project page shows an "after" gallery only (no slider) — ask the user.

## Optional AI image prompts (decoration or labeled renderings only)

- Hero: "Photorealistic wide shot of a high-end remodeled kitchen in a Texas suburban home, white oak cabinets, quartz island, warm natural light, no people, no text"
- Exterior: "Photorealistic two-story brick suburban house in North Texas with a newly added second-floor balcony, black metal railing, late afternoon light, no text"
- Bathroom: "Photorealistic luxury bathroom remodel, freestanding tub, large-format tile, glass walk-in shower, soft daylight, no people"

## Favicon

Until a logo exists: a simple "S" monogram in the serif font on `--color-ink`. Generate `src/app/icon.png` (512×512) and `apple-icon.png` (180×180).
