import Link from "next/link";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="section-pad pt-10 sm:pt-14">
      <div className="container-max grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-5 animate-fadeInUp">Meta ads for the solar industry</p>
          {/* h1 intentionally has no entrance animation — it's the likely LCP
              element, and starting it invisible can push back Largest
              Contentful Paint timing in Lighthouse. Everything below it is
              safe to animate since it doesn't affect that metric. */}
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
            More Qualified Solar Leads.{" "}
            <span className="text-leaf-600">Lower Cost.</span>{" "}
            Higher Closings.
          </h1>
          <p
            className="mt-6 max-w-lg animate-fadeInUp text-base text-ink-400 sm:text-lg"
            style={{ animationDelay: "90ms" }}
          >
            We run Meta ad campaigns that bring solar businesses exclusive,
            high-intent leads — for installers, sellers, technicians, panel
            and battery providers, and solar maintenance teams.
          </p>

          <div
            className="mt-8 flex animate-fadeInUp flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            <Link href={siteConfig.primaryCta.href} className="btn-primary">
              {siteConfig.primaryCta.label}
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Message us on WhatsApp
            </a>
          </div>

          <ul
            className="mt-8 flex animate-fadeInUp flex-wrap gap-x-6 gap-y-2 text-sm text-ink-400"
            style={{ animationDelay: "270ms" }}
          >
            {["No long-term contracts", "Exclusive leads only", "Serving USA, UK & Australia"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-leaf-600">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          {/* Rotating hero image carousel. Add/edit images and captions in
              lib/hero-images.ts. Drop the actual image files in /public/hero/.
              See README.md for size, aspect ratio, and format guidance. */}
          <HeroImageCarousel />
        </div>
      </div>
    </section>
  );
}
