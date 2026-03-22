import { NextRequest, NextResponse } from 'next/server';
import { tableStore } from '@/lib/table-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const table = tableStore.getTable(id);
  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const userId = body?.userId || `user-${Date.now()}`;
    const displayName = body?.displayName || 'Player';
    const emoji = body?.emoji || '♛';
    const chips = parseInt(body?.chips, 10) || 1500;
    const preferredSeat = body?.preferredSeat;

    const seatIdx = tableStore.joinTable(id, {
      id: userId,
      displayName,
      emoji,
      chips,
    }, preferredSeat);

    if (seatIdx < 0) {
      return NextResponse.json({ error: 'Could not join table' }, { status: 400 });
    }

    return NextResponse.json({ seatIndex: seatIdx, table });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
