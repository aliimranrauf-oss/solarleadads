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
