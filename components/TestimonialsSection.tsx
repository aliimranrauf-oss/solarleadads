// Placeholder testimonials — replace `testimonials` with real client quotes
// once you have them. Keeping structure/word count similar will avoid layout
// shifts. Do not launch with these placeholder names/quotes live.
const testimonials = [
  {
    quote: "Placeholder quote — swap in a real client's words about lead quality or communication.",
    name: "Client Name",
    company: "Company, State",
  },
  {
    quote: "Placeholder quote — swap in a real client's words about cost per lead or booked calls.",
    name: "Client Name",
    company: "Company, State",
  },
  {
    quote: "Placeholder quote — swap in a real client's words about overall experience.",
    name: "Client Name",
    company: "Company, State",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-pad bg-surface-alt">
      <div className="container-max">
        <p className="eyebrow">What clients say</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">Built to earn trust from solar businesses.</h2>
        <p className="mt-3 max-w-xl text-sm text-ink-400">
          These are placeholders — real client testimonials will replace this
          section as we onboard our first clients on solarleadads.com.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-dashed border-navy/15 bg-white p-6">
              <p className="text-sm italic leading-relaxed text-ink-400">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 text-xs font-semibold text-navy">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-ink-300">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
