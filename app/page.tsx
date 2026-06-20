import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-green-leaf">
        Fresh from Assam&apos;s finest estates
      </p>
      <h1 className="text-4xl sm:text-5xl">Some moments deserve a better cup.</h1>
      <p className="mt-6 max-w-md text-charcoal/80">
        SAMAAYA — <span className="italic">The Right Moment.</span> The
        storefront is being built. The design system is ready to verify.
      </p>
      <Link
        href="/styleguide"
        className="mt-8 inline-flex items-center rounded-full bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-light"
      >
        View the styleguide →
      </Link>
    </main>
  );
}
