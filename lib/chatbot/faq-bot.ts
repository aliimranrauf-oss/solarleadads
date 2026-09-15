// Zero-cost, zero-API "Instant Answers" bot. Pure keyword matching against
// content that already exists in lib/pricing.ts and lib/chatbot/knowledge.ts,
// so it can never say something inconsistent with the rest of the site —
// and it never claims to be AI.

import { addOns, tiersForTrack } from "@/lib/pricing";
import { chatbotFaqs, faqs, LEAD_INTENT_KEYWORDS, CHATBOT_INTENT_KEYWORDS } from "./knowledge";

export type FaqHistoryMessage = { role: "user" | "assistant"; content: string };

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

// Bare "pricing"/"cost"/"how much" etc is ambiguous between the two service
// lines (Meta ads vs AI chatbot), so it's NOT a normal keyword entry in
// ENTRIES — it's resolved separately in getFaqResponse() using conversation
// context. See hasChatbotContext() below.
const GENERIC_PRICING_KEYWORDS = ["price", "pricing", "cost", "how much", "fee", "fees", "rates"];

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True when `keyword` appears in `haystack` starting at a word boundary.
 *
 * A plain `.includes()` here caused false positives on short keywords: the
 * greeting keyword "hi" matched inside "karac-hi" and "t-hi-s", so "what is
 * the weather in Karachi" and "how does this work" both got answered with
 * "Hey! I can help with..." instead of falling through to a real answer.
 *
 * Only the START of the keyword is anchored, not the end. That's deliberate —
 * it still lets "price" match "prices"/"priced" and "fee" match "fees", which
 * the keyword lists below rely on, while blocking mid-word collisions.
 */
function containsKeyword(haystack: string, keyword: string): boolean {
  return new RegExp(`\\b${escapeRegex(keyword)}`).test(haystack);
}

