// Chatbot-facing knowledge that isn't already structured data elsewhere
// (pricing lives in lib/pricing.ts and is imported directly where needed).
//
// This mirrors the content on /faq and the homepage FAQ teaser so the bot
// never contradicts what's already on the site. If you update copy on
// those pages, update it here too — kept separate (rather than importing
// from the page files) because those files export page components, not
// reusable data.

export type KnowledgeFaq = { q: string; a: string };

export const faqs: KnowledgeFaq[] = [
  {
    q: "Are the leads exclusive to my business?",
    a: "Yes. Every lead generated through your campaign goes to you only — we don't resell or share leads across multiple solar businesses.",
  },
  {
    q: "Do you only work with solar panel installers?",
    a: "No. We work across the solar industry — installers, sellers, technicians, panel and lithium battery providers, system checkup and maintenance teams, and solar cleaning services.",
  },
  {
    q: "Do you require a long-term contract?",
    a: "No. We work month-to-month so you can evaluate results without being locked in.",
  },
  {
    q: "How do I receive new leads?",
    a: "Through the method you prefer — a form submission, a WhatsApp message, or email notification, delivered the moment a new lead comes in. Following up by phone is often the fastest way to convert a solar lead, so you're always free to call your leads directly — we don't personally handle or join those calls; that's between you and your customer.",
  },
  {
    q: "What happens if a lead is low quality?",
    a: "We monitor lead quality throughout the campaign and adjust targeting. Specific replacement terms are outlined when we set up your campaign.",
  },
  {
    q: "Will running ads affect my existing posts or page content?",
    a: "No. Ad campaigns run separately from your organic posts and page content, so your existing content stays untouched.",
  },
  {
    q: "Is giving Meta (Facebook/Instagram) access safe?",
    a: "Yes, completely safe. You only grant limited, permission-based access so we can set up and manage your ad campaigns — we never get access to your payment methods, card details, or billing information. You stay in full control and can revoke access at any time.",
  },
  {
    q: "What if we haven't created a Facebook, Meta, or Instagram account yet?",
    a: "No problem. Many businesses start with us before setting anything up. We'll walk you through creating a Meta Business account and Facebook/Instagram pages, or set them up on your behalf, at no extra cost.",
  },
  {
    q: "Do you need admin access to my whole Facebook page, or just the ad account?",
    a: "Just the ad account and the permissions needed to run campaigns. We don't need — or ask for — full admin control over your Facebook page.",
  },
  {
    q: "Can I remove your access once the campaign ends?",
    a: "Yes, at any time — not just at the end of a campaign. You can revoke it whenever you like directly from your Meta Business Settings.",
  },
  {
    q: "How much does it cost to work with you?",
    a: "It depends on your region and which track fits your business (installation & sales, or cleaning & repair) — see /services for the full breakdown, or request a free lead audit and we'll send a personalized quote.",
  },
  {
    q: "How soon can my campaign go live?",
    a: "Once we have your business details and Meta access, most campaigns are ready to launch within a few business days.",
  },
  {
    q: "How and when do I pay?",
    a: "Once you confirm a package, we send a secure payment link through Payoneer — you don't need a Payoneer account yourself, the link lets you pay by debit/credit card or PayPal. The monthly management fee is billed in advance, before that month's work begins.",
  },
];

// ---------------------------------------------------------------------------
// AI CHATBOT SERVICE (second service line, alongside Meta ads lead gen)
// ---------------------------------------------------------------------------
// Kept in its own array rather than appended to `faqs` above because
// lib/chatbot/faq-bot.ts references the Meta-ads FAQs by index (faqs[0],
// faqs[1]...). Appending here would be safe, but a separate array makes the
// two service lines easy to edit independently. Both arrays are fed into the
// AI system prompt in app/api/chat/route.ts.

