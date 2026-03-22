'use client';

import type { Card as CardType } from '@/lib/game/types';
import { Card } from './Card';

interface CommunityCardsProps {
  cards: CardType[];
}

export function CommunityCards({ cards }: CommunityCardsProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-10">
      {cards.map((c, i) => (
        <Card key={i} card={c} compact />
      ))}
    </div>
  );
}