function buildEntries(): { entries: Entry[]; adsPricingResponse: string; chatbotPricingResponse: string } {
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

  // --- AI CHATBOT SERVICE ---
  // Deliberately placed BEFORE the pricing entry below: the pricing entry
  // matches the generic keyword "how much", which would otherwise swallow
  // "how much does an AI chatbot cost" and answer with Meta ads tiers.
  // First match wins in getFaqResponse(), so order here is load-bearing.
  entries.push(
    {
      keywords: [
        "chatbot cost",
        "chat bot cost",
        "chatbot price",
        "chat bot price",
        "chatbot pricing",
        "cost of a chatbot",
        "how much is a chatbot",
        "how much does a chatbot",
        "how much does an ai chatbot",
      ],
      response: chatbotFaqs[7].a,
    },
    {
      keywords: [
        "build a chatbot",
        "build an ai",
        "do you build chatbot",
        "do you make chatbot",
        "do you build ai",
        "chatbot service",
        "ai chatbot for my",
        "chatbot for my website",
        "chat bot for my website",
      ],
      response: chatbotFaqs[0].a,
    },
    {
      keywords: ["what does the chatbot do", "what can the chatbot", "chatbot features", "what does the bot do"],
      response: chatbotFaqs[1].a,
    },
    {
      keywords: ["trained on", "train the bot", "train the chatbot", "knowledge base", "my own information"],
      response: chatbotFaqs[2].a,
    },
    {
      keywords: ["wordpress", "shopify", "webflow", "wix", "install the bot", "install the chatbot", "embed"],
      response: chatbotFaqs[5].a,
    },
    {
      keywords: ["how long to build", "chatbot timeline", "how long does the chatbot", "delivery time"],
      response: chatbotFaqs[6].a,
    },
    {
      keywords: ["token", "api cost", "api usage", "hybrid", "keep costs low"],
      response: chatbotFaqs[4].a,
    },
    {
      keywords: ["who owns", "own the data", "conversation data", "data ownership"],
      response: chatbotFaqs[9].a,
    },
    {
      keywords: ["maintain the bot", "chatbot support", "after it goes live", "ongoing support"],
      response: chatbotFaqs[8].a,
    }
  );

  // Pricing summary — tier names, taglines, and lead estimates only (no
  // currency figures here, since those vary by region). Generated from
  // lib/pricing.ts so it can never drift from the real numbers on
  // /services — nothing to keep in sync by hand.
  //
  // NOTE: this is intentionally NOT added as a keyword entry in ENTRIES.
  // A bare "pricing"/"cost"/"how much" is ambiguous between the two service
  // lines, so it's handled specially in getFaqResponse() below, which checks
  // conversation context (via CHATBOT_INTENT_KEYWORDS) before deciding
  // whether to show ads pricing or chatbot pricing.
  const installationSummary = tiersForTrack("installation")
    .map((t) => `• ${t.name} — ${t.leadsEstimate}`)
    .join("\n");
  const localSummary = tiersForTrack("local")
    .map((t) => `• ${t.name} — ${t.leadsEstimate}`)
    .join("\n");
  const addOnsSummary = addOns.map((a) => `• ${a.name} (${a.price})`).join("\n");

  const adsPricingResponse = `Pricing depends on your region (USA, UK, or Australia) and which track fits your business:\n\nInstallation & Sales:\n${installationSummary}\n\nCleaning & Repair:\n${localSummary}\n\nAdd-ons:\n${addOnsSummary}\n\nFull numbers by region are on /services — or tell me your region and track and I'll point you to the right tier.`;

  // Small talk.
  entries.push({
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    response:
      "Hey! I can help with two things: Meta ad campaigns that bring exclusive leads to your solar business, and custom AI chatbots we build for solar companies worldwide. Ask me about pricing, leads, regions, or the chatbot service — whatever's useful.",
  });

  // "What's the process?" — common follow-up, grounded rather than
  // falling through to AI every time.
  entries.push({
    keywords: [
      "process",
      "how it works",
      "how does it work",
      "how does this work",
      "how does all this work",
      "what s the process",
      "whats the process",
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

  return { entries, adsPricingResponse, chatbotPricingResponse: chatbotFaqs[7].a };
}

const { entries: ENTRIES, adsPricingResponse: ADS_PRICING_RESPONSE, chatbotPricingResponse: CHATBOT_PRICING_RESPONSE } =
  buildEntries();

/**
 * Was the AI-chatbot service (rather than the Meta-ads service) the topic of
 * this conversation? Checked across the whole thread, not just the latest
 * message — a visitor who said "chat bot for my solar business" two turns
 * ago and then just types "pricing" is still asking about the chatbot.
 */
function hasChatbotContext(userMessage: string, history: FaqHistoryMessage[]): boolean {
  const combined = normalize([...history.map((m) => m.content), userMessage].join(" "));
  return CHATBOT_INTENT_KEYWORDS.some((k) => containsKeyword(combined, k));
}

export function getFaqResponse(userMessage: string, history: FaqHistoryMessage[] = []): FaqBotReply {
  const normalized = normalize(userMessage);
  const hasLeadIntent = LEAD_INTENT_KEYWORDS.some((k) => containsKeyword(normalized, k));

  for (const entry of ENTRIES) {
    if (entry.keywords.some((k) => containsKeyword(normalized, k))) {
      return { text: entry.response, suggestQuote: hasLeadIntent, matched: true };
    }
  }

  // Bare "pricing"/"cost"/"how much" etc: ambiguous on its own, so resolve
  // it using conversation context instead of a fixed keyword entry.
  if (GENERIC_PRICING_KEYWORDS.some((k) => containsKeyword(normalized, k))) {
    const isChatbotTopic = hasChatbotContext(userMessage, history);
    return {
      text: isChatbotTopic ? CHATBOT_PRICING_RESPONSE : ADS_PRICING_RESPONSE,
      suggestQuote: hasLeadIntent,
      matched: true,
    };
  }

  // Fallback branches below: neither is a real topic match, so both are
  // matched: false — hybrid mode escalates to the AI endpoint for both.
  if (hasLeadIntent) {
    return {
      text: "Sounds like you're ready to get started. Use the quick form below, or message us on WhatsApp for a faster reply.",
      suggestQuote: true,
      matched: false,
    };
  }

  return {
    text:
      "I didn't quite catch that — I can answer questions about our Meta ads lead generation (pricing, lead quality, regions, ad account access) and about the AI chatbots we build for solar businesses. For anything else, let's get you to a real person.",
    suggestQuote: true,
    matched: false,
  };
}
