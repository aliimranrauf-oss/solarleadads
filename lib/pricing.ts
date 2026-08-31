export type Region = "us" | "uk" | "au";

export const regions: { id: Region; label: string; currency: string }[] = [
  { id: "us", label: "USA", currency: "$" },
  { id: "uk", label: "UK", currency: "£" },
  { id: "au", label: "Australia", currency: "A$" },
];

export type TrackId = "installation" | "local";

export const tracks: { id: TrackId; label: string; subtitle: string }[] = [
  {
    id: "installation",
    label: "Installation & Sales",
    subtitle: "For installers, battery & panel sellers, full system sellers",
  },
  {
    id: "local",
    label: "Cleaning & Repair",
    subtitle: "For cleaning crews, technicians, and maintenance teams",
  },
];

export type PricingTier = {
  id: "starter" | "growth" | "scale" | "essentials" | "plus";
  track: TrackId;
  name: string;
  mostPopular?: boolean;
  tagline: string;
  /** Monthly management fee — what the client pays SolarLeadAds. */
  fee: Record<Region, number>;
  /** Minimum recommended ad spend — paid directly to Meta, not to us. */
  adSpendMin: Record<Region, number>;
  leadsEstimate: string;
  features: string[];
};

export const pricingTiers: PricingTier[] = [
  // --- Installation & Sales track (high-ticket) ---
  {
    id: "starter",
    track: "installation",
    name: "Starter",
    tagline: "For new or small solar businesses getting started with paid leads",
    fee: { us: 997, uk: 850, au: 1650 },
    adSpendMin: { us: 1500, uk: 1250, au: 2400 },
    leadsEstimate: "25–40 exclusive leads/month",
    features: [
      "Meta campaign setup — lead form + landing page",
      "2 ad creative angles, tested and refined",
      "AI-assisted lead filtering to block time-wasters",
      "Instant WhatsApp + email lead delivery",
      "Basic CRM setup (Sheets or GoHighLevel)",
      "Weekly performance reporting",
      "Month-to-month — no long-term contract",
      "Unqualified leads replaced free",
    ],
  },
  {
    id: "growth",
    track: "installation",
    name: "Growth",
    mostPopular: true,
    tagline: "For established businesses ready to scale lead volume",
    fee: { us: 1797, uk: 1500, au: 2950 },
    adSpendMin: { us: 2500, uk: 2000, au: 4000 },
    leadsEstimate: "60–100 exclusive leads/month",
    features: [
      "Everything in Starter, plus:",
      "4–5 ad creatives incl. UGC & install footage",
      "Custom landing page / funnel built for you",
      "Retargeting campaigns for warm leads",
      "Weekly creative & audience A/B testing",
      "Bi-weekly reporting + dedicated check-in",
      "Priority WhatsApp support",
      "Unqualified leads replaced free",
    ],
  },
  {
    id: "scale",
    track: "installation",
    name: "Scale",
    tagline: "For multi-location teams and panel/battery distributors",
    fee: { us: 2997, uk: 2500, au: 4950 },
    adSpendMin: { us: 5000, uk: 4000, au: 8000 },
    leadsEstimate: "120+ exclusive leads/month",
    features: [
      "Everything in Growth, plus:",
      "Multi-city / multi-region campaign structure",
      "8–10 premium creatives/month, incl. video",
      "Higher-intent solar calculator funnel",
      "Full CRM automation & pipeline build",
      "Weekly reporting + priority 24h support",
      "Unqualified leads replaced free",
    ],
  },

  // --- Local Service Leads track (cleaning, repair, maintenance — low-ticket) ---
  {
    id: "essentials",
    track: "local",
    name: "Essentials",
    tagline: "For solar cleaning, repair & maintenance pros getting started with local leads",
    fee: { us: 497, uk: 425, au: 800 },
    adSpendMin: { us: 800, uk: 650, au: 1300 },
    leadsEstimate: "30–50 local leads/month",
    features: [
      "Simple lead form — no custom funnel needed",
      "1–2 ad angles built around local, fast-decision jobs",
      "Instant WhatsApp + email lead delivery",
      "Monthly performance reporting",
      "Month-to-month — no long-term contract",
      "Unqualified leads replaced free",
    ],
  },
  {
    id: "plus",
    track: "local",
    name: "Plus",
    mostPopular: true,
    tagline: "For local pros ready for more volume and repeat seasonal demand",
    fee: { us: 697, uk: 575, au: 1150 },
    adSpendMin: { us: 1200, uk: 950, au: 1900 },
    leadsEstimate: "60–90 local leads/month",
    features: [
      "Everything in Essentials, plus:",
      "3–4 ad creatives, incl. seasonal offers",
      "Retargeting for past inquiries",
      "Bi-weekly performance reporting",
      "Priority WhatsApp support",
      "Unqualified leads replaced free",
    ],
  },
];

export type AddOn = {
  name: string;
  price: string;
  description: string;
  /** Specific inclusions — shown as a short bullet list under the description. */
  details: string[];
  /** True if this can be bought on its own, without a full lead-gen package. */
  standalone?: boolean;
  standaloneNote?: string;
};

export const addOns: AddOn[] = [
  {
    name: "Website / Funnel Build",
    price: "One-time, from $750",
    description: "For clients who don't yet have a landing page built to convert Meta traffic.",
    details: [
      "Mobile-first landing page, built to convert paid traffic",
      "Fast load speed + tracking pixels installed",
      "1 round of revisions included",
      "Delivered in 5–7 business days",
    ],
    standalone: true,
    standaloneNote: "Just need a converting page? This works as a stand-alone project — no ad management required.",
  },
  {
    name: "AI Appointment Setter",
    price: "+$400/month",
    description: "Automatically follows up and books qualified leads onto your calendar.",
    details: [
      "Instant SMS/WhatsApp reply to every new lead",
      "Automated follow-up sequence until booked or disqualified",
      "Books directly onto your calendar — no manual chasing",
    ],
    standalone: false,
    standaloneNote: "Requires an active lead package — it needs leads flowing in to follow up on.",
  },
  {
    name: "Google Ads Add-on",
    price: "+$800/month",
    description: "Capture high-intent Google searches alongside your Meta campaigns.",
    details: [
      "Search campaign setup targeting high-intent local keywords",
      "Call tracking so you know which leads came from Google",
      "Reported alongside your Meta results, same dashboard",
    ],
    standalone: true,
    standaloneNote: "Prefer search intent over social? This can run as your primary lead channel on its own.",
  },
];

export function findTier(id?: string | null): PricingTier | undefined {
  if (!id) return undefined;
  return pricingTiers.find((t) => t.id === id);
}

export function tiersForTrack(trackId: TrackId): PricingTier[] {
  return pricingTiers.filter((t) => t.track === trackId);
}

export function formatCurrency(region: Region, amount: number): string {
  const { currency } = regions.find((r) => r.id === region)!;
  return `${currency}${amount.toLocaleString("en-US")}`;
}
