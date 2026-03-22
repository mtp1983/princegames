import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)]">
      <h1 className="text-4xl font-bold text-[var(--gold)] mb-2">Page not found</h1>
      <p className="text-[var(--text-dim)] mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:opacity-90"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
