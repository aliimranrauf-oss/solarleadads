import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions solar businesses ask most about leads, Meta/Facebook & Instagram access, pricing, and how working with SolarLeadAds works.",
  alternates: { canonical: "/faq" },
};

type Faq = { q: string; a: string };
type Category = { title: string; description: string; faqs: Faq[] };

const categories: Category[] = [
  {
    title: "General",
    description: "The basics of how working with SolarLeadAds works.",
    faqs: [
      {
        q: "Are the leads exclusive to my business?",
        a: "Yes. Every lead generated through your campaign goes to you only — we don't resell or share leads across multiple solar businesses.",
      },
      {
        q: "Do you only work with solar panel installers?",
        a: "No. We work across the solar industry — installers, sellers, technicians, panel and lithium battery providers, system checkup and maintenance teams, and solar cleaning services.",
      },
      {
        q: "Do you require a long-term contract?",
        a: "No. We work month-to-month so you can evaluate results without being locked in.",
      },
    ],
  },
  {
    title: "Leads & campaign quality",
    description: "What to expect once your campaign is live.",
    faqs: [
      {
        q: "How do I receive new leads?",
        a: "Through the method you prefer — a form submission on your own site, a WhatsApp message, or email notification. We don't route leads through phone calls.",
      },
      {
        q: "What happens if a lead is low quality?",
        a: "We monitor lead quality throughout the campaign and adjust targeting. Specific replacement terms are outlined when we set up your campaign.",
      },
      {
        q: "Will running ads affect my existing posts or page content?",
        a: "No. Ad campaigns run separately from your organic posts and page content, so your existing content stays untouched — your page keeps looking exactly as it does now.",
      },
    ],
  },
  {
    title: "Facebook, Meta & Instagram access",
    description: "The part people are usually most cautious about — here's exactly how it works.",
    faqs: [
      {
        q: "Is giving Meta (Facebook/Instagram) access safe?",
        a: "Yes, completely safe. You only grant limited, permission-based access so we can set up and manage your ad campaigns — we never get access to your payment methods, card details, or billing information. You stay in full control and can revoke access at any time.",
      },
      {
        q: "What if we haven't created a Facebook, Meta, or Instagram account yet?",
        a: "No problem at all. Many businesses start with us before setting anything up. We'll walk you through creating a Meta Business account and Facebook/Instagram pages, or set them up on your behalf, so your campaign can launch without any delay.",
      },
      {
        q: "Do you need admin access to my whole Facebook page, or just the ad account?",
        a: "Just the ad account and the permissions needed to run campaigns. We don't need — or ask for — full admin control over your Facebook page.",
      },
      {
        q: "Can I remove your access once the campaign ends?",
        a: "Yes, absolutely. The access you grant us is fully in your control at any time — not just at the end of a campaign. You can revoke it whenever you like directly from your Meta Business Settings, no need to go through us.",
      },
      {
        q: "What information do you need from me to get started?",
        a: "Just some basic business details (service area, what you offer, and your goals) plus Meta Business access once you're ready to launch. We'll tell you exactly what's needed, step by step, before anything goes live.",
      },
    ],
  },
  {
    title: "Pricing & getting started",
    description: "Costs, setup, and what happens after you reach out.",
    faqs: [
      {
        q: "Does it cost extra to set up a new Facebook/Instagram/Meta account for us?",
        a: "No extra cost — setting up your Meta Business account and Facebook/Instagram pages is included as part of onboarding when you sign up with us. There's no separate setup fee.",
      },
      {
        q: "How much does it cost to work with you?",
        a: "Pricing depends on your service area and campaign goals, so we don't quote a flat number here. Request a free lead audit and we'll send you a clear, personalized quote — no obligation.",
      },
      {
        q: "How soon can my campaign go live?",
        a: "Once we have your business details and Meta access, most campaigns are ready to launch within a few business days.",
      },
      {
        q: "How and when do I pay?",
        a: "Once you confirm a package, we send you a secure payment link through Payoneer — a widely-used international payment platform, similar to how PayPal or Stripe work. You don't need a Payoneer account yourself: the link lets you pay with your debit or credit card, or PayPal, whichever you prefer. The monthly management fee is billed in advance, before that month's work begins, and renewal invoices are sent a few days before your next billing date so there's no interruption to your campaign.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max max-w-3xl text-center">
          <p className="eyebrow mx-auto">FAQ</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Everything you need to know before you start.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-400">
            Straight answers on leads, Meta &amp; Instagram access, pricing,
            and how the whole process works. Can&apos;t find what you&apos;re
            looking for?{" "}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-trust-500 hover:underline"
            >
              Message us on WhatsApp
            </a>
            .
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-max max-w-3xl space-y-14">
          {categories.map((category, ci) => (
            <Reveal key={category.title} delay={ci * 60}>
              <div>
                <p className="eyebrow">{category.title}</p>
                <p className="mt-2 text-sm text-ink-400">{category.description}</p>

                <div className="mt-6 space-y-3">
                  {category.faqs.map((item, i) => (
                    <Reveal key={item.q} delay={i * 50}>
                      <details className="group rounded-xl border border-navy/10 bg-white p-5 open:shadow-card">
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
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-surface-alt">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Still have questions?</h2>
          <p className="mt-3 text-sm text-ink-400">
            Get a free, personalized lead audit and we&apos;ll answer anything
            specific to your business along the way.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Get a Free Lead Audit
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
