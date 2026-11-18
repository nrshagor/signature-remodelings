# 03 — Website content

Status tags:
- **[DRAFT]** — written by us from the client brief. OK to show in preview. Client must approve before launch.
- **[NEEDS CLIENT]** — real fact required. Until provided, leave the field `undefined` and render nothing. Never show a placeholder.
- **[CONFIRMED]** — approved by client. (Nothing is confirmed yet except the services, project cities/types and the domain.)

When the user gives you a confirmed fact, update this file (change the tag) and the matching `src/content/*` file in the same task.

---

## Global / brand (`src/content/site.ts`)

| Field | Value | Status |
| --- | --- | --- |
| Brand name | Signature Remodelings | [DRAFT] — singular or plural to confirm |
| Domain | signatureremodelings.com | [CONFIRMED] |
| Tagline | Remodeling, signed with care. | [DRAFT] — alternatives below |
| Service area line | Serving homeowners and property investors across North Texas. | [DRAFT] — exact cities [NEEDS CLIENT] |
| Phone | — | [NEEDS CLIENT] |
| Email | — | [NEEDS CLIENT] |
| Business address | — | [NEEDS CLIENT] (may be omitted if they prefer) |
| Hours | — | [NEEDS CLIENT] |
| Logo | — | [NEEDS CLIENT] — until provided, use a text wordmark (brand name in the heading font) |
| Social links | — | [NEEDS CLIENT] |

Tagline alternatives (client picks one):
1. Remodeling, signed with care.
2. Your home, redesigned to a higher standard.
3. Thoughtful remodels for homes that deserve more.
4. Built on detail. Finished with pride.

Tone of voice: calm, confident, premium. Short sentences. Talk about the homeowner's life (space, light, comfort, value), not tools. No "#1", "best in Texas" or superlatives that can't be proven.

### Navigation

Main menu (remodeling first, client feedback 2026-11-18): Remodeling (→ `/services`) · Home Flipping (→ `/services/home-flipping`) · Projects · About · FAQ · button **Book a Consultation** (→ `/contact`). "Remodeling" is highlighted on `/services` and the interior/exterior pages; "Home Flipping" only on its own page.

Footer:
- Brand name + one-line description: "Interior remodeling, exterior additions and home flipping in Texas." [DRAFT]
- Columns: Services (3 links) · Company (Projects, About, FAQ, Contact) · Contact (phone, email, area — only fields that exist)
- Bottom row: © {current year} Signature Remodelings · Privacy Policy

## Sitemap and slugs

| Page | Path |
| --- | --- |
| Home | `/` |
| Services | `/services` |
| Interior Remodeling | `/services/interior-remodeling` |
| Exterior & Additions | `/services/exterior-additions` |
| Home Flipping | `/services/home-flipping` |
| Projects | `/projects` |
| Balcony Addition, Carrollton | `/projects/carrollton-balcony-addition` |
| Full Home Flip, Alba | `/projects/alba-home-flip` |
| About (with process) | `/about` |
| FAQ | `/faq` |
| Contact / Free Consultation | `/contact` |
| Privacy Policy | `/privacy-policy` |

---

## Home (`/`)

### 1. Hero [DRAFT]
- Headline: **Remodeling that raises the standard of your home.**
- Sub: Kitchens, bathrooms, balconies and full-home transformations for homeowners who care about every detail.
- Primary button: Book a Consultation → `/contact`
- Secondary button: See Our Work → `/projects`

### 2. Remodeling (bento: Interior + Exterior) [DRAFT]
Remodeling first (client feedback 2026-11-18); home flipping moved to section 6.
- Section eyebrow [DRAFT, new]: Remodeling
- Heading [DRAFT, new]: Remodeling, inside and out.
- **Interior Remodeling** (large tile) — Kitchens, bathrooms and living spaces redesigned for the way you live today. → Explore
- **Exterior & Additions** (tile) — Balconies, patios and second-floor rooms that give you more space without leaving the home you love. → Explore
- List tile "What we remodel": the item titles from both service pages (Kitchens, Bathrooms, Living spaces, Balconies, Covered and open patios, Second-floor room additions, Exterior updates that refresh the look of the home).

