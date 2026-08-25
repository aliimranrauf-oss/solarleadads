"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { heroSlides } from "@/lib/hero-images";

const INTERVAL_MS = 3200;

export default function HeroImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || heroSlides.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-trust-100 via-leaf-50 to-amber-100 blur-2xl opacity-70" />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-soft">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 420px, 90vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* caption overlay, always shows the current slide's caption */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent px-5 pb-4 pt-10">
          <p className="font-display text-sm font-semibold text-white sm:text-base">
            {heroSlides[index]?.caption}
          </p>
        </div>
      </div>

      {heroSlides.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}: ${slide.caption}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-trust-500" : "w-1.5 bg-navy/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
