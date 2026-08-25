const scope = [
  "Solar panel installers",
  "Solar sellers & consultants",
  "Field technicians",
  "Panel & lithium battery providers",
  "System checkup & maintenance teams",
  "Solar cleaning services",
  "Awareness & education campaigns",
];

export default function ExperienceSection() {
  return (
    <section className="section-pad">
      <div className="container-max grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <p className="eyebrow">Proven experience</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            2+ years running lead campaigns across the solar industry.
          </h2>
          <p className="mt-4 text-ink-400">
            Case studies and campaign numbers for solarleadads.com are being
            compiled as we bring on our first cohort of clients here. What we
            bring in the meantime is direct, hands-on experience across nearly
            every corner of the solar business — not just one niche.
          </p>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8">
            <p className="font-display text-sm font-semibold text-navy">Where we&apos;ve run solar lead campaigns</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {scope.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-trust-100 bg-trust-50 px-4 py-2 text-xs font-medium text-trust-600 sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
