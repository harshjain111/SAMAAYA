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
 * Email auth — Sign in OR Create account. Customers never need this (guest
 * checkout + silent accounts), but it's offered for those who want a login.
 * Also serves the store owner/admin.
 */
export function EmailPasswordForm({ next = "/account" }: EmailPasswordFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        // Email confirmation is off → signed in immediately.
        router.refresh();
        router.push(next);
        return;
      }
      // Confirmation required.
      setInfo("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
      setLoading(false);
      return;
    }

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
        <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label className="text-sm font-medium text-charcoal/70">Password</label>
        <input
          type="password"
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {info && <p className="text-sm text-green-deep">{info}</p>}
      <button type="submit" disabled={loading} className={cn(buttonClasses("primary", "md"), "w-full sm:w-auto")}>
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <p className="text-sm text-charcoal/60">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button type="button" onClick={() => { setMode("signup"); setError(null); setInfo(null); }} className="font-medium text-green-deep underline">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="font-medium text-green-deep underline">
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
