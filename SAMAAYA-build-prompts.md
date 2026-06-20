# SAMAAYA — Claude Code Build Prompts
### Phased, sequential prompts to build the storefront + admin
### Use with `SAMAAYA-PRD-v1.md` and `SAMAAYA-CLAUDE.md` in the repo root.

> **How to use:** Run prompts in order. Each builds on the last. Paste one, let it complete, verify, commit, then move on. Keep `CLAUDE.md` and the PRD in context throughout. Don't skip ahead — schema and abstractions come before features for a reason.

---

## PHASE 0 — FOUNDATION

**Prompt 0.1 — Scaffold**
```
Read CLAUDE.md and SAMAAYA-PRD-v1.md. Scaffold a Next.js (App Router) + TypeScript + Tailwind project for SAMAAYA. Set up: Tailwind config with the exact design tokens from CLAUDE.md as CSS variables and theme colors; folder structure (app/, components/, lib/, types/); base layout with cream background and the font pairing (display serif + Inter). Create a typography + color preview page at /styleguide showing all tokens, button variants (primary amber, ghost), and headings so we can verify the design system before building features. Mobile-first.
```

**Prompt 0.2 — Supabase + schema**
```
Set up Supabase client (server + browser) and environment config. Create SQL migrations for every table in PRD §4: products, product_variants, product_images, product_related, customers, addresses, orders, order_items, order_status_history, store_settings. Add appropriate indexes (slug, order_number, status, product_id FKs). Enable RLS: public read on active products/variants/images; customers read only their own orders/addresses; admin role full access. Generate TypeScript types from the schema. Seed store_settings with one row and 2 sample products (with variants, images placeholder, strength, moment) so the storefront has data to render.
```

**Prompt 0.3 — Core abstractions**
```
Before any feature code, create the swappable abstractions from CLAUDE.md:
1. ShippingProvider interface (createShipment, getTracking) with a ManualProvider implementation that just stores courier/AWB/tracking_url entered by admin. Structure so a ShiprocketProvider can be added later without changing order logic.
2. A notify(event, order) dispatcher with channel handlers. Implement EmailChannel (Resend) for events: order_confirmed, payment_received, shipped, delivered. Implement a WhatsAppManual helper that GENERATES a pre-filled wa.me URL (it does not send) for admin use. Leave a clear seam for an automated WhatsApp API channel later.
Add unit-test-style usage examples in comments.
```

---

## PHASE 1 — STOREFRONT (READ-ONLY FIRST)

**Prompt 1.1 — Design system components**
```
Build reusable components matching the design tokens, all mobile-first:
- Button (primary = amber, ghost = outline), with hover/focus states
- ProductCard (image, name, tasting note, StrengthMeter, "From ₹X", size select, inline Add to Cart slot)
- StrengthMeter (1–5 bars, green-soft fill, accessible label)
- TrustBadge, MomentCard, SectionDivider (subtle tea-leaf texture), TestimonialCard, StatusPill
- FreeShippingNudge (progress bar)
Render them all on /styleguide. No business logic yet — props only.
```

**Prompt 1.2 — Homepage (static sections)**
```
Build the homepage at / as a single-scroll page using copy verbatim from SAMAAYA-website-copy.md, sections in PRD §5.1 order:
1 Hero (emotional H1 + FRESH subhead, amber Shop CTA + ghost Why Fresh CTA, micro-trust line, priority-loaded hero image placeholder)
2 Trust strip (4 items)
3 The Fresh Difference (comparison table, the USP)
4 Shop the Range (grid of all active products from DB via ProductCard)
5 Find Your Moment (3 moment cards → /shop?moment=)
6 From Estate to Cup (4 steps)
7 Samaaya Story
8 Social proof + bulk/WhatsApp callout + contact form
9 Footer
Pull products from Supabase. Make it genuinely premium — whitespace, texture, strong type hierarchy. This is the conversion centerpiece.
```

**Prompt 1.3 — Shop + product detail**
```
Build /shop (all active products, filter by strength and moment via query params, using ProductCard) and /product/[slug] (gallery, name, tasting notes, StrengthMeter, origin region, size selector with LIVE price update, sticky mobile Add to Cart, brew guide, fresh-packed badge, "You May Also Like" = product_related or fallback by moment/strength). SSG where possible with product schema JSON-LD for SEO. Clean slugs, meta + OG tags.
```

---

## PHASE 2 — CART & CHECKOUT

**Prompt 2.1 — Cart**
```
Build cart state (persist in localStorage + sync). Global slide-out CartDrawer (no reload) plus full /cart page. On add-to-cart: open drawer, show "Customers also love…" cross-sell (3 related). Show FreeShippingNudge using store_settings.free_shipping_threshold. Quantity edit, remove, subtotal, estimated shipping. Add-to-cart works inline from homepage and shop. Clear amber Checkout CTA.
```

