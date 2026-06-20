"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

export interface GoogleSignInButtonProps {
  /** Where to return after login (defaults to /account). */
  next?: string;
  label?: string;
  className?: string;
}

/**
 * "Continue with Google" (PRD §5.5) — optional, never required. Uses Supabase
 * OAuth; redirects through /auth/callback which links the customer record.
 */
export function GoogleSignInButton({
  next = "/account",
  label = "Continue with Google",
  className,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      console.error("[google sign-in]", error.message);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-white px-6 py-3 font-semibold text-charcoal transition-colors hover:border-green-deep disabled:opacity-60",
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
        <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
      </svg>
      {loading ? "Redirecting…" : label}
    </button>
  );
}
