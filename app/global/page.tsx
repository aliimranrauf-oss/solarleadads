import type { Metadata } from "next";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Solar Lead Generation Agency — Global",
  description:
    "Meta ad campaigns generating exclusive, high-intent solar leads for solar businesses outside the USA, UK, and Australia, taken on a case-by-case basis. No long-term contracts.",
  alternates: { canonical: "/global" },
};

const points = [
  "Dedicated campaigns for the USA, UK & Australia, plus other regions case-by-case",
  "Exclusive leads — never shared or resold",
  "Lead capture adapted to your region's consent and privacy requirements",
  "No long-term contracts",
];

export default function GlobalLandingPage() {
  return (
    <>
      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max max-w-3xl">
          <p className="eyebrow mb-5">Solar lead generation — global</p>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Solar Leads for Businesses Outside the USA, UK & Australia.
          </h1>
          <p className="mt-6 max-w-xl text-base text-ink-400 sm:text-lg">
            The USA, UK, and Australia are where we&apos;ve built dedicated, localized campaigns —
            but Meta ads aren&apos;t limited by geography. If you run a solar business elsewhere,
            we take on new regions case-by-case and will tell you upfront whether we&apos;re a fit
            before you commit to anything.
          </p>

          <ul className="mt-8 space-y-2.5 text-sm text-ink-400">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={siteConfig.primaryCta.href} className="btn-primary">
              {siteConfig.primaryCta.label}
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Message us on WhatsApp
            </a>
          </div>

          <p className="mt-6 text-sm text-ink-400">
            Based in the USA, UK, or Australia instead?{" "}
            <Link href="/usa" className="font-semibold text-trust-500 hover:underline">USA</Link>,{" "}
            <Link href="/uk" className="font-semibold text-trust-500 hover:underline">UK</Link>, and{" "}
            <Link href="/australia" className="font-semibold text-trust-500 hover:underline">Australia</Link>{" "}
            each have a dedicated page with region-specific details.
          </p>
        </div>
      </section>

      <TrustBar />
      <FinalCTA />
    </>
  );
}
