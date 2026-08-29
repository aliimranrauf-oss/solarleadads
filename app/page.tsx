import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProcessSection from "@/components/ProcessSection";
import ServicesSnapshot from "@/components/ServicesSnapshot";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";

// Refetch approved reviews (and any other dynamic data on this page) at
// most every 60s instead of baking them in at build time — otherwise
// newly-approved reviews in Supabase won't show up until the next deploy.
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Organization schema — helps Google associate the logo, name, and contact
// method with this domain for knowledge-panel / rich-result eligibility.
// Add a `sameAs` array here once you have public Facebook/Instagram/LinkedIn
// business page URLs (e.g. sameAs: ["https://facebook.com/...", ...]).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SolarLeadAds",
  url: "https://solarleadads.com",
  logo: "https://solarleadads.com/logo.png",
  description:
    "SolarLeadAds runs Meta ad campaigns that bring qualified leads to solar installers, sellers, technicians, and panel & battery providers in the USA, UK, and Australia.",
  areaServed: ["United States", "United Kingdom", "Australia"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <SolutionSection />
      <ExperienceSection />
      <ProcessSection />
      <ServicesSnapshot />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
