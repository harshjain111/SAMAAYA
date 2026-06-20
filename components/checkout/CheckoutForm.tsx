"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart/store";
import { useStoreData, useHydrated } from "@/lib/cart/useStoreData";
import { buttonClasses } from "@/components/ui";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { validateCheckout } from "@/lib/checkout/validation";
import { cn } from "@/lib/cn";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const data = useStoreData();
  const hydrated = useHydrated();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const subtotal = cartSubtotal(items);
  const threshold = data?.settings.free_shipping_threshold ?? 0;
  const shippingFee = data?.settings.shipping_fee ?? 0;
  const shipping = threshold > 0 && subtotal >= threshold ? 0 : shippingFee;
  const total = subtotal + (items.length ? shipping : 0);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const contact = { name: form.name, phone: form.phone, email: form.email };
    const address = {
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    };
    const v = validateCheckout(contact, address);
    if (!v.ok) {
      setErrors(v.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          contact,
          address,
        }),
      });
      const out = await res.json();
      if (!res.ok) {
        setServerError(out.error || "Something went wrong.");
        if (out.fields) setErrors(out.fields);
        setSubmitting(false);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        setServerError("Could not load the payment window. Please retry.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: out.keyId,
        amount: out.amount,
        currency: out.currency,
        order_id: out.razorpayOrderId,
        name: "SAMAAYA",
        description: `Order ${out.orderNumber}`,
        prefill: out.prefill,
        theme: { color: "#1B4332" },
        handler: async (resp: any) => {
          const vr = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const vout = await vr.json();
          if (vr.ok) {
            clear();
            router.push(`/order/${vout.orderNumber}`);
          } else {
            setServerError(vout.error || "Payment verification failed.");
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setServerError("Payment cancelled. Your cart is saved.");
          },
        },
      });
      rzp.open();
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg text-charcoal/60">Your cart is empty.</p>
        <Link href="/shop" className={buttonClasses("primary", "md")}>
          Shop the range
        </Link>
      </div>
    );
  }

  const field = (
    name: keyof typeof form,
    label: string,
    opts: { type?: string; required?: boolean; placeholder?: string } = {},
  ) => (
    <div>
      <label className="text-sm font-medium text-charcoal/70">{label}</label>
      <input
        type={opts.type || "text"}
        value={form[name]}
        onChange={set(name)}
        placeholder={opts.placeholder}
        className={cn(
          "mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber",
          errors[name] ? "border-red-400" : "border-charcoal/15",
        )}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      {/* Left: details */}
      <div className="space-y-8">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-deep">Your details</h2>
            <span className="text-xs text-charcoal/50">Guest checkout</span>
          </div>
          <p className="mt-1 text-sm text-charcoal/60">
            Prefer one tap? <span className="align-middle"> </span>
          </p>
          <div className="mt-3">
            <GoogleSignInButton next="/checkout" label="Continue with Google" />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {field("name", "Name", { required: true })}
            {field("phone", "Phone", { placeholder: "10-digit mobile" })}
          </div>
          <div className="mt-4">
            {field("email", "Email", { type: "email" })}
          </div>
        </div>

        <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
          <h2 className="text-lg font-semibold text-green-deep">Shipping address</h2>
          <div className="mt-4 space-y-4">
            {field("line1", "Address line 1")}
            {field("line2", "Address line 2 (optional)")}
            <div className="grid gap-4 sm:grid-cols-3">
              {field("city", "City")}
              {field("state", "State")}
              {field("pincode", "PIN code", { placeholder: "6 digits" })}
            </div>
          </div>
        </div>
      </div>

      {/* Right: summary */}
      <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-green-deep">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.variantId} className="flex justify-between gap-2 text-sm">
              <span className="text-charcoal/70">
                {i.name} ({i.weightLabel}) × {i.quantity}
              </span>
              <span className="font-medium">{inr(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-charcoal/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-charcoal/70">Subtotal</dt>
            <dd>{inr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-charcoal/70">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : inr(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-charcoal/10 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-green-deep">{inr(total)}</dd>
          </div>
        </dl>

        {serverError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(buttonClasses("primary", "lg"), "mt-5 w-full")}
        >
          {submitting ? "Processing…" : `Place Order — ${inr(total)}`}
        </button>

        <p className="mt-3 text-center text-xs text-charcoal/60">
          🔒 Secure payment via Razorpay · UPI, cards & netbanking
        </p>
      </aside>
    </form>
  );
}
