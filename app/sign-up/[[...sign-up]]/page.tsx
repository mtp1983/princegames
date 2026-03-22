import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)]">
      <SignUp
        forceRedirectUrl="/lobby"
        signInUrl="/login"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'border border-[var(--clerk-border)] shadow-lg',
          },
        }}
      />
    </main>
  );
}
