type DiscountBadgeProps = {
  percent: number;
  className?: string;
  label?: string;
};

/**
 * Animated "X% OFF — Limited Time" pill with a soft shine sweep and pulse
 * glow. Used on every pricing card (Meta ads packages + AI chatbot tiers) so
 * the "limited-time offer" treatment stays visually consistent site-wide.
 * Respects prefers-reduced-motion via the global rule in app/globals.css.
 */
export default function DiscountBadge({ percent, className = "", label }: DiscountBadgeProps) {
  return (
    <span
      className={`relative isolate inline-flex items-center overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-r from-amber-500 to-leaf-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-soft animate-badgePulse ${className}`}
    >
      <span className="relative z-10">{label ?? `${percent}% off — limited time`}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
    </span>
  );
}
