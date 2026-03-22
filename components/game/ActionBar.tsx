'use client';

import { useState } from 'react';

interface ActionBarProps {
  toCall: number;
  minRaise: number;
  maxRaise: number;
  chips: number;
  canCheck: boolean;
  onAction: (action: 'fold' | 'check' | 'call' | 'raise' | 'allin', raiseAmount?: number) => void;
}

export function ActionBar({ toCall, minRaise, maxRaise, chips, canCheck, onAction }: ActionBarProps) {
  const [raiseAmount, setRaiseAmount] = useState(Math.min(minRaise, maxRaise));

  const effectiveRaise = Math.min(Math.max(raiseAmount, minRaise), maxRaise);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center bg-black/95 border border-[#2a2a1a] rounded-2xl px-5 py-4 shadow-xl">
      <button
        type="button"
        onClick={() => onAction('fold')}
        className="px-5 py-2.5 rounded-lg bg-[#3a1010] text-[#ff7070] border border-[#cc3333] font-bold hover:bg-[#5a2020]"
      >
        Fold
      </button>
      {canCheck && (
        <button
          type="button"
          onClick={() => onAction('check')}
          className="px-5 py-2.5 rounded-lg bg-[#102810] text-[#70ee70] border border-[#33aa33] font-bold hover:bg-[#204a20]"
        >
          Check
        </button>
      )}
      {toCall > 0 && (
        <button
          type="button"
          onClick={() => onAction('call')}
          className="px-5 py-2.5 rounded-lg bg-[#101828] text-[#70aaff] border border-[#3366bb] font-bold hover:bg-[#202a44]"
        >
          Call ${Math.min(toCall, chips)}
        </button>
      )}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[#c9a84c] text-xs font-bold">${effectiveRaise}</span>
        <input
          type="range"
          min={minRaise}
          max={maxRaise}
          step={10}
          value={raiseAmount}
          onChange={(e) => setRaiseAmount(Number(e.target.value))}
          className="w-24 h-1 rounded bg-[#222] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a84c]"
        />
      </div>
      <button
        type="button"
        onClick={() => onAction('raise', effectiveRaise)}
        className="px-5 py-2.5 rounded-lg bg-[#281c04] text-[#c9a84c] border border-[#c9a84c] font-bold hover:bg-[#44300a]"
      >
        Raise
      </button>
      <button
        type="button"
        onClick={() => onAction('allin')}
        className="px-5 py-2.5 rounded-lg bg-[#28083a] text-[#ee88ff] border border-[#9933cc] font-bold hover:bg-[#441460]"
      >
        All In
      </button>
    </div>
  );
}
