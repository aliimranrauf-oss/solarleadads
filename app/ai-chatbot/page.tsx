import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FinalCTA from "@/components/FinalCTA";
import ChatbotPricingSection from "@/components/ChatbotPricingSection";
import { whatsappLink } from "@/lib/site-config";
import { chatbotFaqs } from "@/lib/chatbot/knowledge";

export const metadata: Metadata = {
  title: "AI Chatbots for Solar Businesses",
  description:
    "We design and build custom AI chat assistants for solar businesses worldwide — installers, sellers, wholesale suppliers, lithium battery providers, maintenance teams, and cleaning companies. Trained on your business, live 24/7.",
  alternates: { canonical: "/ai-chatbot" },
  openGraph: {
    title: "AI Chatbots Built for Solar Businesses | SolarLeadAds",
    description:
      "Custom AI chat assistants for solar companies anywhere in the world — trained on your services, pricing, and tone of voice. Qualifies visitors and captures leads 24/7.",
    url: "https://solarleadads.com/ai-chatbot",
    type: "website",
  },
};

// Who the service is for. Deliberately broad — this service is not limited to
// the USA/UK/Australia the way the Meta ads service is.
const audiences = [
  {
    title: "Installation companies",
    desc: "Answer roof, system-size, and timeline questions while your crews are on site — and book the survey before the visitor leaves.",
  },
  {
    title: "Panel & system sellers",
    desc: "Walk buyers through product ranges, specifications, and warranty terms without a rep tied to live chat all day.",
  },
  {
    title: "Wholesale & supply distributors",
    desc: "Handle stock, MOQ, lead-time, and trade-account questions from resellers around the clock, across time zones.",
  },
  {
    title: "Lithium battery providers",
    desc: "Explain capacity, chemistry, compatibility, and cycle-life questions consistently — no more repeating the same spec sheet.",
  },
  {
    title: "Maintenance & repair teams",
    desc: "Triage faults, collect system details, and route genuine callouts to your scheduler instead of your voicemail.",
  },
  {
    title: "Solar cleaning services",
    desc: "Quote by panel count or array size, capture the address, and book the job straight from the conversation.",
  },
];

const capabilities = [
  {
    title: "Trained on your business, not the internet",
    desc: "Your services, pricing structure, service areas, warranty terms, and FAQs go into the assistant's knowledge base. It answers as your company — and it won't invent numbers you never gave it.",
  },
  {
    title: "Qualifies before it hands over",
    desc: "The assistant asks the questions your sales team would ask first, so what reaches your inbox is a shortlist, not a pile of tyre-kickers.",
  },
  {
    title: "Captures leads into your systems",
    desc: "Name, email, company, and the conversation context land in your CRM, database, email, or WhatsApp the moment they're given.",
  },
  {
    title: "Awake at 2am and on weekends",
    desc: "Most solar enquiries arrive outside office hours. An assistant that replies immediately is the difference between a booked survey and a visitor who moves on to a competitor.",
  },
  {
    title: "Your brand voice, your rules",
    desc: "Tone, personality, and hard limits are all configurable — including topics the bot must never guess at and exactly when it should escalate to a human.",
  },
  {
    title: "Multilingual where you need it",
    desc: "Serving more than one market? The assistant can reply in your customers' language without you running separate support teams.",
  },
];

const steps = [
  {
    n: "01",
    title: "Discovery call",
    time: "Day 1",
    desc: "We look at your site, your enquiry volume, and the questions your team answers over and over. If a chatbot isn't the right spend for you right now, we'll say so.",
  },
  {
    n: "02",
    title: "Knowledge base build",
    time: "Day 2–5",
    desc: "We turn your services, pricing logic, coverage areas, and FAQs into a structured knowledge base — the layer that keeps answers accurate and grounded.",
  },
  {
    n: "03",
    title: "Persona & guardrails",
    time: "Day 4–7",
    desc: "We set the tone of voice, define what the assistant must never claim or guess at, and decide exactly when a conversation gets handed to a human.",
  },
  {
    n: "04",
    title: "Build, integrate & test",
    time: "Day 6–10",
    desc: "The widget is built into your site and connected to your CRM or inbox, then tested against real customer questions until the answers hold up.",
  },
  {
    n: "05",
    title: "Go live",
    time: "Day 10–14",
    desc: "The assistant goes live on your site with usage caps and cost controls already in place, so there are no surprise API bills in month one.",
  },
  {
    n: "06",
    title: "Tune from real conversations",
    time: "Ongoing (optional)",
    desc: "We review what visitors actually ask, close the gaps in the knowledge base, and keep the model and integrations current.",
  },
];

