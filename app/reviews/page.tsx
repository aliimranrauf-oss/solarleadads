import type { Metadata } from "next";
import { getApprovedReviews } from "@/lib/get-reviews";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Client Reviews",
  description: "See what solar businesses say about working with SolarLeadAds, and leave your own review.",
  alternates: { canonical: "/reviews" },
};

// Refetch approved reviews from Supabase at most every 60s instead of
// baking them in at build time — otherwise newly-approved reviews won't
// show up until the next deploy.
export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <>
      <section className="section-pad pt-10 sm:pt-14">
        <div className="container-max">
          <p className="eyebrow mb-5">Client reviews</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] sm:text-5xl">
            What solar businesses say about working with us.
          </h1>

          <div className="mt-10">
            <ReviewsCarousel reviews={reviews} />
          </div>
        </div>
      </section>

      <section id="leave-a-review" className="section-pad bg-surface-alt scroll-mt-20">
        <div className="container-max max-w-2xl">
          <p className="eyebrow mb-3">Leave a review</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Worked with SolarLeadAds?</h2>
          <p className="mt-3 text-sm text-ink-400">
            Tell other solar businesses what it was like. Reviews are checked
            before they go live to keep this page genuine.
          </p>

          <div className="relative mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
