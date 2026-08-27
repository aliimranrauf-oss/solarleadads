import { getSupabaseServerClient } from "@/lib/supabase-server";
import { placeholderReviews, type Review } from "@/lib/reviews";

/**
 * Fetches approved reviews for public display. Falls back to placeholder
 * reviews if Supabase isn't configured yet, or if there simply aren't any
 * approved reviews yet — so the section never renders empty.
 */
export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, company, country, rating, review, avatar_url, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("getApprovedReviews error:", error);
      return placeholderReviews;
    }

    if (!data || data.length === 0) {
      return placeholderReviews;
    }

    return data as Review[];
  } catch (err) {
    // Supabase env vars not set yet — don't break the page, just show placeholders.
    console.warn("getApprovedReviews: falling back to placeholders", err);
    return placeholderReviews;
  }
}