**Prompt 2.2 — Auth (guest-first)**
```
Implement auth per CLAUDE.md: guest checkout is default (no login required). Add "Continue with Google" (Supabase OAuth) as optional. On any order, silently create or link a customer record by email/phone and attach auth_user_id if logged in. Never block purchase behind login. Logged-in users can view order history at /account/orders.
```

**Prompt 2.3 — Checkout + Razorpay**
```
Build single-page /checkout: contact (name, phone, email), shipping address (line1/2, city, state, pincode with India validation), always-visible order summary, trust badges at payment step. 
Server-side: compute prices from DB (never trust client), create order (status=new, payment_status=pending), create Razorpay order, return order_id. On payment, VERIFY signature server-side, set payment_status=paid, snapshot order_items + shipping_address, decrement stock, fire notify('order_confirmed') and notify('payment_received'). Handle failure/pending. Add Razorpay webhook endpoint as source of truth. Generate order_number (SMY-YYYY-####). Redirect to /order/[number].
```

**Prompt 2.4 — Confirmation + tracking**
```
Build /order/[number] (confirmation + live status + tracking link if present) and /track (look up by order_number + phone/email). Use StatusPill and order_status_history timeline. Auto-send confirmation email via notify().
```

---

## PHASE 3 — ADMIN PORTAL

**Prompt 3.1 — Admin shell + dashboard**
```
Build /admin/* gated to admin role (redirect non-admins). Admin layout with sidebar nav. Dashboard: today's orders, revenue (today/week/month), pending-fulfillment count, low-stock alerts (variants below threshold), recent orders table. Clean, dense, functional — this is a work tool, not a landing page.
```

**Prompt 3.2 — Product management**
```
Build /admin/products (list, search, filter, active toggle, sort_order) and /admin/products/[id] editor: all product fields (name, slug, tasting note, description, story, origin region, strength 1–5, moment, brew temp/time, featured, active); manage variants (weight, price, MRP, SKU, stock, active) as a repeatable table; image upload to Supabase Storage with reorder + alt text; set related products. Add "new product" flow. Everything dynamic — owner can add a 7th product anytime.
```

**Prompt 3.3 — Order management**
```
Build /admin/orders (list with columns: order#, customer, phone, date, items, total, payment status, fulfillment status, source; filters by status/date/payment; search by order#/name/phone) and /admin/orders/[id]: full items + customer + address + payment info; status pipeline control (new→confirmed→packed→shipped→delivered, +cancelled/refunded) writing to order_status_history; fields to enter courier/AWB/tracking_url (ManualProvider); on save-as-shipped fire notify('shipped'); "Send WhatsApp update" button opening the pre-filled wa.me URL; Razorpay refund button (server-side); internal notes.
```

**Prompt 3.4 — Customers + settings**
```
Build /admin/customers (list, search, per-customer detail with order history, total spent, order count) and /admin/settings (shipping_fee, free_shipping_threshold, whatsapp_number, contact_email, announcement_bar, store info) writing to store_settings. Wire announcement_bar to a dismissible top bar on the storefront.
```

---

## PHASE 4 — POLISH & LAUNCH

**Prompt 4.1 — SEO + performance**
```
Add: sitemap.xml, robots.txt, per-page meta + OG/Twitter tags, Organization + Product JSON-LD schema, optimized next/image everywhere (priority on hero, lazy below fold), font preloading. Audit for LCP < 2.5s on mobile. Verify the site "reads big" — polished, fast, credible.
```

**Prompt 4.2 — Policies, contact, QA**
```
Build policy pages (shipping/returns/privacy/terms) from owner text, the /contact page (form → contact_email, bulk/WhatsApp callout), and a 404 using the copy deck's microcopy. Final QA pass: guest checkout end-to-end, payment success/failure, stock decrement, all notifications fire, admin order flow, mobile sticky CTAs, RLS (a customer can't read another's order). Produce a short launch checklist.
```

---

## PHASE 2 BACKLOG (post-launch, do NOT build now)
Shiprocket provider · WhatsApp Business API channel · coupons/discounts · abandoned-cart recovery · reviews/ratings · analytics dashboard · blog/SEO content · bulk product CSV upload.

---

## RUN ORDER SUMMARY
0.1 → 0.2 → 0.3 → 1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 2.3 → 2.4 → 3.1 → 3.2 → 3.3 → 3.4 → 4.1 → 4.2

Commit after each. Verify conversion features are present (CLAUDE.md checklist) before marking a phase done.
