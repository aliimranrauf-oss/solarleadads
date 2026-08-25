import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-surface/90 backdrop-blur">
      <div className="container-max relative flex items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 20L10 4H14L20 20H16L14.5 15.5H9.5L8 20H4Z" fill="#F2A93B" />
              <path d="M10.5 12H13.5" stroke="#0B2545" strokeWidth="1.4" />
            </svg>
          </span>
          Solar<span className="text-trust-500">LeadAds</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-400 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
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
