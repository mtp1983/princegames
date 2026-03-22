'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PokerTable } from '@/lib/types';

interface JoinTablePromptProps {
  table: PokerTable;
  onJoined?: (seatIndex: number) => void;
}

export function JoinTablePrompt({ table, onJoined }: JoinTablePromptProps) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const isSeated = user && table.seats.some((s) => s.status === 'human' && s.playerId === user.id);
  const hasEmptySeat = table.seats.some((s) => s.status === 'empty');
  const hasNpcSeat = table.seats.some((s) => s.status === 'npc');

  if (!isLoggedIn || isSeated || (!hasEmptySeat && !hasNpcSeat)) return null;

  const handleJoin = async () => {
    if (!user) return;
    setJoining(true);
    setError('');
    try {
      const res = await fetch(`/api/tables/${table.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id, // Clerk user ID
          displayName: user.displayName,
          emoji: user.emoji,
          chips: user.chips,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Could not join');
        return;
      }
      onJoined?.(data.seatIndex);
      router.push(`/game?tableId=${table.id}&seat=${data.seatIndex}`);
    } catch {
      setError('Join failed');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="p-4 rounded-xl border-2 border-[var(--gold)] bg-black/95 shadow-[0_0_40px_rgba(201,168,76,0.3)]">
        <p className="text-[var(--gold)] font-bold mb-2">You&apos;re not at this table yet.</p>
        <p className="text-sm text-[var(--text-dim)] mb-4">
          {hasEmptySeat
            ? 'Take a seat and join the game.'
            : 'Table is full — an NPC will leave to make room for you.'}
        </p>
        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-3 px-6 bg-gradient-to-r from-[var(--gold-dim)] to-[var(--gold)] text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {joining ? 'Joining…' : '♠ Join This Table ♠'}
        </button>
        {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
