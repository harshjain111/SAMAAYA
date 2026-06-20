# SAMAAYA — Launch Checklist

Work top to bottom. Items marked **[owner]** need your input/accounts; **[done]** is already built.

## 1. Database (Supabase)
- [ ] Run `supabase/setup.sql` (schema + RLS + seed) — **already done**
- [ ] Run `supabase/migrations/0003_order_number.sql` (order numbers) — **required for checkout**
- [ ] Run `supabase/storage.sql` (product-images bucket) — **required for admin image upload**
- [ ] Verify: `npm run check:db` and `npm run check:admin` both pass
- [ ] **[owner]** Rotate the `service_role` key (it was shared in chat) → update `.env.local`

## 2. Admin access
- [ ] Create admin: `npm run make:admin -- you@email.com YourStrongPassword`
- [ ] Sign in at `/account` (email + password) → open `/admin`
- [ ] Replace the 2 seeded sample products with real catalog (or edit them)
- [ ] Upload real product photography (admin → product → Images)
- [ ] Set Settings: store name, shipping fee, free-ship threshold, WhatsApp, email, announcement

## 3. Payments (Razorpay) — **[owner]**
- [ ] Add keys to `.env.local`: `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- [ ] Razorpay Dashboard → Webhooks → add `https://<domain>/api/webhooks/razorpay`
      with events `payment.captured`, `payment.failed`, using the webhook secret
- [ ] Test a live ₹1 order end-to-end (success + cancel)

## 4. Email (Resend) — **[owner]**
- [ ] Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (verified domain)
- [ ] Place a test order → confirm order/payment emails arrive

## 5. Auth (optional Google) — **[owner]**
- [ ] Supabase → Authentication → Providers → enable Google + add OAuth credentials
- [ ] Add redirect: `https://<domain>/auth/callback`

## 6. Deploy (Vercel)
- [ ] Import the GitHub repo into Vercel
- [ ] Add ALL env vars from `.env.local` to Vercel project settings
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production URL (drives sitemap, OG, links)
- [ ] Deploy; confirm `/sitemap.xml` and `/robots.txt` resolve

## 7. Final QA (manual)
- [ ] Guest checkout end-to-end (no login required)
- [ ] Payment success → order confirmation page + email; stock decrements
- [ ] Payment failure/cancel handled gracefully
- [ ] `/track` finds an order by number + phone/email; rejects wrong contact
- [ ] Admin: change status to Shipped (with tracking) → customer gets notified
- [ ] Admin: "Send WhatsApp update" opens prefilled wa.me
- [ ] Admin: refund a paid order
- [ ] RLS: a logged-in customer sees only their own orders at `/account/orders`
- [ ] Mobile: sticky add-to-cart on product page; cart drawer; thumb-friendly CTAs
- [ ] Lighthouse on mobile: LCP < 2.5s, no major a11y issues

## 8. Nice-to-have before/after launch
- [ ] Real testimonials (replace placeholders on homepage)
- [ ] Finalize policy text in `app/policies/[slug]/page.tsx` (replace [brackets])
- [ ] Favicon / OG share image

---
**Phase 2 backlog (post-launch, intentionally not built):** Shiprocket, WhatsApp
Business API automation, coupons, abandoned-cart, reviews, analytics, blog, bulk CSV.
