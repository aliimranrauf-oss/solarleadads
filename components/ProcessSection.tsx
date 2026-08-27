import Reveal from "@/components/Reveal";

const steps = [
  { n: "01", title: "We Learn Your Business", desc: "Your services, service area, and ideal customer — before any ad goes live." },
  { n: "02", title: "We Launch Targeted Ads", desc: "Meta campaigns built for your specific solar offer and audience." },
  { n: "03", title: "You Get Qualified Leads", desc: "Interested homeowners and businesses reach you directly — by form, WhatsApp, or email." },
  { n: "04", title: "You Follow Up & Close", desc: "We keep the pipeline full; you handle the conversations that turn into jobs." },
];

export default function ProcessSection() {
  return (
    <section className="section-pad bg-surface-alt">
      <div className="container-max">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">A simple four-step process.</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 100} className="relative">
              <span className="font-mono text-sm text-trust-500">{step.n}</span>
              <p className="mt-3 font-display text-base font-semibold text-navy">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-navy/10 sm:block" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
