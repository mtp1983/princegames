import { NextRequest, NextResponse } from 'next/server';
import { getTableByInviteCode } from '@/lib/table-store-router';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const table = await getTableByInviteCode(code);
  if (!table) {
    return NextResponse.json({ error: 'Table not found' }, { status: 404 });
  }
  return NextResponse.json(table);
}
