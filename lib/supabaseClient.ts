import { createClient } from "@supabase/supabase-js";

/**
 * Public, read-only Supabase client.
 *
 * Uses the ANON key (safe to ship to the browser / use in Server Components).
 * This is only ever used to read from the `blogs` table, and only rows where
 * `is_live = true` are ever queried. Row Level Security must have a policy
 * allowing public SELECT on `blogs` where `is_live = true` — see
 * supabase/blog-schema.sql for the exact policy.
 *
 * Do NOT use this client for writes. Writes (from an admin tool / dashboard)
 * should go through a service-role client on the server, same pattern as
 * lib/supabase-server.ts.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
