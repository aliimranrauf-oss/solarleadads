"use server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export type SubmitLeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const AD_SPEND_OPTIONS = [
  "Not running ads yet",
  "Under $1,000/mo",
  "$1,000 – $3,000/mo",
  "$3,000+/mo",
] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitLead(
  _prevState: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  // Honeypot: real users never see or fill this field. If it has a value,
  // silently pretend it worked so bots don't learn to look elsewhere.
  const honeypot = String(formData.get("hp_field_9k2") ?? "").trim();
  if (honeypot) {
    console.warn("submitLead: honeypot triggered, skipping insert", {
      honeypotValue: honeypot,
    });
    return { status: "success" };
  }

  // Timestamp trap: if the form was "submitted" less than 1.5s after it
  // rendered, it's almost certainly a bot (or a resubmitted/replayed
  // request), not a real person typing.
  const renderedAt = Number(formData.get("form_rendered_at") ?? 0);
  if (renderedAt && Date.now() - renderedAt < 1500) {
    console.warn("submitLead: submitted too fast, likely bot, skipping insert");
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const websiteUrl = String(formData.get("website_url") ?? "").trim();
  const adSpendRangeRaw = String(formData.get("ad_spend_range") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const source = String(formData.get("source") ?? "contact_page").trim();

  if (!name || !email || !company || !message) {
    return {
      status: "error",
      message: "Please fill in your name, email, company, and a short message.",
    };
  }

  if (!isValidEmail(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const adSpendRange = AD_SPEND_OPTIONS.includes(adSpendRangeRaw as (typeof AD_SPEND_OPTIONS)[number])
    ? adSpendRangeRaw
    : null;

  try {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company,
      phone: phone || null,
      website_url: websiteUrl || null,
      ad_spend_range: adSpendRange,
      message,
      source,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        status: "error",
        message: "Something went wrong saving your info. Please try again in a moment.",
      };
    }

    // Optional email notification — only fires if RESEND_API_KEY is set,
    // so the form still works fully before that's configured.
    await notifyByEmail({ name, email, company, phone, websiteUrl, adSpendRange, message });

    return {
      status: "success",
      message:
        "Thanks! We'll take a look and send your free audit to your email within 1–2 business days.",
    };
  } catch (err) {
    console.error("submitLead error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again, or message us on WhatsApp instead.",
    };
  }
}

async function notifyByEmail(lead: {
  name: string;
  email: string;
  company: string;
  phone: string;
  websiteUrl: string;
  adSpendRange: string | null;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) return; // not configured yet — skip quietly

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SolarLeadAds <onboarding@resend.dev>",
        to: [to],
        subject: `New audit request — ${lead.company}`,
        text: [
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Company: ${lead.company}`,
          `Phone: ${lead.phone || "—"}`,
          `Website / Ad Library link: ${lead.websiteUrl || "—"}`,
          `Ad spend: ${lead.adSpendRange || "—"}`,
          "",
          "Message:",
          lead.message,
        ].join("\n"),
      }),
    });
  } catch (err) {
    // Don't fail the form submission just because the email notification failed —
    // the lead is already safely in Supabase.
    console.error("Resend notification failed:", err);
  }
}
