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

export default function HomePage() {
  return (
    <>
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
