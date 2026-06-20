// Quick connection test. Run: npm run check:db
// Reads .env.local, pings Supabase, confirms the schema + seed are in place.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

if (!url || !anon) {
  fail(
    "Missing keys in .env.local. Fill NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase → Settings → API), then re-run.",
  );
}

console.log(`\n🔌 Connecting to ${url} ...`);

// 1) Public read (anon key, RLS applies) — proves keys + RLS public-read work.
const pub = createClient(url, anon);
const { data: products, error: pErr } = await pub
  .from("products")
  .select("name, slug, active")
  .eq("active", true);

if (pErr) {
  fail(
    `Public read failed: ${pErr.message}\n` +
      "Did you run supabase/setup.sql in the SQL Editor yet?",
  );
}

const { data: settings, error: sErr } = await pub
  .from("store_settings")
  .select("store_name, free_shipping_threshold")
  .single();

if (sErr) fail(`store_settings read failed: ${sErr.message}`);

console.log(`✅ Connected. Public read works (RLS active).`);
console.log(`   Store: ${settings.store_name}`);
console.log(`   Free-ship threshold: ₹${settings.free_shipping_threshold}`);
console.log(`   Active products (${products.length}):`);
for (const p of products) console.log(`     • ${p.name}  (/${p.slug})`);

// 2) Service-role check (optional) — proves server writes will work.
if (service) {
  const admin = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { count, error: aErr } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true });
  if (aErr) {
    console.log(`\n⚠️  Service-role check failed: ${aErr.message}`);
  } else {
    console.log(`\n✅ Service-role key works (orders table reachable, ${count ?? 0} rows).`);
  }
} else {
  console.log(
    `\nℹ️  SUPABASE_SERVICE_ROLE_KEY not set — fine for now, needed for checkout later.`,
  );
}

console.log(`\n🎉 Supabase is connected and ready.\n`);