export const chatbotFaqs: KnowledgeFaq[] = [
  {
    q: "Do you also build AI chatbots for solar businesses?",
    a: "Yes — it's our second service line. We design, build, and deploy custom AI chat assistants for solar businesses worldwide: installers, sellers and consultants, wholesale suppliers and distributors, panel and lithium battery providers, maintenance and system-checkup teams, and solar cleaning companies.",
  },
  {
    q: "What does the AI chatbot actually do for my solar business?",
    a: "It answers customer questions 24/7 in your own brand voice, qualifies visitors before they ever reach your team, captures name/email/company straight into your CRM or inbox, and hands off to a human when a conversation needs one. Most solar sites lose enquiries overnight and on weekends — this is what closes that gap.",
  },
  {
    q: "Is the chatbot trained on my own business information?",
    a: "Yes. We load your services, pricing structure, service areas, warranty terms, FAQs, and tone of voice into the assistant's knowledge base, so it answers as your business — not as a generic AI. It won't invent numbers you haven't given it.",
  },
  {
    q: "Which solar businesses is the AI chatbot built for?",
    a: "Any solar-related business, anywhere in the world — installation companies, panel and system sellers, wholesale and supply distributors, lithium battery suppliers, EPC contractors, O&M and repair teams, and solar panel cleaning services. We are not limited to the USA, UK, and Australia for chatbot work, unlike our Meta ads service.",
  },
  {
    q: "How does the hybrid chatbot keep API costs low?",
    a: "The assistant answers common questions instantly from a built-in knowledge base at zero API cost, and only calls the AI model when a visitor asks something the knowledge base can't handle. Repeat questions are cached, and daily usage caps are built in — so your token spend stays predictable instead of scaling with traffic.",
  },
  {
    q: "What websites can the chatbot be installed on?",
    a: "Next.js, React, WordPress, Shopify, Webflow, Wix, and most standard HTML sites — installed as an embedded widget or built directly into your codebase. If you're unsure what your site runs on, send us the URL and we'll check.",
  },
  {
    q: "How long does it take to build the AI chatbot?",
    a: "A standard build is typically ready in about 1–2 weeks from the point we have your content and site access. More complex builds — multilingual, CRM/calendar integration, or a large product catalogue — take longer, and we confirm the timeline in your quote.",
  },
  {
    q: "How much does an AI chatbot cost?",
    a: "It's a one-time setup fee, not a subscription. Right now, launch pricing (60% off) starts at $99 for a rule-based FAQ bot, $150 for a full AI-powered bot trained on your business data, and $250 for a multi-channel bot with CRM integration. WhatsApp/Telegram adds $50 if not already included. Share your website and what you want the bot to handle, and we'll send a fixed quote — no obligation.",
  },
  {
    q: "Do you maintain the chatbot after it goes live?",
    a: "Yes — optional ongoing support covers knowledge-base updates, answer-quality tuning based on real conversations, and model/API upkeep. You can also take full ownership and run it yourself if you'd prefer.",
  },
  {
    q: "Who owns the chatbot and the conversation data?",
    a: "You do. The assistant runs on your own site under your own API key, and lead data goes into your database or inbox — not ours.",
  },
];

// Keywords that signal the visitor is asking about the AI chatbot service
// rather than the Meta ads service. Used by the free keyword bot to route to
// the right answer set.
export const CHATBOT_INTENT_KEYWORDS = [
  "chatbot",
  "chat bot",
  "ai bot",
  "ai assistant",
  "ai agent",
  "virtual assistant",
  // "live chat" was removed — it was matching generic questions like "do you
  // have live chat support" or "is this live chat" (asking whether they're
  // talking to a human right now), which then got the "yes we build AI
  // chatbots" pitch. That's a wrong-context canned answer, which is exactly
  // the "amateur bot" feeling this keyword list should avoid causing.
];

// Small talk / lead-intent detection reused by the keyword FAQ bot.
export const LEAD_INTENT_KEYWORDS = [
  "quote",
  "audit",
  "get started",
  "sign up",
  "sign me up",
  "work with you",
  "start a campaign",
  "run ads for",
  "generate leads for",
  "talk to a human",
  "talk to someone",
];
