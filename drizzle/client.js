import { drizzle } from 'drizzle-orm/neon-serverless';
import { Client } from '@neondatabase/serverless';
import ws from 'ws';
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

const WebSocketImpl = globalThis.WebSocket || ws;
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocketImpl;
}

const client = new Client({ connectionString, fetchEndpoint: process.env.NEON_FETCH_ENDPOINT, webSocketConstructor: WebSocketImpl });
await client.connect();

export const db = drizzle(client, { schema });
export { schema } from './schema.js';
