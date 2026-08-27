import Link from "next/link";
import { getApprovedReviews } from "@/lib/get-reviews";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Reveal from "@/components/Reveal";

export default async function TestimonialsSection() {
  const reviews = await getApprovedReviews();

  return (
    <section className="section-pad bg-surface-alt">
      <div className="container-max">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">What clients say</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
              Built to earn trust from solar businesses.
            </h2>
          </div>
          <Link href="/reviews" className="btn-secondary">
            See all reviews
          </Link>
        </Reveal>

        <div className="mt-10">
          <ReviewsCarousel reviews={reviews} />
        </div>

        <p className="mt-8 text-center text-sm text-ink-400">
          Worked with us?{" "}
          <Link href="/reviews#leave-a-review" className="font-semibold text-trust-500 hover:underline">
            Leave a review
          </Link>
        </p>
      </div>
    </section>
  );
}
