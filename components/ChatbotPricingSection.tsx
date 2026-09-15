import Link from "next/link";
import Reveal from "@/components/Reveal";
import DiscountBadge from "@/components/DiscountBadge";
import { chatbotTiers, discountPercent, formatUsd } from "@/lib/chatbot-pricing";

export default function ChatbotPricingSection() {
  return (
    <section className="section-pad pt-0">
      <div className="container-max">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
            Fixed quote before anything starts — no surprises later.
          </h2>
          <p className="mt-4 text-base text-ink-400">
            Launch pricing below is 60% off while we grow our chatbot portfolio. It&apos;s a
            one-time setup fee, not a subscription — the assistant runs on your own API key, so
            there&apos;s no markup on usage. Bigger or custom scopes are quoted from these
            starting points.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
          {chatbotTiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 90}>
              <div
                className={`card-lift relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-card ${
                  tier.mostPopular
                    ? "border-trust-500 bg-trust-50 lg:-translate-y-3 lg:shadow-soft"
                    : "border-navy/5"
                }`}
              >
                {tier.mostPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-trust-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-soft">
                    Most Popular
                  </span>
                )}

                <DiscountBadge percent={discountPercent(tier)} className="absolute -top-3 right-4" />

                <p className="font-display text-lg font-semibold text-navy">{tier.name}</p>
                <p className="mt-1.5 text-sm text-ink-400">{tier.tagline}</p>

                <div className="mt-5 flex flex-wrap items-baseline gap-2">
                  <span className="text-sm text-ink-300 line-through">
                    {formatUsd(tier.originalPrice)}
                  </span>
                  {tier.priceQualifier === "from" && (
                    <span className="text-sm text-ink-400">from</span>
                  )}
                  <span className="font-display text-3xl font-semibold text-navy">
                    {formatUsd(tier.price)}
                  </span>
                  <span className="text-sm text-ink-400">one-time</span>
                </div>
                <p className="mt-1 text-xs text-ink-300">Limited-time launch pricing</p>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-400">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mt-0.5 shrink-0 text-leaf-600"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?package=chatbot-${tier.id}`}
                  className={tier.mostPopular ? "btn-primary mt-7 w-full" : "btn-secondary mt-7 w-full"}
                >
                  Get my fixed quote
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How the pricing works */}
        <Reveal className="mt-10 rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8" delay={90}>
          <p className="font-display text-base font-semibold text-navy">How the pricing works</p>
          <p className="mt-2 max-w-2xl text-sm text-ink-400">
            The price above is a one-time setup fee for the build — there&apos;s no monthly fee
            from us. Rule-based bots have zero ongoing cost. AI-powered bots run on your own API
            key, so you pay the provider (OpenAI, Anthropic, or xAI) directly for actual usage,
            same way ad spend works with our Meta packages. After launch, small tweaks and
            Q&amp;A updates are free; larger custom feature requests are quoted separately based
            on the work involved.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row" delay={120}>
          <Link href="/contact" className="btn-primary">
            Request a quote
          </Link>
          <a
            href="#chatbot-faq"
            className="btn-secondary"
          >
            Read the chatbot FAQ
          </a>
        </Reveal>
      </div>
    </section>
  );
}
