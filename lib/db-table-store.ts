import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { tables as tablesSchema } from '@/lib/db/schema';
import type { PokerTable, TableSeat, User } from './types';

function getDb() {
  if (!db) throw new Error('Database not configured');
  return db;
}

const NPC_POOL = [
  { name: 'Viper Reyes', emoji: '🐍' },
  { name: 'Lady Lux', emoji: '👸' },
  { name: 'Iron Duke', emoji: '⚔️' },
  { name: 'Blaze Quinn', emoji: '🔥' },
  { name: 'Ghost Wang', emoji: '👻' },
  { name: 'Rio Dante', emoji: '🎲' },
  { name: 'Sable Fox', emoji: '🦊' },
  { name: 'Ace Montoya', emoji: '🃏' },
] as const;

const STARTING_CHIPS = 1500;
const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeId(): string {
  return Math.random().toString(36).slice(2, 12);
}

function makeInviteCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += INVITE_CODE_CHARS[Math.floor(Math.random() * INVITE_CODE_CHARS.length)];
  }
  return code;
}

function createEmptySeats(count: number): TableSeat[] {
  return Array.from({ length: count }, (_, i) => ({
    seatIndex: i,
    status: 'empty' as const,
    playerId: null,
    displayName: '',
    emoji: '',
    chips: 0,
  }));
}

function rowToTable(row: typeof tablesSchema.$inferSelect): PokerTable {
  return {
    id: row.id,
    name: row.name,
    inviteCode: row.inviteCode,
    maxSeats: row.maxSeats,
    seats: (row.seats as TableSeat[]) ?? [],
    pot: row.pot,
    phase: row.phase,
    status: row.status as 'waiting' | 'playing' | 'finished',
    createdAt: row.createdAt.getTime(),
  };
}

export async function createTable(name: string, maxSeats = 9): Promise<PokerTable> {
  const id = makeId();
  let inviteCode = makeInviteCode();
  let attempts = 0;
  const database = getDb();
  while (attempts++ < 20) {
    const rows = await database
      .select()
      .from(tablesSchema)
      .where(eq(tablesSchema.inviteCode, inviteCode))
      .limit(1);
    if (rows.length === 0) break;
    inviteCode = makeInviteCode();
  }
  const seats = createEmptySeats(maxSeats);
  await getDb().insert(tablesSchema).values({
    id,
    name,
    inviteCode,
    maxSeats,
    seats,
    pot: 0,
    phase: 'Waiting for players',
    status: 'waiting',
  });
  return {
    id,
    name,
    inviteCode,
    maxSeats,
    seats,
    pot: 0,
    phase: 'Waiting for players',
    status: 'waiting',
    createdAt: Date.now(),
  };
}

export async function getTable(id: string): Promise<PokerTable | undefined> {
  const rows = await getDb().select().from(tablesSchema).where(eq(tablesSchema.id, id)).limit(1);
  const row = rows[0];
  return row ? rowToTable(row) : undefined;
}

export async function getTableByInviteCode(code: string): Promise<PokerTable | undefined> {
  const rows = await getDb().select().from(tablesSchema);
  const row = rows.find(
    (r) => r.inviteCode.toUpperCase() === code.toUpperCase()
  );
  return row ? rowToTable(row) : undefined;
}

export async function listTables(): Promise<PokerTable[]> {
  const rows = await getDb().select().from(tablesSchema);
  return rows.map(rowToTable);
}

async function addRandomNpc(table: PokerTable): Promise<boolean> {
  const emptyIdx = table.seats.findIndex((s) => s.status === 'empty');
  if (emptyIdx < 0) return false;
  const npc = NPC_POOL[Math.floor(Math.random() * NPC_POOL.length)];
  const npcId = `npc-${npc.name}-${makeId()}`;
  const newSeats = [...table.seats];
  newSeats[emptyIdx] = {
    seatIndex: emptyIdx,
    status: 'npc',
    playerId: npcId,
    displayName: npc.name,
    emoji: npc.emoji,
    chips: STARTING_CHIPS,
  };
  await getDb().update(tablesSchema).set({ seats: newSeats }).where(eq(tablesSchema.id, table.id));
  return true;
}

export async function joinTable(
  tableId: string,
  user: User,
  preferredSeat?: number
): Promise<number> {
  const table = await getTable(tableId);
  if (!table) return -1;

  const alreadySeated = table.seats.some(
    (s) => s.status === 'human' && s.playerId === user.id
  );
  if (alreadySeated) return table.seats.find((s) => s.playerId === user.id)!.seatIndex;

  let seatIdx = -1;
  const emptySeats = table.seats
    .map((s, i) => (s.status === 'empty' ? i : -1))
    .filter((i) => i >= 0);

  const newSeats = [...table.seats];

  if (emptySeats.length > 0) {
    seatIdx = preferredSeat ?? emptySeats[0];
    if (!emptySeats.includes(seatIdx)) seatIdx = emptySeats[0];
  } else {
    const npcSeats = table.seats
      .map((s, i) => (s.status === 'npc' ? i : -1))
      .filter((i) => i >= 0);
    if (npcSeats.length === 0) return -1;
    seatIdx = npcSeats[Math.floor(Math.random() * npcSeats.length)];
    newSeats[seatIdx] = {
      seatIndex: seatIdx,
      status: 'empty',
      playerId: null,
      displayName: '',
      emoji: '',
      chips: 0,
    };
  }

  newSeats[seatIdx] = {
    seatIndex: seatIdx,
    status: 'human',
    playerId: user.id,
    displayName: user.displayName,
    emoji: user.emoji,
    chips: user.chips,
  };

  await getDb().update(tablesSchema).set({ seats: newSeats }).where(eq(tablesSchema.id, tableId));
  return seatIdx;
}

export async function seedTableWithNpcs(tableId: string, count: number): Promise<void> {
  let table = await getTable(tableId);
  if (!table) return;
  let added = 0;
  while (added < count) {
    const ok = await addRandomNpc(table);
    if (!ok) break;
    added++;
    table = await getTable(tableId);
    if (!table) break;
  }
}
