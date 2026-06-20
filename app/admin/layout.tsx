import { redirect } from "next/navigation";
import { getServerUser, isAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Admin gate (PRD §3.2). Non-admins are redirected out. Guests go to /account
 * to sign in; signed-in non-admins go home. RLS is the real enforcement — this
 * is the UX layer on top.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/account?next=/admin");
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen bg-cream md:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
