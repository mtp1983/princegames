import { NextRequest, NextResponse } from 'next/server';
import { getTable, joinTable } from '@/lib/table-store-router';
import { rateLimit, getClientKey } from '@/lib/rate-limit';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const table = await getTable(id);
  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
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
    const userId = body?.userId || `user-${Date.now()}`;
    const displayName = body?.displayName || 'Player';
    const emoji = body?.emoji || '♛';
    const chips = parseInt(body?.chips, 10) || 1500;
    const preferredSeat = body?.preferredSeat;

    const seatIdx = await joinTable(id, {
      id: userId,
      displayName,
      emoji,
      chips,
    }, preferredSeat);

    if (seatIdx < 0) {
      return NextResponse.json({ error: 'Could not join table' }, { status: 400 });
    }

    const updated = await getTable(id);
    return NextResponse.json({ seatIndex: seatIdx, table: updated ?? table });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
