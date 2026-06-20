# SAMAAYA — Product Requirements Document
### v1.0 · Tea E-Commerce Storefront + Admin Portal
### Prepared for: Vibrnd (build) · Owner: SAMAAYA

---

## 1. OVERVIEW

### 1.1 What we're building
A premium-modern e-commerce website for **SAMAAYA**, a fresh-to-cup Assam tea brand, with a full self-serve admin portal. The site sells **6 products** (dynamic — owner can add/remove), doubles as a shareable catalog, and is engineered end-to-end for conversion.

### 1.2 Primary goals (in priority order)
1. **Maximize revenue per visitor** — every layout and CTA decision serves this.
2. **Frictionless catalog + purchase** — owner shares one link; customer sees products, prices, sizes instantly and can buy in minimal clicks.
3. **Owner autonomy** — everything (products, prices, stock, orders, shipping status) managed from the admin panel. Zero developer dependency for day-to-day operations.

### 1.3 Brand positioning (drives all copy & UX)
- **Tagline:** *The Right Moment.*
- **Core USP (the moat):** Fresh-to-cup. Big brands warehouse tea 1–2 years; SAMAAYA ships fresh from Assam's estates.
- **Three pillars:** FRESH (rational) → ASSAM (borrowed credibility) → THE MOMENT (emotional payoff). Every page follows this Feature → Credibility → Emotion arc.
- **Voice:** warm, confident, plainspoken-premium, modern Indian. No colonial clichés, no fake heritage.
- Full copy in `SAMAAYA-website-copy.md`.

### 1.4 Launch market
India only. Razorpay (UPI/cards/netbanking/wallets). INR pricing.

---

## 2. TECH STACK

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | SSR/SSG for SEO + speed |
| Styling | Tailwind CSS | Design tokens below |
| Database + Auth | Supabase (Postgres) | RLS for security |
| Auth methods | Guest + Google OAuth + silent account | No signup wall |
| Payments | Razorpay | India-first |
| Storage | Supabase Storage | Product images |
| Email | Resend (transactional) | Auto order/shipping emails |
| WhatsApp | Manual at launch; WhatsApp Business API later | Notification layer abstracted |
| Shipping | Manual at launch; Shiprocket later | Provider interface abstracted |
| Hosting | Vercel | |
| Image optimization | next/image + Supabase CDN | Critical for tea photography |

---

## 3. INFORMATION ARCHITECTURE

### 3.1 Public pages
- `/` — Homepage (single-scroll conversion slope)
- `/shop` — All products, filterable (strength, moment)
- `/product/[slug]` — Product detail
- `/cart` — Cart (also slide-out drawer globally)
- `/checkout` — Single-page guest-first checkout
- `/order/[number]` — Confirmation + tracking
- `/track` — Track order by number + phone/email
- `/about` — Brand story
- `/contact` — Contact form + bulk/wholesale
- `/policies/[shipping|returns|privacy|terms]`

### 3.2 Admin pages (auth-gated, role: admin)
- `/admin` — Dashboard
- `/admin/products` — List / add / edit
- `/admin/products/[id]` — Product editor
- `/admin/orders` — Order list + filters
- `/admin/orders/[id]` — Order detail + status + shipping
- `/admin/customers` — Customer list + history
- `/admin/settings` — Shipping fees, free-ship threshold, store info

---

## 4. DATA MODEL

```sql
-- PRODUCTS
products (
  id uuid pk,
  name text,
  slug text unique,
  short_tasting_note text,        -- card one-liner
  description text,               -- full
  story text,                     -- per-product story
  origin_region text,             -- estate/region
  strength int,                   -- 1–5 (strength meter)
  moment text,                    -- 'morning'|'afternoon'|'evening'
  brew_temp text,
  brew_time text,
  featured bool,
  active bool,
  sort_order int,
  created_at timestamptz
)

product_variants (
  id uuid pk,
  product_id uuid fk,
  weight_grams int,               -- 250/500/1000
  label text,                     -- "250g"
  price numeric,                  -- INR
  mrp numeric null,               -- for strike-through
  sku text,
  stock_qty int,
  active bool
)

product_images (
  id uuid pk,
  product_id uuid fk,
  url text,
  alt text,
  sort_order int
)

product_related (                 -- "You may also like"
  product_id uuid fk,
  related_product_id uuid fk
)

-- CUSTOMERS & ORDERS
customers (
  id uuid pk,
  name text,
  email text,
  phone text,
  auth_user_id uuid null,         -- linked if logged in
  created_at timestamptz
)

addresses (
  id uuid pk,
  customer_id uuid fk,
  line1 text, line2 text,
  city text, state text, pincode text,
  is_default bool
)

orders (
  id uuid pk,
  order_number text unique,       -- SMY-2026-0001
  customer_id uuid fk,
  status text,                    -- new|confirmed|packed|shipped|delivered|cancelled|refunded
  payment_status text,            -- pending|paid|failed|refunded
  payment_method text,
  razorpay_order_id text,
  razorpay_payment_id text,
  subtotal numeric,
  shipping_fee numeric,
  discount numeric default 0,
  total numeric,
  -- shipping (manual now, Shiprocket-ready)
  courier text null,
  awb_number text null,
  tracking_url text null,
  shipping_address jsonb,         -- snapshot
  source text default 'web',
  notes text null,
  created_at timestamptz
)

order_items (
  id uuid pk,
  order_id uuid fk,
  variant_id uuid fk,
  product_name text,              -- snapshot
  weight_label text,              -- snapshot
  unit_price numeric,             -- snapshot
  quantity int,
  line_total numeric
)

order_status_history (
  id uuid pk,
  order_id uuid fk,
  status text,
  note text,
  created_at timestamptz
)

-- SETTINGS
store_settings (
  id uuid pk,
  shipping_fee numeric,
  free_shipping_threshold numeric,
  whatsapp_number text,
  contact_email text,
  store_name text,
  announcement_bar text null
)
```

