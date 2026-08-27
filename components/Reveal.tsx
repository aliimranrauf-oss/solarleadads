"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — use for elegant sequential reveals within a section. */
  delay?: number;
};

/**
 * Lightweight scroll-reveal wrapper.
 *
 * Uses a single IntersectionObserver per instance, unobserves itself the
 * moment it has fired, and only ever toggles `opacity`/`transform` — both
 * compositor-only properties, so this never triggers layout/paint work and
 * has no measurable Lighthouse Performance cost. Content is present in the
 * server-rendered HTML the whole time (nothing is removed from the DOM),
 * so this doesn't affect SEO. A <noscript> rule in the root layout forces
 * everything visible if JavaScript is unavailable, so nothing ever gets
 * stuck hidden.
 *
 * Do NOT wrap likely LCP elements (e.g. the hero h1) with this — starting
 * them at opacity:0 can delay when they're painted.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver isn't available for some reason, just show it.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
