-- =============================================================================
-- SAMAAYA — seed.sql
-- One store_settings row + 2 sample products (variants, placeholder images,
-- strength, moment) so the storefront has data to render before the owner
-- adds the real catalog via admin. Idempotent: safe to re-run.
-- Prices/threshold here are PLACEHOLDERS — owner overrides via /admin/settings.
-- =============================================================================

-- STORE SETTINGS (single row) ------------------------------------------------
insert into public.store_settings
  (shipping_fee, free_shipping_threshold, whatsapp_number, contact_email, store_name, announcement_bar)
select 49, 599, '+910000000000', 'hello@samaaya.example', 'SAMAAYA',
       'Fresh from Assam''s estates · Free shipping over ₹599'
where not exists (select 1 from public.store_settings);

-- SAMPLE PRODUCTS ------------------------------------------------------------
-- Product 1: a bold morning tea.
with p as (
  insert into public.products
    (name, slug, short_tasting_note, description, story, origin_region,
     strength, moment, brew_temp, brew_time, featured, active, sort_order)
  select
    'Assam Morning Gold',
    'assam-morning-gold',
    'Malty, brisk, full-bodied — a proper wake-up cup.',
    'A classic single-estate Assam black tea with rich malt, a brisk bite, and a deep amber liquor. Built for the first cup of the day.',
    'Picked at peak from a single Assam estate and packed within days — never warehoused. This is what fresh Assam actually tastes like.',
    'Upper Assam',
    5, 'morning', '95°C', '3–4', true, true, 1
  where not exists (select 1 from public.products where slug = 'assam-morning-gold')
  returning id
)
insert into public.product_variants (product_id, weight_grams, label, price, mrp, sku, stock_qty, sort_order)
select id, w.grams, w.label, w.price, w.mrp, w.sku, w.stock, w.sort
from p
cross join (values
  (250,  '250g',  299, 349, 'AMG-250',  120, 1),
  (500,  '500g',  549, 649, 'AMG-500',   80, 2),
  (1000, '1kg',   999, 1199, 'AMG-1000', 40, 3)
) as w(grams, label, price, mrp, sku, stock, sort);

insert into public.product_images (product_id, url, alt, sort_order)
select pr.id,
       'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1200&q=80',
       'Loose-leaf Assam black tea', 1
from public.products pr
where pr.slug = 'assam-morning-gold'
  and not exists (select 1 from public.product_images i where i.product_id = pr.id);

-- Product 2: a calm afternoon tea.
with p as (
  insert into public.products
    (name, slug, short_tasting_note, description, story, origin_region,
     strength, moment, brew_temp, brew_time, featured, active, sort_order)
  select
    'Garden Green Calm',
    'garden-green-calm',
    'Smooth, grassy, gently sweet — a mid-day reset.',
    'A delicate Assam green tea with a soft, vegetal smoothness and a clean finish. Light enough for the afternoon, alive with freshness.',
    'Steamed and dried soon after plucking to lock in the green, grassy character that fades fast in older tea.',
    'Assam Valley',
    2, 'afternoon', '80°C', '2–3', false, true, 2
  where not exists (select 1 from public.products where slug = 'garden-green-calm')
  returning id
)
insert into public.product_variants (product_id, weight_grams, label, price, mrp, sku, stock_qty, sort_order)
select id, w.grams, w.label, w.price, w.mrp, w.sku, w.stock, w.sort
from p
cross join (values
  (250,  '250g', 349, NULL::numeric, 'GGC-250', 90, 1),
  (500,  '500g', 649, NULL::numeric, 'GGC-500', 60, 2)
) as w(grams, label, price, mrp, sku, stock, sort);

insert into public.product_images (product_id, url, alt, sort_order)
select pr.id,
       'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80',
       'Fresh green tea leaves', 1
from public.products pr
where pr.slug = 'garden-green-calm'
  and not exists (select 1 from public.product_images i where i.product_id = pr.id);

-- RELATED: link the two sample products both ways.
insert into public.product_related (product_id, related_product_id, sort_order)
select a.id, b.id, 1
from public.products a, public.products b
where a.slug = 'assam-morning-gold' and b.slug = 'garden-green-calm'
on conflict do nothing;

insert into public.product_related (product_id, related_product_id, sort_order)
select a.id, b.id, 1
from public.products a, public.products b
where a.slug = 'garden-green-calm' and b.slug = 'assam-morning-gold'
on conflict do nothing;