**Key principle:** order_items and shipping_address store **snapshots** (name, price, weight at time of order) so historical orders stay correct even if products/prices change later.

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 Storefront — Homepage
Single-scroll, sections in this exact order (the conversion slope):
1. Hero — emotional H1 + FRESH subhead, dual CTA (Shop / Why Fresh)
2. Trust strip — 4 credibility items
3. The Fresh Difference — USP comparison (the moat)
4. Shop the Range — all 6 products, **add-to-cart inline from homepage**
5. Find Your Moment — 3 moment cards (morning/afternoon/evening) → filtered shop
6. From Estate to Cup — 4-step freshness journey
7. Samaaya Story — short, honest
8. Social proof + bulk/wholesale (WhatsApp) + contact form
9. Footer

### 5.2 Conversion features (REQUIRED — these are not optional polish)
- **Strength meter** — visual 1–5 bars on cards + product pages.
- **Inline add-to-cart from homepage & shop** — no forced navigation to buy.
- **"You may also like"** — 3 related products on product page (admin-set or auto by moment/strength).
- **Cross-sell in cart drawer** — "Customers also love…" on add.
- **Free-shipping progress nudge** — "₹X away from free shipping" with progress bar; raises AOV.
- **Sticky add-to-cart on mobile** product pages.
- **"From ₹X" price entry** on every card (reduces sticker shock).
- **Moment-based merchandising** — products tagged morning/afternoon/evening, surfaced contextually.

### 5.3 Product detail page
- Gallery, name, tasting notes, strength meter, origin region
- Size selector → live price update
- Add to cart (sticky mobile)
- Brew guide
- Fresh-packed reassurance badge
- Related products

### 5.4 Cart
- Global slide-out drawer (no reload) + full `/cart` page
- Quantity edit, remove
- Cross-sell block
- Free-shipping nudge
- Subtotal + estimated shipping
- Checkout CTA

### 5.5 Auth & checkout
- **Guest checkout is the default path.** No account required to buy.
- **"Continue with Google"** optional — one tap, autofills.
- **Silent account creation** — on guest order, create/link customer record by email/phone so order history persists. No signup wall, ever.
- Single-page checkout: contact + address + order summary + Razorpay.
- Trust badges at payment step.
- Address pincode field (India format validation).

### 5.6 Payments (Razorpay)
- Create Razorpay order server-side, verify signature server-side (never trust client).
- Handle success/failure/pending states.
- Webhook for payment confirmation → set payment_status=paid → trigger confirmation email.
- Refund action from admin (calls Razorpay refund API).
- Store razorpay_order_id + payment_id on order.

### 5.7 Shipping (manual at launch, Shiprocket-ready)
- **Launch:** Owner manually enters courier name, AWB number, tracking URL on the order in admin. Saving "shipped" status with tracking triggers customer notification.
- **Abstraction:** Build a `ShippingProvider` interface (`createShipment`, `getTracking`) with a `ManualProvider` implementation now. Shiprocket implementation drops in later without touching order logic.
- Customer-facing tracking link on order page + in shipped notification.

### 5.8 Notifications
Build a single `notify(event, order)` dispatcher so channels are swappable.
- **Email (auto, launch):** order confirmation, payment received, shipped (with tracking), delivered. Via Resend.
- **WhatsApp (manual at launch):** Admin order page shows a **"Send WhatsApp update"** button that opens a pre-filled `wa.me` message (order status + tracking) to the customer's number. Owner taps send.
- **WhatsApp API (later):** Same `notify()` dispatcher gains an automated WhatsApp channel — no rework of calling code.

