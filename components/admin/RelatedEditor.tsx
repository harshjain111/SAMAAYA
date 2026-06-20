"use client";

import { useState, useTransition } from "react";
import { saveRelated } from "@/lib/actions/products";
import { Button } from "@/components/ui";

export function RelatedEditor({
  productId,
  allProducts,
  selectedIds,
}: {
  productId: string;
  allProducts: { id: string; name: string }[];
  selectedIds: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      try {
        await saveRelated(productId, [...selected]);
        setMsg("Saved ✓");
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <h2 className="font-semibold text-green-deep">You may also like</h2>
      <p className="mt-1 text-xs text-charcoal/50">Pick related products shown on this product&apos;s page. Leave empty to auto-suggest by moment/strength.</p>

      {allProducts.length === 0 ? (
        <p className="mt-4 text-sm text-charcoal/50">No other products yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {allProducts.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
              {p.name}
            </label>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <Button onClick={save} disabled={pending}>{pending ? "Saving…" : "Save related"}</Button>
        {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
      </div>
    </div>
  );
}
