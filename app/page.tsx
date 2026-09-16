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
import { getApprovedReviews } from "@/lib/get-reviews";
import {
  jsonLdGraph,
  organizationSchema,
  websiteSchema,
  aggregateRatingFrom,
  reviewsSchema,
  metaAdsOfferCatalog,
  chatbotOfferCatalog,
  ORG_ID,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

// Refetch approved reviews (and any other dynamic data on this page) at
// most every 60s instead of baking them in at build time — otherwise
// newly-approved reviews in Supabase won't show up until the next deploy.
export const revalidate = 60;

export const metadata: Metadata = {
  // The homepage is the page most likely to rank for the head term, so it
  // gets its own title rather than inheriting the layout default verbatim.
  title: "Solar Lead Generation Agency | Exclusive Solar Leads (USA, UK & Australia)",
  description:
    "We run Meta ad campaigns that deliver exclusive, qualified solar leads to installers, panel & battery sellers, technicians, and cleaning teams across the USA, UK, and Australia. Month-to-month, unqualified leads replaced free.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Reviews are fetched here (not only inside TestimonialsSection) so the
  // star-rating schema below is built from the exact same approved reviews
  // that are visible on the page. Google requires that match — rating markup
  // without the reviews rendered on-page is a manual-action risk.
  const reviews = await getApprovedReviews();
  const aggregateRating = aggregateRatingFrom(reviews);

  const jsonLd = jsonLdGraph([
    {
      ...organizationSchema,
      // Only attach ratings once there are real reviews in Supabase.
      ...(aggregateRating
        ? { aggregateRating, review: reviewsSchema(reviews) }
        : {}),
      hasOfferCatalog: metaAdsOfferCatalog(),
    },
    websiteSchema,
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Solar Lead Generation Agency | Exclusive Solar Leads",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORG_ID },
      primaryImageOfPage: absoluteUrl("/og-image.jpg"),
      inLanguage: "en",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#meta-ads-service`,
      name: "Meta Ads Lead Generation for Solar Businesses",
      serviceType: "Solar lead generation",
      provider: { "@id": ORG_ID },
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
      ],
      description:
        "Facebook and Instagram ad campaigns that generate exclusive, high-intent leads for solar installers, sellers, technicians, and maintenance teams.",
      hasOfferCatalog: metaAdsOfferCatalog(),
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#chatbot-service`,
      name: "AI Chatbot Development for Solar Businesses",
      serviceType: "AI chatbot development",
      provider: { "@id": ORG_ID },
      areaServed: "Worldwide",
      description:
        "Custom AI chat assistants trained on your own solar business data — qualifying visitors and capturing leads 24/7.",
      hasOfferCatalog: chatbotOfferCatalog(),
    },
  ]);

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
