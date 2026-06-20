"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClasses } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface EmailPasswordFormProps {
  /** Where to go after sign-in. */
  next?: string;
}

/**
 * Email + password sign-in. Primarily for the store owner/admin (create the
 * user in Supabase → Authentication → Users, then add to admin_users). Works
 * without Google OAuth or SMTP. Customers can still use guest checkout / Google.
 */
export function EmailPasswordForm({ next = "/account" }: EmailPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.refresh();
    router.push(next);
  }

  const inputCls =
    "mt-1 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-amber";

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm font-medium text-charcoal/70">Email</label>
        <input
          type="email"
          className={inputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-charcoal/70">Password</label>
        <input
          type="password"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className={cn(buttonClasses("primary", "md"))}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
