import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "SolarLeadAds is a Meta ads agency built only for the solar industry — running exclusive lead generation campaigns for solar businesses in the USA, UK, and Australia.",
  alternates: { canonical: "/about" },
};

const scope = [
  "Solar panel installers",
  "Solar sellers & consultants",
  "Field technicians",
  "Panel & lithium battery providers",
  "System checkup & maintenance teams",
  "Solar cleaning services",
];

const regions = [
  {
    title: "USA",
    body: "Campaigns targeted to US solar buyers, with lead capture built around US TCPA consent language.",
    href: "/usa",
  },
  {
    title: "UK",
    body: "Campaigns localized for UK solar buying behavior and lead-capture expectations.",
    href: "/uk",
  },
  {
    title: "Australia",
    body: "Campaigns localized for the Australian solar market and buyer intent.",
    href: "/australia",
  },
  {
    title: "Global",
    body: "Outside these three, we take on solar businesses on a case-by-case basis.",
    href: "/global",
  },
];

const trustPoints = [
  {
    title: "Exclusive leads only",
    body: "Every lead generated through your campaign goes to you only — never resold or shared with competitors.",
  },
  {
    title: "No long-term contracts",
    body: "We work month-to-month across every package. You stay because it's working, not because of a contract.",
  },
  {
    title: "Unqualified leads replaced free",
    body: "We monitor lead quality throughout the campaign and replace unqualified leads at no extra cost.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero intro */}
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">About</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              A Meta ads agency built only for solar.
            </h1>
            {/* TODO: add founder name here once finalized — e.g. "Founded and run by [Name]" */}
            <p className="mt-4 text-base text-ink-400">
              SolarLeadAds isn&apos;t a generalist marketing agency that happens to run solar
              campaigns — solar is the only industry we work in. We run Meta ad campaigns that
              generate exclusive, high-intent leads for solar businesses in the USA, UK, and
              Australia, and nothing else competes for our attention.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why solar-only */}
      <section className="section-pad pt-0">
        <div className="container-max grid gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-2">
            <p className="eyebrow">Why solar-only</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Specialists, not a generalist agency.
            </h2>
            <p className="mt-4 text-ink-400">
              Staying focused on one industry means every campaign, every offer, and every piece
              of ad creative is built around how solar buyers actually think — not adapted from a
              template built for another industry.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={120}>
            <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
              <p className="font-display text-sm font-semibold text-navy">
                Where we&apos;ve run solar lead campaigns
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {scope.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-trust-100 bg-trust-50 px-4 py-2 text-xs font-medium text-trust-600 sm:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experience */}
      <section className="section-pad pt-0">
        <div className="container-max max-w-2xl">
          <Reveal>
            <p className="eyebrow">Experience</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              2+ years running lead campaigns across the solar industry.
            </h2>
            <p className="mt-4 text-ink-400">
              Case studies and campaign numbers for solarleadads.com are being compiled as we
              bring on our first cohort of clients here. What we bring in the meantime is direct,
              hands-on experience across nearly every corner of the solar business — not just one
              niche.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Regions served */}
      <section className="section-pad pt-0">
        <div className="container-max">
          <Reveal>
            <p className="eyebrow">Regions served</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">USA, UK, Australia & beyond.</h2>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((region, i) => (
              <Reveal key={region.title} delay={i * 90}>
                <Link
                  href={region.href}
                  className="card-lift block rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
                >
                  <p className="font-display text-sm font-semibold text-navy">{region.title}</p>
                  <p className="mt-1.5 text-sm text-ink-400">{region.body}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal>
            <p className="eyebrow">What you can count on</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A few things worth knowing.</h2>
          </Reveal>

          <ul className="mt-8 space-y-5">
            {trustPoints.map((point, i) => (
              <Reveal key={point.title} delay={i * 70}>
                <li className="flex items-start gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-1 shrink-0 text-leaf-600"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p className="font-display text-sm font-semibold text-navy sm:text-base">
                      {point.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-400">{point.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
