import type { Metadata } from "next";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Solar Lead Generation Agency — UK",
  description:
    "Meta ad campaigns generating exclusive, high-intent solar leads for UK installers, sellers, and technicians. No long-term contracts, PECR & UK GDPR-aware lead capture.",
  alternates: { canonical: "/uk" },
};

const points = [
  "Campaigns targeted to UK solar buyers and local search behavior",
  "Exclusive leads — never shared or resold",
  "Lead capture built with UK GDPR & PECR consent requirements in mind",
  "No long-term contracts",
];

export default function UKLandingPage() {
  return (
    <>
      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max max-w-3xl">
          <p className="eyebrow mb-5">Solar lead generation — uk</p>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
            More Qualified Solar Leads for UK Solar Businesses.
          </h1>
          <p className="mt-6 max-w-xl text-base text-ink-400 sm:text-lg">
            We run Meta ad campaigns built around how UK homeowners and
            businesses actually search for and decide on solar — for
            installers, sellers, technicians, panel and battery providers,
            and solar maintenance teams across the UK.
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
        </div>
      </section>

      <TrustBar />
      <FinalCTA />
    </>
  );
}
