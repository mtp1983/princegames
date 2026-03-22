'use client';

interface PotBoxProps {
  pot: number;
}

export function PotBox({ pot }: PotBoxProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/90 border-2 border-[#c9a84c] rounded-xl px-8 py-2 min-w-[200px] text-center shadow-[0_0_26px_rgba(201,168,76,0.3)]">
      <div className="text-[10px] tracking-widest text-gray-500 uppercase">Total Pot</div>
      <div className="text-[#c9a84c] text-2xl font-bold">${pot}</div>
    </div>
  );
}
