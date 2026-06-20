"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Sign out and refresh. */
export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="text-sm font-medium text-charcoal/60 underline hover:text-green-deep"
    >
      Sign out
    </button>
  );
}
