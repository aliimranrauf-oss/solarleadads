import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the SolarLeadAds website and our Meta ads lead generation services for solar businesses.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "August 31, 2026";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-400 sm:text-base">
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Terms of Service</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              The terms behind working with us.
            </h1>
            <p className="mt-4 text-base text-ink-400">
              These terms govern your use of this website and, at a high level, the working
              relationship when you engage {siteConfig.name} for lead generation services. Last
              updated {LAST_UPDATED}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal className="space-y-10">
            <Section id="acceptance" title="1. Acceptance of these terms">
              <p>
                By using this website or submitting a form on it, you agree to these terms. If you
                don&apos;t agree, please don&apos;t use the site or submit a form.
              </p>
            </Section>

            <Section id="who-this-is-for" title="2. Who this site is for">
              <p>
                This website and our services are intended for solar businesses (installers,
                sellers, technicians, panel and battery providers, maintenance and cleaning
                teams) and individuals acting on their behalf — not for general consumer use. You
                must be at least 18 years old to submit a form or engage our services.
              </p>
            </Section>

            <Section id="services-overview" title="3. What our services are">
              <p>
                {siteConfig.name} provides Meta (Facebook/Instagram) ad campaign setup, exclusive
                lead delivery, and campaign optimization for solar businesses, as described on our{" "}
                <Link href="/services" className="font-semibold text-trust-500 hover:underline">
                  Services & Pricing
                </Link>{" "}
                page. Specific deliverables, timelines, ad spend arrangements, and lead-replacement
                terms for a given engagement are confirmed directly with you when a campaign is
                set up, and take precedence over the general descriptions on this site.
              </p>
              <p>
                Packages are month-to-month. Either party may end the arrangement in line with
                the notice terms agreed when the campaign was set up.
              </p>
            </Section>

            <Section id="ad-spend" title="4. Ad spend">
              <p>
                Where stated, ad spend is paid by you directly to Meta from your own ad account.
                We don&apos;t hold, invoice, or take a cut of your ad spend — our management fee is
                separate and agreed with you upfront.
              </p>
            </Section>

            <Section id="billing" title="5. Billing & payment">
              <p>
                The monthly management fee is billed in advance of the service period it covers,
                and is separate from your ad spend (see Section 4 — we never touch or invoice your
                ad budget). Invoices are sent via Payoneer, a secure third-party payment platform;
                you don&apos;t need a Payoneer account of your own to pay — you can pay using a
                debit or credit card, or PayPal, directly from the link we send.
              </p>
              <p>
                Renewal invoices are sent a few days ahead of your next billing date. If a renewal
                payment isn&apos;t received by the due date, campaign work may be paused until
                payment is completed.
              </p>
            </Section>

            <Section id="leads" title="6. Leads">
              <p>
                Leads generated for your campaign are delivered to you exclusively and are not
                resold or shared with other businesses. We aim for lead quality but can&apos;t
                guarantee that every lead converts into a sale — buying intent and follow-up on
                your end also affect outcomes. Specific terms for replacing unqualified leads are
                confirmed when your campaign is set up.
              </p>
            </Section>

            <Section id="your-responsibilities" title="7. Your responsibilities">
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide accurate information when submitting forms or setting up a campaign.</li>
                <li>Hold any licenses, certifications, or permits your jurisdiction requires to sell or install solar products.</li>
                <li>Comply with applicable advertising, consumer protection, and telemarketing laws (e.g. TCPA in the US, PECR/GDPR in the UK, the Spam Act 2003 in Australia) when following up with leads we generate.</li>
                <li>Not use this site to submit false, misleading, or fraudulent information — including fake reviews.</li>
              </ul>
            </Section>

            <Section id="third-party-platforms" title="8. Third-party platforms">
              <p>
                Our services rely on third-party platforms — principally Meta&apos;s advertising
                platform, along with WhatsApp for messaging and Supabase for form storage. We
                aren&apos;t responsible for outages, policy changes, or account actions taken by
                these platforms that are outside our control, though we&apos;ll work with you to
                resolve issues where we can.
              </p>
            </Section>

            <Section id="ip" title="9. Intellectual property">
              <p>
                The content on this website — text, graphics, and design — belongs to{" "}
                {siteConfig.name} unless otherwise noted, and may not be copied or reused without
                permission. Ad creative and campaign assets produced for a specific client
                engagement are addressed in that engagement&apos;s own agreement.
              </p>
            </Section>

            <Section id="disclaimers" title="10. Disclaimers">
              <p>
                This website and the information on it are provided &quot;as is.&quot; While we
                aim for accuracy, we don&apos;t guarantee that the site will be error-free or
                uninterrupted, and results described on the site (including testimonials) reflect
                individual client experiences rather than guaranteed outcomes for every business.
              </p>
            </Section>

            <Section id="liability" title="11. Limitation of liability">
              <p>
                To the extent permitted by law, {siteConfig.name} is not liable for indirect,
                incidental, or consequential damages arising from your use of this website or our
                services, beyond amounts actually paid to us for the service giving rise to the
                claim. Nothing in these terms limits liability that can&apos;t be excluded under
                applicable law.
              </p>
            </Section>

            <Section id="governing-law" title="12. Governing law">
              <p>
                Because we serve clients across the USA, UK, and Australia, the governing law and
                jurisdiction for a specific client engagement are set out in that engagement&apos;s
                own agreement. Absent a specific agreement, these general website terms are
                governed by the laws applicable to where {siteConfig.name} is established, without
                regard to conflict-of-law principles.
              </p>
            </Section>

            <Section id="changes" title="13. Changes to these terms">
              <p>
                We may update these terms from time to time. The &quot;last updated&quot; date at
                the top of this page reflects the most recent revision. Continued use of the site
                after changes means you accept the updated terms.
              </p>
            </Section>

            <Section id="contact" title="14. Contact us">
              <p>
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-trust-500 hover:underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </Section>
          </Reveal>

          <p className="mt-10 text-xs text-ink-300">
            These terms are provided as general information and aren&apos;t legal advice. For
            terms tailored to your business and the jurisdictions you operate in, consult a
            qualified lawyer. See also our{" "}
            <Link href="/privacy" className="font-semibold text-trust-500 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
