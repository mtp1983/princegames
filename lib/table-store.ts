import type { PokerTable, TableSeat, User } from './types';

const NPC_POOL = [
  { name: 'Viper Reyes', emoji: '🐍', style: 'aggressive' },
  { name: 'Lady Lux', emoji: '👸', style: 'balanced' },
  { name: 'Iron Duke', emoji: '⚔️', style: 'tight' },
  { name: 'Blaze Quinn', emoji: '🔥', style: 'maniac' },
  { name: 'Ghost Wang', emoji: '👻', style: 'balanced' },
  { name: 'Rio Dante', emoji: '🎲', style: 'loose' },
  { name: 'Sable Fox', emoji: '🦊', style: 'aggressive' },
  { name: 'Ace Montoya', emoji: '🃏', style: 'tight' },
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

/** In-memory store for poker tables. Replace with DB later. */
class TableStore {
  private tables: Map<string, PokerTable> = new Map();
  private npcChurnInterval: ReturnType<typeof setInterval> | null = null;

  createTable(name: string, maxSeats = 9): PokerTable {
    const id = makeId();
    const inviteCode = makeInviteCode();
    const seats = createEmptySeats(maxSeats);
    const table: PokerTable = {
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
    this.tables.set(id, table);
    this.maybeStartNpcChurn();
    return table;
  }

  getTable(id: string): PokerTable | undefined {
    return this.tables.get(id);
  }

  getTableByInviteCode(code: string): PokerTable | undefined {
    return Array.from(this.tables.values()).find(
      (t) => t.inviteCode.toUpperCase() === code.toUpperCase()
    );
  }

  listTables(): PokerTable[] {
    return Array.from(this.tables.values());
  }

  /**
   * Human joins. If table is full, an NPC leaves to make room.
   * Returns the seat index, or -1 if join failed.
   */
  joinTable(tableId: string, user: User, preferredSeat?: number): number {
    const table = this.tables.get(tableId);
    if (!table) return -1;

    const alreadySeated = table.seats.some(
      (s) => s.status === 'human' && s.playerId === user.id
    );
    if (alreadySeated) return table.seats.find((s) => s.playerId === user.id)!.seatIndex;

    let seatIdx = -1;
    const emptySeats = table.seats
      .map((s, i) => (s.status === 'empty' ? i : -1))
      .filter((i) => i >= 0);

    if (emptySeats.length > 0) {
      seatIdx = preferredSeat ?? emptySeats[0];
      if (!emptySeats.includes(seatIdx)) seatIdx = emptySeats[0];
    } else {
      const npcSeats = table.seats
        .map((s, i) => (s.status === 'npc' ? i : -1))
        .filter((i) => i >= 0);
      if (npcSeats.length === 0) return -1;
      seatIdx = npcSeats[Math.floor(Math.random() * npcSeats.length)];
      table.seats[seatIdx] = {
        ...table.seats[seatIdx],
        status: 'empty',
        playerId: null,
        displayName: '',
        emoji: '',
        chips: 0,
      };
    }

    table.seats[seatIdx] = {
      seatIndex: seatIdx,
      status: 'human',
      playerId: user.id,
      displayName: user.displayName,
      emoji: user.emoji,
      chips: user.chips,
    };
    return seatIdx;
  }

  leaveTable(tableId: string, userId: string): boolean {
    const table = this.tables.get(tableId);
    if (!table) return false;
    const idx = table.seats.findIndex((s) => s.playerId === userId && s.status === 'human');
    if (idx < 0) return false;
    table.seats[idx] = {
      seatIndex: idx,
      status: 'empty',
      playerId: null,
      displayName: '',
      emoji: '',
      chips: 0,
    };
    return true;
  }

  /** Add a random NPC to an empty seat. */
  addRandomNpc(tableId: string): boolean {
    const table = this.tables.get(tableId);
    if (!table) return false;
    const emptyIdx = table.seats.findIndex((s) => s.status === 'empty');
    if (emptyIdx < 0) return false;
    const npc = NPC_POOL[Math.floor(Math.random() * NPC_POOL.length)];
    const npcId = `npc-${npc.name}-${makeId()}`;
    table.seats[emptyIdx] = {
      seatIndex: emptyIdx,
      status: 'npc',
      playerId: npcId,
      displayName: npc.name,
      emoji: npc.emoji,
      chips: STARTING_CHIPS,
    };
    return true;
  }

  /** Remove a random NPC, leaving seat empty. */
  removeRandomNpc(tableId: string): boolean {
    const table = this.tables.get(tableId);
    if (!table) return false;
    const npcSeats = table.seats
      .map((s, i) => (s.status === 'npc' ? i : -1))
      .filter((i) => i >= 0);
    if (npcSeats.length === 0) return false;
    const idx = npcSeats[Math.floor(Math.random() * npcSeats.length)];
    table.seats[idx] = {
      seatIndex: idx,
      status: 'empty',
      playerId: null,
      displayName: '',
      emoji: '',
      chips: 0,
    };
    return true;
  }

  /** NPCs come and go randomly, like a real casino. */
  private maybeStartNpcChurn() {
    if (this.npcChurnInterval) return;
    this.npcChurnInterval = setInterval(() => {
      this.tables.forEach((table) => {
        if (table.status !== 'waiting') return;
        const roll = Math.random();
        const npcCount = table.seats.filter((s) => s.status === 'npc').length;
        const emptyCount = table.seats.filter((s) => s.status === 'empty').length;
        if (roll < 0.15 && emptyCount > 0) {
          this.addRandomNpc(table.id);
        } else if (roll < 0.25 && npcCount > 1) {
          this.removeRandomNpc(table.id);
        }
      });
    }, 8000 + Math.random() * 12000);
  }

  /** Seed a table with some NPCs for demo. */
  seedTableWithNpcs(tableId: string, count: number): void {
    const table = this.tables.get(tableId);
    if (!table) return;
    let added = 0;
    while (added < count && this.addRandomNpc(tableId)) added++;
  }
}

export const tableStore = new TableStore();
