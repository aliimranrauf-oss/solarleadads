import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";
import { pricingTiers } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What solar businesses can expect from a SolarLeadAds Meta campaign — lead volume ranges, how we report performance, and real client reviews.",
  alternates: { canonical: "/results" },
};

const expectations = pricingTiers
  .filter((t) => t.track === "installation")
  .map((t) => ({
    name: t.name,
    leads: t.leadsEstimate,
    note: t.tagline,
  }));

const reportingPoints = [
  {
    title: "You see real numbers, not vanity metrics",
    body: "Leads delivered, cost per lead, and ad spend — reported on a schedule that matches your package (weekly or bi-weekly). No reach or impression counts dressed up as results.",
  },
  {
    title: "Lead quality is tracked, not assumed",
    body: "We monitor form completions against the qualifying questions in your funnel (ownership, bill range, roof type, timeline) so you know volume and quality side by side.",
  },
  {
    title: "Unqualified leads are replaced",
    body: "If a lead doesn't meet the criteria we agreed on, it's replaced at no extra cost — the specifics are confirmed when your campaign is set up.",
  },
  {
    title: "You keep control of ad spend",
    body: "Your budget runs from your own Meta ad account. We never take a cut of it or mark it up — our fee is separate and fixed.",
  },
];

export default function ResultsPage() {
  return (
    <>
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Results</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              What to actually expect from a Meta lead campaign.
            </h1>
            <p className="mt-4 text-base text-ink-400">
              We&apos;d rather give you honest ranges than a highlight reel. Here&apos;s how lead
              volume typically tracks by package, how we report performance, and what current
              clients say once campaigns are live.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lead volume ranges — pulled straight from live pricing tiers, not invented */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal>
            <p className="eyebrow">Typical lead volume</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold sm:text-3xl">
              Ranges by package, for installers & sellers.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-400">
              Actual volume depends on your service area, ad spend, and season. These are the
              ranges we plan campaigns around — the same figures shown on our{" "}
              <Link href="/services" className="font-semibold text-trust-500 hover:underline">
                services & pricing
              </Link>{" "}
              page.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {expectations.map((tier, i) => (
              <Reveal
                key={tier.name}
                delay={i * 100}
                className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <p className="font-display text-sm font-semibold text-navy">{tier.name}</p>
                <p className="mt-2 text-2xl font-semibold text-trust-500">{tier.leads}</p>
                <p className="mt-2 text-sm text-ink-400">{tier.note}</p>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-400">
            Run a local cleaning, repair, or maintenance business instead? See the{" "}
            <Link href="/services#local" className="font-semibold text-trust-500 hover:underline">
              local-service packages
            </Link>{" "}
            for comparable ranges.
          </p>
        </div>
      </section>

      {/* Reporting & accountability */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
            <p className="eyebrow">How we report results</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {reportingPoints.map((item) => (
                <div key={item.title}>
                  <p className="font-display text-sm font-semibold text-navy">{item.title}</p>
                  <p className="mt-1.5 text-sm text-ink-400">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <TrustBar />

      {/* Real client reviews — same data source as homepage/services */}
      <TestimonialsSection />

      <section className="section-pad pt-0">
        <div className="container-max max-w-2xl text-center">
          <Reveal>
            <p className="text-sm text-ink-400">
              Want ranges specific to your market and service area?{" "}
              <Link href="/contact" className="font-semibold text-trust-500 hover:underline">
                Get a free lead audit
              </Link>{" "}
              or{" "}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-trust-500 hover:underline"
              >
                message us on WhatsApp
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