// The hybrid architecture — genuine differentiator and the reason running
// costs stay flat as traffic grows.
const hybridLayers = [
  {
    label: "Layer 1",
    title: "Instant answers",
    cost: "Zero API cost",
    desc: "Common questions — pricing, coverage, lead times, warranty — are matched against your knowledge base and answered immediately. No model call, no tokens, no latency.",
  },
  {
    label: "Layer 2",
    title: "AI reasoning",
    cost: "Only when needed",
    desc: "Anything the knowledge base can't handle escalates to the AI model, which answers using your business data as its only source of truth.",
  },
  {
    label: "Layer 3",
    title: "Cost controls",
    cost: "Predictable spend",
    desc: "Repeat questions are cached, per-visitor and site-wide usage caps are enforced, and a circuit breaker protects you if the provider has an outage.",
  },
];

export default function AiChatbotPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "AI Chatbot Development for Solar Businesses",
        serviceType: "AI chatbot development",
        provider: {
          "@type": "Organization",
          name: "SolarLeadAds",
          url: "https://solarleadads.com",
        },
        areaServed: "Worldwide",
        description:
          "Custom AI chat assistants designed, built, and deployed for solar businesses worldwide — installers, sellers, wholesale suppliers, lithium battery providers, maintenance teams, and solar cleaning companies.",
        url: "https://solarleadads.com/ai-chatbot",
      },
      {
        "@type": "FAQPage",
        mainEntity: chatbotFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-3xl">
          <p className="eyebrow mx-auto">AI chatbot development</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl lg:text-5xl">
            AI chatbots built for solar businesses — anywhere in the world.
          </h1>
          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink-400">
              We build custom AI chat assistants for the solar industry and nothing else. Installers,
              sellers, wholesale suppliers, lithium battery providers, maintenance and system-checkup
              teams, and solar cleaning companies — if the business is solar, we build for it.
              Trained on your own services and pricing, live on your site 24/7, and answering like a
              member of your team.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-sm text-ink-400">
              Want to see one working? The assistant in the bottom-right corner of this site is one
              of ours — ask it something.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Positioning / expertise */}
      <section className="section-pad pt-8">
        <div className="container-max">
          <Reveal className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-10">
            <p className="eyebrow">Solar-only specialists</p>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl">
              We were building AI assistants for solar companies before most agencies offered them at
              all.
            </h2>
            <p className="mt-4 max-w-3xl text-base text-ink-400">
              Most chatbot shops will build for a dentist on Monday and a law firm on Tuesday. We
              don&apos;t. Solar is the only industry we work in, across both of our service lines —
              which means we already know the questions your customers ask, the objections that stall
              a sale, and the difference between a serious buyer and someone pricing a hobby project.
              That knowledge goes into your assistant from day one instead of being learned on your
              budget.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Solar industry only",
                  body: "Every assistant we ship is for a solar business. No generalist templates rebadged with your logo.",
                },
                {
                  title: "Built, not resold",
                  body: "We write the code and own the architecture — we're not reselling someone else's no-code widget with a markup.",
                },
                {
                  title: "Global by default",
                  body: "Our ads service covers the USA, UK, and Australia. Chatbot work has no such limit — we build for solar businesses on any continent.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Who we build for</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
              Every corner of the solar industry, across the globe.
            </h2>
            <p className="mt-4 text-base text-ink-400">
              Different solar businesses field completely different questions. Each assistant is
              built around yours.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 60}
                className="card-lift rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 text-sm text-ink-400">
              Not on the list? If it&apos;s solar — EPC contracting, inverter supply, mounting
              systems, off-grid kits, financing — we&apos;ll build for it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
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
        </div>
      </section>

      {/* Hybrid architecture */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="rounded-3xl bg-navy px-8 py-12 shadow-soft sm:px-12 sm:py-14">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-leaf-500">
              How we keep your costs down
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-white sm:text-3xl">
              A hybrid design, so your API bill doesn&apos;t scale with your traffic.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-white/70 sm:text-base">
              Most chatbots send every single message to an AI model and bill you for the privilege —
              including the tenth visitor this week asking your opening hours. Ours answers the
              predictable questions for free and saves the model for the questions that actually
              need it.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {hybridLayers.map((layer) => (
                <div key={layer.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
                    {layer.label}
                  </p>
                  <h3 className="mt-3 font-display text-base font-semibold text-white">
                    {layer.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-leaf-500">{layer.cost}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{layer.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">How we build it</p>
            <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
              From first call to live on your site.
            </h2>
            <p className="mt-4 text-base text-ink-400">
              A standard build takes roughly one to two weeks once we have your content and site
              access. Bigger scopes take longer — and we tell you that up front, in the quote.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 60}
                className="card-lift rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-trust-500">{step.n}</span>
                  <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-ink-400">
                    {step.time}
                  </span>
                </div>
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
