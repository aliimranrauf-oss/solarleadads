import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SolarLeadAds collects, uses, and protects information submitted through our website, contact forms, and review forms.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "August 28, 2026";

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

export default function PrivacyPage() {
  return (
    <>
      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Privacy Policy</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              Your privacy, plainly explained.
            </h1>
            <p className="mt-4 text-base text-ink-400">
              This page explains what information {siteConfig.name} collects when you use this
              website, how we use it, and the choices you have. Last updated {LAST_UPDATED}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-max max-w-3xl">
          <Reveal className="space-y-10">
            <Section id="who-we-are" title="1. Who we are">
              <p>
                {siteConfig.name} ({siteConfig.domain}) is a Meta advertising agency serving
                solar businesses. This policy covers the information we collect through this
                website — including the contact form, review form, and WhatsApp link — and how
                we handle it.
              </p>
              <p>
                Questions about this policy can be sent to{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-trust-500 hover:underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </Section>

            <Section id="information-we-collect" title="2. Information we collect">
              <p>We collect information in the following ways:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-navy">Contact / lead audit form</span> — name,
                  email, company name, phone number (optional), website or Facebook Ad Library
                  link (optional), current ad spend range (optional), and the message you write
                  us.
                </li>
                <li>
                  <span className="font-medium text-navy">Review form</span> — name, company
                  (optional), country, star rating, order number, your written review, and a
                  contact method (email or phone) used to verify the review.
                </li>
                <li>
                  <span className="font-medium text-navy">WhatsApp</span> — if you message us via
                  the WhatsApp link on this site, that conversation is handled by WhatsApp
                  (Meta) under its own privacy policy, not this one.
                </li>
                <li>
                  <span className="font-medium text-navy">Automatically, from your browser</span> —
                  standard technical data such as IP address, browser type, and pages visited,
                  collected for basic security and site performance purposes.
                </li>
              </ul>
              <p>
                We do not knowingly collect information from anyone under the age of 18, and this
                site is not directed at children.
              </p>
            </Section>

            <Section id="how-we-use-it" title="3. How we use this information">
              <ul className="list-disc space-y-2 pl-5">
                <li>To respond to your inquiry and provide the free lead audit you requested.</li>
                <li>To set up, run, and report on ad campaigns for clients who engage our services.</li>
                <li>To verify and publish customer reviews (with your name and country, as shown on the site).</li>
                <li>To detect and prevent spam or fraudulent form submissions.</li>
                <li>To meet legal, accounting, or record-keeping obligations.</li>
              </ul>
              <p>
                We do not sell your personal information, and we do not share contact-form or
                review-form submissions with other businesses for their own marketing purposes.
              </p>
            </Section>

            <Section id="where-its-stored" title="4. Where information is stored">
              <p>
                Form submissions are stored using Supabase, a third-party database provider.
                Supabase may store data on servers outside your country of residence. By
                submitting a form on this site, you consent to this transfer and storage, which is
                necessary to provide the service you&apos;ve requested.
              </p>
            </Section>

            <Section id="cookies" title="5. Cookies and tracking">
              <p>
                This site does not currently set non-essential cookies or run third-party
                analytics or advertising pixels. If that changes — for example, if we add Meta
                Pixel or Google Analytics to measure our own ad campaigns — we&apos;ll update this
                policy accordingly and add a cookie notice where required by law.
              </p>
            </Section>

            <Section id="your-rights" title="6. Your rights">
              <p>Depending on where you live, you may have the right to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Ask what personal information we hold about you.</li>
                <li>Ask us to correct inaccurate information.</li>
                <li>Ask us to delete your information, where we&apos;re not required to keep it.</li>
                <li>Withdraw consent for us to contact you.</li>
              </ul>
              <p>
                This includes rights available under the UK/EU General Data Protection Regulation
                (GDPR), Australia&apos;s Privacy Act 1988 and Australian Privacy Principles, and
                US state privacy laws where applicable. To exercise any of these rights, email{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-trust-500 hover:underline">
                  {siteConfig.email}
                </a>{" "}
                and we&apos;ll respond within a reasonable time.
              </p>
            </Section>

            <Section id="retention" title="7. How long we keep information">
              <p>
                We keep contact-form and review submissions for as long as reasonably needed to
                respond to your inquiry, deliver services, or comply with legal and accounting
                obligations — after which we delete or anonymize it. You can request earlier
                deletion at any time by emailing us.
              </p>
            </Section>

            <Section id="third-parties" title="8. Third-party services we use">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-navy">Supabase</span> — stores form
                  submissions.
                </li>
                <li>
                  <span className="font-medium text-navy">WhatsApp (Meta)</span> — powers the
                  WhatsApp chat link.
                </li>
                <li>
                  <span className="font-medium text-navy">Meta (Facebook/Instagram) Ads</span> —
                  used to run advertising campaigns for our clients; if you interact with a client
                  ad, Meta&apos;s own privacy policy applies to that interaction.
                </li>
              </ul>
              <p>
                Each of these providers has its own privacy policy governing how it handles data
                on its platform.
              </p>
            </Section>

            <Section id="changes" title="9. Changes to this policy">
              <p>
                We may update this policy from time to time. The &quot;last updated&quot; date at
                the top of this page reflects the most recent revision. Material changes will be
                reflected here before they take effect.
              </p>
            </Section>

            <Section id="contact" title="10. Contact us">
              <p>
                For any privacy question or request, email{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-trust-500 hover:underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </Section>
          </Reveal>

          <p className="mt-10 text-xs text-ink-300">
            This policy is provided as general information and isn&apos;t legal advice. For a
            policy tailored to your specific data practices and the jurisdictions you operate in,
            consult a qualified lawyer. See also our{" "}
            <Link href="/terms" className="font-semibold text-trust-500 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
