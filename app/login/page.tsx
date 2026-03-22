'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect_url') || '/lobby';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)]">
      <SignIn
        forceRedirectUrl={redirect}
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'border border-[var(--clerk-border)] shadow-lg',
          },
        }}
      />
      <Link
        href="/"
        className="mt-6 text-sm text-[var(--text-dim)] hover:text-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] rounded"
      >
        Back
      </Link>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-[var(--bg)]"><p className="text-[var(--text-dim)]">Loading…</p></main>}>
      <LoginContent />
    </Suspense>
  );
}
