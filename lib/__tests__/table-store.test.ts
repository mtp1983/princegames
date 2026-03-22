import { describe, it, expect, beforeEach } from 'vitest';
import { tableStore } from '../table-store';
import type { User } from '../types';

// TableStore uses a singleton; we need to reset state between tests.
// Since the store doesn't expose reset, we'll test in isolation and create fresh tables.

describe('tableStore', () => {
  let tableId: string;
  const testUser: User = {
    id: 'user-1',
    displayName: 'Alice',
    emoji: '👑',
    chips: 1500,
  };

  beforeEach(() => {
    const table = tableStore.createTable('Test Table', 9);
    tableId = table.id;
  });

  describe('createTable', () => {
    it('creates a table with empty seats', () => {
      const table = tableStore.getTable(tableId);
      expect(table).toBeDefined();
      expect(table!.name).toBe('Test Table');
      expect(table!.maxSeats).toBe(9);
      expect(table!.seats).toHaveLength(9);
      expect(table!.seats.every((s) => s.status === 'empty')).toBe(true);
      expect(table!.inviteCode).toMatch(/^[A-Z0-9]{6}$/);
    });
  });

  describe('joinTable', () => {
    it('places user in first empty seat', () => {
      const seatIdx = tableStore.joinTable(tableId, testUser);
      expect(seatIdx).toBeGreaterThanOrEqual(0);
      const table = tableStore.getTable(tableId)!;
      expect(table.seats[seatIdx].status).toBe('human');
      expect(table.seats[seatIdx].playerId).toBe(testUser.id);
      expect(table.seats[seatIdx].displayName).toBe('Alice');
      expect(table.seats[seatIdx].chips).toBe(1500);
    });

    it('returns same seat if user already seated', () => {
      const first = tableStore.joinTable(tableId, testUser);
      const second = tableStore.joinTable(tableId, testUser);
      expect(first).toBe(second);
    });

    it('replaces NPC when table is full and human joins', () => {
      const table = tableStore.getTable(tableId)!;
      // Fill all seats with NPCs via seedTableWithNpcs
      tableStore.seedTableWithNpcs(tableId, 9);
      const filled = tableStore.getTable(tableId)!;
      expect(filled.seats.every((s) => s.status === 'npc')).toBe(true);

      const seatIdx = tableStore.joinTable(tableId, testUser);
      expect(seatIdx).toBeGreaterThanOrEqual(0);
      const after = tableStore.getTable(tableId)!;
      const humanSeats = after.seats.filter((s) => s.status === 'human');
      expect(humanSeats).toHaveLength(1);
      expect(humanSeats[0].playerId).toBe(testUser.id);
      const npcSeats = after.seats.filter((s) => s.status === 'npc');
      expect(npcSeats).toHaveLength(8);
    });
  });

  describe('addRandomNpc / removeRandomNpc', () => {
    it('adds NPC to empty seat', () => {
      const added = tableStore.addRandomNpc(tableId);
      expect(added).toBe(true);
      const table = tableStore.getTable(tableId)!;
      const npcSeats = table.seats.filter((s) => s.status === 'npc');
      expect(npcSeats).toHaveLength(1);
      expect(npcSeats[0].displayName).toBeTruthy();
      expect(npcSeats[0].emoji).toBeTruthy();
      expect(npcSeats[0].chips).toBe(1500);
    });

    it('removes random NPC', () => {
      tableStore.addRandomNpc(tableId);
      tableStore.addRandomNpc(tableId);
      const removed = tableStore.removeRandomNpc(tableId);
      expect(removed).toBe(true);
      const table = tableStore.getTable(tableId)!;
      const npcSeats = table.seats.filter((s) => s.status === 'npc');
      expect(npcSeats).toHaveLength(1);
    });

    it('returns false when no empty seat to add NPC', () => {
      tableStore.seedTableWithNpcs(tableId, 9);
      const added = tableStore.addRandomNpc(tableId);
      expect(added).toBe(false);
    });

    it('returns false when no NPC to remove', () => {
      const removed = tableStore.removeRandomNpc(tableId);
      expect(removed).toBe(false);
    });
  });

  describe('getTableByInviteCode', () => {
    it('finds table by invite code (case insensitive)', () => {
      const table = tableStore.getTable(tableId)!;
      const found = tableStore.getTableByInviteCode(table.inviteCode);
      expect(found?.id).toBe(tableId);
      const foundLower = tableStore.getTableByInviteCode(table.inviteCode.toLowerCase());
      expect(foundLower?.id).toBe(tableId);
    });
  });
});
