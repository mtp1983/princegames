'use client';

import type { Seat } from '@/lib/game/types';

interface StartScreenProps {
  seats: Seat[];
  onDeal: () => void;
}

export function StartScreen({ seats, onDeal }: StartScreenProps) {
  return (
    <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-6xl mb-2 drop-shadow-[0_0_20px_#c9a84c]">♛</div>
      <h1 className="font-[Cinzel_Decorative] text-6xl text-[#c9a84c] tracking-widest mb-2">
        PRINCE POKER
      </h1>
      <p className="text-sm text-[#8aaa88] tracking-widest uppercase mb-10">
        Texas Hold&apos;em · {seats.filter((s) => s.status !== 'empty').length} Players
      </p>
      <div className="flex flex-wrap gap-3 justify-center max-w-[760px] mb-10">
        {seats.filter((s) => s.status !== 'empty').map((s) => (
          <div
            key={s.index}
            className="px-4 py-3 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-center min-w-[80px]"
          >
            <span className="block text-2xl">{s.emoji}</span>
            <span className="text-[#c9a84c] text-xs font-bold">{s.displayName}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onDeal}
        className="px-16 py-5 bg-gradient-to-r from-[#8a6820] via-[#c9a84c] to-[#e8c76b] rounded-xl text-xl font-bold text-black shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 transition-transform"
      >
        ♠ Deal Me In ♠
      </button>
    </div>
  );
}
