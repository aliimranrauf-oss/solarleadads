export type Region = "us" | "uk" | "au";

export const regions: { id: Region; label: string; currency: string }[] = [
  { id: "us", label: "USA", currency: "$" },
  { id: "uk", label: "UK", currency: "£" },
  { id: "au", label: "Australia", currency: "A$" },
];

export type PricingTier = {
  id: "starter" | "growth" | "scale";
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
  {
    id: "starter",
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
];

export const addOns = [
  {
    name: "Website / Funnel Build",
    price: "One-time, from $750",
    description: "For clients who don't yet have a landing page built to convert Meta traffic.",
  },
  {
    name: "AI Appointment Setter",
    price: "+$400/month",
    description: "Automatically follows up and books qualified leads onto your calendar.",
  },
  {
    name: "Google Ads Add-on",
    price: "+$800/month",
    description: "Capture high-intent Google searches alongside your Meta campaigns.",
  },
];

export function findTier(id?: string | null): PricingTier | undefined {
  if (!id) return undefined;
  return pricingTiers.find((t) => t.id === id);
}

export function formatCurrency(region: Region, amount: number): string {
  const { currency } = regions.find((r) => r.id === region)!;
  return `${currency}${amount.toLocaleString("en-US")}`;
}
