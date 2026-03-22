import { NextRequest, NextResponse } from 'next/server';
import { tableStore } from '@/lib/table-store';

export async function GET() {
  const tables = tableStore.listTables();
  return NextResponse.json(tables);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name || 'New Table';
    const maxSeats = Math.min(9, Math.max(2, parseInt(body?.maxSeats, 10) || 9));
    const table = tableStore.createTable(name, maxSeats);
    tableStore.seedTableWithNpcs(table.id, Math.min(4, maxSeats - 1));
    return NextResponse.json(table);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
