// Zero-cost, zero-API "Instant Answers" bot. Pure keyword matching against
// content that already exists in lib/pricing.ts and lib/chatbot/knowledge.ts,
// so it can never say something inconsistent with the rest of the site —
// and it never claims to be AI.

import { addOns, tiersForTrack } from "@/lib/pricing";
import { faqs, LEAD_INTENT_KEYWORDS } from "./knowledge";

export type FaqBotReply = {
  text: string;
  suggestQuote?: boolean;
  /**
   * True only when a real keyword/topic entry matched (pricing, a specific
   * FAQ, greeting, etc). False for both fallback branches below (the
   * lead-intent nudge and the generic "didn't catch that" message) —
   * neither is a real answer, so hybrid mode should escalate to the AI
   * endpoint in both cases rather than treat them as "handled".
   */
  matched: boolean;
};

type Entry = { keywords: string[]; response: string };

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildEntries(): Entry[] {
  const entries: Entry[] = [];

  // FAQs, reused verbatim from lib/chatbot/knowledge.ts.
  entries.push(
    { keywords: ["exclusive", "resell", "resold", "shared with other"], response: faqs[0].a },
    { keywords: ["only work with installers", "only installers", "what businesses", "what kind of solar"], response: faqs[1].a },
    { keywords: ["long term contract", "long-term contract", "locked in", "contract length"], response: faqs[2].a },
    { keywords: ["how do i receive", "how do i get leads", "receive leads", "receive new leads"], response: faqs[3].a },
    { keywords: ["low quality", "bad lead", "unqualified", "lead quality"], response: faqs[4].a },
    { keywords: ["affect my posts", "existing content", "organic posts"], response: faqs[5].a },
    { keywords: ["is it safe", "meta access safe", "facebook access safe", "safe to give access"], response: faqs[6].a },
    { keywords: ["don't have a facebook", "dont have a facebook", "no facebook page", "haven't created", "havent created"], response: faqs[7].a },
    { keywords: ["admin access", "whole facebook page", "full access", "just the ad account"], response: faqs[8].a },
    { keywords: ["remove your access", "revoke access", "take back access"], response: faqs[9].a },
    { keywords: ["how soon", "how fast can i start", "when can i launch", "go live"], response: faqs[11].a },
    { keywords: ["how do i pay", "how and when do i pay", "payoneer", "payment link"], response: faqs[12].a }
  );

  // Pricing summary — tier names, taglines, and lead estimates only (no
  // currency figures here, since those vary by region). Generated from
  // lib/pricing.ts so it can never drift from the real numbers on
  // /services — nothing to keep in sync by hand.
  const installationSummary = tiersForTrack("installation")
    .map((t) => `• ${t.name} — ${t.leadsEstimate}`)
    .join("\n");
  const localSummary = tiersForTrack("local")
    .map((t) => `• ${t.name} — ${t.leadsEstimate}`)
    .join("\n");
  const addOnsSummary = addOns.map((a) => `• ${a.name} (${a.price})`).join("\n");

  entries.push({
    keywords: ["price", "pricing", "cost", "how much", "fee", "fees", "rates"],
    response: `Pricing depends on your region (USA, UK, or Australia) and which track fits your business:\n\nInstallation & Sales:\n${installationSummary}\n\nCleaning & Repair:\n${localSummary}\n\nAdd-ons:\n${addOnsSummary}\n\nFull numbers by region are on /services — or tell me your region and track and I'll point you to the right tier.`,
  });

  // Small talk.
  entries.push({
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    response: "Hey! Ask me about pricing, leads, regions we cover, or how Meta ad access works — happy to help.",
  });

  // "What's the process?" — common follow-up, grounded rather than
  // falling through to AI every time.
  entries.push({
    keywords: [
      "process",
      "how it works",
      "how does it work",
      "how do you work",
      "what steps",
      "what happens next",
      "how do we start",
      "how do i start",
      "getting started",
    ],
    response:
      "Here's how it works:\n\n1. You request a free lead audit (here, via the contact form, or WhatsApp) describing your business and goals.\n2. We review it and send a clear, personalized quote — no obligation.\n3. Once you confirm a package, we set up (or help set up) your Meta ad account and campaign — creative, landing page, and targeting.\n4. Your campaign goes live, usually within a few business days.\n5. Leads land in your WhatsApp/email the moment they come in, with regular reporting.\n\nWant to get started? Share a few details and we'll follow up.",
  });

  return entries;
}

const ENTRIES = buildEntries();

export function getFaqResponse(userMessage: string): FaqBotReply {
  const normalized = normalize(userMessage);
  const hasLeadIntent = LEAD_INTENT_KEYWORDS.some((k) => normalized.includes(k));

  for (const entry of ENTRIES) {
    if (entry.keywords.some((k) => normalized.includes(k))) {
      return { text: entry.response, suggestQuote: hasLeadIntent, matched: true };
    }
  }

  // Fallback branches below: neither is a real topic match, so both are
  // matched: false — hybrid mode escalates to the AI endpoint for both.
  if (hasLeadIntent) {
    return {
      text: "Sounds like you're ready to get leads flowing. Want to leave a few details — name, email, and company — and we'll send a free lead audit?",
      suggestQuote: true,
      matched: false,
    };
  }

  return {
    text: "I didn't quite catch that — I can answer questions about pricing, leads, regions, and Meta ad access. For anything else, let's get you to a real person.",
    suggestQuote: true,
    matched: false,
  };
}
