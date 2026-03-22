import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;
const db = sql ? drizzle(sql, { schema }) : null;

export { db, schema, sql };

export async function validateDatabase(): Promise<{ ok: boolean; error?: string }> {
  if (!sql) return { ok: false, error: 'No database URL configured' };
  try {
    await sql`SELECT 1`;
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
