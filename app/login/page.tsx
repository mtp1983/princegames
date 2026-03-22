'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <SignIn
        forceRedirectUrl="/lobby"
        signUpUrl="/sign-up"
        appearance={{
          variables: { colorPrimary: '#c9a84c' },
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-black/80 border border-[var(--gold)]',
          },
        }}
      />
      <Link href="/" className="mt-6 text-sm text-[var(--text-dim)] hover:text-[var(--gold)]">
        Back
      </Link>
    </main>
  );
}
