import { createPublicClient } from "@/lib/supabase/public";
import type { StoreSettings } from "@/types/database";

const FALLBACK: StoreSettings = {
  id: "fallback",
  shipping_fee: 0,
  free_shipping_threshold: 0,
  whatsapp_number: null,
  contact_email: null,
  store_name: "SAMAAYA",
  announcement_bar: null,
  updated_at: new Date(0).toISOString(),
};

/**
 * The single store_settings row (publicly readable). Returns safe defaults if
 * the table is empty or unreachable so the storefront always renders.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getStoreSettings]", error.message);
    return FALLBACK;
  }
  return data ?? FALLBACK;
}
