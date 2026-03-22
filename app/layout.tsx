import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'The Prince Casino — King of Poker',
  description: 'Play 3D Texas Hold\'em poker. Join tables, invite friends, win big.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#c9a84c',
          colorForeground: 'var(--clerk-fg)',
          colorMutedForeground: 'var(--clerk-fg-muted)',
          colorBackground: 'var(--clerk-bg-card)',
          colorInput: 'var(--clerk-input-bg)',
          colorInputForeground: 'var(--clerk-input-fg)',
          colorBorder: 'var(--clerk-border)',
          colorPrimaryForeground: '#0f172a',
        },
      }}
    >
      <html lang="en">
        <body className="antialiased">
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
