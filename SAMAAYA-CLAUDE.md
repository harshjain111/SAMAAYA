# CLAUDE.md — SAMAAYA Project Context

> This file gives Claude Code persistent context. Read it before any task. Pair with `SAMAAYA-PRD-v1.md` (full spec) and `SAMAAYA-website-copy.md` (final copy).

---

## PROJECT
SAMAAYA — fresh-to-cup Assam tea e-commerce site + admin portal. 6 products (dynamic), India-only, conversion-engineered. Built by Vibrnd.

**Tagline:** *The Right Moment.*

## NON-NEGOTIABLE PRINCIPLES
1. **Conversion first.** Every UI decision serves revenue-per-visitor. When unsure, choose the path with fewer clicks to purchase.
2. **No signup wall.** Guest checkout is default. Google login optional. Accounts created silently on order.
3. **The FRESH USP is the moat.** Fresh-to-cup vs. big brands' 1–2 year warehousing. Reinforce it on hero, product pages, and badges.
4. **Owner autonomy.** All products/prices/stock/orders/shipping managed from admin. Nothing about products is hardcoded.
5. **Snapshots in orders.** order_items + shipping_address store values at time of order; never re-derive historical orders from live product data.
6. **Honest brand.** No fake heritage, no founding date, no "since 19XX." Lean on R&D + freshness + Assam.

## STACK
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth + Storage), RLS enabled
- Razorpay (payments) — verify signatures server-side, always
- Resend (transactional email)
- Vercel (hosting)
- Manual shipping + manual WhatsApp at launch, behind swappable interfaces

## ARCHITECTURE RULES
- **ShippingProvider interface** with `ManualProvider` now; Shiprocket later. Order logic never imports a concrete provider directly.
- **`notify(event, order)` dispatcher** — email auto now; WhatsApp manual now (pre-filled wa.me); WhatsApp API later. Calling code never changes when channels are added.
- **Server-side only:** Razorpay order creation, signature verification, refunds, webhook handling. Never trust client for price/payment state.
- **Prices computed server-side** at checkout from DB, not from client payload.
- **RLS:** customers read only their own orders; admin role gates `/admin/*` and admin mutations.

## DESIGN TOKENS
```
green-deep #1B4332 · green-mid #2D5A3D · green-leaf #52796F · green-soft #74A57F
amber #C9881F (PRIMARY CTA) · amber-light #D4A24E
cream #F7F3E9 (bg) · charcoal #2A2A24 (text)
```
- **Primary CTAs are amber. Never green-on-green.** This contrast is the top visual conversion lever.
- Display: premium modern serif/humanist (Fraunces/Clash). Body: Inter/General Sans.
- Subtle tea-leaf/tea-grain texture at low opacity. Warm, premium, lots of whitespace. Mobile-first.

## REQUIRED CONVERSION FEATURES (do not skip)
strength meter (1–5 bars) · inline add-to-cart from homepage & shop · related products ("you may also like") · cart cross-sell ("customers also love") · free-shipping progress nudge · sticky mobile add-to-cart · "From ₹X" on every card · moment-based merchandising (morning/afternoon/evening)

## DATA MODEL
See PRD §4. Core tables: products, product_variants, product_images, product_related, customers, addresses, orders, order_items, order_status_history, store_settings.

## COPY
All final copy in `SAMAAYA-website-copy.md`. Use it verbatim. `[brackets]` = owner-supplied placeholders (prices, district, links). Product content comes from admin/DB, not hardcoded.

## ORDER STATUS PIPELINE
new → confirmed → packed → shipped → delivered (+ cancelled / refunded)
Payment: pending → paid → failed → refunded
Status change to `shipped` (with tracking entered) triggers `notify('shipped', order)`.

## DON'T
- Don't add a login wall before purchase.
- Don't hardcode products, prices, or the count "6."
- Don't make primary CTAs low-contrast.
- Don't trust client-side prices or payment status.
- Don't build Phase 2 items (coupons, reviews, Shiprocket, WA API, abandoned cart) before launch unless asked.
- Don't invent heritage/founding-year copy.

## DEFINITION OF DONE (per feature)
Mobile-responsive · matches design tokens · server-validated where money/stock involved · conversion feature present if applicable · works with guest checkout · admin can manage related data.
