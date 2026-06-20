import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface UpsertCustomerInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  authUserId?: string | null;
}

/**
 * Silent account creation (PRD §5.5, CLAUDE.md). Finds or creates a customer
 * by auth user → email → phone, links auth_user_id when logged in, and fills
 * in missing name/phone. Runs with the service role (bypasses RLS) — server
 * only. Returns the customer id. NEVER blocks purchase.
 */
export async function upsertCustomer(
  input: UpsertCustomerInput,
): Promise<string | null> {
  const admin = createAdminClient();
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.trim() || null;

  // 1) Match by linked auth user.
  if (input.authUserId) {
    const { data: byAuth } = await admin
      .from("customers")
      .select("id, name, phone")
      .eq("auth_user_id", input.authUserId)
      .maybeSingle();
    if (byAuth) {
      await admin
        .from("customers")
        .update({
          name: byAuth.name || input.name || null,
          phone: byAuth.phone || phone,
        })
        .eq("id", byAuth.id);
      return byAuth.id;
    }
  }

  // 2) Match by email.
  let existing: { id: string; auth_user_id: string | null } | null = null;
  if (email) {
    const { data } = await admin
      .from("customers")
      .select("id, auth_user_id")
      .ilike("email", email)
      .maybeSingle();
    existing = data ?? null;
  }
  // 3) Else match by phone.
  if (!existing && phone) {
    const { data } = await admin
      .from("customers")
      .select("id, auth_user_id")
      .eq("phone", phone)
      .maybeSingle();
    existing = data ?? null;
  }

  if (existing) {
    await admin
      .from("customers")
      .update({
        name: input.name || undefined,
        phone: phone || undefined,
        auth_user_id: input.authUserId ?? existing.auth_user_id ?? undefined,
      })
      .eq("id", existing.id);
    return existing.id;
  }

  // 4) Create new.
  const { data: created, error } = await admin
    .from("customers")
    .insert({
      name: input.name || null,
      email,
      phone,
      auth_user_id: input.authUserId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[upsertCustomer]", error.message);
    return null;
  }
  return created.id;
}

/** Link an authenticated user to an existing/new customer record (OAuth login). */
export async function linkAuthUserToCustomer(
  authUserId: string,
  email: string,
  name?: string | null,
): Promise<string | null> {
  return upsertCustomer({ authUserId, email, name });
}
