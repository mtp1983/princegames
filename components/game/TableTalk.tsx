'use client';

import type { LogLine } from '@/lib/game/types';

interface TableTalkProps {
  lines: LogLine[];
}

export function TableTalk({ lines }: TableTalkProps) {
  return (
    <div className="absolute bottom-4 right-4 w-[270px] max-h-[112px] overflow-y-auto bg-black/90 border border-[#1e2a1e] rounded-xl p-4">
      <h3 className="text-[#c9a84c] text-[9px] tracking-widest uppercase mb-2">Table Talk</h3>
      <div className="space-y-1">
        {lines.slice(-8).map((l) => (
          <p
            key={l.id}
            className={`text-xs border-b border-[#0e1214] py-0.5 ${
              l.type === 'win' ? 'text-[#44ee88]' : l.type === 'you' ? 'text-[#aaddff]' : l.type === 'action' ? 'text-[#c9a84c]' : 'text-gray-500'
            }`}
          >
            {l.text}
          </p>
        ))}
      </div>
    </div>
  );
}
