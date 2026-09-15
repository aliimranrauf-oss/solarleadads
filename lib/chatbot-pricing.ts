// Pricing for the AI Chatbot service line. Kept separate from lib/pricing.ts
// (which powers the Meta-ads packages) since this is a one-time setup fee,
// not a recurring regional price. Update the numbers here and both the
// /ai-chatbot page and this file's exported copy stay in sync.

import { discountPercent as sharedDiscountPercent } from "./discount";

export type ChatbotTier = {
  id: "basic" | "ai" | "pro";
  name: string;
  mostPopular?: boolean;
  tagline: string;
  /** Original (pre-discount) one-time setup price, in USD. */
  originalPrice: number;
  /** Current discounted one-time setup price, in USD. */
  price: number;
  /** Use "from" when the final price can move with scope. */
  priceQualifier?: "from" | "flat";
  features: string[];
};

export const chatbotTiers: ChatbotTier[] = [
  {
    id: "basic",
    name: "Basic FAQ Bot",
    tagline: "Scripted replies, no AI. Good for straightforward, repeatable questions.",
    originalPrice: 249,
    price: 99,
    priceQualifier: "flat",
    features: [
      "Rule-based Q&A flow — no AI model, so zero ongoing running cost",
      "Website popup widget, styled to match your brand",
      "1 round of revisions included",
      "Delivered in 3–5 business days",
      "You own it outright — no monthly fee, ever",
    ],
  },
  {
    id: "ai",
    name: "AI-Powered Bot",
    mostPopular: true,
    tagline: "GPT, Claude, or Grok — trained on your own business data.",
    originalPrice: 375,
    price: 150,
    priceQualifier: "from",
    features: [
      "Real memory + RAG grounded in your services, pricing & FAQs",
      "Website widget included",
      "Runs on your own API key — you own the bot and the data",
      "WhatsApp / Telegram integration: +$50 one-time",
      "Minor tweaks & Q&A updates after launch: free",
      "Bigger custom features (CRM, extra integrations): quoted separately based on scope",
    ],
  },
  {
    id: "pro",
    name: "Pro Multi-Channel Bot",
    tagline: "Everything in AI-Powered, built out across every channel your leads use.",
    originalPrice: 625,
    price: 250,
    priceQualifier: "from",
    features: [
      "Everything in AI-Powered, plus:",
      "WhatsApp + Telegram + Instagram DM included — no per-channel add-on",
      "CRM / lead-capture integration",
      "Multilingual support",
      "Custom persona & guardrails tuned to your brand",
      "Priority build turnaround",
    ],
  },
];

export function discountPercent(tier: ChatbotTier): number {
  return sharedDiscountPercent(tier.price, tier.originalPrice);
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
