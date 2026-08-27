const problems = [
  {
    title: "Shared, Recycled Leads",
    desc: "The same contact gets sold to five other solar companies before you even call.",
    gradient: "from-amber-500 to-orange-500",
    icon: (
      <>
        <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 7.3L10.5 15.8M16 7.3L13.5 15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Traffic That Isn't Ready",
    desc: "Clicks and likes that never turn into an actual conversation about solar.",
    gradient: "from-trust-400 to-trust-600",
    icon: (
      <path
        d="M6 4l12 6-5 1.5L11 17 6 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Ad Spend Without a Strategy",
    desc: "Budgets running on guesswork instead of targeting built for solar buyers.",
    gradient: "from-leaf-500 to-leaf-600",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M12 8v8M9.5 10.2c0-1.2 1.1-2.2 2.5-2.2s2.5.8 2.5 1.8c0 2.4-5 1.6-5 4 0 1 1.1 1.8 2.5 1.8s2.5-.7 2.5-1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "No Time to Chase Leads",
    desc: "You're installing, servicing, and selling — not sitting behind an ad dashboard.",
    gradient: "from-navy-700 to-navy-900",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function ProblemSection() {
  return (
    <section className="section-pad">
      <div className="container-max">
        <p className="eyebrow">The problem</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
          Most solar businesses struggle to get leads worth their time.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="card-lift animate-fadeInUp rounded-2xl border border-navy/5 bg-white p-6 shadow-card"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={`icon-badge mb-4 bg-gradient-to-br ${p.gradient}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {p.icon}
                </svg>
              </div>
              <p className="font-display text-base font-semibold text-navy">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
