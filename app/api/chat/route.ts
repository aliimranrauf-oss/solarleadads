import { NextRequest, NextResponse } from "next/server";
import { regions, tracks, pricingTiers, addOns, formatCurrency, type PricingTier } from "@/lib/pricing";
import { chatbotFaqs, faqs } from "@/lib/chatbot/knowledge";
import { PERSONA } from "@/lib/chatbot/persona";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// AI PROVIDER
// ---------------------------------------------------------------------------
// Two providers are supported, both OpenAI-compatible, so the request/response
// shape below is identical for either — only the URL, key, and model change.
// No extra npm dependency is needed beyond a plain fetch call.
//
//   Groq  (groq.com)  — fast, generous free tier. Key starts with "gsk_".
//   Grok  (x.ai)      — xAI's model. Paid, key starts with "xai-".
//
// These are two DIFFERENT companies with confusingly similar names.
//
// Pick one by setting AI_PROVIDER in your environment variables:
//   AI_PROVIDER=groq   (default if unset — keeps existing deployments working)
//   AI_PROVIDER=grok
//
// Then set the matching key: GROQ_API_KEY or XAI_API_KEY.
// Optionally override the model with AI_MODEL.

type ProviderId = "groq" | "grok";

const PROVIDERS: Record<
  ProviderId,
  { url: string; defaultModel: string; envKey: string; label: string }
> = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "openai/gpt-oss-120b",
    envKey: "GROQ_API_KEY",
    label: "Groq",
  },
  grok: {
    url: "https://api.x.ai/v1/chat/completions",
    defaultModel: "grok-4-fast",
    envKey: "XAI_API_KEY",
    label: "xAI Grok",
  },
};

function resolveProvider() {
  const raw = (process.env.AI_PROVIDER ?? "groq").trim().toLowerCase();
  const id: ProviderId = raw === "grok" || raw === "xai" ? "grok" : "groq";
  const config = PROVIDERS[id];
  return {
    id,
    label: config.label,
    url: config.url,
    model: process.env.AI_MODEL?.trim() || config.defaultModel,
    apiKey: process.env[config.envKey],
    envKey: config.envKey,
  };
}

const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_OUTPUT_TOKENS = 300;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 20; // per IP, per window

const GLOBAL_RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day
const GLOBAL_RATE_LIMIT_MAX_REQUESTS = 300; // whole site, per day — adjust to taste

const RESPONSE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const CIRCUIT_BREAKER_FAILURE_THRESHOLD = 3; // consecutive Groq failures
const CIRCUIT_BREAKER_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// In-memory only, all of it: every map/counter below resets on cold start
// and isn't shared across serverless instances/regions. Fine for current
// traffic on a single Vercel deployment — revisit with Redis/Upstash if
// traffic grows enough that cold starts or multi-instance scaling start
// undercounting these.

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Global (site-wide, not per-IP) daily cap — a backstop against a burst of
// requests spread across many different visitors/IPs at once, which the
// per-IP limiter above can't catch on its own.
let globalRateState = { count: 0, resetAt: Date.now() + GLOBAL_RATE_LIMIT_WINDOW_MS };

