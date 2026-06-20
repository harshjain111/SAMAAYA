import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookieless anon client for PUBLIC reads (products, settings) in Server
 * Components. Because it doesn't touch cookies(), pages that use it can be
 * statically rendered / ISR-cached (PRD §7 SEO + performance). RLS still
 * applies — anon sees only active catalog + store_settings.
 *
 * Use the cookie-aware lib/supabase/server.ts when you need the logged-in
 * user's session (e.g. their own orders).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
