'use client';

import type { GamePhase } from '@/lib/game/types';

interface PhaseBoxProps {
  phase: GamePhase;
}

const PHASE_LABELS: Record<GamePhase, string> = {
  waiting: 'Waiting',
  preflop: 'Pre-Flop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  showdown: 'Showdown',
};

export function PhaseBox({ phase }: PhaseBoxProps) {
  return (
    <div className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-black/70 border border-[#3a3a2a] rounded-lg px-5 py-1">
      <span className="text-[#bba] text-xs tracking-widest uppercase">{PHASE_LABELS[phase]}</span>
    </div>
  );
}
