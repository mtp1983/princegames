import type { Card, Rank, Suit } from './types';
import { RANKS, SUITS } from './types';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

export function cardToString(c: Card): string {
  return `${c.rank}${c.suit}`;
}

export function cardFromString(s: string): Card {
  const rank = s[0] as Rank;
  const suit = s[1] as Suit;
  return { rank, suit };
}

export function isRed(c: Card): boolean {
  return c.suit === 'h' || c.suit === 'd';
}

export function rankLabel(r: Rank): string {
  return r === 'T' ? '10' : r;
}

export function suitSymbol(s: Suit): string {
  return { s: '♠', h: '♥', d: '♦', c: '♣' }[s];
}

export type HandRank =
  | { type: 'high'; desc: string; value: number }
  | { type: 'pair'; desc: string; value: number; pairRank: number }
  | { type: 'twopair'; desc: string; value: number }
  | { type: 'trips'; desc: string; value: number }
  | { type: 'straight'; desc: string; value: number }
  | { type: 'flush'; desc: string; value: number }
  | { type: 'fullhouse'; desc: string; value: number }
  | { type: 'quads'; desc: string; value: number }
  | { type: 'straightflush'; desc: string; value: number };

export function evaluateHand(cards: Card[]): HandRank {
  if (cards.length < 5) return { type: 'high', desc: '—', value: 0 };
  const all = [...cards].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
  const values = all.map((c) => RANK_VALUES[c.rank]);
  const suits = all.map((c) => c.suit);
  const counts: Record<number, number> = {};
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] ?? 0;
  const maxRank = Number(sorted[0]?.[0] ?? 0);

  const isFlush = suits.every((s) => s === suits[0]);
  const uniq = Array.from(new Set(values)).sort((a, b) => b - a);
  const isStraight = (() => {
    for (let i = 0; i <= uniq.length - 5; i++) {
      const slice = uniq.slice(i, i + 5);
      if (slice[4]! - slice[0]! === 4) return true;
    }
    if (uniq.includes(14)) {
      const low = values.filter((v) => v !== 14).concat([1]);
      const set = Array.from(new Set(low)).sort((a, b) => b - a);
      for (let i = 0; i <= set.length - 5; i++) {
        const slice = set.slice(i, i + 5);
        if (slice[0]! - slice[4]! === 4) return true;
      }
    }
    return false;
  })();

  if (isFlush && isStraight) {
    return { type: 'straightflush', desc: 'Straight Flush', value: 900 + maxRank };
  }
  if (maxCount === 4) {
    return { type: 'quads', desc: 'Four of a Kind', value: 800 + maxRank };
  }
  if (maxCount === 3 && (sorted[1]?.[1] ?? 0) >= 2) {
    return { type: 'fullhouse', desc: 'Full House', value: 700 + maxRank };
  }
  if (isFlush) {
    return { type: 'flush', desc: 'Flush', value: 600 + uniq[0]! };
  }
  if (isStraight) {
    return { type: 'straight', desc: 'Straight', value: 500 + uniq[0]! };
  }
  if (maxCount === 3) {
    return { type: 'trips', desc: 'Three of a Kind', value: 400 + maxRank };
  }
  if (maxCount === 2 && (sorted[1]?.[1] ?? 0) === 2) {
    return { type: 'twopair', desc: 'Two Pair', value: 300 + maxRank };
  }
  if (maxCount === 2) {
    const pairRank = Number(sorted[0]?.[0]);
    const kicker = values.find((v) => v !== pairRank) ?? 0;
    return { type: 'pair', desc: `Pair of ${rankFromValue(pairRank)}`, value: 200 + pairRank, pairRank };
  }
  const high = Math.max(...values);
  return { type: 'high', desc: rankFromValue(high) + ' high', value: high };
}

const VALUE_TO_RANK: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
};

function rankFromValue(v: number): string {
  return VALUE_TO_RANK[v] ?? '?';
}

export function compareHands(a: Card[], b: Card[]): number {
  const ha = evaluateHand(a);
  const hb = evaluateHand(b);
  return ha.value - hb.value;
}
