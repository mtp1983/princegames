import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

const db = drizzle({ schema });

export { db, schema, sql };

export async function validateDatabase(): Promise<{ ok: boolean; error?: string }> {
  try {
    await sql`SELECT 1`;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
