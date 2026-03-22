export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type GamePhase = 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export type SeatStatus = 'empty' | 'npc' | 'human';

export interface Seat {
  index: number;
  status: SeatStatus;
  playerId: string | null;
  displayName: string;
  emoji: string;
  chips: number;
  currentBet: number;
  folded: boolean;
  isDealer: boolean;
  isActive: boolean;
  cards: Card[];
  isAllIn: boolean;
}

export interface GameState {
  phase: GamePhase;
  pot: number;
  communityCards: Card[];
  seats: Seat[];
  currentTurnIndex: number | null;
  turnTimeLeft: number;
  turnTimeTotal: number;
  minRaise: number;
  bigBlind: number;
  smallBlind: number;
  started: boolean;
  winnerSeatIndex: number | null;
  winningHand: string | null;
  wonAmount: number;
  logLines: LogLine[];
}

export interface LogLine {
  id: string;
  text: string;
  type: 'info' | 'action' | 'win' | 'you';
}

export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];