### 3. Why Signature [DRAFT — every promise needs client OK before launch]
- Heading: Built around your home, not a template.
- **Design first** — You see the plan before work begins, so there are no surprises on site.
- **One point of contact** — One team manages your project from first visit to final walkthrough.
- **Detail-driven finish** — Materials, trims and transitions are chosen to look right for years, not just on handover day.
- **Clear communication** — Regular updates, honest timelines and straight answers.

### 4. Featured projects (2 cards) [DRAFT]
- Heading: Recent work
- **Balcony Addition — Carrollton, TX**: An existing home gains a new balcony, adding outdoor living space and a stronger front elevation. → View project
- **Full Home Flip — Alba, TX**: A dated house remodeled inside and out, ready for today's buyers. → View project

### 5. Process (4 steps) [DRAFT]
- Heading: How we work
1. **Consult** — We visit, listen and understand your goals.
2. **Design** — You get a clear plan and scope.
3. **Build** — Our team remodels with care for your home.
4. **Reveal** — A final walkthrough to make sure it's right.

### 6. For investors band [DRAFT]
- Eyebrow [DRAFT, new]: For investors
- Heading: From dated to market-ready. (Home Flipping page headline)
- Text: We take dated houses and turn them into polished, market-ready homes for investors. (Home Flipping card line)
- Image: Alba cover photo (`projects/alba-home-flip/after-1.jpg`), label "Alba, TX · Home flipping"
- Link [DRAFT, new]: Explore home flipping → `/services/home-flipping`

### 7. Closing CTA [DRAFT]
- Heading: Ready to see what your home could become?
- Text: Tell us about your project. We'll walk you through ideas, options and next steps.
- Button: Book a Consultation

---

## Services index (`/services`) [DRAFT]
- Headline: Remodeling services
- Intro: We focus on three kinds of work, so every project gets our full attention.
- Then the remodeling bento (Interior + Exterior, same as Home section 2, without its heading).
- Then a compact home-flipping block (same text and link as Home section 6).
- Closing CTA (same as Home section 6).

