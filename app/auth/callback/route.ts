import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { linkAuthUserToCustomer } from "@/lib/data/customers";

/**
 * OAuth callback — exchanges the code for a session, then links the auth user
 * to any existing guest customer record (by email) so order history merges.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        await linkAuthUserToCustomer(user.id, user.email, user.user_metadata?.name);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?error=auth`);
}
