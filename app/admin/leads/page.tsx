import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { getSuggestedAction, getStatusLabel, daysSince } from "@/lib/suggested-action";
import type { OutreachEmailRow } from "@/lib/outreach-types";
import { logout } from "@/app/admin/login/actions";
import OutreachDashboard, { type OutreachDisplayRow } from "./OutreachDashboard";

export const metadata: Metadata = {
  title: "Outreach Tracker | Admin",
  robots: { index: false, follow: false },
};

// Always fetch fresh — this is an internal ops dashboard, not something to
// cache across requests.
export const dynamic = "force-dynamic";

function lastActivityTime(row: OutreachEmailRow): number {
  const candidates = [row.last_opened_at, row.clicked_at, row.delivered_at, row.sent_at, row.created_at];
  for (const c of candidates) {
    if (c) return new Date(c).getTime();
  }
  return 0;
}

export default async function AdminLeadsPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("outreach_emails")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("AdminLeadsPage fetch error:", error);
  }

  const rows: OutreachEmailRow[] = (data as OutreachEmailRow[] | null) ?? [];

  // "Sorted by most recent activity first" (Dev Spec §5) — activity meaning
  // whichever of open/click/delivered/sent/created happened most recently.
  const sorted = [...rows].sort((a, b) => lastActivityTime(b) - lastActivityTime(a));

  const displayRows: OutreachDisplayRow[] = sorted.map((row) => {
    const suggested = getSuggestedAction({
      replied: row.replied,
      bounced: row.bounced,
      spamComplaint: row.spam_complaint,
      openCount: row.open_count,
      sentAt: row.sent_at,
      sequenceStep: row.sequence_step,
    });

    return {
      id: row.id,
      companyName: row.company_name,
      recipientEmail: row.recipient_email,
      subject: row.subject,
      sentAt: row.sent_at,
      daysSinceSent: daysSince(row.sent_at),
      status: getStatusLabel({
        bounced: row.bounced,
        spamComplaint: row.spam_complaint,
        openCount: row.open_count,
        deliveredAt: row.delivered_at,
        sentAt: row.sent_at,
      }),
      openCount: row.open_count,
      bounced: row.bounced,
      spamComplaint: row.spam_complaint,
      replied: row.replied,
      sequenceStep: row.sequence_step,
      suggestedAction: suggested.label,
      suggestedPriority: suggested.priority,
      statusNote: row.status_note,
    };
  });

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-ink-300/15 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-navy">Outreach Tracker</h1>
            <p className="text-sm text-ink-400">Cold email status, synced from Brevo</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-ink-400 hover:text-navy border border-ink-300/30 rounded-lg px-3 py-1.5 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            Couldn&apos;t load outreach data. Check that the <code>outreach_emails</code> table exists
            (see <code>supabase/outreach-schema.sql</code>).
          </div>
        )}
        <OutreachDashboard rows={displayRows} />
      </div>
    </main>
  );
}
