"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  regions,
  tracks,
  tiersForTrack,
  addOns,
  formatCurrency,
  type Region,
  type TrackId,
} from "@/lib/pricing";

export default function PricingSection() {
  const [track, setTrack] = useState<TrackId>("installation");
  const [region, setRegion] = useState<Region>("us");
  const tiers = tiersForTrack(track);

  return (
    <section className="section-pad pt-0 sm:pt-0">
      <div className="container-max">
        {/* Track tabs — which kind of solar business is this for */}
        <Reveal className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-navy/10 bg-white p-1 shadow-card">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTrack(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  track === t.id ? "bg-trust-500 text-white" : "text-ink-400 hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-300">{tracks.find((t) => t.id === track)?.subtitle}</p>
        </Reveal>

        {/* Region toggle */}
        <Reveal className="mt-6 flex justify-center" delay={40}>
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
        <div
          className={`mt-10 grid gap-6 lg:items-start ${
            tiers.length === 2 ? "sm:grid-cols-2 lg:mx-auto lg:max-w-3xl" : "lg:grid-cols-3"
          }`}
        >
          {tiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 90}>
              <div
                className={`card-lift relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-card ${
                  tier.mostPopular
                    ? "border-trust-500 bg-trust-50 lg:-translate-y-3 lg:shadow-soft"
                    : "border-navy/5"
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
                  {tier.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.features.length > 4 && (
                  <details className="group mt-2.5">
                    <summary className="cursor-pointer list-none text-xs font-semibold text-trust-500 hover:underline">
                      + {tier.features.length - 4} more included
                    </summary>
                    <ul className="mt-2.5 space-y-2.5 text-sm text-ink-400">
                      {tier.features.slice(4).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

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
            dollar goes toward reaching buyers, not toward our margin. Installation & Sales campaigns are
            priced for high-value, considered purchases; Cleaning & Repair campaigns are priced for
            faster, lower-ticket local jobs — the system for each is built around how that customer
            actually decides to buy.
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
                <div className="flex h-full flex-col rounded-2xl border border-navy/5 bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-sm font-semibold text-navy">{addOn.name}</p>
                    {addOn.standalone && (
                      <span className="shrink-0 rounded-full bg-leaf-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-leaf-600">
                        Stand-alone OK
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-trust-500">{addOn.price}</p>
                  <p className="mt-2 text-sm text-ink-400">{addOn.description}</p>

                  <ul className="mt-3 space-y-1.5 text-xs text-ink-400">
                    {addOn.details.map((d) => (
                      <li key={d} className="flex items-start gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-leaf-600">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {d}
                      </li>
                    ))}
                  </ul>

                  {addOn.standaloneNote && (
                    <p
                      className={`mt-3 rounded-lg px-3 py-2 text-xs ${
                        addOn.standalone
                          ? "bg-leaf-50 text-leaf-600"
                          : "bg-surface-alt text-ink-400"
                      }`}
                    >
                      {addOn.standaloneNote}
                    </p>
                  )}
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
