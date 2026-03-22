'use client';

interface StatsPanelProps {
  displayName: string;
  chips: number;
  bet: number;
  hand: string;
}

export function StatsPanel({ displayName, chips, bet, hand }: StatsPanelProps) {
  return (
    <div className="absolute left-4 bottom-[130px] bg-black/90 border border-[#1e2a1e] rounded-xl p-4 min-w-[155px]">
      <h3 className="text-[#c9a84c] text-[9px] tracking-widest uppercase mb-2">You — {displayName}</h3>
      <div className="text-gray-300 text-xs space-y-1">
        <p>
          <span className="text-gray-500">Chips:</span> ${chips}
        </p>
        <p>
          <span className="text-gray-500">Bet:</span> ${bet}
        </p>
        <p>
          <span className="text-gray-500">Hand:</span>{' '}
          <span className="text-[#c9a84c] font-bold">{hand}</span>
        </p>
      </div>
    </div>
  );
}
