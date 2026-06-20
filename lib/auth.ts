import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/** Current authenticated user (or null for guests). Server-side. */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Throw unless the caller is an admin — guard for server actions/mutations. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized.");
  }
}

/** Whether the current user is an admin (gates /admin/*). */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return !!data;
}
