import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// Lead-capture endpoint for the chat widget (components/ChatWidget.tsx).
// The main /contact page uses a Server Action (app/contact/actions.ts)
// instead, since it's a plain <form>. The chat widget is a client
// component that needs a fetch-able JSON endpoint, so it gets its own
// route here — but both write into the exact same Supabase `leads` table
// with the same columns, just with company/phone/etc. often left blank
// since the chat widget only asks for name, email, and a short message.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

const VALID_SOURCES = ["chat_bot"] as const;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // per IP, per window — leads are rarer than chat messages

// In-memory only: resets on cold start, not shared across serverless
// instances. Fine for current traffic — revisit with Redis/Upstash if it
// grows.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

function clean(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions — please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field. Bots that
  // blindly fill every input do. Pretend success so the bot doesn't learn
  // anything, but skip the actual DB insert.
  const honeypot = clean(body.company_website, MAX_FIELD_LENGTH);
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  const name = clean(body.name, MAX_FIELD_LENGTH);
  const email = clean(body.email, MAX_FIELD_LENGTH);
  const company = clean(body.company, MAX_FIELD_LENGTH);
  const message = clean(body.message, MAX_MESSAGE_LENGTH);

  const rawSource = clean(body.source, MAX_FIELD_LENGTH);
  const source = (VALID_SOURCES as readonly string[]).includes(rawSource) ? rawSource : "chat_bot";

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email) {
    fieldErrors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!company) fieldErrors.company = "Company name is required.";
  if (!message) fieldErrors.message = "Message is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company,
      phone: null,
      website_url: null,
      ad_spend_range: null,
      message,
      source,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Something went wrong saving your message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chatbot lead route error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again, or email us directly." },
      { status: 500 }
    );
  }
}