### 5.9 Admin portal
**Dashboard:** today's orders, revenue (today/week/month), pending-fulfillment count, low-stock alerts, recent orders.

**Products:** list with search/filter; add/edit/delete; manage variants (weight/price/MRP/SKU/stock); upload/reorder images; set strength, moment, related products, featured, active, sort order.

**Orders:** list with columns — Order #, customer, phone, date, items count, total, payment status, fulfillment status, source. Filter by status/date/payment. Search by order #/name/phone.

**Order detail:** full items, customer, shipping address, payment info; status pipeline control (New→Confirmed→Packed→Shipped→Delivered→Cancelled/Refunded); enter courier/AWB/tracking; "Send WhatsApp update" button; refund button; internal notes; status history log.

**Customers:** list, contact details, order history per customer, total spent, order count.

**Settings:** shipping fee, free-shipping threshold, WhatsApp number, contact email, announcement bar text, store info.

---

## 6. DESIGN SYSTEM

### 6.1 Color tokens
```
--green-deep:    #1B4332   /* primary brand, headers, dark sections */
--green-mid:     #2D5A3D   /* secondary surfaces */
--green-leaf:    #52796F   /* accents, icons */
--green-soft:    #74A57F   /* highlights, strength meter fill */
--amber:         #C9881F   /* PRIMARY CTA — high contrast vs green */
--amber-light:   #D4A24E   /* hover, secondary accent */
--cream:         #F7F3E9   /* page background, warm */
--charcoal:      #2A2A24   /* body text */
--white:         #FFFFFF
```
**CTA rule:** primary buttons are amber on green/cream. This contrast is the single biggest visual conversion lever — never make a primary CTA green-on-green.

### 6.2 Typography
- **Display/headings:** a confident modern serif or high-quality humanist sans (e.g. Fraunces, Playfair, or Clash) — premium feel.
- **Body/UI:** clean sans (Inter / General Sans).
- Generous line-height, large hero type, clear hierarchy.

### 6.3 Texture & pattern
- Subtle tea-leaf line motifs + tea-grain texture as **low-opacity** section dividers and background watermarks. Never loud.
- Organic, warm, premium. Lots of whitespace.

### 6.4 Photography (make-or-break)
Macro dry leaf, steam rising from cup, Assam garden landscapes, hands plucking, styled flatlays. Warm golden-hour tone. Mediocre photos will make the brand look small regardless of code quality — prioritize this.

### 6.5 Components to standardize
Product card, strength meter, CTA button (primary/ghost), trust badge, moment card, cart drawer, free-ship progress bar, section divider, testimonial card, admin table, status pill.

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- **Performance:** LCP < 2.5s, optimized images, lazy-load below fold. Hero image priority-loaded.
- **Mobile-first:** majority of Indian traffic is mobile. Sticky add-to-cart, thumb-friendly CTAs, fast checkout.
- **SEO:** SSG for storefront, semantic markup, meta + OG tags, product schema (JSON-LD), sitemap, clean slugs. Goal: "look like a big company."
- **Security:** Supabase RLS (customers see only own orders; admin role for admin routes); Razorpay signature verification server-side; no secrets client-side; admin routes protected.
- **Accessibility:** semantic HTML, alt text, focus states, contrast (the amber/green palette passes).

---

## 8. SCOPE & PHASING

### Phase 1 — LAUNCH (this build)
Full storefront, all conversion features, guest+Google auth, Razorpay, manual shipping, auto email + manual WhatsApp, full admin (products/orders/customers/settings/dashboard).

### Phase 2 — POST-LAUNCH
Shiprocket integration, WhatsApp Business API automation, discount codes/coupons, abandoned-cart recovery, reviews/ratings, analytics dashboard, blog/SEO content, bulk product upload.

**Discipline note:** Shopify has hundreds of features; for 6 products we need ~15%. Phase 1 above is the right scope. Resist scope creep into Phase 2 items before launch.

---

## 9. OWNER INPUTS REQUIRED (to finalize)
- 6 products: name, type, tasting notes, story, origin region, strength (1–5), moment tag, brew temp/time, weight options + prices (+ MRP if showing discount), stock, SKUs
- District/region naming for "fresh from [Assam region]"
- Shipping fee + free-shipping threshold
- WhatsApp number + contact email
- Logo + brand photography
- Policy text (shipping/returns/privacy/terms)
- Razorpay account + API keys
- Google OAuth credentials
- Domain

---

*End of PRD v1.0. Pair with `SAMAAYA-CLAUDE.md` (Claude Code context) and `SAMAAYA-build-prompts.md` (phased build prompts).*