function isGloballyRateLimited(): boolean {
  const now = Date.now();
  if (now > globalRateState.resetAt) {
    globalRateState = { count: 1, resetAt: now + GLOBAL_RATE_LIMIT_WINDOW_MS };
    return false;
  }
  if (globalRateState.count >= GLOBAL_RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  globalRateState.count += 1;
  return false;
}

// Response cache for repeat questions: keyed on a normalized version of the
// latest user message, so near-identical questions from different visitors
// reuse one AI call instead of paying for it twice within the TTL window.
// Intentionally ignores prior conversation history as part of the cache
// key — if that becomes a problem, key on the full message list instead,
// at the cost of a much lower cache hit rate.
const responseCache = new Map<string, { reply: string; suggestQuote: boolean; expiresAt: number }>();

function normalizeForCache(message: string): string {
  return message.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getCachedResponse(message: string) {
  const key = normalizeForCache(message);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry;
}

function setCachedResponse(message: string, reply: string, suggestQuote: boolean) {
  const key = normalizeForCache(message);
  responseCache.set(key, { reply, suggestQuote, expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS });
}

// Circuit breaker: if the AI provider starts failing repeatedly (rate limit, outage, a
// deprecated model 404ing), stop hammering it on every visitor request and
// show a friendly message for a cooldown window instead. Resets to closed
// the moment a call succeeds.
let circuitBreakerState = { consecutiveFailures: 0, openUntil: 0 };

function isCircuitOpen(): boolean {
  return Date.now() < circuitBreakerState.openUntil;
}

function recordProviderFailure() {
  circuitBreakerState.consecutiveFailures += 1;
  if (circuitBreakerState.consecutiveFailures >= CIRCUIT_BREAKER_FAILURE_THRESHOLD) {
    circuitBreakerState.openUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
  }
}

function recordProviderSuccess() {
  circuitBreakerState = { consecutiveFailures: 0, openUntil: 0 };
}

function formatTier(t: PricingTier): string {
  const feeLine = regions.map((r) => `${r.label} ${formatCurrency(r.id, t.fee[r.id])}`).join(" / ");
  const spendLine = regions
    .map((r) => `${r.label} ${formatCurrency(r.id, t.adSpendMin[r.id])}+`)
    .join(" / ");
  return `  - ${t.name}${t.mostPopular ? " (Most Popular)" : ""}: ${t.tagline}\n    Monthly fee: ${feeLine}\n    Recommended min ad spend (paid to Meta, not us): ${spendLine}\n    Estimated leads: ${t.leadsEstimate}`;
}

function buildPricingText(): string {
  return tracks
    .map((track) => {
      const tierLines = pricingTiers
        .filter((t) => t.track === track.id)
        .map(formatTier)
        .join("\n");
      return `${track.label} (${track.subtitle}):\n${tierLines}`;
    })
    .join("\n\n");
}

function buildAddOnsText(): string {
  return addOns
    .map((a) => `  - ${a.name} (${a.price})${a.standalone ? " — can be bought standalone" : ""}: ${a.description}`)
    .join("\n");
}

function buildSystemPrompt(): string {
  const pricingText = buildPricingText();
  const addOnsText = buildAddOnsText();
  const faqText = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
  const chatbotFaqText = chatbotFaqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  // Generated from lib/pricing.ts and lib/chatbot/knowledge.ts at module
  // load, so pricing/FAQ changes there flow into the bot's knowledge
  // automatically — nothing to keep in sync by hand.
  return `You are the assistant for SolarLeadAds.com. The business has two service lines, both built only for the solar industry: (1) Meta (Facebook/Instagram) ads lead generation, and (2) custom AI chatbot development for solar businesses worldwide. Every visitor is a solar business, not a homeowner.

Answer questions about pricing, leads, regions covered, Meta ad access, the onboarding process, and the AI chatbot service using ONLY the information below. If asked something outside this scope, say you're not sure and offer to connect them with the team via the contact form. Keep answers short: 2 to 4 sentences, unless listing pricing tiers.

Always respond to the visitor's most recent message specifically — read it carefully before answering. If it asks something different from your previous reply, address that new question directly instead of repeating your last answer. Never pad an answer with pricing info the visitor didn't ask about in their latest message.

${PERSONA}

Regions served BY THE META ADS SERVICE: ${regions.map((r) => r.label).join(", ")} (plus other countries on a case-by-case "Global" basis). The AI chatbot service has no regional restriction — it is sold to solar businesses anywhere in the world.

Pricing by track and region (META ADS SERVICE ONLY — these figures are NOT the price of an AI chatbot build, which is quoted per project):
${pricingText}

Add-ons:
${addOnsText}

FAQs — Meta ads lead generation:
${faqText}

FAQs — AI chatbot development service:
${chatbotFaqText}

If the user expresses interest in starting a campaign, getting a lead audit, having an AI chatbot built, or hiring the team in any other way, ask for their name, email, and company name so the team can follow up. The moment you send a reply that asks for their name/email/company, end that exact reply with the marker [[COLLECT_CONTACT]] on its own line. This marker is stripped before the user ever sees it — never explain it or mention it exists.`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

type IncomingMessage = { role: "user" | "assistant"; content: string };

function clean(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  const provider = resolveProvider();
  const apiKey = provider.apiKey;

  if (!apiKey) {
    console.error(
      `${provider.envKey} is not set (AI_PROVIDER=${provider.id}). ` +
        "Set it in .env.local locally, or in Vercel > Settings > Environment Variables."
    );
    return NextResponse.json(
      { reply: "The AI assistant isn't configured yet — please use the contact form instead." },
      { status: 500 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { reply: "You've hit the message limit for now — please try again later or use the contact form." },
      { status: 429 }
    );
  }

  if (isGloballyRateLimited()) {
    return NextResponse.json(
      { reply: "We're getting a lot of questions right now — please try again later or use the contact form." },
      { status: 429 }
    );
  }

  if (isCircuitOpen()) {
    return NextResponse.json(
      { reply: "We're experiencing high demand right now — please try again in a few minutes, or use the contact form." },
      { status: 503 }
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];

  const messages: IncomingMessage[] = rawMessages
    .filter(
      (m): m is IncomingMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({ role: m.role, content: clean(m.content, MAX_MESSAGE_LENGTH) }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);

  if (messages.length === 0) {
    return NextResponse.json({ reply: "Say something and I'll do my best to help!" }, { status: 400 });
  }

  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ reply: "Invalid conversation state." }, { status: 400 });
  }

  const latestUserMessage = messages[messages.length - 1].content;
  const cached = getCachedResponse(latestUserMessage);
  if (cached) {
    return NextResponse.json({ reply: cached.reply, suggestQuote: cached.suggestQuote });
  }

  // Both providers are OpenAI-compatible: plain "system"/"user"/"assistant"
  // roles in a single messages array.
  const providerMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const aiRes = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: providerMessages,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text().catch(() => "");
      console.error(`${provider.label} API error:`, aiRes.status, errText);
      recordProviderFailure();
      return NextResponse.json(
        { reply: "Something went wrong — try again, or use the contact form." },
        { status: 502 }
      );
    }

    const data = await aiRes.json();
    const rawReply: string = data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (!rawReply) {
      recordProviderFailure();
      return NextResponse.json(
        { reply: "Something went wrong — try again, or use the contact form." },
        { status: 502 }
      );
    }

    recordProviderSuccess();

    const suggestQuote = rawReply.includes("[[COLLECT_CONTACT]]");
    const reply = rawReply.replace("[[COLLECT_CONTACT]]", "").trim();

    setCachedResponse(latestUserMessage, reply, suggestQuote);

    return NextResponse.json({ reply, suggestQuote });
  } catch (err) {
    console.error("Chat route error:", err);
    recordProviderFailure();
    return NextResponse.json(
      { reply: "Something went wrong — try again, or use the contact form." },
      { status: 502 }
    );
  }
}
