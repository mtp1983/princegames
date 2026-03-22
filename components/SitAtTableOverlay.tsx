'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import type { PokerTable } from '@/lib/types';

interface SitAtTableOverlayProps {
  table: PokerTable;
}

export function SitAtTableOverlay({ table }: SitAtTableOverlayProps) {
  const { user, isLoggedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const isSeated = user && table.seats.some((s) => s.status === 'human' && s.playerId === user.id);
  const hasEmptySeat = table.seats.some((s) => s.status === 'empty');
  const hasNpcSeat = table.seats.some((s) => s.status === 'npc');

  if (isSeated || (!hasEmptySeat && !hasNpcSeat)) return null;

  const handleSit = () => {
    if (!isLoaded) return;
    if (!isLoggedIn) {
      router.push(`/login?redirect_url=${encodeURIComponent(`/table/${table.id}`)}`);
      return;
    }
    if (!user) return;
    setJoining(true);
    setError('');
    fetch(`/api/tables/${table.id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        displayName: user.displayName,
        emoji: user.emoji,
        chips: user.chips,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) setError(data?.error || 'Could not join');
        else router.refresh();
      })
      .catch(() => setError('Join failed'))
      .finally(() => setJoining(false));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="p-8 rounded-2xl border-2 border-[var(--gold)] bg-[var(--bg-card)] shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[var(--gold)] mb-2">Sit at Table</h2>
        <p className="text-[var(--text-dim)] mb-6">
          {hasEmptySeat
            ? 'Take a seat to play.'
            : 'Table is full — an NPC will leave to make room.'}
        </p>
        <button
          onClick={handleSit}
          disabled={joining}
          className="w-full py-4 px-6 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 text-lg"
        >
          {joining ? 'Joining…' : '♠ Sit at Table ♠'}
        </button>
        {!isLoggedIn && isLoaded && (
          <p className="mt-4 text-sm text-[var(--text-dim)]">
            You&apos;ll be asked to sign in first.
          </p>
        )}
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
