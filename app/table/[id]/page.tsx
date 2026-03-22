'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { PokerTable } from '@/lib/types';
import { ShareTableLink } from '@/components/ShareTableLink';
import { JoinTablePrompt } from '@/components/JoinTablePrompt';

export default function TablePage() {
  const params = useParams();
  const id = params.id as string;
  const [table, setTable] = useState<PokerTable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/tables/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTable(data);
        } else {
          setTable(null);
        }
      } catch {
        setTable(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !table) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-dim)]">
          {loading ? 'Loading…' : 'Table not found'}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <Link href="/lobby" className="font-cinzel-deco text-xl text-[var(--gold)]">
          ← Lobby
        </Link>
        <span className="text-sm text-[var(--text-dim)]">Table: {table.name}</span>
      </header>

      <h1 className="text-2xl font-bold text-[var(--gold)] mb-6">{table.name}</h1>

      {/* Prominent share link — top of page */}
      <ShareTableLink
        tableId={table.id}
        inviteCode={table.inviteCode}
        className="mb-8"
      />

      {/* Table seats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 mb-8">
        {table.seats.map((seat) => (
          <div
            key={seat.seatIndex}
            className={`p-4 rounded-xl border text-center ${
              seat.status === 'empty'
                ? 'border-dashed border-[var(--text-dim)]/50 text-[var(--text-dim)]'
                : seat.status === 'npc'
                  ? 'border-[var(--text-dim)]/40 bg-black/30'
                  : 'border-[var(--gold)] bg-[var(--gold)]/10'
            }`}
          >
            {seat.status === 'empty' ? (
              <span className="text-sm">Empty seat</span>
            ) : (
              <>
                <div className="text-3xl mb-2">{seat.emoji}</div>
                <div className="font-bold text-sm truncate">{seat.displayName}</div>
                <div className="text-xs text-[var(--text-dim)]">
                  {seat.status === 'npc' ? 'NPC' : 'Player'} · ${seat.chips}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Join prompt when logged in (fixed at bottom) */}
      <JoinTablePrompt table={table} />
    </main>
  );
}
