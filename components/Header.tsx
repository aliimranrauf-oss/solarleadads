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
