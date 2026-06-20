import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * SERVICE-ROLE Supabase client. Bypasses RLS — use ONLY in trusted server code:
 * order creation, price computation, stock decrement, payment/webhook handling,
 * silent customer creation (CLAUDE.md §ARCHITECTURE RULES, PRD §5.6).
 *
 * The `server-only` import makes the build fail if this is ever pulled into a
 * Client Component, so the key can never reach the browser. Never expose the
 * service-role key with a NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
