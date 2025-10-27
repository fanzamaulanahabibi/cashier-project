import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import * as schema from './schema.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL || process.env.DATABASEURL;
if (!connectionString) {
  console.warn('DATABASE_URL is not set; Drizzle client will fail to connect.');
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
export { schema } from './schema.js';