## Interior Remodeling (`/services/interior-remodeling`) [DRAFT]
- Headline: Interiors redesigned around the way you live.
- Intro: Your kitchen and bathrooms work harder than any other rooms in the house. We remodel them to look refined, feel open and function smoothly every day.
- What we remodel:
  - **Kitchens** — layouts, cabinetry, countertops, islands, lighting
  - **Bathrooms** — showers, tubs, vanities, tile, fixtures
  - **Living spaces** — flooring, open-plan changes, built-ins, finishes
  - (Item list [NEEDS CLIENT] confirmation — remove anything they don't do)
- Who it's for: Homeowners who want a lasting upgrade, not a quick cosmetic fix.
- CTA heading: Planning a kitchen or bath remodel? · Button: Book a Consultation

## Exterior & Additions (`/services/exterior-additions`) [DRAFT]
- Headline: More space, without leaving the home you love.
- Intro: Sometimes the best move is not moving. We add balconies, patios and second-floor rooms that fit your home's structure and style, so the addition looks like it was always there.
- What we build:
  - Balconies
  - Covered and open patios
  - Second-floor room additions
  - Exterior updates that refresh the look of the home
- Who it's for: Families who need more room, and owners who want to add living space and curb appeal.
- Featured: Balcony Addition — Carrollton, TX → `/projects/carrollton-balcony-addition`
- CTA heading: Thinking about adding space? · Text: Let's look at what your home can support. · Button: Book a Consultation

## Home Flipping (`/services/home-flipping`) [DRAFT]
- Headline: From dated to market-ready.
- Intro: We take older houses and remodel them into clean, modern homes that today's buyers want. For investors, that means a property positioned to sell at a stronger price.
- How it works:
  1. Evaluate the property and its potential
  2. Plan a remodel scope that fits the target market
  3. Remodel inside and out
  4. Hand over a home ready for listing
- Who it's for: Real estate investors and owners of older properties.
- Featured: Full Home Flip — Alba, TX → `/projects/alba-home-flip`
- CTA heading: Have a property with potential? · Text: Let's talk scope and timeline. · Button: Book a Consultation
- Rule: **no profit, ROI or sale-price promises.** Flipping model (service for outside investors vs. own flips) [NEEDS CLIENT].

---

## Projects index (`/projects`) [DRAFT]
- Headline: Our work
- Intro: Every project starts with an existing home and a clear goal. Here's what we've built.
- Cards: the two projects (image, title, city, type, one-line summary).
- Filter UI: not needed with only two projects.

## Project: Balcony Addition — Carrollton, TX (`/projects/carrollton-balcony-addition`)
- Type: Exterior addition · City: Carrollton, TX
- Summary [DRAFT]: An existing home in Carrollton gains a new balcony, adding outdoor living space and a stronger front elevation.
- The goal [NEEDS CLIENT]: owner's reason (view, outdoor space, curb appeal).
- The work [DRAFT + NEEDS CLIENT]: The new balcony ties into the existing structure and matches the home's materials and lines. Size, materials, railing type → from the drawing.
- Status [NEEDS CLIENT]: completed or in progress. If in progress: show "In progress" label and the gallery title "Design rendering".
- Gallery: Before (company photo) · Design drawing · Rendering (captioned "Design rendering") · After (when finished).
- **Do not** use Google Maps imagery or show the street address.

## Project: Full Home Flip — Alba, TX (`/projects/alba-home-flip`)
- Type: Home flipping · City: Alba, TX
- Summary [DRAFT]: An older house remodeled into a bright, move-in-ready home.
- Starting point [NEEDS CLIENT]: condition before (from the company, not Zillow).
- The work [DRAFT] (client to confirm): Inside, the house was refreshed from end to end: new wood-look flooring, a white-cabinet kitchen with stone-look countertops, tile backsplash and stainless appliances, updated bathrooms with new vanities and a tiled shower, new ceiling fans and fresh paint throughout. Outside, the front porch and exterior were cleaned up for a stronger first impression.
- The result [DRAFT]: A home ready for today's buyers. Sale outcome only with written client permission.
- Gallery [CONFIRMED photos, client permission]: cover `after-1.jpg` (front exterior) + 11 "after" photos (`gallery-1` … `gallery-11`). No "before" photos exist, so no before/after slider.
- **Do not** use Zillow photos or show the street address.

---

## About (`/about`) [DRAFT]
- Headline: A new company built on an old-fashioned standard.
- Body: Signature Remodelings was founded to do remodeling the careful way: listen first, plan clearly, and finish every detail as if it were our own home. We focus on three things — interior remodels, exterior additions and home flips — so every project gets our full attention.
- Founder block [NEEDS CLIENT]: name, photo, short background. Hidden until provided.
- Values: Craftsmanship · Honesty · Respect for your home · Clear communication
- Process: same 4 steps as Home section 5 (this is where the GSAP process animation lives), plus one line each:
  1. Consult — A visit to your home to understand goals, budget range and timing.
  2. Design — A clear plan and scope before any work starts.
  3. Build — Organized, respectful work with regular updates.
  4. Reveal — A final walkthrough together.
- Closing CTA (same as Home section 6).

## FAQ (`/faq`)
Show only questions whose answer is [DRAFT] or [CONFIRMED]. Questions with [NEEDS CLIENT] answers stay hidden until answered. FAQ JSON-LD only for [CONFIRMED] answers.

| # | Question | Answer | Status |
| --- | --- | --- | --- |
| 1 | What areas do you serve? | — | [NEEDS CLIENT] |
| 2 | Do you offer free consultations or estimates? | — | [NEEDS CLIENT] |
| 3 | How long does a kitchen or bathroom remodel take? | It depends on the size and scope of the project. You'll get a timeline with your plan before work starts. | [DRAFT] |
| 4 | Can I stay in my home during the remodel? | Usually, depending on the project. We'll talk through what to expect for yours. | [DRAFT — client to confirm] |
| 5 | Do you handle permits? | — | [NEEDS CLIENT] |
| 6 | Are you licensed and insured? | — | [NEEDS CLIENT] — only real, documented details |
| 7 | Do you work with real estate investors? | Yes. Our home flipping service is built for investors who want a property remodeled and ready for market. | [DRAFT] |
| 8 | Can you add a second floor to my house? | Often, yes — it depends on the structure. We assess the home first and tell you what's possible. | [DRAFT — client to confirm] |

## Contact (`/contact`) [DRAFT]
- Headline: Let's talk about your home.
- Text: Share a few details and we'll get back to you to schedule a consultation.
- Form fields:
  - Full name (required)
  - Phone (required)
  - Email (required)
  - Property city or ZIP (required)
  - Project type (required, select): Interior remodeling · Exterior & additions · Home flipping · Other
  - Budget range (optional, select) — ranges [NEEDS CLIENT]; hide the field until provided
  - Timeline (optional, select): As soon as possible · 1–3 months · 3–6 months · Just exploring
  - Message (required, 20–2000 characters)
  - Consent line under button: "By sending this form you agree to be contacted about your project." [DRAFT]
- Button: Request a Consultation
- Success: "Thank you — we've received your request and will contact you soon."
- Error: "Something went wrong and your message wasn't sent. Please try again in a moment." (+ phone/email if available)
- Side panel: phone, email, hours, service area — only fields that exist.

## Privacy Policy (`/privacy-policy`) [NEEDS CLIENT]
Simple policy covering: what the contact form collects, why, who receives it, how long it's kept, no selling of data, contact for questions, effective date. Needs the company's legal name and contact email. This is not legal advice — the client should review it. Hidden from nav/footer until the page exists.

## 404 page [DRAFT]
- Heading: This page has moved or doesn't exist.
- Buttons: Back to home · See our projects

---

## SEO copy (`src/content/seo.ts`) [DRAFT]

Title ≤ 60 characters, description ≤ 160. "North Texas" changes when the service area is confirmed.

| Page | Title | Description |
| --- | --- | --- |
| Home | Signature Remodelings — Home Remodeling in North Texas | Kitchen, bathroom, balcony and second-floor remodeling plus home flipping for investors. Book a consultation with Signature Remodelings. |
| Services | Remodeling Services — Signature Remodelings | Interior remodeling, exterior additions and home flipping for Texas homeowners and investors. |
| Interior | Kitchen & Bathroom Remodeling — Signature Remodelings | Kitchens, bathrooms and living spaces remodeled with care and detail. Plan your interior remodel with Signature Remodelings. |
| Exterior & Additions | Balconies, Patios & Room Additions — Signature | Add space with a balcony, patio or second-floor room designed to match your home. Talk to Signature Remodelings. |
| Home Flipping | Home Flipping Remodels for Investors — Signature | We remodel dated houses into market-ready homes for real estate investors. See our Alba, TX flip and start your project. |
| Projects | Remodeling Projects — Signature Remodelings | Before-and-after remodeling projects in Texas, from a Carrollton balcony addition to a full home flip in Alba. |
| Carrollton project | Balcony Addition in Carrollton, TX — Signature | A new balcony added to an existing Carrollton home for more outdoor living space and a stronger front elevation. |
| Alba project | Full Home Flip in Alba, TX — Signature Remodelings | A dated Alba, TX house remodeled inside and out into a move-in-ready home. |
| About | About Signature Remodelings | A Texas remodeling company focused on careful planning, clear communication and detail-driven craftsmanship. |
| FAQ | Remodeling FAQ — Signature Remodelings | Answers about consultations, timelines, additions and investor flips from Signature Remodelings. |
| Contact | Book a Remodeling Consultation — Signature | Tell us about your kitchen, bathroom, addition or flip project and we'll contact you to schedule a consultation. |
