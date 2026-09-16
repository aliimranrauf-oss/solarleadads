import type { Metadata } from "next";
import Link from "next/link";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { jsonLdGraph, breadcrumbSchema, regionServiceSchema, organizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Solar Lead Generation Australia | Exclusive Leads for AU Installers",
  description:
    "Meta ad campaigns generating exclusive, high-intent solar leads for Australian installers, sellers, technicians and cleaning teams. Spam Act 2003-aware lead capture, no long-term contracts.",
  keywords: ["solar leads Australia","solar lead generation Australia","exclusive solar leads AU","Facebook ads solar installers Australia","solar panel leads Sydney Melbourne Brisbane"],
  alternates: { canonical: "/australia" },
  openGraph: {
    title: "Solar Lead Generation Australia | Exclusive Leads for AU Installers",
    description:
      "Meta ad campaigns generating exclusive, high-intent solar leads for Australian installers, sellers, technicians and cleaning teams. Spam Act 2003-aware lead capture, no long-term contracts.",
    url: "https://solarleadads.com/australia",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Solar lead generation in the Australia" }],
  },
};

// Country-scoped Service schema. Without this, /usa, /uk and /australia all
// look like near-duplicates of /services to Google and compete with each
// other. areaServed is what separates them.
const jsonLd = jsonLdGraph([
  organizationSchema,
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Australia", path: "/australia" },
  ]),
  regionServiceSchema({
    path: "/australia",
    name: "Solar Lead Generation — Australia",
    description:
      "Meta ad campaigns generating exclusive, high-intent solar leads for Australian installers, sellers, technicians and cleaning teams. Spam Act 2003-aware lead capture, no long-term contracts.",
    countryName: "Australia",
    countryCode: "AU",
  }),
]);

const points = [
  "Campaigns targeted to Australian solar buyers and local search behavior",
  "Exclusive leads — never shared or resold",
  "Lead capture built with Australia's Spam Act 2003 & Privacy Principles in mind",
  "No long-term contracts",
];

export default function AustraliaLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max max-w-3xl">
          <p className="eyebrow mb-5">Solar lead generation — australia</p>
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
            More Qualified Solar Leads for Australian Solar Businesses.
          </h1>
          <p className="mt-6 max-w-xl text-base text-ink-400 sm:text-lg">
            We run Meta ad campaigns built around how Australian homeowners
            and businesses actually search for and decide on solar — for
            installers, sellers, technicians, panel and battery providers,
            and solar maintenance teams across Australia.
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
