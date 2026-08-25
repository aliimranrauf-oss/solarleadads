const problems = [
  {
    title: "Shared, Recycled Leads",
    desc: "The same contact gets sold to five other solar companies before you even call.",
  },
  {
    title: "Traffic That Isn't Ready",
    desc: "Clicks and likes that never turn into an actual conversation about solar.",
  },
  {
    title: "Ad Spend Without a Strategy",
    desc: "Budgets running on guesswork instead of targeting built for solar buyers.",
  },
  {
    title: "No Time to Chase Leads",
    desc: "You're installing, servicing, and selling — not sitting behind an ad dashboard.",
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
          {problems.map((p) => (
            <div key={p.title} className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <div className="mb-4 h-9 w-9 rounded-lg bg-amber-100" />
              <p className="font-display text-base font-semibold text-navy">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
