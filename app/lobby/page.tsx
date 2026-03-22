'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { useAuth } from '@/lib/auth-context';
import type { PokerTable } from '@/lib/types';

export default function LobbyPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { user } = useAuth();
  const [tables, setTables] = useState<PokerTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tables');
        const data = await res.json();
        setTables(Array.isArray(data) ? data : []);
      } catch {
        setTables([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const createTable = async () => {
    if (!isSignedIn || !user) {
      window.location.href = '/login?redirect_url=' + encodeURIComponent('/lobby');
      return;
    }
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Table',
          maxSeats: 9,
          displayName: user?.displayName || 'Player',
          emoji: user?.emoji || '♛',
          chips: user?.chips ?? 1500,
        }),
      });
      const table = await res.json();
      if (res.status === 401) {
        window.location.href = '/login?redirect_url=' + encodeURIComponent('/lobby');
        return;
      }
      if (table?.id) window.location.href = `/table/${table.id}`;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="font-cinzel-deco text-2xl text-[var(--gold)]">
          ♛ PRINCE CASINO
        </Link>
        <div className="flex gap-4 items-center">
          {isLoaded && (
            isSignedIn ? (
              <UserButton />
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 border border-[var(--gold)] rounded-lg text-sm hover:bg-[var(--gold)] hover:text-black"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </header>

      <h1 className="text-3xl font-bold text-[var(--gold)] mb-6">Tables</h1>

      {loading ? (
        <p className="text-[var(--text-dim)]">Loading tables…</p>
      ) : (
        <>
          {isLoaded && (
            <div className="mb-6">
              {isSignedIn ? (
                <button
                  onClick={createTable}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:scale-105"
                >
                  + Create Table
                </button>
              ) : (
                <Link
                  href="/login?redirect_url=%2Flobby"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:scale-105"
                >
                  Sign in to Create Table
                </Link>
              )}
            </div>
          )}

          <div className="grid gap-4">
            {tables.length === 0 ? (
              <p className="text-[var(--text-dim)]">No tables yet. Create one!</p>
            ) : (
              tables.map((t) => (
                <Link
                  key={t.id}
                  href={`/table/${t.id}`}
                  className="block p-4 rounded-xl border border-[var(--gold)]/30 bg-black/50 hover:border-[var(--gold)] hover:bg-black/70 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[var(--gold)]">{t.name}</div>
                      <div className="text-sm text-[var(--text-dim)]">
                        Code: {t.inviteCode} · {t.seats.filter((s) => s.status !== 'empty').length}/{t.maxSeats} seats
                      </div>
                    </div>
                    <span className="text-[var(--gold)]">→</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}
