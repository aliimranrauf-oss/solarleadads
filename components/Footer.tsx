import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const linkCols = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Results", href: "/results" },
      { label: "Process", href: "/process" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-10 bg-navy px-6 py-14 text-white/70 sm:px-10">
      <div className="container-max grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            Solar<span className="text-amber-500">LeadAds</span>
          </p>
          <p className="mt-3 max-w-xs text-sm">
            Meta ads lead generation for solar businesses — installers,
            sellers, technicians, and more.
          </p>
        </div>

        {linkCols.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
          </ul>

          <p className="mt-6 text-sm font-semibold text-white">We serve</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/usa" className="hover:text-white">USA</Link>
            </li>
            <li>
              <Link href="/uk" className="hover:text-white">United Kingdom</Link>
            </li>
            <li>
              <Link href="/australia" className="hover:text-white">Australia</Link>
            </li>
            <li>
              <Link href="/global" className="hover:text-white">Global</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-max mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.domain}. All rights reserved.
      </div>
    </footer>
  );
}
