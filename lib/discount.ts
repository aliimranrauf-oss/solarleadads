/** Rounded discount percentage, e.g. 60 for "60% OFF". Computed from the two
 * prices so the badge never drifts out of sync if either price is edited. */
export function discountPercent(current: number, original: number): number {
  if (!original) return 0;
  return Math.round((1 - current / original) * 100);
}
