import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * Uses the SERVICE ROLE key, which bypasses Row Level Security — this file
 * must never be imported into a "use client" component or exposed to the
 * browser. It's only ever called from Server Actions (see app/contact/actions.ts).
 *
 * Row Level Security stays ON in Supabase with no public policies. The
 * service role key is the only way to write to the `leads` table, so we
 * don't need to expose an anon insert policy at all — safer default.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars. Copy .env.example to .env.local and fill in " +
        "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see README → Supabase setup)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
