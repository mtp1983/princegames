import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createTable,
  getTable,
  joinTable,
  listTables,
  seedTableWithNpcs,
} from '@/lib/table-store-router';
import { rateLimit, getClientKey } from '@/lib/rate-limit';

/** Ensure at least one table exists (seed on empty). */
async function ensureSeedTable() {
  const tables = await listTables();
  if (tables.length === 0) {
    const table = await createTable('Main Table', 9);
    await seedTableWithNpcs(table.id, 4);
    return await listTables();
  }
  return tables;
}

export async function GET() {
  const tables = await ensureSeedTable();
  return NextResponse.json(tables);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required to create a table' }, { status: 401 });
  }

  const rl = rateLimit(getClientKey(request));
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
    );
  }
  try {
    const body = await request.json();
    const name = body?.name || 'New Table';
    const maxSeats = Math.min(9, Math.max(2, parseInt(body?.maxSeats, 10) || 9));
    const displayName = body?.displayName || 'Player';
    const emoji = body?.emoji || '♛';
    const chips = parseInt(body?.chips, 10) || 1500;

    const table = await createTable(name, maxSeats);
    await seedTableWithNpcs(table.id, Math.min(4, maxSeats - 1));

    await joinTable(table.id, { id: userId, displayName, emoji, chips });
    const updated = await getTable(table.id);
    return NextResponse.json(updated ?? table);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
