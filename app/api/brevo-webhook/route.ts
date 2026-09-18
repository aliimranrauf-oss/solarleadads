import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// Receives real-time events from Brevo (Transactional → Settings → Webhooks)
// and updates the matching row in `outreach_emails`. See Dev Spec §4.
//
// Brevo isn't authenticated by default, so this endpoint is secured with a
// shared-secret query param instead: set BREVO_WEBHOOK_SECRET, then point
// Brevo at:
//   https://yourdomain.com/api/brevo-webhook?key=YOUR_SECRET
//
// Brevo's webhook payload field names have shifted across API versions, so
// this reads a few possible spellings defensively rather than assuming one.
// Confirm the exact shape with Brevo's "send a test event" button after
// setup and adjust EVENT_FIELD_CANDIDATES below if needed — check your
// server logs, which print the raw payload on any row-matching failure.

type BrevoPayload = Record<string, unknown>;

function str(payload: BrevoPayload, keys: string[]): string | null {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  const secret = process.env.BREVO_WEBHOOK_SECRET;
  const providedKey = req.nextUrl.searchParams.get("key");

  if (!secret) {
    console.error("brevo-webhook: BREVO_WEBHOOK_SECRET is not set — refusing all requests");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (providedKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: BrevoPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = (str(payload, ["event"]) ?? "").toLowerCase();
  const messageId = str(payload, ["message-id", "message_id", "messageId", "id"]);
  const email = str(payload, ["email", "to"]);
  const subject = str(payload, ["subject"]);
  const bounceReason = str(payload, ["reason", "error", "reasonMessage"]);

  if (!event) {
    console.warn("brevo-webhook: payload missing 'event' field", payload);
    return NextResponse.json({ ok: true }); // ack anyway — nothing useful to do with it
  }

  const supabase = getSupabaseServerClient();

  // 1. Try to find the row this event belongs to: message_id first (exact),
  //    then fall back to email + subject (until Option B / message-id-at-send
  //    time is in place — see Dev Spec §8).
  let existingRow: { id: string; open_count: number; first_opened_at: string | null } | null = null;

  if (messageId) {
    const { data } = await supabase
      .from("outreach_emails")
      .select("id, open_count, first_opened_at")
      .eq("message_id", messageId)
      .maybeSingle();
    existingRow = data;
  }

  if (!existingRow && email) {
    let query = supabase
      .from("outreach_emails")
      .select("id, open_count, first_opened_at")
      .eq("recipient_email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (subject) query = query.eq("subject", subject);

    const { data } = await query.maybeSingle();
    existingRow = data;
  }

  // 2. Build the field updates for this event type.
  const updates: Record<string, unknown> = {};

  switch (event) {
    case "sent":
    case "request":
      updates.sent_at = updates.sent_at ?? nowIso();
      break;
    case "delivered":
      updates.delivered_at = nowIso();
      break;
    case "opened":
    case "unique_opened":
      if (!existingRow?.first_opened_at) updates.first_opened_at = nowIso();
      updates.last_opened_at = nowIso();
      updates.open_count = (existingRow?.open_count ?? 0) + 1;
      break;
    case "click":
    case "clicked":
      updates.clicked_at = nowIso();
      break;
    case "hard_bounce":
    case "soft_bounce":
      updates.bounced = true;
      if (bounceReason) updates.bounce_reason = bounceReason;
      break;
    case "spam":
    case "spam_complaint":
      updates.spam_complaint = true;
      break;
    default:
      // Unrecognized event type (e.g. "unsubscribed", "blocked", "deferred")
      // — ack it but don't guess at a field to update.
      console.log(`brevo-webhook: unhandled event type "${event}"`, { email, messageId });
      return NextResponse.json({ ok: true });
  }

  if (messageId) updates.message_id = messageId;

  // 3. Update the matched row, or create a new one so nothing gets missed
  //    even if a manual "Log a new send" step was forgotten (Dev Spec §4.4).
  if (existingRow) {
    const { error } = await supabase.from("outreach_emails").update(updates).eq("id", existingRow.id);
    if (error) {
      console.error("brevo-webhook: update error", error, { event, email, messageId });
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
  } else {
    if (!email) {
      console.warn("brevo-webhook: no matching row and no email to create one from", payload);
      return NextResponse.json({ ok: true });
    }
    const { error } = await supabase.from("outreach_emails").insert({
      recipient_email: email,
      subject: subject ?? null,
      ...updates,
    });
    if (error) {
      console.error("brevo-webhook: insert error", error, { event, email, messageId });
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }
  }

  // Brevo expects a fast 200 and will retry/disable the webhook on repeated
  // timeouts or errors — keep this handler quick, no extra work below here.
  return NextResponse.json({ ok: true });
}
