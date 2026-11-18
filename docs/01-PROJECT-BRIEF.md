# 01 — Project brief

## Client

- **Company:** Signature Remodelings (final spelling, singular vs plural, to confirm)
- **Domain:** signatureremodelings.com (HBS has domain access; currently a blank page)
- **Location:** Texas, USA. Known projects are in Carrollton, TX and Alba, TX.
- **Status:** New company. Very little original content yet.
- **Brought in by:** Jahid (HBS Founder & CEO). Builder: N R Shagor (HBS CTO).
- **Hosting:** HBS VPS (Hostinger), Node app behind Nginx with PM2. DNS at GoDaddy. Server is handled separately by the user.

## What the company does (from the client brief)

Remodeling only. They take an existing house and make internal or external changes.

| Service | Includes (as stated by client) |
| --- | --- |
| Interior remodeling | Kitchen area, bathrooms, etc. |
| Exterior remodeling / additions | Adding a patio, second-floor rooms, etc. |
| Home flipping | Take an old house, remodel it, help investors sell at a higher price |

## Goal

Reach **high-end customers**. The site must look premium, load fast, and build trust with real project photos and clear, honest copy.

## Audience

1. Homeowners in North Texas with higher budgets planning a kitchen, bath or addition.
2. Real estate investors looking for a remodeling partner for flips.

## Reference site

- dfwimproved.com (a Plano, TX design-build remodeler) — used only as a reference for structure: services, project gallery, process, consultation call-to-action. **Do not copy its text, images or claims.**

## Known projects (only these two exist)

| Project | City | Type | Material available |
| --- | --- | --- | --- |
| Balcony addition | Carrollton, TX | Exterior addition | Renovation drawing (pending from client); original house visible on Google Maps (do not use Maps imagery on the site) |
| Full home flip | Alba, TX | Home flipping | Renovated photos (pending from client); original listing on Zillow (do not use Zillow photos on the site) |

Street addresses are known internally but **must never appear on the site**.

## Scope (v1)

Pages: Home, Services (index + 3 service pages), Projects (index + 2 project pages), About (with process), FAQ, Contact, Privacy Policy, 404.

Features:
- Responsive, premium design, older-browser safe
- Subtle scroll animations; GSAP ScrollTrigger only on project stories and the process section
- Before/after image slider on project pages
- Contact / consultation form with spam protection
- SEO: metadata, sitemap, robots, structured data (only with confirmed facts)
- Preview mode: site can run not-indexed for client review before launch

Out of scope for v1: blog, CMS/admin panel, online payments, Three.js/3D, multi-language, cost calculator.

## Confirmed vs not confirmed

Confirmed: the three services, the two project cities and types, the domain, high-end goal.

Not confirmed (see `03-CONTENT.md` and `PROGRESS.md` → Open questions): exact brand name, logo, colors, phone, email, address, hours, service area, founder info, license/insurance, warranty, free estimates, financing, permits, flipping model, project details and photos.
