"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { regions, pricingTiers, addOns, formatCurrency, type Region } from "@/lib/pricing";

export default function PricingSection() {
  const [region, setRegion] = useState<Region>("us");

  return (
    <section className="section-pad pt-0 sm:pt-0">
      <div className="container-max">
        {/* Region toggle */}
        <Reveal className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-navy/10 bg-white p-1 shadow-card">
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  region === r.id ? "bg-navy text-white" : "text-ink-400 hover:text-navy"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tier cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 90}>
              <div
                className={`card-lift relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-card ${
                  tier.mostPopular ? "border-trust-500 lg:-translate-y-3 lg:shadow-soft" : "border-navy/5"
                }`}
              >
                {tier.mostPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-trust-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-soft">
                    Most Popular
                  </span>
                )}

                <p className="font-display text-lg font-semibold text-navy">{tier.name}</p>
                <p className="mt-1.5 text-sm text-ink-400">{tier.tagline}</p>

                <div className="mt-5">
                  <span className="font-display text-3xl font-semibold text-navy">
                    {formatCurrency(region, tier.fee[region])}
                  </span>
                  <span className="text-sm text-ink-400">/month</span>
                  <p className="mt-1 text-xs text-ink-300">
                    Management fee — ad spend paid directly to Meta, separately
                  </p>
                </div>

                <div className="mt-4 rounded-xl bg-surface-alt px-4 py-3 text-xs text-ink-400">
                  <p>
                    Recommended ad spend: from{" "}
                    <span className="font-semibold text-navy">{formatCurrency(region, tier.adSpendMin[region])}/mo</span>
                  </p>
                  <p className="mt-1">Est. {tier.leadsEstimate}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-400">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?package=${tier.id}`}
                  className={tier.mostPopular ? "btn-primary mt-7 w-full" : "btn-secondary mt-7 w-full"}
                >
                  Choose {tier.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How the pricing works */}
        <Reveal className="mt-14 rounded-2xl border border-navy/5 bg-white p-6 shadow-card sm:p-8" delay={90}>
          <p className="font-display text-base font-semibold text-navy">How the pricing works</p>
          <p className="mt-2 max-w-2xl text-sm text-ink-400">
            The monthly fee above is what you pay SolarLeadAds for campaign setup, management, and
            optimization. Ad spend is separate — you fund your own Meta ad account directly, so every
            dollar goes toward reaching buyers, not toward our margin. This is standard practice across
            professional ad agencies and keeps your ad spend fully visible and in your control.
          </p>
        </Reveal>

        {/* Add-ons */}
        <div className="mt-8">
          <Reveal>
            <p className="eyebrow">Add-ons</p>
            <h3 className="mt-2 text-xl font-semibold text-navy">Extend any package</h3>
          </Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {addOns.map((addOn, i) => (
              <Reveal key={addOn.name} delay={i * 80}>
                <div className="h-full rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                  <p className="font-display text-sm font-semibold text-navy">{addOn.name}</p>
                  <p className="mt-1 text-sm font-semibold text-trust-500">{addOn.price}</p>
                  <p className="mt-2 text-sm text-ink-400">{addOn.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Trust / guarantee strip */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl bg-navy px-6 py-6 text-center sm:px-10" delay={60}>
          {[
            "No long-term contracts",
            "Exclusive leads only — never resold",
            "Unqualified leads replaced free",
          ].map((item) => (
            <p key={item} className="flex items-center gap-2 text-sm font-medium text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-leaf-500">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
