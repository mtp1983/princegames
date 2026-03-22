import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg)]">
      <SignIn
        forceRedirectUrl="/lobby"
        signUpUrl="/sign-up"
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
