import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import FinalCTA from "@/components/FinalCTA";
import ChatbotPricingSection from "@/components/ChatbotPricingSection";
import { whatsappLink } from "@/lib/site-config";
import { chatbotFaqs } from "@/lib/chatbot/knowledge";
import {
  jsonLdGraph,
  breadcrumbSchema,
  chatbotOfferCatalog,
  organizationSchema,
  ORG_ID,
  absoluteUrl,
} from "@/lib/seo";
import { chatbotTiers } from "@/lib/chatbot-pricing";

export const metadata: Metadata = {
  // Title leads with the exact phrase buyers search ("AI chatbot for
  // <industry>") and carries the price signal, which lifts click-through
  // even when the ranking position doesn't move.
  //
  // Price fixed to $299: that's the "AI-Powered Bot" tier (chatbotTiers id
  // "ai"). The $179 tier is the "Basic FAQ Bot" — scripted, no AI model at
  // all (see lib/chatbot-pricing.ts) — so it can't be the price attached to
  // a page titled "AI Chatbot".
  title: "AI Chatbot for Solar Businesses | Custom Build from $299",
  description:
    "Custom AI-powered chatbots for solar installers, sellers, wholesale suppliers, battery providers, maintenance and cleaning companies. Trained on your own services and pricing, live on your site 24/7. One-time build from $299 — no monthly fee. (A simpler, scripted non-AI FAQ bot is also available from $179.)",
  keywords: [
    "AI chatbot for solar business",
    "solar website chatbot",
    "custom AI chatbot development",
    "chatbot for solar installers",
    "WhatsApp chatbot solar company",
    "lead capture chatbot",
  ],
  alternates: { canonical: "/ai-chatbot" },
  openGraph: {
    title: "AI Chatbots Built for Solar Businesses | From $299 One-Time",
    description:
      "Custom AI chat assistants for solar companies anywhere in the world — trained on your services, pricing, and tone of voice. Qualifies visitors and captures leads 24/7.",
    url: "https://solarleadads.com/ai-chatbot",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AI chatbots for solar businesses" }],
  },
};

// Trimmed to the 4 benefits a busy owner actually decides on. The longer
// 6-item version (with a wholesale/distributor/multilingual breakdown) is
// still true, but it read like a spec sheet — this keeps the page skimmable.
const capabilities = [
  {
    title: "Trained on your business",
    desc: "Your services, pricing, coverage area and FAQs go in. It answers as your company and never invents numbers you didn't give it.",
  },
  {
    title: "Qualifies before it hands over",
    desc: "Asks the questions your team would ask first, so what reaches your inbox is a shortlist — not a pile of tyre-kickers.",
  },
  {
    title: "Awake at 2am and weekends",
    desc: "Most solar enquiries come in after hours. A reply that's instant is the difference between a booked survey and a lost lead.",
  },
  {
    title: "Sends leads where you work",
    desc: "Name, contact info and context land in your CRM, inbox, or WhatsApp the moment they're given.",
  },
];

// 6 detailed process steps became 3 plain-language ones. The full build
// timeline (knowledge base, persona/guardrails, tuning) still happens — it's
// just not something a first-time visitor needs to read before they'll ask
// for a quote.
// The hero headline says "AI chatbot" and must quote an AI-model tier's
// price. chatbotTiers[0] ("Basic FAQ Bot") is scripted with no AI model at
// all — using its $179 price here would be an inaccurate claim. This finds
// the "ai" tier ($299) instead, and falls back to the first tier only if the
// "ai" id is ever renamed/removed, so the page never crashes.
const heroTier =
  chatbotTiers.find((t) => t.id === "ai") ?? chatbotTiers[0];
const basicTier = chatbotTiers.find((t) => t.id === "basic");

const steps = [
  {
    n: "1",
    title: "Tell us about your business",
    desc: "A quick call or form about your services, pricing, and the questions you get asked most.",
  },
  {
    n: "2",
    title: "We build & test it",
    desc: "Live in about 1–2 weeks, trained on your business and tested against real customer questions before it goes live.",
  },
  {
    n: "3",
    title: "It goes live on your site",
    desc: "Answering visitors and sending you qualified leads — with usage caps in place so there are no surprise bills.",
  },
];

// Tiers that actually run an AI model — excludes "basic" (scripted, no AI).
const aiModelTiers = chatbotTiers.filter((t) => t.id !== "basic");

