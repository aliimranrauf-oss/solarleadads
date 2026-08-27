"use server";

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

  if (!name || !country || !review) {
    return {
      status: "error",
      message: "Please fill in your name, country, and review.",
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

    // status is deliberately hardcoded to "pending" here — never taken from
    // the form — so a visitor can never publish their own review directly.
    const { error } = await supabase.from("reviews").insert({
      name,
      company: company || null,
      country,
      rating,
      review,
      avatar_url: avatarUrl || null,
      status: "pending",
    });

    if (error) {
      console.error("submitReview insert error:", error);
      return {
        status: "error",
        message: "Something went wrong saving your review. Please try again in a moment.",
      };
    }

    return {
      status: "success",
      message: "Thanks! Your review has been submitted and will appear once it's reviewed.",
    };
  } catch (err) {
    console.error("submitReview error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again shortly.",
    };
  }
}
