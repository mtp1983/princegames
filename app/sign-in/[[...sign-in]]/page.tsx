import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
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
    </main>
  );
}