export default function AiChatbotPage() {
  const jsonLd = jsonLdGraph([
    organizationSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AI Chatbots", path: "/ai-chatbot" },
    ]),
    {
      "@type": "Service",
      "@id": `${absoluteUrl("/ai-chatbot")}#service`,
      name: "AI Chatbot Development for Solar Businesses",
      serviceType: "AI chatbot development",
      provider: { "@id": ORG_ID },
      areaServed: "Worldwide",
      description:
        "Custom AI chat assistants designed, built, and deployed for solar businesses worldwide — installers, sellers, wholesale suppliers, lithium battery providers, maintenance teams, and solar cleaning companies.",
      url: absoluteUrl("/ai-chatbot"),
      // Real prices, pulled from lib/chatbot-pricing.ts. This is what makes
      // the page eligible to show a "from $179" price directly in Google.
      hasOfferCatalog: chatbotOfferCatalog(),
      offers: chatbotTiers.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        price: tier.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      })),
    },
    {
      // Marks the page up as a software product too, which is a second,
      // separate rich-result path for "AI chatbot" style queries.
      //
      // Price range is scoped to AI-model tiers only ("ai" + "pro"). The
      // "basic" tier has no AI model in it at all, so including its $179 in
      // a "Solar AI Chatbot" product's price range would be an inaccurate
      // claim to Google, same issue as the headline above.
      "@type": "Product",
      name: "Solar AI Chatbot",
      description:
        "A custom AI chat assistant trained on your solar business — services, pricing, service areas, and FAQs — installed on your website and messaging channels.",
      brand: { "@id": ORG_ID },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...aiModelTiers.map((t) => t.price)),
        highPrice: Math.max(...aiModelTiers.map((t) => t.price)),
        offerCount: aiModelTiers.length,
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: chatbotFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — same two-column layout as the homepage Hero.tsx: text + CTAs
          on the left, a real image on the right. Static image here (not a
          carousel) since one clear picture of the product is enough on a
          service page — a rotating carousel is homepage-only. */}
      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow mb-5">AI chatbot development</p>
            <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
              An AI chatbot for your solar business — from{" "}
              <span className="text-leaf-600">${heroTier.price}</span>.
            </h1>
            <p className="mt-6 max-w-lg text-base text-ink-400 sm:text-lg">
              Answers customer questions and captures leads on your site, 24/7 — trained on your
              own services and pricing. Built for the solar industry, nothing else.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Get a chatbot quote
              </Link>
              <a
                href={whatsappLink(
                  "Hi SolarLeadAds, I'd like a quote for an AI chatbot for my solar business."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Message us on WhatsApp
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-400">
              {["One-time build, no subscription", "Live in 1–2 weeks", "You own it"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-leaf-600">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-ink-400">
              Curious what one feels like? The assistant in the bottom-right corner of this site is
              one of ours — ask it something.
            </p>
            {basicTier && (
              <p className="mt-2 text-sm text-ink-400">
                Just need simple scripted replies, no AI model? A {basicTier.name} starts at $
                {basicTier.price}.
              </p>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-trust-100 via-leaf-50 to-amber-100 blur-2xl opacity-70" />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-soft">
                <Image
                  src="/chatbot-icon.jpg"
                  alt="AI chatbot assistant widget for a solar business website"
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 92vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent px-5 pb-4 pt-10">
                  <p className="font-display text-sm font-semibold text-white sm:text-base">
                    Live on your site, answering visitors 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it does — 4 cards instead of the previous 6-card "who it's
          for" grid plus a separate 6-card "capabilities" grid. One section,
          skimmable in 10 seconds. */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What it does</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
              A member of your team that never sleeps.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {capabilities.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 60}
                className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={60}>
            <p className="mt-6 text-sm text-ink-400">
              Built for installers, panel & battery sellers, wholesale suppliers, maintenance teams,
              and cleaning companies. If your business is solar, we build for it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it works — 3 plain steps instead of 6 detailed ones. */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
              Three steps, live in about two weeks.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 60}
                className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-trust-500 font-mono text-sm font-semibold text-white">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <ChatbotPricingSection />

      {/* FAQ — shares its source with the on-site assistant (lib/chatbot/knowledge.ts)
          so this page and the bot can never contradict each other. */}
      <section id="chatbot-faq" className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow mx-auto">Chatbot FAQ</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
              Questions we get asked most.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-3">
            {chatbotFaqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 40}>
                <details className="group rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                  <summary className="cursor-pointer list-none font-display text-base font-semibold text-navy marker:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
