"use client";

import { useState, useTransition } from "react";
import { setProductActive } from "@/lib/actions/products";
import { cn } from "@/lib/cn";

/** Inline active/inactive toggle for a product row. */
export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [on, setOn] = useState(active);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      try {
        await setProductActive(id, next);
      } catch {
        setOn(!next); // revert on failure
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        on ? "bg-green-soft" : "bg-charcoal/20",
        pending && "opacity-60",
      )}
      aria-label={on ? "Active" : "Inactive"}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          on ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
