// Create (or promote) an admin user. Run:
//   npm run make:admin -- you@example.com YourStrongPassword
// Uses the service role to create a confirmed user and add them to admin_users.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [email, password] = process.argv.slice(2);

if (!url || !key) {
  console.error("\n❌ Missing keys in .env.local.\n");
  process.exit(1);
}
if (!email || !password) {
  console.error("\nUsage: npm run make:admin -- <email> <password>\n");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// Create the user (confirmed). If they already exist, find them.
let userId;
const { data: created, error: createErr } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createErr) {
  if (/already/i.test(createErr.message)) {
    console.log("ℹ️  User exists — locating and updating password…");
    // find by listing users
    let page = 1;
    for (;;) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error) { console.error("❌", error.message); process.exit(1); }
      const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
      if (u) { userId = u.id; break; }
      if (data.users.length < 200) break;
      page += 1;
    }
    if (!userId) { console.error("❌ Could not find existing user."); process.exit(1); }
    await db.auth.admin.updateUserById(userId, { password, email_confirm: true });
  } else {
    console.error("❌", createErr.message);
    process.exit(1);
  }
} else {
  userId = created.user.id;
}

const { error: adminErr } = await db
  .from("admin_users")
  .upsert({ user_id: userId }, { onConflict: "user_id" });
if (adminErr) { console.error("❌ admin_users:", adminErr.message); process.exit(1); }

// Also create a customer record so order history links up.
await db.from("customers").upsert(
  { auth_user_id: userId, email },
  { onConflict: "auth_user_id" },
);

console.log(`\n✅ ${email} is now an admin.`);
console.log("   Sign in at /account (email + password), then open /admin.\n");
