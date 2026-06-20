import Link from "next/link";
import { buttonClasses } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-leaf">
        404
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        This page steeped too long and vanished.
      </h1>
      <p className="mt-4 text-charcoal/70">
        Let&apos;s get you back to something fresh.
      </p>
      <Link href="/shop" className={`${buttonClasses("primary", "md")} mt-8`}>
        Back to shop
      </Link>
    </main>
  );
}
