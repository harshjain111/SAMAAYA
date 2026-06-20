# SAMAAYA — Supabase setup

Everything here is written and ready. Run it once you have a Supabase project.

## 1. Create the project
1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API → copy the **Project URL**, **anon public** key, and
   **service_role** key into `.env.local` (see `.env.example`).

## 2. Run the schema + RLS + seed
In the Supabase dashboard → **SQL Editor**, run these in order:

1. `migrations/0001_schema.sql` — tables, indexes, `is_admin()`, triggers
2. `migrations/0002_rls.sql` — Row Level Security policies
3. `seed.sql` — store_settings + 2 sample products (idempotent)

> Or, with the Supabase CLI linked: `supabase db push` then run `seed.sql`.

## 3. Make yourself an admin
RLS gates `/admin/*` on the `admin_users` table. After you sign in once (so an
`auth.users` row exists), grant admin in the SQL Editor:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```

## 4. Regenerate types (optional, keeps types/database.ts authoritative)
```bash
npx supabase gen types typescript --project-id <project-id> --schema public > types/database.ts
```

## Design notes
- **All money/stock writes are server-side** with the service-role key, which
  bypasses RLS. Guest checkout needs no anon write policies.
- **Snapshots:** `order_items` and `orders.shipping_address` store values at
  order time — historical orders never re-derive from live product data.
- **Public reads:** active products/variants/images, related links, and
  `store_settings` are world-readable. Customers read only their own
  orders/addresses (matched via `auth_user_id`).
