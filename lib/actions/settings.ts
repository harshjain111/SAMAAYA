"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export interface SettingsFields {
  store_name: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  whatsapp_number: string | null;
  contact_email: string | null;
  announcement_bar: string | null;
}

/** Update the single store_settings row (creates it if missing). */
export async function saveSettings(fields: SettingsFields) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("store_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await admin.from("store_settings").update(fields).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("store_settings").insert(fields);
    if (error) throw new Error(error.message);
  }

  // Settings affect every storefront page (announcement bar, shipping).
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true };
}
