/**
 * Routes table operations to DB (when configured) or in-memory store.
 */
import { db } from '@/lib/db';
import { tableStore } from '@/lib/table-store';
import * as dbStore from '@/lib/db-table-store';
import type { PokerTable, User } from './types';

function useDb(): boolean {
  return db !== null;
}

export async function listTables(): Promise<PokerTable[]> {
  if (useDb()) return dbStore.listTables();
  return tableStore.listTables();
}

export async function getTable(id: string): Promise<PokerTable | undefined> {
  if (useDb()) return dbStore.getTable(id);
  return tableStore.getTable(id);
}

export async function getTableByInviteCode(code: string): Promise<PokerTable | undefined> {
  if (useDb()) return dbStore.getTableByInviteCode(code);
  return tableStore.getTableByInviteCode(code);
}

export async function createTable(name: string, maxSeats?: number): Promise<PokerTable> {
  if (useDb()) return dbStore.createTable(name, maxSeats);
  const table = tableStore.createTable(name, maxSeats);
  return table;
}

export async function joinTable(
  tableId: string,
  user: User,
  preferredSeat?: number
): Promise<number> {
  if (useDb()) return dbStore.joinTable(tableId, user, preferredSeat);
  return tableStore.joinTable(tableId, user, preferredSeat);
}

export async function seedTableWithNpcs(tableId: string, count: number): Promise<void> {
  if (useDb()) return dbStore.seedTableWithNpcs(tableId, count);
  tableStore.seedTableWithNpcs(tableId, count);
}
