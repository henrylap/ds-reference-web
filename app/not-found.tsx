import Link from "next/link";

export default function NotFound() {
  return (
    <section className="panel p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm subtle">
        The requested command or library does not exist in this reference.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)]"
      >
        Back to home
      </Link>
    </section>
  );
}
