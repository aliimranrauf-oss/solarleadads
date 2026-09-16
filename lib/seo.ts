/**
 * Central SEO helpers — every piece of structured data on the site is built
 * here so the numbers, names, and URLs can never drift apart between pages.
 *
 * Google reads JSON-LD to decide which rich results a page is eligible for.
 * The three that matter most for this site:
 *   - Offer / price       → price shown directly in search results
 *   - AggregateRating     → gold stars next to the listing
 *   - FAQPage             → expandable Q&A under the listing
 *
 * IMPORTANT: prices here are pulled from lib/pricing.ts and
 * lib/chatbot-pricing.ts, never retyped. Edit the price in those files and
 * the schema follows automatically.
 */

import { pricingTiers, formatCurrency } from "./pricing";
import { chatbotTiers } from "./chatbot-pricing";
import type { Review } from "./reviews";
import { siteConfig } from "./site-config";

export const SITE_URL = "https://solarleadads.com";

export function absoluteUrl(path = "/"): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/** Stable @id so every schema block on the site points at ONE organization
 * entity rather than creating a new one per page. This is what lets Google
 * merge reviews, services, and contact details into a single business. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Public profiles for the business. Google uses `sameAs` to confirm this
 * domain and those profiles are the same entity — it's one of the strongest
 * signals for a knowledge panel.
 *
 * TODO (owner action): replace these with your real, live profile URLs and
 * delete any you don't have. Leaving a wrong URL here is worse than leaving
 * the array empty.
 */
export const socialProfiles: string[] = [
  // "https://www.facebook.com/solarleadads",
  // "https://www.instagram.com/solarleadads",
  // "https://www.linkedin.com/company/solarleadads",
];

export const organizationSchema = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: siteConfig.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.png"),
  },
  image: absoluteUrl("/og-image.jpg"),
  email: siteConfig.email,
  telephone: siteConfig.whatsappDisplayNumber,
  description:
    "SolarLeadAds runs Meta ad campaigns and builds AI chat assistants that bring qualified leads to solar installers, sellers, technicians, and panel & battery providers in the USA, UK, and Australia.",
  slogan: "Exclusive solar leads. No shared lists, no long-term contracts.",
  priceRange: "$$",
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "Australia" },
  ],
  knowsAbout: [
    "Solar lead generation",
    "Meta advertising for solar installers",
    "Facebook Ads for solar companies",
    "Solar panel cleaning leads",
    "AI chatbots for solar businesses",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      telephone: siteConfig.whatsappDisplayNumber,
      availableLanguage: ["English"],
      areaServed: ["US", "GB", "AU"],
    },
  ],
  ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: siteConfig.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

/** Breadcrumbs give Google the "Home › Services › Pricing" trail shown under
 * the blue link instead of a raw URL. Cheap to add, always worth it. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Star rating block, built from real approved reviews.
 * Returns null when there aren't enough genuine reviews — Google penalises
 * rating markup that isn't backed by visible reviews on the page, and the
 * placeholder reviews in lib/reviews.ts must never be marked up. */
export function aggregateRatingFrom(reviews: Review[]) {
  const real = reviews.filter((r) => !r.id.startsWith("placeholder"));
  if (real.length < 2) return null;

  const total = real.reduce((sum, r) => sum + (r.rating || 0), 0);
  return {
    "@type": "AggregateRating",
    ratingValue: Number((total / real.length).toFixed(1)),
    reviewCount: real.length,
    bestRating: 5,
    worstRating: 1,
  };
}

/** Individual review markup. Same rule as above — real reviews only. */
export function reviewsSchema(reviews: Review[]) {
  return reviews
    .filter((r) => !r.id.startsWith("placeholder"))
    .slice(0, 10)
    .map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.created_at,
      reviewBody: r.review,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
}

/**
 * Meta ads packages as a priced offer catalog. USD is used as the schema
 * currency because Google needs one currency per Offer — the on-page
 * switcher still shows GBP/AUD to the visitor.
 */
export function metaAdsOfferCatalog() {
  return {
    "@type": "OfferCatalog",
    name: "Solar Meta Ads Lead Generation Packages",
    itemListElement: pricingTiers.map((tier) => ({
      "@type": "Offer",
      name: `${tier.name} — ${tier.track === "installation" ? "Installation & Sales" : "Cleaning & Repair"}`,
      description: `${tier.tagline} Includes ${tier.leadsEstimate}.`,
      price: tier.fee.us,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/services"),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: tier.fee.us,
        priceCurrency: "USD",
        unitCode: "MON",
        billingIncrement: 1,
      },
    })),
  };
}

/** AI chatbot tiers as one-time-price offers. */
export function chatbotOfferCatalog() {
  return {
    "@type": "OfferCatalog",
    name: "AI Chatbot Development Packages",
    itemListElement: chatbotTiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      description: tier.tagline,
      price: tier.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/ai-chatbot"),
      priceValidUntil: priceValidUntil(),
    })),
  };
}

/** Google wants a `priceValidUntil` on discounted offers. Rolling 12 months
 * from today so it never silently expires and drops the rich result. */
export function priceValidUntil(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

/** Region landing pages (/usa, /uk, /australia) — a Service entity scoped to
 * one country, which is what makes them eligible to rank for
 * "solar lead generation agency <country>" rather than competing with /services. */
export function regionServiceSchema(opts: {
  path: string;
  name: string;
  description: string;
  countryName: string;
  countryCode: string;
}) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: "Solar lead generation",
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": ORG_ID },
    areaServed: {
      "@type": "Country",
      name: opts.countryName,
      identifier: opts.countryCode,
    },
    hasOfferCatalog: metaAdsOfferCatalog(),
  };
}

/** Wraps any set of schema nodes into a single @graph document.
 * One <script> per page beats several — it lets Google link the nodes by @id. */
export function jsonLdGraph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/** Convenience re-export so pages can display the same currency formatting
 * they use in schema without a second import. */
export { formatCurrency };
