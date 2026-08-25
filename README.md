# SolarLeadAds — Website

Next.js (App Router) + TypeScript + Tailwind CSS. Homepage is fully built;
other pages are stubbed as the next milestone.

## Stack
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels) via `next/font/google`
- No external image dependency on the homepage — hero uses a custom SVG component (`components/PanelGridGraphic.tsx`) so there's nothing broken if you don't have a photo yet

## Folder structure

```
solarleadads/
├─ app/
│  ├─ layout.tsx        ← root layout: fonts, <Header/>, <Footer/>, metadata, WhatsApp button
│  ├─ page.tsx           ← homepage (assembles all sections below)
│  ├─ globals.css        ← Tailwind + design tokens (buttons, eyebrow label, section padding)
│  ├─ robots.ts          ← auto-generated robots.txt
│  ├─ sitemap.ts         ← auto-generated sitemap.xml (add new pages here as you build them)
│  ├─ services/          ← NOT built yet — create page.tsx here next
│  ├─ results/           ← NOT built yet
│  ├─ about/             ← NOT built yet
│  ├─ process/           ← NOT built yet
│  ├─ contact/           ← NOT built yet (this is where the Supabase form goes)
│  ├─ faq/               ← NOT built yet (full FAQ page — homepage has a short teaser)
│  ├─ privacy/           ← NOT built yet
│  └─ terms/             ← NOT built yet
├─ components/
│  ├─ Header.tsx          Sticky nav + primary CTA
│  ├─ MobileNav.tsx        Mobile menu (client component)
│  ├─ Hero.tsx             Hero section
│  ├─ PanelGridGraphic.tsx Signature SVG illustration (swap for a real photo later, see comment inside)
│  ├─ TrustBar.tsx         3-item trust strip under hero
│  ├─ ProblemSection.tsx
│  ├─ SolutionSection.tsx
│  ├─ ExperienceSection.tsx  "2+ years, across these solar verticals" — no invented stats
│  ├─ ProcessSection.tsx     4-step process
│  ├─ ServicesSnapshot.tsx   3 service cards + link to /services
│  ├─ TestimonialsSection.tsx  PLACEHOLDER content — replace before launch
│  ├─ FAQSection.tsx        Short FAQ teaser + link to /faq
│  ├─ FinalCTA.tsx          Bottom conversion band
│  ├─ WhatsAppButton.tsx    Floating WhatsApp button, site-wide
│  └─ Footer.tsx
├─ lib/
│  └─ site-config.ts     ← single source of truth: email, WhatsApp number, nav links, CTA text
│                            EDIT THIS FIRST — put your real WhatsApp number in whatsappNumber
├─ .env.example           ← copy to .env.local when you build the Contact form (Step 2)
└─ public/                ← put real images here later (currently empty)
```

## Before you deploy — 2 things to update

1. **`lib/site-config.ts`** — replace `whatsappNumber: "10000000000"` with your real
   WhatsApp Business number in international format (e.g. `"923001234567"` for Pakistan,
   no `+`, no spaces). Everything else (email, nav, CTA labels) is already wired from here.
2. Double check `metadataBase` and OG URLs in `app/layout.tsx` still say `solarleadads.com`.

## Hero carousel images

The hero now rotates through 3–6 images automatically (every ~3.2s), each
with its own short caption, similar to a "get more X leads" rotation.

**Where files go:** `public/hero/`, named `hero-1.jpg`, `hero-2.jpg`, etc.
**Where to edit captions/order/count:** `lib/hero-images.ts` — this is a plain
array, add or remove entries to change how many slides show (3–6 is the
sweet spot; more feels slow, fewer feels static).

**Image specs (for your AI generator):**
- **Aspect ratio: 4:3** (landscape) — this is what the carousel container is built for
- **Recommended resolution: 1600 × 1200 px** (scales down cleanly on mobile, sharp on retina screens)
- **Format:** JPG or WEBP — WEBP is smaller for the same quality
- **File size target: under 300–400 KB each** after export (use squoosh.app or tinypng.com to compress if your generator exports larger)
- **Style consistency matters most:** since these rotate in the same spot, keep
  lighting, color grading, and composition style consistent across all slides
  (e.g. don't mix a bright daytime photo with a moody dark one) — inconsistency
  reads as "stock photo grab bag" rather than a designed carousel
- Each image should have a clear focal point roughly centered — the caption
  bar overlays the bottom ~25% of the image, so avoid important detail there

**Example caption set already wired up** (edit freely in `lib/hero-images.ts`):
1. Get more solar installation leads
2. Get more solar checkup & maintenance leads
3. Get hired for solar panel cleaning jobs
4. Get more panel & battery upgrade leads
5. Get more solar sales leads

If an image file is missing, that slide will just show a broken image icon —
so add all files referenced in `lib/hero-images.ts` before deploying, or trim
the array down to only the slides you have images for.



```bash
npm install
npm run dev
```

Then open http://localhost:3000. (Note: the very first `npm run build` needs
real internet access to fetch Google Fonts — this is normal and will work on
your machine and on Vercel automatically.)

## Deploy

1. Push this repo to GitHub.
2. Import the repo in Vercel → it auto-detects Next.js, no config needed.
3. In Vercel project settings → Domains → add `solarleadads.com` and follow
   Vercel's DNS instructions to point it from Namecheap (usually an A record
   or CNAME, Vercel shows you exactly which).

## What's next (in order)

1. **Contact page + Supabase form** — the biggest remaining piece. Fields:
   Name, Email, Company Name, Phone, Message. Needs:
   - A Supabase table for submissions
   - A server action or API route in `app/contact/` that inserts the row
   - An email notification on new submission (Resend or Postmark — Supabase
     alone doesn't send email)
   - Spam protection (honeypot field is enough to start; add reCAPTCHA if spam becomes an issue)
2. **Services page** — expand the 3-card snapshot into full package tiers (Starter/Growth/Scale)
3. **Results page** — case study layout, ready for real numbers once you have clients
4. **About page** — your story, why solar-only, the 2+ years experience across verticals
5. **Process page** — expand the 4-step homepage version into full detail
6. **Full FAQ page** — homepage has 5 questions; expand this list here
7. **Privacy Policy + Terms of Service** — see notes below, get a lawyer to review before publishing
8. Replace `TestimonialsSection.tsx` placeholder content with real client quotes
9. Replace `PanelGridGraphic.tsx` with a real photo once you have one, or keep the illustration — it's fully custom, not a stock asset

## Legal pages — key points to include (not legal advice)

**Terms of Service** should state clearly:
- SolarLeadAds is a marketing/advertising agency — you do not sell solar products or services yourself
- You do not directly contact end consumers; clients (solar businesses) are
  responsible for their own compliance with TCPA and other consumer-contact
  laws for leads generated through their campaigns
- Payment terms, no long-term contract policy, and what happens if a lead is
  disputed as low quality (define this now, even briefly)

**Privacy Policy** should cover:
- What data your own site collects (contact form: name, email, company, phone, message)
- That this data is used only to respond to inquiries, not sold to third parties
- How long you retain it, and how someone can request deletion
- A line distinguishing your site's data collection from the separate consumer
  data your clients collect through their own ad campaigns (which falls under
  their policy, not yours)

**Get an actual lawyer or a service like Termly/Rocket Lawyer to review both
before launch** — the above is a structure to work from, not a substitute for review.
