import Link from "next/link";

const services = [
  {
    title: "Meta Ads Management",
    points: ["Full campaign setup & management", "Audience research & targeting", "Ad copy & creative testing", "Conversion tracking"],
  },
  {
    title: "Lead Generation System",
    points: ["High-converting lead forms", "Instant lead notifications", "WhatsApp & email delivery", "Lead quality filtering"],
  },
  {
    title: "Reporting & Growth",
    points: ["Regular performance reports", "Cost-per-lead optimization", "Scaling what's working", "Ongoing strategy support"],
  },
];

export default function ServicesSnapshot() {
  return (
    <section className="section-pad">
      <div className="container-max">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Our services</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">Meta ads services built for solar businesses.</h2>
          </div>
          <Link href="/services" className="btn-secondary">
            See all services
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <p className="font-display text-lg font-semibold text-navy">{s.title}</p>
              <ul className="mt-4 space-y-2.5">
                {s.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-ink-400">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
