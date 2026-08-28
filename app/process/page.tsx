import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FinalCTA from "@/components/FinalCTA";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How a SolarLeadAds campaign goes from first conversation to exclusive leads in your inbox — step by step, with no long-term contract.",
  alternates: { canonical: "/process" },
};

const steps = [
  {
    n: "01",
    title: "Free lead audit",
    time: "Day 1",
    desc:
      "We look at your service area, current lead sources, and ideal customer before recommending anything. If Meta ads aren't a fit for your business right now, we'll tell you.",
  },
  {
    n: "02",
    title: "Meta access & campaign setup",
    time: "Day 2–4",
    desc:
      "You grant limited, permission-based access to your Meta ad account — no payment details ever change hands. We build your lead form, landing page or funnel, and initial audiences.",
  },
  {
    n: "03",
    title: "Creative built for your business",
    time: "Day 3–6",
    desc:
      "Ad angles built around your offer — install footage, before/after savings, local trust signals, or seasonal promotions — tailored to the package you choose.",
  },
  {
    n: "04",
    title: "Campaign goes live",
    time: "Day 5–7",
    desc:
      "Ads launch to your target audience. Qualifying questions in the lead form (ownership, bill range, roof type, timeline) start filtering for real buyers from day one.",
  },
  {
    n: "05",
    title: "Leads delivered directly to you",
    time: "Ongoing",
    desc:
      "Every lead is exclusive to your business and reaches you instantly by form notification, WhatsApp, or email — never queued, never resold.",
  },
  {
    n: "06",
    title: "Testing, reporting & optimization",
    time: "Weekly / bi-weekly",
    desc:
      "We test creative and audiences on a regular cadence and send you a plain-language report on leads, cost per lead, and what we're adjusting next.",
  },
];

const faqs = [
  {
    q: "How long until my campaign is live?",
    a: "Most campaigns go live within 5–7 days of getting Meta access, depending on how quickly creative and landing pages are approved.",
  },
  {
    q: "What do I need to provide to get started?",
    a: "Access to your Meta ad account (or help creating one), a sense of your service area and ideal customer, and any existing photos or video from past installs if you have them.",
  },
  {
    q: "Is there a contract?",
    a: "No. Every package runs month-to-month, so you can pause or cancel with notice — see the specifics when we set up your campaign.",
  },
  {
    q: "What if I want to change my package later?",
    a: "You can move up or down between packages as your ad spend and lead volume needs change — see current packages on the services & pricing page.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Our process</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              From first conversation to exclusive leads — step by step.
            </h1>
            <p className="mt-4 text-base text-ink-400">
              No black box. Here&apos;s exactly what happens after you reach out, and what to
              expect once your campaign is live.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-max">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 90}
                className="card-lift rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-trust-500">{step.n}</span>
                  <span className="rounded-full bg-trust-50 px-3 py-1 text-xs font-semibold text-trust-600">
                    {step.time}
                  </span>
                </div>
                <p className="mt-4 font-display text-base font-semibold text-navy">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process FAQ */}
      <section className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal>
            <p className="eyebrow">Before you start</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Common process questions</h2>
          </Reveal>

          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-navy/10 bg-white p-5 open:shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-sm font-semibold text-navy sm:text-base">
                  {item.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0 text-trust-500 transition-transform group-open:rotate-45"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{item.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-400">
            More questions? See the full{" "}
            <Link href="/faq" className="font-semibold text-trust-500 hover:underline">
              FAQ
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
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
