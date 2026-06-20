-- =============================================================================
-- SAMAAYA — 0003_order_number.sql  (ADDITIVE — safe to run on a live DB)
-- Sequential, human-friendly order numbers: SMY-YYYY-0001.
-- Paste into Supabase → SQL Editor → Run. Does not touch existing data.
-- =============================================================================

create sequence if not exists public.order_number_seq;

create or replace function public.next_order_number()
returns text
language sql
volatile
as $$
  select 'SMY-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.order_number_seq')::text, 4, '0');
$$;
