import { NextRequest, NextResponse } from 'next/server';
import { createTable, listTables, seedTableWithNpcs } from '@/lib/table-store-router';
import { rateLimit, getClientKey } from '@/lib/rate-limit';

export async function GET() {
  const tables = await listTables();
  return NextResponse.json(tables);
}

export async function POST(request: NextRequest) {
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
    const table = await createTable(name, maxSeats);
    await seedTableWithNpcs(table.id, Math.min(4, maxSeats - 1));
    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
