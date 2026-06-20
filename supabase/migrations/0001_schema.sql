-- =============================================================================
-- SAMAAYA — 0001_schema.sql
-- Core schema per PRD §4. Tables, FKs, indexes, helper functions, triggers.
-- RLS policies live in 0002_rls.sql. Seed data in ../seed.sql.
-- =============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- updated_at trigger helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- ADMIN: who can access /admin/* and admin mutations.
-- Not in the PRD data model, but required to implement "role: admin" (PRD §3.2).
-- An auth user is an admin iff their auth.uid() is present here.
-- -----------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- security definer so it can read admin_users regardless of the caller's RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- =============================================================================
-- PRODUCTS
-- =============================================================================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_tasting_note text,                       -- card one-liner
  description text,                              -- full
  story text,                                    -- per-product story
  origin_region text,                           -- estate/region
  strength int check (strength between 1 and 5), -- strength meter
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
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- PRODUCT VARIANTS (weight/price/MRP/SKU/stock)
-- =============================================================================
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  weight_grams int not null,                     -- 250/500/1000
  label text not null,                           -- "250g"
  price numeric(10, 2) not null check (price >= 0),
  mrp numeric(10, 2) check (mrp >= 0),           -- for strike-through
  sku text unique,
  stock_qty int not null default 0 check (stock_qty >= 0),
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants (product_id);
create index product_variants_active_idx on public.product_variants (active);
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- =============================================================================
-- PRODUCT IMAGES
-- =============================================================================
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images (product_id);

-- =============================================================================
-- PRODUCT RELATED ("You may also like")
-- =============================================================================
create table public.product_related (
  product_id uuid not null references public.products (id) on delete cascade,
  related_product_id uuid not null references public.products (id) on delete cascade,
  sort_order int not null default 0,
  primary key (product_id, related_product_id),
  check (product_id <> related_product_id)
);
create index product_related_product_idx on public.product_related (product_id);

-- =============================================================================
-- CUSTOMERS
-- =============================================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  auth_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
-- Used by silent account creation to dedupe by email/phone (PRD §5.5).
create unique index customers_email_key on public.customers (lower(email)) where email is not null;
create index customers_phone_idx on public.customers (phone);

-- =============================================================================
-- ADDRESSES
-- =============================================================================
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

-- =============================================================================
-- ORDERS
-- =============================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,             -- SMY-2026-0001
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
  -- shipping (manual now, Shiprocket-ready)
  courier text,
  awb_number text,
  tracking_url text,
  shipping_address jsonb,                        -- snapshot
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
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ORDER ITEMS (snapshots — never re-derive from live product data)
-- =============================================================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,                    -- snapshot
  weight_label text not null,                    -- snapshot
  unit_price numeric(10, 2) not null,            -- snapshot
  quantity int not null check (quantity > 0),
  line_total numeric(10, 2) not null
);
create index order_items_order_idx on public.order_items (order_id);

-- =============================================================================
-- ORDER STATUS HISTORY
-- =============================================================================
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
create index order_status_history_order_idx on public.order_status_history (order_id, created_at);

-- =============================================================================
-- STORE SETTINGS (single row)
-- =============================================================================
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
create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();
