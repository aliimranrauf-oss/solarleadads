import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Regenerate the sitemap on every request to sitemap.xml so a new blog post
// (is_live = true in Supabase) shows up for Google without a redeploy.
export const revalidate = 0;

const BASE = "https://solarleadads.com";

/**
 * Fetches live blog slugs, but never throws.
 *
 * WHY THIS MATTERS: the previous version imported the shared Supabase client
 * at module scope. That client calls createClient() with non-null-asserted
 * env vars, so a missing or misconfigured NEXT_PUBLIC_SUPABASE_URL threw
 * during the build — which meant `next build` failed outright, and at runtime
 * /sitemap.xml returned a 500. A 500 sitemap is invisible to Google: it can't
 * discover your blog posts at all, and Search Console flags the whole file as
 * "Couldn't fetch".
 *
 * Now the worst case is a sitemap without blog URLs, which still lets every
 * static page get crawled.
 */
async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Sitemap: Supabase env vars not set — skipping blog URLs.");
    return [];
  }

  try {
    const supabase = createClient(url, key);
    const { data: posts, error } = await supabase
      .from("blogs")
      .select("slug, published_at, updated_at")
      .eq("is_live", true)
      .eq("lang", "en");

    if (error) {
      console.error("Sitemap: failed to fetch blog posts:", error.message);
      return [];
    }

    return (posts ?? []).map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: unexpected error fetching blog posts:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogEntries();

  // Static routes, highest-priority first. Priority is a weak hint to Google,
  // but the ordering also documents which pages you actually care about
  // ranking: homepage → money pages (services, chatbot, country pages).
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ai-chatbot`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/usa`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/uk`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/australia`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/results`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/process`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/global`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/reviews`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ] as const).map((route) => ({ ...route, lastModified: new Date() }));

  return [...staticRoutes, ...blogPosts];
}
