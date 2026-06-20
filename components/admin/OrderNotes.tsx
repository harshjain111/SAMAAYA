"use client";

import { useState, useTransition } from "react";
import { saveOrderNotes } from "@/lib/actions/orders";
import { Button } from "@/components/ui";

export function OrderNotes({ orderId, notes }: { orderId: string; notes: string | null }) {
  const [value, setValue] = useState(notes ?? "");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await saveOrderNotes(orderId, value);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Internal notes (not shown to customer)"
        className="w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save notes"}</Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
    </div>
  );
}
