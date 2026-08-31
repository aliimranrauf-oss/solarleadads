import Link from "next/link";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "Are the leads exclusive to my business?",
    a: "Yes. Every lead generated through your campaign goes to you only — we don't resell or share leads across multiple solar businesses.",
  },
  {
    q: "Do you only work with solar panel installers?",
    a: "No. We work across the solar industry — installers, sellers, technicians, panel and lithium battery providers, system checkup and maintenance teams, and solar cleaning services.",
  },
  {
    q: "How do I receive new leads?",
    a: "Through the method you prefer — a form submission on your own site, a WhatsApp message, or email notification, delivered the moment a new lead comes in. From there, following up by phone is often the fastest way to convert a solar lead, so you're always free to call your leads directly — we just don't personally handle or join those calls ourselves; that's between you and your customer.",
  },
  {
    q: "What happens if a lead is low quality?",
    a: "We monitor lead quality throughout the campaign and adjust targeting. Specific replacement terms are outlined when we set up your campaign.",
  },
  {
    q: "Do you require a long-term contract?",
    a: "No. We work month-to-month so you can evaluate results without being locked in.",
  },
];

export default function FAQSection() {
  return (
    <section className="section-pad">
      <div className="container-max grid gap-10 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-2">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Common questions from solar businesses.</h2>
          <p className="mt-4 text-sm text-ink-400">
            Have something specific in mind?{" "}
            <Link href="/faq" className="font-semibold text-trust-500 hover:underline">
              See the full FAQ
            </Link>{" "}
            or reach out directly.
          </p>
        </Reveal>

        <div className="space-y-3 lg:col-span-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 70}>
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
    </section>
  );
}
