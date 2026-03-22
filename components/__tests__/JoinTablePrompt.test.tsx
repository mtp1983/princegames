import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JoinTablePrompt } from '../JoinTablePrompt';
import { AuthProvider } from '@/lib/auth-context';
import type { PokerTable, TableSeat } from '@/lib/types';

function mkTable(overrides?: Partial<PokerTable>): PokerTable {
  const seats: TableSeat[] = Array.from({ length: 9 }, (_, i) =>
    i < 3
      ? { seatIndex: i, status: 'npc', playerId: `npc-${i}`, displayName: `NPC ${i}`, emoji: '🎲', chips: 1500 }
      : { seatIndex: i, status: 'empty', playerId: null, displayName: '', emoji: '', chips: 0 }
  );
  return {
    id: 't1',
    name: 'Test',
    inviteCode: 'ABC123',
    maxSeats: 9,
    seats,
    pot: 0,
    phase: 'Waiting',
    status: 'waiting',
    createdAt: Date.now(),
    ...overrides,
  };
}

function wrap(ui: React.ReactElement) {
  return <AuthProvider>{ui}</AuthProvider>;
}

describe('JoinTablePrompt', () => {
  it('renders nothing when user is not logged in', () => {
    const table = mkTable();
    const { container } = render(wrap(<JoinTablePrompt table={table} />));
    expect(container.querySelector('button')).toBeNull();
  });
});
