import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-surface/90 backdrop-blur">
      <div className="container-max relative flex items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-navy">
            <Image src="/logo.png" alt="SolarLeadAds logo" width={32} height={32} className="h-full w-full object-cover" priority />
          </span>
          Solar<span className="text-trust-500">LeadAds</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-ink-400 transition-colors hover:text-navy"
                >
                  {item.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 text-ink-300 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Invisible bridge so the pointer doesn't leave the hoverable area
                    between the link and the dropdown panel. */}
                <div className="absolute left-0 right-0 top-full h-2" />

                <div
                  className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 rounded-2xl border border-navy/5 bg-white p-2 opacity-0 shadow-soft transition-all duration-150 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-alt"
                    >
                      <p className="text-sm font-semibold text-navy">{child.label}</p>
                      {child.description && (
                        <p className="mt-0.5 text-xs text-ink-400">{child.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-400 transition-colors hover:text-navy"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={siteConfig.primaryCta.href} className="btn-primary hidden sm:inline-flex text-sm px-5 py-2.5">
            {siteConfig.primaryCta.label}
          </Link>
          <Link href={siteConfig.primaryCta.href} className="btn-primary sm:hidden text-xs px-4 py-2">
            Free Audit
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
