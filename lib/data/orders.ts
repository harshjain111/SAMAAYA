import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/database";

/**
 * The current user's orders (RLS restricts to their own via auth_user_id).
 * Guests have none — they track via /track (Prompt 2.4).
 */
export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getMyOrders]", error.message);
    return [];
  }
  return (data ?? []) as Order[];
}
