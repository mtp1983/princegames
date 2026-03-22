export type SeatStatus = 'empty' | 'npc' | 'human';

export interface TableSeat {
  seatIndex: number;
  status: SeatStatus;
  /** For NPCs: character name. For humans: user id. */
  playerId: string | null;
  displayName: string;
  emoji: string;
  chips: number;
  isDealer?: boolean;
  isActive?: boolean;
}

export interface PokerTable {
  id: string;
  name: string;
  inviteCode: string;
  maxSeats: number;
  seats: TableSeat[];
  pot: number;
  phase: string;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

export interface User {
  id: string;
  displayName: string;
  emoji: string;
  chips: number;
}
