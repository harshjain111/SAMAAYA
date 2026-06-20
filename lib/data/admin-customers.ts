import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Customer, Order } from "@/types/database";

export interface AdminCustomerRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  orderCount: number;
  totalSpent: number; // paid orders only
}

export interface AdminCustomerDetail {
  customer: Customer;
  orders: Order[];
  orderCount: number;
  totalSpent: number;
}

const last10 = (s?: string | null) => (s ?? "").replace(/\D/g, "").slice(-10);

export async function getAdminCustomers(search?: string): Promise<AdminCustomerRow[]> {
  const admin = createAdminClient();

  const [{ data: customers }, { data: orders }] = await Promise.all([
    admin.from("customers").select("*").order("created_at", { ascending: false }),
    admin.from("orders").select("customer_id, total, payment_status"),
  ]);

  // Aggregate orders per customer.
  const agg = new Map<string, { count: number; spent: number }>();
  for (const o of orders ?? []) {
    if (!o.customer_id) continue;
    const a = agg.get(o.customer_id) ?? { count: 0, spent: 0 };
    a.count += 1;
    if (o.payment_status === "paid") a.spent += Number(o.total);
    agg.set(o.customer_id, a);
  }

  let rows: AdminCustomerRow[] = (customers ?? []).map((c) => {
    const a = agg.get(c.id) ?? { count: 0, spent: 0 };
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      created_at: c.created_at,
      orderCount: a.count,
      totalSpent: a.spent,
    };
  });

  if (search) {
    const s = search.trim().toLowerCase();
    const sd = last10(search);
    rows = rows.filter(
      (r) =>
        (r.name ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (sd && last10(r.phone) === sd),
    );
  }

  return rows;
}

export async function getAdminCustomer(id: string): Promise<AdminCustomerDetail | null> {
  const admin = createAdminClient();
  const { data: customer } = await admin
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!customer) return null;

  const { data: orders } = await admin
    .from("orders")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as Order[];
  const totalSpent = list
    .filter((o) => o.payment_status === "paid")
    .reduce((s, o) => s + Number(o.total), 0);

  return {
    customer: customer as Customer,
    orders: list,
    orderCount: list.length,
    totalSpent,
  };
}
