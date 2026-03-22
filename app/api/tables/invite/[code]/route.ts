import { NextRequest, NextResponse } from 'next/server';
import { tableStore } from '@/lib/table-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const table = tableStore.getTableByInviteCode(code);
  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }
  return NextResponse.json(table);
}
