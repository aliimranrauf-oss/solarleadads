/**
 * Suggested next action for a cold-outreach row.
 *
 * Simple, deterministic rules — no AI. Kept as a pure function (data in,
 * string out) so the day/count thresholds can be tweaked later without
 * touching the admin page component. See Dev Spec §6 for the source rules.
 *
 * Rule order matters — first match wins. Don't reorder without checking the
 * spec; e.g. "replied" and "bounced" must always be checked before the
 * engagement-based rules below them.
 */

export type OutreachActionInput = {
  replied: boolean;
  bounced: boolean;
  spamComplaint: boolean;
  openCount: number;
  sentAt: string | null; // ISO timestamp, or null if not sent yet
  sequenceStep: number;
};

export type SuggestedActionResult = {
  label: string;
  /** Rough urgency, for sorting/coloring in the UI. Not part of the spec's
   *  rule text itself — derived from which rule matched. */
  priority: "none" | "low" | "medium" | "high";
};

/** Whole days elapsed between `sentAt` and now. Null if never sent. */
export function daysSince(sentAt: string | null, now: Date = new Date()): number | null {
  if (!sentAt) return null;
  const sentTime = new Date(sentAt).getTime();
  if (Number.isNaN(sentTime)) return null;
  const diffMs = now.getTime() - sentTime;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getSuggestedAction(row: OutreachActionInput): SuggestedActionResult {
  const { replied, bounced, spamComplaint, openCount, sequenceStep } = row;
  const daysSinceSent = daysSince(row.sentAt);

  if (replied) {
    return { label: "No action — replied", priority: "none" };
  }

  if (bounced) {
    return { label: "Remove from list — bounced", priority: "medium" };
  }

  if (spamComplaint) {
    return { label: "Remove from list — spam complaint", priority: "high" };
  }

  if (openCount >= 2 && !replied) {
    return { label: "Personal follow-up (high engagement)", priority: "high" };
  }

  // Not sent yet (no sent_at) — nothing time-based applies.
  if (daysSinceSent === null) {
    return { label: "No action yet — not sent", priority: "none" };
  }

  if (openCount === 1 && daysSinceSent >= 3 && daysSinceSent < 7 && sequenceStep === 1) {
    return { label: "Send Email 2 (follow-up)", priority: "medium" };
  }

  if (openCount === 1 && daysSinceSent >= 7 && sequenceStep <= 2) {
    return { label: "Send Email 3 (break-up)", priority: "medium" };
  }

  if (openCount === 0 && daysSinceSent >= 3 && daysSinceSent < 7) {
    return { label: "Resend with new subject line", priority: "low" };
  }

  if (openCount === 0 && daysSinceSent >= 7) {
    return { label: "Check spam placement / try other channel (WhatsApp, LinkedIn)", priority: "medium" };
  }

  return { label: "No action yet — within normal window", priority: "none" };
}

/** Derived status label for the "Status" column. */
export function getStatusLabel(row: {
  bounced: boolean;
  spamComplaint: boolean;
  openCount: number;
  deliveredAt: string | null;
  sentAt: string | null;
}): string {
  if (row.bounced) return "Bounced";
  if (row.spamComplaint) return "Spam";
  if (row.openCount > 0) return `Opened (x${row.openCount})`;
  if (row.deliveredAt) return "Delivered";
  if (row.sentAt) return "Sent";
  return "Not sent";
}
