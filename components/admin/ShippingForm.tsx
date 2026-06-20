"use client";

import { useState, useTransition } from "react";
import { saveShipping } from "@/lib/actions/orders";
import { Button } from "@/components/ui";

const inputCls =
  "mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";

export function ShippingForm({
  orderId,
  courier,
  awbNumber,
  trackingUrl,
}: {
  orderId: string;
  courier: string | null;
  awbNumber: string | null;
  trackingUrl: string | null;
}) {
  const [f, setF] = useState({
    courier: courier ?? "",
    awbNumber: awbNumber ?? "",
    trackingUrl: trackingUrl ?? "",
  });
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await saveShipping(orderId, f);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div>
      <label className="text-sm font-medium text-charcoal/70">Courier</label>
      <input className={inputCls} value={f.courier} onChange={(e) => setF({ ...f, courier: e.target.value })} placeholder="Delhivery, DTDC…" />
      <label className="mt-3 block text-sm font-medium text-charcoal/70">AWB number</label>
      <input className={inputCls} value={f.awbNumber} onChange={(e) => setF({ ...f, awbNumber: e.target.value })} />
      <label className="mt-3 block text-sm font-medium text-charcoal/70">Tracking URL</label>
      <input className={inputCls} value={f.trackingUrl} onChange={(e) => setF({ ...f, trackingUrl: e.target.value })} placeholder="https://…" />
      <div className="mt-3 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save shipping"}</Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
    </div>
  );
}
