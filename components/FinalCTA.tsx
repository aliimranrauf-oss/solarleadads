import Link from "next/link";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import Reveal from "@/components/Reveal";

export default function FinalCTA() {
  return (
    <section className="px-6 pb-20 sm:px-10">
      <div className="container-max rounded-3xl bg-navy px-8 py-12 text-center shadow-soft sm:px-16 sm:py-16">
        <Reveal>
          <h2 className="mx-auto max-w-xl text-2xl font-semibold text-white sm:text-3xl">
            Ready to get more solar leads?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70 sm:text-base">
            Tell us about your solar business and get a free audit of where your current lead generation stands.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={siteConfig.primaryCta.href} className="btn-primary bg-leaf-500 hover:bg-leaf-600">
            {siteConfig.primaryCta.label}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60"
          >
            Message us on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}
