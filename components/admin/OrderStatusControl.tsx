"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@/types/database";

export function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(current);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status, note || undefined);
        setNote("");
        setMsg("Status updated ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div>
      <label className="text-sm font-medium text-charcoal/70">Fulfillment status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm capitalize focus-visible:outline-2 focus-visible:outline-amber"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (logged in history)"
        className="mt-2 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm"
      />
      <div className="mt-3 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={pending || status === undefined}>
          {pending ? "Saving…" : "Update status"}
        </Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
      <p className="mt-2 text-xs text-charcoal/50">
        Setting <strong>Shipped</strong> emails the customer with tracking. Save shipping details first.
      </p>
    </div>
  );
}
