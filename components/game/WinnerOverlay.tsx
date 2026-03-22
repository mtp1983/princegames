'use client';

import type { Seat } from '@/lib/game/types';
import { Card } from './Card';

interface WinnerOverlayProps {
  winner: Seat;
  wonAmount: number;
  winningHand: string | null;
  onNextHand: () => void;
}

export function WinnerOverlay({ winner, wonAmount, winningHand, onNextHand }: WinnerOverlayProps) {
  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <h1 className="font-[Cinzel_Decorative] text-5xl text-[#c9a84c] mb-2 drop-shadow-[0_0_40px_rgba(201,168,76,0.9)]">
        ♛ Winner!
      </h1>
      <p className="text-white text-lg my-2">{winner.displayName}</p>
      <p className="text-[#c9a84c] text-base mb-6">${wonAmount}</p>
      {winningHand && <p className="text-gray-400 text-sm mb-4">{winningHand}</p>}
      {winner.cards.length > 0 && (
        <div className="flex gap-2 mb-6">
          {winner.cards.map((c, i) => (
            <Card key={i} card={c} />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onNextHand}
        className="px-12 py-4 bg-gradient-to-r from-[#8a6820] via-[#c9a84c] to-[#e8c76b] rounded-xl font-bold text-black hover:scale-105 transition-transform"
      >
        Next Hand ▶
      </button>
    </div>
  );
}
