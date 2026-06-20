"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/ui";
import { OrderDetail } from "@/components/order/OrderDetail";
import type { OrderDetails } from "@/lib/data/orders";
import { cn } from "@/lib/cn";

/** Track-by-number form (PRD §3.1 /track). Verifies via phone/email. */
export function TrackForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<OrderDetails | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, contact }),
      });
      const out = await res.json();
      if (res.ok) setDetails(out.details);
      else setError(out.error || "Could not find that order.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";

  return (
    <div>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">
            Order number
          </label>
          <input
            className={inputCls}
            placeholder="SMY-2026-0001"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">
            Phone or email
          </label>
          <input
            className={inputCls}
            placeholder="The phone or email on the order"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={cn(buttonClasses("primary", "md"))}
        >
          {loading ? "Looking…" : "Track Order"}
        </button>
      </form>

      {details && (
        <div className="mt-10">
          <OrderDetail details={details} />
        </div>
      )}
    </div>
  );
}
