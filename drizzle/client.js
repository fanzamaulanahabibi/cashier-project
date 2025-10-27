import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import * as schema from './schema.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL || process.env.DATABASEURL;
if (!connectionString) {
  console.warn('DATABASE_URL is not set; Drizzle client will fail to connect.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { schema } from './schema.js';

export async function runInTransaction(work) {
  if (typeof db.transaction === 'function') {
    return await db.transaction(work);
  }
  // Fallback: run without explicit transaction (neon-http may not support tx on older versions)
  return await work(db);
}
