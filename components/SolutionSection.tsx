import Reveal from "@/components/Reveal";

const solutions = [
  {
    title: "Exclusive Leads",
    desc: "Every lead we send goes to you — never shared or resold.",
    gradient: "from-leaf-500 to-leaf-600",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.3 12.2l1.9 1.9 3.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Built for Solar Buyers",
    desc: "Targeting and creative shaped around how solar customers actually decide.",
    gradient: "from-trust-400 to-trust-600",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      </>
    ),
  },
  {
    title: "Across the Whole Business",
    desc: "Leads for installs, sales, technician visits, panel & battery interest, checkups, and cleaning.",
    gradient: "from-amber-500 to-orange-500",
    icon: (
      <>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: "Simple Reporting",
    desc: "You see what's working — no jargon, no guesswork on your end.",
    gradient: "from-navy-700 to-navy-900",
    icon: (
      <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function SolutionSection() {
  return (
    <section className="section-pad bg-surface-alt">
      <div className="container-max">
        <Reveal>
          <p className="eyebrow">The solution</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
            Leads built around your solar business, not a generic template.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className="card-lift animate-fadeInUp rounded-2xl bg-white p-6 shadow-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={`icon-badge mb-4 bg-gradient-to-br ${s.gradient}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {s.icon}
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
