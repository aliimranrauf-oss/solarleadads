import type { Metadata } from "next";
import Link from "next/link";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTA from "@/components/FinalCTA";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Meta ads packages for solar installers, sellers, technicians, and panel & battery providers — exclusive leads, transparent pricing, no long-term contracts.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Services & pricing</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              A Meta ads system built for solar — not shared leads, not guesswork.
            </h1>
            <p className="mt-4 text-base text-ink-400">
              Every package is a full lead-generation system: campaign setup, exclusive lead delivery,
              and ongoing optimization. Pick the tier that matches your ad spend and lead volume goals —
              you can move up as you grow, month to month.
            </p>
          </Reveal>
        </div>
      </section>

      <PricingSection />

      {/* Real client reviews — same component/data source as the homepage */}
      <TestimonialsSection />

      {/* Trust — quick facts, complements the reviews above */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
            <p className="eyebrow">Why solar businesses work with us</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {[
                {
                  title: "2+ years, solar-only",
                  body: "Hands-on experience running lead campaigns across installers, sellers, technicians, and maintenance teams — not a generalist agency.",
                },
                {
                  title: "Exclusive leads, always",
                  body: "Every lead goes to one business only. Nothing here is resold or shared across competitors.",
                },
                {
                  title: "No lock-in",
                  body: "Month-to-month across every package. You stay because it's working, not because of a contract.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <p className="font-display text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-1.5 text-sm text-ink-400">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-400">
              Want to read more?{" "}
              <Link href="/reviews" className="font-semibold text-trust-500 hover:underline">
                See all reviews
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Quick FAQ relevant to pricing */}
      <section className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal>
            <p className="eyebrow">Before you choose</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">A few things worth knowing</h2>
          </Reveal>

          <div className="mt-8 space-y-3">
            {[
              {
                q: "Why is ad spend separate from the management fee?",
                a: "Your ad spend goes straight to Meta from your own ad account — we never touch it. This keeps your budget fully transparent and means every dollar you spend goes toward reaching buyers, not toward our fee.",
              },
              {
                q: "What if a lead turns out to be unqualified?",
                a: "We monitor lead quality throughout the campaign and replace unqualified leads at no extra cost — the specifics are confirmed when we set up your campaign.",
              },
              {
                q: "Can I switch packages later?",
                a: "Yes. Everything is month-to-month, so you can move up to a higher tier as your ad spend and lead volume grow, or scale down if you need to.",
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-navy/10 bg-white p-5 open:shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-navy sm:text-base">
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-trust-500 transition-transform group-open:rotate-45">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{item.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-400">
            Not sure which package fits?{" "}
            <Link href="/contact" className="font-semibold text-trust-500 hover:underline">
              Get a free lead audit
            </Link>{" "}
            or{" "}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-trust-500 hover:underline">
              message us on WhatsApp
            </a>{" "}
            and we&apos;ll recommend one.
          </p>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
