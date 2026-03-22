import { describe, it, expect } from 'vitest';
import { tableStore } from '@/lib/table-store';

/**
 * API route logic tests — exercises the same code paths as GET/POST handlers.
 * Run full integration against live server with: npm run dev & npm run test:api (custom script).
 */
describe('Tables API logic', () => {
  it('listTables returns array', () => {
    const tables = tableStore.listTables();
    expect(Array.isArray(tables)).toBe(true);
  });

  it('createTable produces valid table', () => {
    const table = tableStore.createTable('API Test Table', 6);
    expect(table.id).toBeTruthy();
    expect(table.name).toBe('API Test Table');
    expect(table.maxSeats).toBe(6);
    expect(table.seats).toHaveLength(6);
    expect(table.inviteCode).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('getTable returns created table', () => {
    const created = tableStore.createTable('Lookup Test', 9);
    const fetched = tableStore.getTable(created.id);
    expect(fetched?.id).toBe(created.id);
  });

  it('join produces seat index', () => {
    const table = tableStore.createTable('Join Test', 9);
    const seatIdx = tableStore.joinTable(table.id, {
      id: 'test-user',
      displayName: 'Tester',
      emoji: '♛',
      chips: 1500,
    });
    expect(typeof seatIdx).toBe('number');
    expect(seatIdx).toBeGreaterThanOrEqual(0);
  });
});
