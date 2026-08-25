const solutions = [
  { title: "Exclusive Leads", desc: "Every lead we send goes to you — never shared or resold." },
  { title: "Built for Solar Buyers", desc: "Targeting and creative shaped around how solar customers actually decide." },
  { title: "Across the Whole Business", desc: "Leads for installs, sales, technician visits, panel & battery interest, checkups, and cleaning." },
  { title: "Simple Reporting", desc: "You see what's working — no jargon, no guesswork on your end." },
];

export default function SolutionSection() {
  return (
    <section className="section-pad bg-surface-alt">
      <div className="container-max">
        <p className="eyebrow">The solution</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
          Leads built around your solar business, not a generic template.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white p-6 shadow-card">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-50 text-leaf-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-display text-base font-semibold text-navy">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
