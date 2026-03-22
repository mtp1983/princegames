import { NextResponse } from 'next/server';
import { validateDatabase } from '@/lib/db';

export async function GET() {
  try {
    const result = await validateDatabase();
    return NextResponse.json({
      status: result.ok ? 'ok' : 'error',
      database: result.ok ? 'connected' : result.error,
    });
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      database: (e as Error).message,
    });
  }
}
