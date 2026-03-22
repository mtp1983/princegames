'use client';

interface TimerBarProps {
  left: number;
  total: number;
  visible: boolean;
}

export function TimerBar({ left, total, visible }: TimerBarProps) {
  if (!visible) return null;
  const pct = total > 0 ? (left / total) * 100 : 0;

  return (
    <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[280px] h-1 bg-[#111] rounded">
      <div
        className="h-full rounded bg-[#c9a84c] transition-all duration-200"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
