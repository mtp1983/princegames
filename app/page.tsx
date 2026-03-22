'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function countActive(tables: Array<{ seats?: Array<{ status: string }> }>): number {
  if (!Array.isArray(tables)) return 0;
  return tables.reduce((sum, t) => {
    const active = t.seats?.filter((s) => s.status === 'human' || s.status === 'npc').length ?? 0;
    return sum + active;
  }, 0);
}

export default function HomePage() {
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/tables')
      .then((res) => res.json())
      .then((tables) => setActiveCount(countActive(tables)))
      .catch(() => setActiveCount(0));
  }, []);

  const subtitle =
    activeCount !== null
      ? `Texas Hold'em · ${activeCount} active`
      : "Texas Hold'em · 9 Players";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1a22] to-black">
      <div className="text-center px-4">
        <div className="text-6xl mb-3 drop-shadow-[0_0_20px_var(--gold)]">♛</div>
        <h1 className="font-['Cinzel_Decorative',serif] text-6xl md:text-7xl text-[var(--gold)] tracking-widest mb-2">
          PRINCE POKER
        </h1>
        <p className="text-[var(--text-dim)] text-sm tracking-[0.3em] uppercase mb-12">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="inline-block px-16 py-5 text-xl font-bold text-black bg-gradient-to-r from-[#8a6820] via-[var(--gold)] to-[#e8c76b] rounded-xl shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 hover:shadow-[0_0_70px_rgba(201,168,76,0.8)] transition-all"
          >
            ♠ Join a Table ♠
          </Link>
        </div>

        <p className="mt-8 text-[var(--text-dim)] text-sm">
          <Link href="/lobby" className="underline hover:text-[var(--gold)]">
            Lobby
          </Link>
          {' · '}
          <Link href="/login" className="underline hover:text-[var(--gold)]">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
