import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { leaveTable } from '@/lib/table-store-router';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  const { id } = await params;
  const ok = await leaveTable(id, userId);
  if (!ok) {
    return NextResponse.json({ error: 'Not seated at table' }, { status: 400 });
  }
  return NextResponse.json({ left: true });
}
