"use client";

import { useRef, useState } from "react";
import type { Review } from "@/lib/reviews";

const PAGE_SIZE = 3;
const SWIPE_THRESHOLD_PX = 50;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "#F2A93B" : "none"}
          stroke={i < rating ? "#F2A93B" : "#C9D2DA"}
          strokeWidth="1.5"
        >
          <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const touchStartX = useRef<number | null>(null);

  function goTo(nextPage: number) {
    // wrap around in both directions
    setPage(((nextPage % totalPages) + totalPages) % totalPages);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      goTo(deltaX < 0 ? page + 1 : page - 1);
    }
    touchStartX.current = null;
  }

  const visible = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div>
      <div
        className="flex items-stretch gap-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {totalPages > 1 && (
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => goTo(page - 1)}
            className="hidden shrink-0 items-center justify-center self-center rounded-full border border-navy/10 bg-white p-2 text-navy shadow-card transition-colors hover:border-trust-500 hover:text-trust-500 sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div key={page} className="grid flex-1 animate-fadeInUp gap-6 lg:grid-cols-3">
          {visible.map((r) => (
            <div key={r.id} className="card-lift flex flex-col rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
              <StarRating rating={r.rating} />
              <p className="mt-4 flex-1 text-sm italic leading-relaxed text-ink-400">&ldquo;{r.review}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                {r.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatar_url}
                    alt={r.name}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-semibold text-navy">
                    {initials(r.name)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-navy">{r.name}</p>
                  <p className="text-xs text-ink-300">
                    {r.company ? `${r.company}, ` : ""}
                    {r.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => goTo(page + 1)}
            className="hidden shrink-0 items-center justify-center self-center rounded-full border border-navy/10 bg-white p-2 text-navy shadow-card transition-colors hover:border-trust-500 hover:text-trust-500 sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Mobile prev/next — arrows above are desktop-only, swipe handles mobile,
              but tap targets are still useful for accessibility/no-touch mobile browsers */}
          <button
            type="button"
            aria-label="Previous reviews"
            onClick={() => goTo(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy sm:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show review page ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-6 bg-trust-500" : "w-1.5 bg-navy/15"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next reviews"
            onClick={() => goTo(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 text-navy sm:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
