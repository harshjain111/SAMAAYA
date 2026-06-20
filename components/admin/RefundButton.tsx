"use client";

import { useState, useTransition } from "react";
import { refundOrder } from "@/lib/actions/orders";

export function RefundButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function refund() {
    if (!confirm("Issue a full refund via Razorpay? This cannot be undone.")) return;
    setMsg(null);
    startTransition(async () => {
      try {
        await refundOrder(orderId);
        setMsg("Refunded ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Refund failed");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={refund}
        disabled={pending}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Refunding…" : "Refund order"}
      </button>
      {msg && <p className="mt-2 text-sm text-charcoal/60">{msg}</p>}
    </div>
  );
}
