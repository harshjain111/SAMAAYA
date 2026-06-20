-- =============================================================================
-- SAMAAYA — setup.sql  (ONE-PASTE SETUP)
-- Paste this whole file into Supabase → SQL Editor → Run. That's it.
--
-- It is SAFE TO RE-RUN: the top section drops any half-built SAMAAYA tables
-- first, so the "relation already exists" error can never happen. Re-running
-- gives you a clean, fully-seeded database every time.
--
-- WARNING: this DELETES all data in these tables. That's fine during setup.
-- Do NOT run this on a live store with real orders.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. CLEAN SLATE — drop everything we own (cascade clears FKs/policies).
-- ---------------------------------------------------------------------------
drop table if exists
  public.order_status_history,
  public.order_items,
  public.orders,
  public.addresses,
  public.customers,
  public.product_related,
  public.product_images,
  public.product_variants,
  public.products,
  public.store_settings,
  public.admin_users
  cascade;

drop function if exists public.is_admin() cascade;
drop function if exists public.set_updated_at() cascade;

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. HELPERS
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 2. TABLES
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_tasting_note text,
  description text,
  story text,
  origin_region text,
  strength int check (strength between 1 and 5),
  moment text check (moment in ('morning', 'afternoon', 'evening')),
  brew_temp text,
  brew_time text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_active_idx on public.products (active);
create index products_moment_idx on public.products (moment);
create index products_sort_idx on public.products (sort_order);
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  weight_grams int not null,
  label text not null,
  price numeric(10, 2) not null check (price >= 0),
  mrp numeric(10, 2) check (mrp >= 0),
  sku text unique,
  stock_qty int not null default 0 check (stock_qty >= 0),
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants (product_id);
create index product_variants_active_idx on public.product_variants (active);
create trigger product_variants_set_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images (product_id);

