// Verifies admin data queries run against the live schema. Run: npm run check:admin
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("\n❌ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local\n");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

let failed = false;
async function check(name, p) {
  const { error, data } = await p;
  if (error) {
    failed = true;
    console.log(`❌ ${name}: ${error.message}`);
  } else {
    const n = Array.isArray(data) ? data.length : data == null ? 0 : 1;
    console.log(`✅ ${name} (${n} rows)`);
  }
}

console.log("\n🔎 Admin data queries\n");

await check(
  "products list (nested variants+images)",
  db
    .from("products")
    .select("id, name, slug, active, product_variants(price, stock_qty, active), product_images(url, sort_order)")
    .order("sort_order", { ascending: true }),
);

await check(
  "low stock variants",
  db
    .from("product_variants")
    .select("id, label, stock_qty, product_id, products(name, slug)")
    .eq("active", true)
    .lte("stock_qty", 10),
);

await check(
  "recent orders",
  db.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
);

await check(
  "paid orders (revenue)",
  db.from("orders").select("total, created_at").eq("payment_status", "paid"),
);

await check(
  "next_order_number() RPC",
  db.rpc("next_order_number"),
);

console.log(failed ? "\n⚠️  Some queries failed (see above).\n" : "\n🎉 All admin queries valid.\n");
process.exit(failed ? 1 : 0);
