# SolarLeadAds — Full Site Documentation

**Last updated:** August 31, 2026
**Purpose of this file:** Hand this single file to any developer (instead of the whole codebase) so they know exactly what the site is, how it's built, where everything lives, and what to touch for common changes — pricing, copy, images, forms, SEO, deployment.

---

## 1. What this site is

SolarLeadAds is a marketing website for a **Meta (Facebook/Instagram) ads lead-generation agency for the solar industry**. It sells monthly ad-management packages to solar installers, sellers, technicians, panel/battery providers, and solar cleaning/maintenance crews in the **USA, UK, and Australia** (plus a "Global / case-by-case" option for other countries).

The site is **not an e-commerce store** — there's no checkout. Every page funnels toward one of two actions:
1. Fill out the **Contact / Free Lead Audit form** (saved to a database)
2. Message the business on **WhatsApp**

---

## 2. Tech stack (plain English)

| Layer | What's used | Why it matters for a developer |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Pages live as folders under `app/`, each with a `page.tsx`. Server-rendered by default. |
| Language | **TypeScript** | All files are `.ts`/`.tsx`. Type errors will block a clean build. |
| Styling | **Tailwind CSS** | No separate CSS files per component — styling is inline via class names. Colors/fonts are defined once in `tailwind.config.ts`. |
| Database | **Supabase** (Postgres + hosted API) | Stores contact-form leads, client reviews, and blog posts. |
| Hosting (intended) | **Vercel** | Auto-deploys from GitHub, zero server config needed. |
| Fonts | Space Grotesk (headings), Inter (body), JetBrains Mono (small labels) — loaded via Google Fonts automatically |
| Email (optional) | **Resend** — only sends notification emails if configured; site works fine without it |
| Analytics (optional) | **Google Analytics 4** — only loads if a measurement ID is set |

**To run it locally:**
```bash
npm install
npm run dev
```
Then open `http://localhost:3000`.

**To build for production:**
```bash
npm run build
```

---

## 3. Every page on the site, and what it does

