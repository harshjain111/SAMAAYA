-- =============================================================================
-- SAMAAYA — 0002_rls.sql
-- Row Level Security per PRD §7 / CLAUDE.md §ARCHITECTURE RULES.
--
-- Model:
--   - Public (anon + authenticated) can READ active products/variants/images,
--     related links, and store_settings.
--   - A logged-in customer can READ only their own customer row, addresses,
--     orders, order_items, and status history (matched via auth_user_id).
--   - Admins (in admin_users) can do everything.
--   - All money/stock WRITES happen server-side with the SERVICE ROLE key,
--     which bypasses RLS entirely. Guest checkout therefore needs no anon
--     write policies — orders are created by trusted server code only.
-- =============================================================================

-- Enable RLS everywhere.
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

-- -----------------------------------------------------------------------------
-- ADMIN_USERS — only admins may read it; no client writes (managed via SQL/server).
-- -----------------------------------------------------------------------------
create policy admin_users_select_admin on public.admin_users
  for select using (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCTS — public reads active; admin full.
-- -----------------------------------------------------------------------------
create policy products_select_public on public.products
  for select using (active = true);
create policy products_admin_all on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT_VARIANTS — public reads active variants of active products; admin full.
-- -----------------------------------------------------------------------------
create policy product_variants_select_public on public.product_variants
  for select using (
    active = true
    and exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.active = true
    )
  );
create policy product_variants_admin_all on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT_IMAGES — public reads images of active products; admin full.
-- -----------------------------------------------------------------------------
create policy product_images_select_public on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.active = true
    )
  );
create policy product_images_admin_all on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT_RELATED — public read; admin full.
-- -----------------------------------------------------------------------------
create policy product_related_select_public on public.product_related
  for select using (true);
create policy product_related_admin_all on public.product_related
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- CUSTOMERS — a user reads/updates only their own row; admin full.
-- Inserts/links happen server-side (service role) during silent account creation.
-- -----------------------------------------------------------------------------
create policy customers_select_own on public.customers
  for select using (auth_user_id = auth.uid());
create policy customers_update_own on public.customers
  for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy customers_admin_all on public.customers
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- ADDRESSES — owned via the customer row; admin full.
-- -----------------------------------------------------------------------------
create policy addresses_select_own on public.addresses
  for select using (
    exists (
      select 1 from public.customers c
      where c.id = addresses.customer_id and c.auth_user_id = auth.uid()
    )
  );
create policy addresses_modify_own on public.addresses
  for all using (
    exists (
      select 1 from public.customers c
      where c.id = addresses.customer_id and c.auth_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.customers c
      where c.id = addresses.customer_id and c.auth_user_id = auth.uid()
    )
  );
create policy addresses_admin_all on public.addresses
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- ORDERS — a customer reads only their own; admin full.
-- Writes are server-side only (service role). Guests track via server endpoint.
-- -----------------------------------------------------------------------------
create policy orders_select_own on public.orders
  for select using (
    exists (
      select 1 from public.customers c
      where c.id = orders.customer_id and c.auth_user_id = auth.uid()
    )
  );
create policy orders_admin_all on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- ORDER_ITEMS — readable iff parent order is readable; admin full.
-- -----------------------------------------------------------------------------
create policy order_items_select_own on public.order_items
  for select using (
    exists (
      select 1
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where o.id = order_items.order_id and c.auth_user_id = auth.uid()
    )
  );
create policy order_items_admin_all on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- ORDER_STATUS_HISTORY — readable iff parent order is readable; admin full.
-- -----------------------------------------------------------------------------
create policy order_status_history_select_own on public.order_status_history
  for select using (
    exists (
      select 1
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where o.id = order_status_history.order_id and c.auth_user_id = auth.uid()
    )
  );
create policy order_status_history_admin_all on public.order_status_history
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- STORE_SETTINGS — public read (needed for free-ship threshold on storefront);
-- admin write.
-- -----------------------------------------------------------------------------
create policy store_settings_select_public on public.store_settings
  for select using (true);
create policy store_settings_admin_all on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());
