'use client';

import type { Seat } from '@/lib/game/types';
import { Card } from './Card';

const ELLIPSE_RX = 42;
const ELLIPSE_RY = 24;

function getSeatPosition(index: number): { x: number; y: number } {
  const angle = (index / 9) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + ELLIPSE_RX * Math.cos(angle),
    y: 50 + ELLIPSE_RY * Math.sin(angle),
  };
}

interface SeatRingProps {
  seats: Seat[];
  humanSeatIndex: number;
}

export function SeatRing({ seats, humanSeatIndex }: SeatRingProps) {
  return (
    <div className="absolute inset-0" style={{ perspective: '1200px' }}>
      {seats.map((seat, i) => {
        const pos = getSeatPosition(i);
        const isHuman = seat.status === 'human';
        return (
          <div
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            <div
              className={`px-3 py-2 rounded-xl text-center min-w-[100px] border transition-all ${
                seat.isActive ? 'border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.5)]' : 'border-[#1e2a1e] bg-black/80'
              } ${seat.folded ? 'opacity-40' : ''}`}
            >
              {seat.isDealer && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c9a84c] text-black text-xs font-bold flex items-center justify-center">
                  D
                </span>
              )}
              <span className="block text-xl">{seat.emoji}</span>
              <span className="block text-[#c9a84c] text-xs font-bold truncate max-w-[90px]">{seat.displayName}</span>
              <span className="block text-gray-500 text-xs">${seat.chips}</span>
              {seat.currentBet > 0 && <span className="block text-amber-400 text-xs">Bet: ${seat.currentBet}</span>}
            </div>
            {!seat.folded && seat.cards.length > 0 && (
              <div className={`flex gap-1 mt-2 ${isHuman ? 'justify-center' : 'justify-center'}`}>
                {seat.cards.map((c, ci) => (
                  <Card key={ci} card={c} faceDown={!isHuman && seat.status !== 'human'} compact />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