create table public.product_related (
  product_id uuid not null references public.products (id) on delete cascade,
  related_product_id uuid not null references public.products (id) on delete cascade,
  sort_order int not null default 0,
  primary key (product_id, related_product_id),
  check (product_id <> related_product_id)
);
create index product_related_product_idx on public.product_related (product_id);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  auth_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index customers_email_key on public.customers (lower(email)) where email is not null;
create index customers_phone_idx on public.customers (phone);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_customer_idx on public.addresses (customer_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  status text not null default 'new'
    check (status in ('new','confirmed','packed','shipped','delivered','cancelled','refunded')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  payment_method text,
  razorpay_order_id text,
  razorpay_payment_id text,
  subtotal numeric(10, 2) not null default 0,
  shipping_fee numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  courier text,
  awb_number text,
  tracking_url text,
  shipping_address jsonb,
  source text not null default 'web',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_customer_idx on public.orders (customer_id);
create index orders_status_idx on public.orders (status);
create index orders_payment_status_idx on public.orders (payment_status);
create index orders_created_idx on public.orders (created_at desc);
create index orders_razorpay_order_idx on public.orders (razorpay_order_id);
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  weight_label text not null,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null
);
create index order_items_order_idx on public.order_items (order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
create index order_status_history_order_idx on public.order_status_history (order_id, created_at);

create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  shipping_fee numeric(10, 2) not null default 0,
  free_shipping_threshold numeric(10, 2) not null default 0,
  whatsapp_number text,
  contact_email text,
  store_name text not null default 'SAMAAYA',
  announcement_bar text,
  updated_at timestamptz not null default now()
);
create trigger store_settings_set_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.admin_users          enable row level security;
alter table public.products             enable row level security;
alter table public.product_variants     enable row level security;
alter table public.product_images       enable row level security;
alter table public.product_related      enable row level security;
alter table public.customers            enable row level security;
alter table public.addresses            enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.order_status_history enable row level security;
alter table public.store_settings       enable row level security;

create policy admin_users_select_admin on public.admin_users
  for select using (public.is_admin());

create policy products_select_public on public.products
  for select using (active = true);
create policy products_admin_all on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy product_variants_select_public on public.product_variants
  for select using (
    active = true and exists (
      select 1 from public.products p where p.id = product_variants.product_id and p.active = true
    )
  );
create policy product_variants_admin_all on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

create policy product_images_select_public on public.product_images
  for select using (
    exists (select 1 from public.products p where p.id = product_images.product_id and p.active = true)
  );
create policy product_images_admin_all on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy product_related_select_public on public.product_related
  for select using (true);
create policy product_related_admin_all on public.product_related
  for all using (public.is_admin()) with check (public.is_admin());

create policy customers_select_own on public.customers
  for select using (auth_user_id = auth.uid());
create policy customers_update_own on public.customers
  for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy customers_admin_all on public.customers
  for all using (public.is_admin()) with check (public.is_admin());

create policy addresses_select_own on public.addresses
  for select using (
    exists (select 1 from public.customers c where c.id = addresses.customer_id and c.auth_user_id = auth.uid())
  );
create policy addresses_modify_own on public.addresses
  for all using (
    exists (select 1 from public.customers c where c.id = addresses.customer_id and c.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.customers c where c.id = addresses.customer_id and c.auth_user_id = auth.uid())
  );
create policy addresses_admin_all on public.addresses
  for all using (public.is_admin()) with check (public.is_admin());

create policy orders_select_own on public.orders
  for select using (
    exists (select 1 from public.customers c where c.id = orders.customer_id and c.auth_user_id = auth.uid())
  );
create policy orders_admin_all on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy order_items_select_own on public.order_items
  for select using (
    exists (
      select 1 from public.orders o join public.customers c on c.id = o.customer_id
      where o.id = order_items.order_id and c.auth_user_id = auth.uid()
    )
  );
create policy order_items_admin_all on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy order_status_history_select_own on public.order_status_history
  for select using (
    exists (
      select 1 from public.orders o join public.customers c on c.id = o.customer_id
      where o.id = order_status_history.order_id and c.auth_user_id = auth.uid()
    )
  );
create policy order_status_history_admin_all on public.order_status_history
  for all using (public.is_admin()) with check (public.is_admin());

create policy store_settings_select_public on public.store_settings
  for select using (true);
create policy store_settings_admin_all on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. SEED — store settings + 2 sample products (placeholder prices/images)
-- ---------------------------------------------------------------------------
insert into public.store_settings
  (shipping_fee, free_shipping_threshold, whatsapp_number, contact_email, store_name, announcement_bar)
values (49, 599, '+910000000000', 'hello@samaaya.example', 'SAMAAYA',
        'Fresh from Assam''s estates · Free shipping over ₹599');

with p as (
  insert into public.products
    (name, slug, short_tasting_note, description, story, origin_region,
     strength, moment, brew_temp, brew_time, featured, active, sort_order)
  values
    ('Assam Morning Gold', 'assam-morning-gold',
     'Malty, brisk, full-bodied — a proper wake-up cup.',
     'A classic single-estate Assam black tea with rich malt, a brisk bite, and a deep amber liquor. Built for the first cup of the day.',
     'Picked at peak from a single Assam estate and packed within days — never warehoused. This is what fresh Assam actually tastes like.',
     'Upper Assam', 5, 'morning', '95°C', '3–4', true, true, 1)
  returning id
)
insert into public.product_variants (product_id, weight_grams, label, price, mrp, sku, stock_qty, sort_order)
select id, w.grams, w.label, w.price, w.mrp, w.sku, w.stock, w.sort
from p cross join (values
  (250,  '250g',  299, 349, 'AMG-250',  120, 1),
  (500,  '500g',  549, 649, 'AMG-500',   80, 2),
  (1000, '1kg',   999, 1199, 'AMG-1000', 40, 3)
) as w(grams, label, price, mrp, sku, stock, sort);

insert into public.product_images (product_id, url, alt, sort_order)
select id, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1200&q=80',
       'Loose-leaf Assam black tea', 1
from public.products where slug = 'assam-morning-gold';

with p as (
  insert into public.products
    (name, slug, short_tasting_note, description, story, origin_region,
     strength, moment, brew_temp, brew_time, featured, active, sort_order)
  values
    ('Garden Green Calm', 'garden-green-calm',
     'Smooth, grassy, gently sweet — a mid-day reset.',
     'A delicate Assam green tea with a soft, vegetal smoothness and a clean finish. Light enough for the afternoon, alive with freshness.',
     'Steamed and dried soon after plucking to lock in the green, grassy character that fades fast in older tea.',
     'Assam Valley', 2, 'afternoon', '80°C', '2–3', false, true, 2)
  returning id
)
insert into public.product_variants (product_id, weight_grams, label, price, mrp, sku, stock_qty, sort_order)
select id, w.grams, w.label, w.price, w.mrp, w.sku, w.stock, w.sort
from p cross join (values
  (250, '250g', 349, NULL::numeric, 'GGC-250', 90, 1),
  (500, '500g', 649, NULL::numeric, 'GGC-500', 60, 2)
) as w(grams, label, price, mrp, sku, stock, sort);

insert into public.product_images (product_id, url, alt, sort_order)
select id, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80',
       'Fresh green tea leaves', 1
from public.products where slug = 'garden-green-calm';

insert into public.product_related (product_id, related_product_id, sort_order)
select a.id, b.id, 1 from public.products a, public.products b
where a.slug = 'assam-morning-gold' and b.slug = 'garden-green-calm';
insert into public.product_related (product_id, related_product_id, sort_order)
select a.id, b.id, 1 from public.products a, public.products b
where a.slug = 'garden-green-calm' and b.slug = 'assam-morning-gold';

-- Done. You should see 2 products, 5 variants, 2 images, 1 settings row.
select 'SAMAAYA setup complete ✅' as status,
       (select count(*) from public.products) as products,
       (select count(*) from public.product_variants) as variants;