| URL | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — hero, trust bar, problem/solution, process, services snapshot, testimonials, FAQ teaser, final CTA |
| `/services` | `app/services/page.tsx` | Full pricing page (see Section 5 below — this is the one you'll edit most) |
| `/results` | `app/results/page.tsx` | What clients can expect: lead volume ranges per tier, how reporting works, testimonials |
| `/process` | `app/process/page.tsx` | Step-by-step: audit → Meta access → creative → launch → ongoing optimization |
| `/about` | `app/about/page.tsx` | Company story, which solar business types are served, region coverage |
| `/reviews` | `app/reviews/page.tsx` | Public review carousel + a form for clients to submit new reviews |
| `/faq` | `app/faq/page.tsx` | Full FAQ, grouped into categories |
| `/contact` | `app/contact/page.tsx` | Lead-audit form. If someone clicks "Choose [Package]" on the pricing page, this page pre-fills which package they picked |
| `/blog` and `/blog/[slug]` | `app/blog/` | Blog list + individual post pages, content pulled from Supabase (not hardcoded) |
| `/usa`, `/uk`, `/australia`, `/global` | `app/usa/`, etc. | Region-specific landing pages (for ad campaigns targeting a specific country) |
| `/privacy` | `app/privacy/page.tsx` | Privacy Policy |
| `/terms` | `app/terms/page.tsx` | Terms of Service |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | Auto-generated for search engines — add new page URLs to `sitemap.ts` if you add a page |

---

## 4. Every reusable component, in plain terms

All in `components/`:

- **Header.tsx** — sticky top navigation + primary CTA button
- **MobileNav.tsx** — the mobile hamburger menu
- **Hero.tsx** + **HeroImageCarousel.tsx** — homepage hero, rotates through images every ~3.2 seconds
- **PanelGridGraphic.tsx** — a custom-drawn SVG illustration (not a stock photo) used as a fallback/decorative graphic
- **TrustBar.tsx** — the 3-item trust strip ("No long-term contracts", etc.)
- **ProblemSection.tsx** / **SolutionSection.tsx** — homepage pitch: the problem solar businesses have, and how this agency solves it
- **ExperienceSection.tsx** — "2+ years, across these verticals" credibility block
- **ProcessSection.tsx** — condensed 4-step version of `/process` for the homepage
- **ServicesSnapshot.tsx** — 3-card teaser linking to `/services`
- **PricingSection.tsx** — the full pricing UI (tabs, region toggle, tier cards, add-ons). Used on `/services`. **This is the main file to edit for pricing changes.**
- **TestimonialsSection.tsx** — homepage testimonials
- **ReviewsCarousel.tsx** / **ReviewForm.tsx** — used on `/reviews`; carousel displays approved reviews, form lets clients submit new ones
- **FAQSection.tsx** — short FAQ teaser on the homepage
- **ContactForm.tsx** — the lead-audit form on `/contact`
- **FinalCTA.tsx** — the bottom conversion banner repeated across most pages
- **WhatsAppButton.tsx** — floating WhatsApp button shown site-wide
- **Reveal.tsx** — small wrapper that fades/slides elements into view on scroll (purely visual, no content)
- **Footer.tsx** — site-wide footer

---

## 5. Pricing system — how it works and what to edit

**File: `lib/pricing.ts`** — this is the single source of truth for all pricing, shown on `/services` via `components/PricingSection.tsx`.

### Structure
- Two **tracks** (tabs on the pricing page):
  - `installation` — "Installation & Sales" (high-ticket: installers, sellers, panel/battery providers) → tiers: **Starter, Growth, Scale**
  - `local` — "Cleaning & Repair" (lower-ticket, faster-decision local jobs) → tiers: **Essentials, Plus**
- Three **regions**: US ($), UK (£), Australia (A$) — every tier has a separate fee for each region.
- Each tier has:
  - `fee` — the monthly management fee the client pays the agency
  - `adSpendMin` — recommended minimum ad budget (paid directly to Meta, not to the agency — kept separate on purpose for transparency)
  - `leadsEstimate` — plain-text estimate like "60–100 exclusive leads/month"
  - `features` — bullet list; first 4 show by default, rest are under a "+ X more included" expandable
  - `mostPopular` — set this flag on exactly one tier per track to show the highlighted "Most Popular" card

### Add-ons
Below the tier cards, there are 3 add-on cards (Website/Funnel Build, AI Appointment Setter, Google Ads Add-on). Each has:
- `price`, `description`
- `details` — a short bullet list of specifics (what's actually included)
- `standalone` (true/false) — whether this can be bought on its own without a full package (shows a "Stand-alone OK" badge)
- `standaloneNote` — explains why/why not

**To change a price, add a tier, or edit an add-on:** edit `lib/pricing.ts` only. The UI (`PricingSection.tsx`) reads from this file automatically — you never need to touch the component just to change numbers or text.

**To change how pricing displays (layout, colors, badges):** edit `components/PricingSection.tsx`.

---

## 6. Forms and where the data goes

There are **two forms**, both backed by Supabase (a hosted Postgres database):

### A) Contact / Lead Audit form (`/contact`)
- Component: `components/ContactForm.tsx`
- Server logic: `app/contact/actions.ts`
- Fields: Name, Email, Company, Phone, Website/Ad Library link, Ad spend range, Message
- On submit: inserts a row into the Supabase `leads` table
- **Spam protection:** a hidden honeypot field + a timestamp check (rejects submissions made faster than 1.5 seconds after the page loaded)
- **Optional email notification:** if `RESEND_API_KEY` and `NOTIFY_EMAIL_TO` environment variables are set, an email is sent on every new lead. If not set, the form still works — it just skips the email step silently.
- If someone clicked "Choose [Package]" on the pricing page, the form pre-fills which package they're interested in (passed via the URL, e.g. `/contact?package=growth`).

### B) Review form (`/reviews`)
- Component: `components/ReviewForm.tsx`
- Server logic: `app/reviews/actions.ts`
- Fields: Name, Company (optional), Country, Rating (1–5), Review text, Photo URL (optional), Order number, Contact (phone or email)
- Reviews are **auto-approved and go live immediately** (status is hardcoded to `"approved"` — a visitor can never fake this).
- `order_number` and `contact` are collected only to discourage fake reviews / allow manual verification — **they are never displayed publicly** (the public query in `lib/get-reviews.ts` doesn't select those columns).
- Same honeypot + timestamp spam protection as the contact form.
- If Supabase has zero approved reviews yet (e.g., brand new site), the site shows placeholder reviews from `lib/reviews.ts` instead of an empty section — swap these out once you have 3+ real reviews.

---

## 7. Blog

- Blog posts are **not hardcoded** — they're pulled live from a Supabase table called `blogs`.
- `/blog` lists all posts where `is_live = true`.
- `/blog/[slug]` renders one post. New posts appear automatically once added to Supabase and marked live — no code changes or redeploy needed.
- Uses the **public/anon** Supabase client (`lib/supabaseClient.ts`), safe to expose in the browser since it can only ever read live posts.

---

## 8. Environment variables (secrets/config)

These go in a `.env.local` file locally, or in Vercel's Project Settings → Environment Variables for production. **Never commit real values to GitHub.**

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key, safe for browser — used for read-only blog fetching |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Secret key, server-only — used to insert leads/reviews. **Never expose this in client code.** |
| `RESEND_API_KEY` | Optional | Enables email notifications when a new lead comes in |
| `NOTIFY_EMAIL_TO` | Optional | Which inbox gets the new-lead notification email |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Enables Google Analytics 4 tracking |

---

## 9. Site-wide settings — the one file to edit for contact info

**File: `lib/site-config.ts`**

This is the single source of truth for:
- Business name, domain, email
- **WhatsApp number** (international format, no `+`, no spaces — e.g. `447462230676`)
- The default pre-filled WhatsApp message
- Main navigation menu links (add/remove/reorder pages here)
- Primary and secondary call-to-action button text

Every place on the site that shows the WhatsApp button, nav menu, or CTA buttons pulls from this one file — **update contact details here, not by searching through every page.**

---

## 10. Images

| What | Where | Notes |
|---|---|---|
| Hero rotating images | `public/hero/hero-1.jpg` … `hero-5.jpg` | Captions/order controlled by `lib/hero-images.ts`. Spec: 4:3 aspect ratio, ~1600×1200px, under 300–400KB each, consistent lighting/style across all slides. |
| Logo | `public/logo.png` | Used in header/footer and Organization structured data (SEO) |
| Social share image | `public/og-image.jpg` | Shown when the site is shared on Facebook/Twitter/LinkedIn — 1200×630px |
| Decorative hero graphic | `components/PanelGridGraphic.tsx` | This is hand-coded SVG, not an image file — can be swapped for a real photo later, or kept as-is |

To add/remove a hero slide: drop the image file in `public/hero/`, then add/remove its entry in `lib/hero-images.ts`.

---

## 11. Design tokens (colors, fonts, spacing)

**File: `tailwind.config.ts`** — change a color here and it updates everywhere that color is used.

| Token | Hex | Used for |
|---|---|---|
| `navy` | `#0B2545` | Headings, dark backgrounds (footer, trust strip) |
| `trust` | `#1B6CA8` | Primary brand blue — buttons, links, active tab states |
| `leaf` | `#2E9E5B` | Green — checkmarks, "included" ticks, positive badges |
| `amber` | `#F2A93B` | Accent/warning color |
| `ink` | `#1C2530` (+ lighter shades) | Body text |
| `surface` | `#F8FAFB` / `#EFF4F6` | Page and section backgrounds |

Fonts: **Space Grotesk** (headings/display), **Inter** (body text), **JetBrains Mono** (small mono labels like "01" step numbers) — all loaded automatically via Google Fonts in `app/layout.tsx`, no manual font files needed.

Reusable button/label styles (`.btn-primary`, `.btn-secondary`, `.eyebrow`, `.section-pad`, `.container-max`, `.card-lift`) are defined once in `app/globals.css`.

---

## 12. SEO setup already in place

- Every page has its own `<title>` and meta description (set per-page in each `page.tsx`'s `metadata` export)
- Canonical URLs set on every page
- Open Graph + Twitter card images configured (`public/og-image.jpg`)
- `Organization` structured data (JSON-LD) on the homepage — helps Google show the logo/name in search results
- Auto-generated `robots.txt` (`app/robots.ts`) and `sitemap.xml` (`app/sitemap.ts`) — **if you add a new page, add its URL to `app/sitemap.ts`**

---

## 13. Legal pages

`/privacy` and `/terms` are already written (last updated Aug 28, 2026) but were drafted as a starting structure, not reviewed by a lawyer. Key points already covered:
- **Terms:** the business is a marketing/ads agency, not a solar seller; clients (not this business) are responsible for consumer-contact law compliance (e.g., TCPA) for leads generated through their campaigns; no long-term contract policy; lead-quality dispute policy
- **Privacy:** what the contact/review forms collect, that it's never sold to third parties, retention basics, and a note that this policy doesn't cover the separate data solar-business clients collect through their own ad campaigns

**Recommendation:** have an actual lawyer or a service like Termly review both before treating them as final.

---

## 14. Common changes — quick reference for a developer

| I want to... | Edit this file |
|---|---|
| Change a price or package name | `lib/pricing.ts` |
| Change an add-on's price/description/details | `lib/pricing.ts` |
| Change how pricing cards look (colors, layout) | `components/PricingSection.tsx` |
| Change the WhatsApp number or business email | `lib/site-config.ts` |
| Add/remove/reorder a nav menu item | `lib/site-config.ts` |
| Swap a hero image or its caption | `lib/hero-images.ts` + `public/hero/` |
| Edit homepage copy/sections | `app/page.tsx` (assembles components) + the individual component files in `components/` |
| Edit FAQ questions | `app/faq/page.tsx` (full list) and `components/FAQSection.tsx` (homepage teaser) |
| Change brand colors or fonts | `tailwind.config.ts` |
| Add a brand-new page | Create a folder + `page.tsx` under `app/`, then add its URL to `app/sitemap.ts` and (if it should be in the menu) `lib/site-config.ts` |
| Change what the contact form collects | `components/ContactForm.tsx` (fields) + `app/contact/actions.ts` (validation/saving logic) |
| Swap placeholder testimonials for real ones | `components/TestimonialsSection.tsx` and/or `lib/reviews.ts` (fallback shown when no real Supabase reviews exist yet) |

---

## 15. Deployment

1. Push the repo to GitHub.
2. Import the repo into **Vercel** — it auto-detects Next.js, no manual config needed.
3. Add all required environment variables (Section 8) in Vercel → Project Settings → Environment Variables.
4. In Vercel → Domains, add the real domain and follow the DNS instructions shown (usually an A record or CNAME at your domain registrar).
5. Every push to the main branch auto-redeploys.

---

*This file describes the site as of August 31, 2026. If a developer makes structural changes (new pages, new data sources, renamed files), ask them to update this file too, so it stays a reliable single reference.*
