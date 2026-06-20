-- =============================================================================
-- SAMAAYA — storage.sql  (run once in Supabase → SQL Editor)
-- Creates the public "product-images" bucket and its RLS policies:
--   - anyone can READ (storefront needs public image URLs)
--   - only admins (admin_users) can upload / update / delete
-- Safe to re-run.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Clean up old policies if re-running.
drop policy if exists "product-images public read" on storage.objects;
drop policy if exists "product-images admin write" on storage.objects;
drop policy if exists "product-images admin update" on storage.objects;
drop policy if exists "product-images admin delete" on storage.objects;

create policy "product-images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product-images admin write"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product-images admin update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product-images admin delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
