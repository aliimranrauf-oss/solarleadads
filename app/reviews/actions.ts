"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export type SubmitReviewState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Accepts either a plausible email or a plausible phone number. Deliberately
// loose (international formats vary a lot) — this is a light sanity check,
// not a hard validator, since the real goal is just discouraging one-off
// randoms from leaving fake reviews, not blocking real customers.
function isValidContact(value: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+]?[\d\s()-]{7,20}$/;
  return emailPattern.test(value) || phonePattern.test(value);
}

export async function submitReview(
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  // Honeypot — same pattern as the contact form. Real users never see this field.
  const honeypot = String(formData.get("hp_field_9k2") ?? "").trim();
  if (honeypot) {
    console.warn("submitReview: honeypot triggered, skipping insert");
    return { status: "success", message: "Thanks for your review!" };
  }

  // Timestamp trap — reject anything submitted implausibly fast.
  const renderedAt = Number(formData.get("form_rendered_at") ?? 0);
  if (renderedAt && Date.now() - renderedAt < 1500) {
    console.warn("submitReview: submitted too fast, likely bot, skipping insert");
    return { status: "success", message: "Thanks for your review!" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const review = String(formData.get("review") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();
  const orderNumber = String(formData.get("order_number") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();

  if (!name || !country || !review) {
    return {
      status: "error",
      message: "Please fill in your name, country, and review.",
    };
  }

  if (!orderNumber) {
    return {
      status: "error",
      message: "Please enter the order number you got from us when you purchased services.",
    };
  }

  if (!contact) {
    return {
      status: "error",
      message: "Please enter a phone number or email so we can verify your order.",
    };
  }

  if (!isValidContact(contact)) {
    return {
      status: "error",
      message: "Please enter a valid phone number or email address.",
    };
  }

  if (review.length > 1000) {
    return { status: "error", message: "Please keep your review under 1000 characters." };
  }

  const rating = Number(ratingRaw);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Please choose a rating from 1 to 5." };
  }

  if (avatarUrl && !isValidUrl(avatarUrl)) {
    return { status: "error", message: "That photo link doesn't look like a valid URL." };
  }

  try {
    const supabase = getSupabaseServerClient();

    // status is deliberately hardcoded here — never taken from the form —
    // so a visitor can never inject an arbitrary status value. Reviews are
    // auto-approved and go live immediately; pinning (separate "pinned"
    // column) is still a manual, admin-only action done in Supabase.
    //
    // order_number and contact are collected purely to discourage random
    // fake reviews and to let you verify a genuine customer if needed.
    // Neither is ever selected by the public query in lib/get-reviews.ts,
    // so neither ever appears on the site.
    const { error } = await supabase.from("reviews").insert({
      name,
      company: company || null,
      country,
      rating,
      review,
      avatar_url: avatarUrl || null,
      status: "approved",
      order_number: orderNumber,
      contact,
    });

    if (error) {
      console.error("submitReview insert error:", error);
      return {
        status: "error",
        message: "Something went wrong saving your review. Please try again in a moment.",
      };
    }

    // Instantly refresh the homepage and /reviews page caches so the new
    // review shows up right away instead of waiting for the 60s revalidate.
    revalidatePath("/");
    revalidatePath("/reviews");

    return {
      status: "success",
      message: "Your review has been published. Thanks for sharing your experience!",
    };
  } catch (err) {
    console.error("submitReview error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again shortly.",
    };
  }
}
