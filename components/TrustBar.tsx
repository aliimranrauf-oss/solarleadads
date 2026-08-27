const items = [
  {
    title: "Solar-Only Focus",
    desc: "We work exclusively with solar businesses — installers, sellers, and technicians.",
    icon: (
      <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "USA, UK & Australia",
    desc: "We run and localize campaigns for solar markets and buying behavior in all three countries.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
  },
  {
    title: "Real Solar Experience",
    desc: "2+ years running lead campaigns across the solar industry, globally.",
    icon: (
      <path d="M4 19V9m6 10V5m6 14v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="px-6 sm:px-10">
      <div className="container-max rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trust-50 text-trust-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {item.icon}
                </svg>
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-sm text-ink-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
