'use client';

import type { Card as CardType } from '@/lib/game/types';
import { rankLabel, suitSymbol, isRed } from '@/lib/game/poker';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  compact?: boolean;
}

export function Card({ card, faceDown, compact }: CardProps) {
  const colorClass = isRed(card) ? 'text-red-600' : 'text-gray-900';

  if (faceDown) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-lg bg-gradient-to-br from-[#1a3a5c] to-[#0d1f33] border-2 border-[#c9a84c]/40 flex flex-col items-center justify-center ${
          compact ? 'w-[46px] h-[66px]' : 'w-[72px] h-[104px]'
        }`}
      >
        <span className="text-[#c9a84c]/60 text-lg">🂠</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg bg-white border-2 border-[#c9a84c] flex flex-col items-center justify-center shadow-lg ${colorClass} ${
        compact ? 'w-[46px] h-[66px] text-sm' : 'w-[72px] h-[104px]'
      }`}
    >
      <span className={compact ? 'text-base' : 'text-xl font-bold'}>{rankLabel(card.rank)}</span>
      <span className={compact ? 'text-lg' : 'text-2xl'}>{suitSymbol(card.suit)}</span>
    </motion.div>
  );
}
