import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { whatsappLink } from "@/lib/site-config";
import { findTier } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Get a Free Lead Audit",
  description:
    "Tell us about your solar business and get a free, personalized audit of where your current lead generation stands.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: packageId } = await searchParams;
  const tier = findTier(packageId);

  return (
    <section className="section-pad pt-10 sm:pt-14">
      <div className="container-max grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-5">{tier ? `${tier.name} package` : "Free lead audit"}</p>
          <h1 className="text-3xl font-semibold leading-[1.15] sm:text-4xl">
            {tier
              ? `Let's set up your ${tier.name} package.`
              : "Get a free, personalized audit of your solar lead generation."}
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-400">
            {tier
              ? `Tell us a bit about your business and we'll confirm details, timeline, and next steps for the ${tier.name} package — ${tier.leadsEstimate.toLowerCase()}.`
              : "Tell us a bit about your business and — if you've got them — drop in your website or Facebook Ad Library link. We'll take a look and email you back with what's working, what's costing you leads, and what we'd fix first."}
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink-400">
            {[
              "No long-term contracts",
              "Exclusive leads only",
              "Serving USA, UK & Australia",
              tier
                ? "We'll reply within 1–2 business days to confirm setup"
                : "We'll email your audit — nothing else required from you",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-ink-300">
            Prefer to type it out yourself?{" "}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-trust-500 hover:underline">
              Message us on WhatsApp
            </a>{" "}
            instead.
          </p>
        </div>

        <div className="relative rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
          <ContactForm source={tier ? `pricing_${tier.id}` : "contact_page"} presetPackage={tier ? { id: tier.id, name: tier.name } : null} />
        </div>
      </div>
    </section>
  );
}
